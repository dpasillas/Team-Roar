using UnityEngine;
using System.Collections;

public class Projectile : Attack {

	// Use this for initialization
	public float speed = 200;
	private float dist = 0;
	public float range = 200;
	public bool arcing = true;
	private float t = 2;
	public GameObject target = null;
	public GameObject owner = null;

	//Generic Explosion
	public GameObject explosion = null;
	
	//Specific instance
	private GameObject expl;

	float distance()
	{
		return dist;
	}

	void Start () {
		StartRoutine ();
	}

	protected void StartRoutine()
	{
		if (target != null) 
			SetTarget (target);
	}

	public void ShootAt(GameObject target)
	{
		this.target = target;
	}

	void FixedUpdate(){
		ShootAtTarget();
	}

	protected void SetTarget (GameObject other)
	{
		if (speed == 0)
			return;

		if (arcing) {
			Vector3 v0 = Physics.gravity * -0.5f * t;
			Vector3 pos = other.transform.position;
			v0 += (transform.position * -1 + new Vector3 (pos.x, transform.position.y, pos.z)) * (1f / t);
			gameObject.rigidbody.useGravity = true;
			this.rigidbody.velocity = v0;
			gameObject.transform.LookAt (transform.position + v0);
		} else {
			gameObject.rigidbody.useGravity = false;
			gameObject.transform.LookAt (new Vector3(other.transform.position.x, transform.position.y, other.transform.position.z));
			gameObject.rigidbody.velocity = transform.forward * speed;
		}
	}

	protected void ShootAtTarget()
	{
		if (finished || speed == 0 || arcing)
			return;

		if (dist >= range*2 && !finished) {
			Finish ();
			return;
		}
		float displacement = Time.deltaTime * speed;
		dist += displacement;

		gameObject.transform.LookAt (transform.position + gameObject.rigidbody.velocity);
	}

	public void OnCollisionEnter(Collision col)
	{
		Debug.Log("Projectile Collided with " + col.gameObject);
		if (col.gameObject == gameObject) return;
		Finish ();
	}

	public override void Finish()
	{
		if (finished)
			return;
		finished = true;
		
		Destroy (gameObject.rigidbody);
		Destroy (gameObject.collider);
		if(gameObject.light != null)
			Destroy (gameObject.light);

		if(explosion != null) {
			expl = (GameObject)Instantiate (explosion, transform.position, transform.rotation);
			
			float size = 0.5f + 2 *(radius) * 0.866f;
			expl.transform.localScale = new Vector3 (size, size, size);
			expl.particleSystem.startSize = size;
			Destroy (gameObject,expl.particleSystem.duration+0.01f);
			Destroy (expl, expl.particleSystem.duration);
		}
		else
		{
			Destroy (gameObject, 0.5f);

		}

	}
}

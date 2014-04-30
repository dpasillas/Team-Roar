using UnityEngine;
using System.Collections;

public class AnimateOnSpace : MonoBehaviour {

	// Use this for initialization

	public GameObject bullet;
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown ("space")) {
			Animator ani = GetComponentInChildren<Animator>();
			if(ani == null)
			{
				Debug.Log("no ani!");
			}
			else
			{
				ani.SetTrigger("Shoot");
				Invoke ("shootProjectile",1.0f);
				Debug.Log("SPACE!");
			}
		}
	}

	void shootProjectile()
	{
		//Instantiate (bullet,transform.position,transform.rotation);
	}
}

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class Damage : MonoBehaviour {

	// Use this for initialization
	//public GUIText textObject;
	public GameObject textObject;
	//private TextMesh text;
	private GameObject cam;
	public float displayDuration = 1.0f;

	public int defense = 100;
	public int dexterity = 100;
	public int maxHP = 100;
	private int currentHP = 0;
	private List<GameObject> textObjs = new List<GameObject>();
	public Hexagon tile = null;
	public GameObject deathAnimation = null;
	void Start () {
		//GUIText text = gameObject.GetComponentInChildren<GUIText> ();
		//GameObject newTextObject = (GameObject)Instantiate (textObject);
		//newTextObject.transform.position += transform.position;
		//newTextObject.transform.parent = transform;
		currentHP = maxHP;
//		TextMesh text = textObject.GetComponent<TextMesh>();
		cam = GameObject.Find ("Main Camera");
		/*if (text != null) {
			//text.text = "";
			Debug.Log ("Gui text found!");
		} else
			Debug.Log ("no gui text found!");
	*/
	}
	
	// Update is called once per frame
	void Update () {
		for (int i = 0; i < textObjs.Count; ++i) {
			GameObject text = textObjs[i];
			text.transform.position += new Vector3(0,1,0) * (Time.deltaTime * 2);
			text.transform.LookAt (cam.transform.position);
			text.transform.Rotate (textObject.transform.up, 180);
		}
	}

	void OnTriggerEnter(Collider col)
	//void OnCollisionEnter(Collision c)
	{
		//Collider col = c.collider;

		GameObject owner = col.gameObject.GetComponent<Projectile>().owner;
		if (owner == gameObject)
			return;
	

		Debug.Log ("Collision detected with " + col.gameObject);
		Attack a = col.gameObject.GetComponent<Attack> ();
		if (a == null){
			Debug.Log("Empty!");
			return;
		}
		if(tile != null)
			tile.breadthFirstDo(a.radius, (Pair<Hexagon.OccupantType,GameObject> o, int d) => {
				if(o == null)
					return true;

				//walls block explosions, don't move it past this point!
				if(o.first == Hexagon.OccupantType.WALL)
					return false;

				GameObject obj = o.second;
				if (obj == null) 
					return false;

				Damage dm = obj.GetComponent<Damage>();
				if(dm == null)
					return true;
				
				string s = "";
				bool hit = dm.calculateHit(a.accuracy);
				
				TextMesh text = dm.createTextObject();
				if(hit){
					int damage = (a.ignoreArmor) ? a.attack : dm.calculateDamage(a.attack);
					
					if(a.healing){
						text.color = new Color(0f,1f,1f);
						dm.currentHP += damage;
						if(dm.currentHP > dm.maxHP)
							dm.currentHP = dm.maxHP;
					} else {
						text.color = new Color(1f, 0f, 0f);
						dm.currentHP -= damage;
					}
					text.text = s + damage;
					if(!a.piercing) {
						Debug.Log ("Finishing " + a.gameObject);
						a.Finish();
					}
					
					if(dm.currentHP <= 0) {
						Debug.Log ("Killed " + dm.gameObject);
						dm.die();
					}
				}
				else
				{
					text.color = new Color(1f, 0f, 0f);
					text.text = "Miss!";
					Debug.Log ("MISSED");
					dm.dodge();
				}
				
				dm.Invoke ("clearText", displayDuration);
				
				return true;
				
			});
		else
			Debug.Log("No Tile Found!");
	}

	TextMesh createTextObject()
	{
		GameObject newTextObject = (GameObject)Instantiate (textObject);
		newTextObject.transform.position += transform.position;
		newTextObject.transform.parent = transform;

		textObjs.Add (newTextObject);

		TextMesh text = newTextObject.GetComponent<TextMesh> ();
		return text;
	}

	float calculateAccuracy()
	{
		return (dexterity  * 0.1f);
	}

	float calculateEvasionBonus()
	{
		return (dexterity * 0.05f);
	}

	bool calculateHit(float accuracy)
	{
		float chance = calculateHitChance (accuracy);
		float value = UnityEngine.Random.value;

		Debug.Log ("Chance: " + chance + ", Value: " + value);
		if (value <= chance)
			return true;
		return false;
	}

	float calculateHitChance(float accuracy)
	{
		float evasion = calculateEvasionBonus ();
		Debug.Log ("Accuracy: " + accuracy + ", Evasion: " + evasion);
		//return 1.0f + (accuracy - evasion) / (2 * accuracy);
		return Mathf.Pow((1.4f * accuracy) / (accuracy + evasion),1.5f);
	}

	int calculateDamage(int attack)
	{
		return (int)(attack * 33.3333f / (33.3333f + defense) * UnityEngine.Random.Range(0.9f, 1.1f));
	}

	void clearText()
	{
		GameObject front = textObjs [0];
		textObjs.RemoveAt (0);
		Destroy (front);
	}

	void die()
	{
		if(deathAnimation != null)
		{
			GameObject aniClone = Instantiate(deathAnimation,
			                                  transform.position,
			                                  deathAnimation.transform.rotation) as GameObject;
			Color c = Color.red;
			MeshRenderer child = GetComponentInChildren<MeshRenderer>();
			if (child != null)
				c = child.material.color;
			// = gameObject.renderer.material.color;

			if(aniClone.particleSystem != null)
				aniClone.particleSystem.startColor = c;

			if(aniClone.light != null)
				aniClone.light.color = c;


			Destroy(aniClone,aniClone.particleSystem.duration);
		}
		tile.Unhighlight();
		tile.setOccupant(null, Hexagon.OccupantType.WALL);
		gameObject.SetActive(false);
	}

	void dodge()
	{

	}

	public int Health()
	{
		return currentHP;
	}
}
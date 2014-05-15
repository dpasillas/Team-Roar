using UnityEngine;
using System.Collections;

public class Attack : MonoBehaviour {

	// Use this for initialization
	public int attack = 50;
	public int accuracy = 5;
	public bool piercing = false;
	public bool healing = false;
	public bool ignoreArmor = false;
	public int radius = 0;

	protected bool finished = false;

	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public virtual void Finish()
	{

	}
}

#pragma strict

// Use this for initialization
private var pos : Vector3;
private var dir : Vector3;
private var isRunning : boolean;

function Awake () {
	isRunning = false;
}

// Update is called once per frame
function FixedUpdate(){
	if (isRunning)
		Shoot();
}

function Shoot()
{
	var dist : float = (pos - transform.position).magnitude;
	if (dist < 0.01) {
		Destroy (this.gameObject, 0.5f);
		return;
	}
	//Vector3 dir = other.transform.position - transform.position;
	transform.Translate (dir * Mathf.Min ( Time.deltaTime * 200,dist) );
}

function SetTarget(other : GameObject)
{
	pos = other.transform.position;
	dir = pos - transform.position;
	dir.Normalize ();
	isRunning = true;
}

function Stop() {
	isRunning = false;
}
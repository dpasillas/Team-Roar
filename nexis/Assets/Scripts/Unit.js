#pragma strict

public var speed : float = 10.0;
private var moveTarget : Vector3;

private var canMove : boolean;
private var canAct : boolean;

// Unit stats
public var moveRange : int = 7.0;
public var shootRange : float = 7.0;
public var health : int = 5;
public var unitName : String;

function Awake () {
	canMove = false;
	canAct = false;
	moveTarget = transform.position;
	unitName = "Unit" + (Mathf.FloorToInt(Random.Range(1.0, 10.0))).ToString();
}

function Update () {
	transform.position = Vector3.MoveTowards(transform.position, moveTarget, speed * Time.deltaTime);
	
	if (health <= 0)
		Destroy(this.gameObject, 0.5f);
}

function CanMove() {
	return canMove;
}

function BeginMove() {
	canMove = true;
}

function EndMove() {
	canMove = false;
}


function CanAct () {
	return canAct;
}

function BeginAct () {
	canAct = true;
}

function EndAct () {
	canAct = false;
}

function MoveTo (target : Vector3) {
	moveTarget = target;
}

function ShootAt (target : GameObject) {
	var dist = (target.transform.position - transform.position).magnitude;
	if (dist <= shootRange) {
		target.GetComponent(Unit).health--;
		return true;
	}
	else {
		return false;
	}
}

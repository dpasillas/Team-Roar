#pragma strict

public var speed : float = 20.0;
private var moveTarget : Vector3;
private var shootTarget : GameObject;

private var canMove : boolean;
private var canAct : boolean;

private var resetRot : Quaternion;

// Unit stats
public var moveRange : int = 7.0;
public var shootRange : float = 7.0;
public var health : int = 5;
public var unitName : String;
public var projectile : GameObject;

private var xVel : float;
private var yVel : float;
private var zVel : float;

enum AIStates { EnemyMove, EnemyShoot, EnemyDone };
private var AIState : AIStates;
private var AICntrl : boolean;
private var AIShootTarget : GameObject;

function Awake () {
	canMove = false;
	canAct = false;
	moveTarget = transform.position;
	unitName = "Unit" + (Mathf.FloorToInt(Random.Range(1.0, 10.0))).ToString();
	AICntrl = false;
	AIState = AIStates.EnemyDone;
}

function Update () {
	var x = Mathf.SmoothDamp(transform.position.x, moveTarget.x, xVel, speed * Time.deltaTime);
	var y = Mathf.SmoothDamp(transform.position.y, moveTarget.y, yVel, speed * Time.deltaTime);
	var z = Mathf.SmoothDamp(transform.position.z, moveTarget.z, zVel, speed * Time.deltaTime);

	transform.position = Vector3(x, y, z);

	//transform.position = Vector3.MoveTowards(transform.position, moveTarget, speed * Time.deltaTime);
	
	if (AICntrl) {
		var dist : float;
		dist = (transform.position - moveTarget).magnitude;
		var tdist : float = 100000.0;
		if (AIShootTarget)
			tdist = (AIShootTarget.transform.position - transform.position).magnitude;
		switch (AIState) {
			case AIStates.EnemyMove:
				if (dist <= 0.001)
					AIState = AIStates.EnemyShoot;
				break;
			case AIStates.EnemyShoot:
				if (tdist > shootRange) {
					AIState = AIStates.EnemyDone;
				} else {
					ShootAt(AIShootTarget);
					AIShootTarget = null;
				}
				break;
			case AIStates.EnemyDone:
				AIState = AIStates.EnemyDone;
				AICntrl = false;
				break;
		}
	}
	
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
	var dir = target.transform.position - transform.position;
	resetRot = transform.rotation;
	transform.rotation = Quaternion.LookRotation(dir);
	if (AICntrl) transform.rotation = Quaternion.LookRotation(-dir);

	Invoke("ResetAfterShooting", 2.0);

	shootTarget = target;
	
	//Animate yourself shooting
	var ani : Animator = GetComponentInChildren(Animator);
	if (ani) ani.SetTrigger("Shoot");
	
	Invoke("ShootLaser", 1.0);
}

function ShootLaser() {
	var pos = GetComponentInChildren(UnitLocalAnimate).transform.position;
	var rot = Quaternion.identity;// transform.rotation;
	var l = Instantiate (projectile, pos, rot);
	l.GetComponent(Laser).SetTarget(shootTarget.GetComponentInChildren(UnitLocalAnimate).gameObject);
}

function OnTriggerEnter(other : Collider) {
	Destroy(other.gameObject, 2.0);
	health--;
	Debug.Log(unitName + " Triggered");
}

function ResetAfterShooting() {
	transform.rotation = resetRot;
}


function EnemyUnitBegin () {
	AICntrl = true;
	AIState = AIStates.EnemyMove;
}

function EnemyUnitDone () {
	if (AIState == AIStates.EnemyDone) return true;
	return false;
}

function EnemySetTarget (t : GameObject) {
	AIShootTarget = t;
}
#pragma strict

import System.Collections.Generic;

public var speed : float = 20.0;
private var moveTarget : Vector3;
private var shootTarget : GameObject;

private var canMove : boolean;
private var canAct : boolean;
private var selected : boolean;
private var updatingPath : boolean;

private var resetRot : Quaternion;

// Unit stats
enum UNIT_TYPES { SCOUT, SUPPORT, SNIPER, HEAVY };
public var moveRange : int = 3;
public var shootRange : float = 7.0;
public var health : int = 5;
public var unitName : UNIT_TYPES;
public var projectile : GameObject;

private var xVel : float;
private var yVel : float;
private var zVel : float;

enum AIStates { EnemyStart, EnemyMove, EnemyShoot, EnemyDone };
public var isEnemy : boolean = false;
private var AIState : AIStates;
private var AICntrl : boolean;


var currentTile : Hexagon;
var nextTile : Hexagon;
private var prevTile : Hexagon;
private var path : List.<Hexagon> = new List.<Hexagon>();
private var prevList : List.<Hexagon> = new List.<Hexagon>();

static public var current : Unit = null;
static public var mouseDownUnit : Unit = null;
static public var cam : CameraTarget;

//Used for Enemy AI Calcualtions
private var unitManager : UnitManager;
private var AIShootTarget : GameObject;
private var AIMoveTarget : Hexagon;

function Awake () {
	canMove = false;
	canAct = false;
	selected = false;
	moveTarget = transform.position;
	//unitName = "Unit" + (Mathf.FloorToInt(Random.Range(1.0, 10.0))).ToString();
	AICntrl = false;
	AIState = AIStates.EnemyDone;
	unitManager = FindObjectOfType(UnitManager);
	cam = FindObjectOfType(CameraTarget);
}

function Update () {
	if (Hexagon.mouseDownTile)
		mouseDownUnit = Hexagon.mouseDownTile.occupant.second.GetComponent(Unit);
	else
		mouseDownUnit = null;

	UpdateHighlight();

	if (!AICntrl) {
		UpdatePath();
		MouseAction();
	} else {
		UpdateAI();
	}
}

function OnMouseDown()
{
	currentTile.ToggleMouseDown();
}

function UpdateAI () {
	//var x = Mathf.SmoothDamp(transform.position.x, moveTarget.x, xVel, speed * Time.deltaTime);
	//var y = Mathf.SmoothDamp(transform.position.y, moveTarget.y, yVel, speed * Time.deltaTime);
	//var z = Mathf.SmoothDamp(transform.position.z, moveTarget.z, zVel, speed * Time.deltaTime);
	//transform.position = Vector3(x, y, z);
	
	var dist : float;
	dist = (transform.position - moveTarget).magnitude;
	var tdist : float = 100000.0;
	if (AIShootTarget)
		tdist = (AIShootTarget.transform.position - transform.position).magnitude;
	switch (AIState) {
		case AIStates.EnemyStart:
			Debug.Log("EnemyStart");
			StartCoroutine(MoveAlongPath());
			AIState = AIStates.EnemyMove;
			break;
			
		case AIStates.EnemyMove:
			Debug.Log("EnemyMove");
			if (currentTile == AIMoveTarget) {
				AIState = AIStates.EnemyShoot;
				canMove = false;
			} else {
				AIState = AIStates.EnemyMove;
			}
			break;
			
		case AIStates.EnemyShoot:
			Debug.Log("EnemyShoot");
			if (tdist > shootRange) {
				AIState = AIStates.EnemyDone;
				canAct = false;
			} else {
				ShootAt(AIShootTarget);
				AIShootTarget = null;
				AIState = AIStates.EnemyDone;
				canAct = false;
			}
			break;
			
		case AIStates.EnemyDone:
			Debug.Log("EnemyDone");
			AIState = AIStates.EnemyDone;
			AICntrl = false;
			break;
	}
}

function Select() {
	selected = true;
	updatingPath = true;
	currentTile.selectTile = currentTile;
	Highlight();
	current = this;
}

function Deselect() {
	selected = false;
	currentTile.selectTile = null;
	Unhighlight();
	current = null;
}

function UpdateHighlight() {
	if (!nextTile) return;
	if (nextTile == currentTile) return;
	Unhighlight();
	currentTile.occupant = null;
	currentTile = nextTile;
	currentTile.setOccupant(gameObject, Hexagon.OccupantType.TEAM_A);
	Highlight();
}

function Highlight() {
	if (isEnemy) {
		currentTile.HighlightSelect(true);
		return;
	}

	currentTile.HighlightSelect(true);
	if (canMove)
		currentTile.HighlightRange(moveRange, true);
}

function Unhighlight() {
	currentTile.Unhighlight();
	currentTile.HighlightRange(moveRange, false);
}

function UpdatePath() {
	//Keep things tidy...
	for (var hex : Hexagon in prevList) 
		hex.ToBaseMat();
	prevList.Clear();

	if (!selected) return;
	if (!currentTile || !currentTile.hoverTile) return;
	if (!canMove) return;
	if (!updatingPath) return;
	
	path = currentTile.getPathTo(currentTile.hoverTile);
	
	if (path.Count <= 0) return;
	if (path.Count > moveRange + 1) return;
	
	for (var hex : Hexagon in path) {
		hex.HighlightSelect(false);
		prevList.Add(hex);
	}
}

function MouseAction() {
	if (!selected) return;
	if (!canMove) return;
	if (path.Count > moveRange + 1) return;
	if (!currentTile.hoverTile || currentTile.hoverTile.occupant) return;
	
	if (Input.GetMouseButtonDown(0)) {
		updatingPath = false;
		canMove = false;
		Unhighlight();
		StartCoroutine(MoveAlongPath());
	}
}

function MoveAlongPath ()
{
	//currentTile.setOccupant(null, Hexagon.OccupantType.TEAM_A);
	//currentTile.Unhighlight();
	
	var list : List.<Hexagon> = path;
	var obj : GameObject = gameObject;

	var t : float = 0;
	var tw: float = 0;
	var i : int;
	for(i = 0; i < list.Count - 1; ++i) {
		//nextTile = list[i];
		var u : Quaternion = obj.transform.rotation;
		var a : Vector3 = list[i].transform.position;
		var b : Vector3 = list[i+1].transform.position;
		a.y = obj.transform.position.y;
		b.y = a.y;

		obj.transform.LookAt(obj.transform.position + b - a);
		var v : Quaternion = obj.transform.rotation;

		var angle : float = Quaternion.Angle(u,v);

		while(tw <= 1) {
			tw += Time.deltaTime * 360f / angle;
			if(tw < 1) {
				obj.transform.rotation = Quaternion.Lerp(u,v,tw);
				yield;
			} else {
				obj.transform.rotation = v;
			}
		}
		tw = 0;

		while(t < 1) {
			t += Time.deltaTime * 5;
			if(t <= 1) {
				obj.transform.position = a * (1 - t) + b * t;
				yield;
			} else {
				obj.transform.position = b;
			}
		}
		t = 0;
	}
	nextTile = list[i];
}

function BeginTurn() {
	BeginMove();
	BeginAct();
	cam.SetTarget(gameObject);
	if (isEnemy) {
		AICntrl = true;
		AIState = AIStates.EnemyStart;
		
		//Do enemy selection here...
		if (!unitManager) return;
		var units : List.<Unit> = unitManager.Units();
		var tiles : List.<Hexagon> = currentTile.HexagonsInRange(moveRange);
		
		var target = units[Mathf.FloorToInt(Random.Range(0.0, units.Count()))];
		var targetTile = tiles[Mathf.FloorToInt(Random.Range(0.0, tiles.Count()))];
		this.AIMoveTarget = targetTile;
		this.AIShootTarget = target.gameObject;
		this.path = currentTile.getPathTo(targetTile);
	}
}

function EndTurn() {
	selected = false;
	currentTile.selectTile = null;
	Unhighlight();
	current = null;
	
	if (currentTile.mouseDownTile)
		currentTile.mouseDownTile.Unhighlight();
	currentTile.mouseDownTile = null;
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
	if (target == gameObject) return;
		
	var dir = target.transform.position - transform.position;
	resetRot = transform.rotation;
	transform.rotation = Quaternion.LookRotation(dir);

	shootTarget = target;
	
	//Animate yourself shooting
	var ani : Animator = GetComponentInChildren(Animator);
	if (ani) ani.SetTrigger("Shoot");
	
	Invoke("ShootLaser", 1.0);
	cam.StallCam(2.5);
}

function ShootLaser() {
	var pos = GetComponentInChildren(UnitLocalAnimate).transform.position;
	var rot = Quaternion.identity;// transform.rotation;
	var l = Instantiate (projectile, pos, rot);
	l.GetComponent(Projectile).owner = gameObject;
	l.GetComponent(Projectile).ShootAt(shootTarget.gameObject);
}

function ResetAfterShooting() {
	transform.rotation = resetRot;
}

function InitUnit (tile : Hexagon, isEnemy : boolean)
{
	currentTile = tile;
	transform.position = currentTile.transform.position;
	moveTarget = transform.position;
	
	var dmg : Damage;
	dmg = GetComponent(Damage);
	dmg.tile = currentTile;
	currentTile.setOccupant(this.gameObject, Hexagon.OccupantType.TEAM_A);
	
	this.isEnemy = isEnemy;
}

function Die ()
{
	currentTile.occupant = null;
	Unhighlight();
	Destroy(gameObject);
}

/* These are used by Enemy AI... */
function EnemyUnitBegin () {
	AICntrl = true;
	AIState = AIStates.EnemyMove;
	Debug.Log("Began unit");
}

function EnemyUnitDone () {
	if (AIState == AIStates.EnemyDone) return true;
	return false;
}

function EnemySetTarget (t : GameObject) {
	AIShootTarget = t;
}
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
public var tossProjectile : GameObject;

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
	
	shootRange = projectile.GetComponent(Projectile).range;
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
			Debug.Log(AIShootTarget);
			if (!AIShootTarget) {
				AIState = AIStates.EnemyDone;
				EndAct();
			} else if (tdist > shootRange) {
				AIState = AIStates.EnemyDone;
				EndAct();
			} else {
				ShootAt(AIShootTarget, 1);
				AIShootTarget = null;
				AIState = AIStates.EnemyDone;
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
	
	if (path.Count() <= 0) return;
	
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
	Debug.Log(name + " Beginning Turn");
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
		
		//var target = units[Mathf.FloorToInt(Random.Range(0.0, units.Count()))];
		//var targetTile = tiles[Mathf.FloorToInt(Random.Range(0.0, tiles.Count()))];
		
		var targetTile = GetTargetTile();
		var target = GetBestShootTargetByTile(targetTile);
		
		this.AIMoveTarget = targetTile;
		this.AIShootTarget = target;
		this.path = currentTile.getPathTo(targetTile);
	}
}

/*
Action priorities:
Move closer to enemy : 0
Move farther from enemy : 1
Move farther at low health : 2

Do nothing: 0
Shoot enemy: 1
Throw Grenade at 2+ enemies : 2
Shoot dying enemy : 3
*/

private var LOW_LIMIT : int = 35;

function RankTile(tile : Hexagon) {
	//Can't go on that tile
	if (tile.occupant) return;
	if (!unitManager) return;
	
	var units : List.<Unit> = unitManager.Units();
	var score : int = 0;
	var actScore : int = 0;
	var health : int = GetComponent(Damage).Health();
	var maxHealth : int = GetComponent(Damage).maxHP;
	
	for (unit in units) {
		var currDist : double = (unit.transform.position - currentTile.transform.position).magnitude;	
		var newDist : double = (unit.transform.position - tile.transform.position).magnitude;
		
		if (newDist < currDist)
			score += 1;
		else if (newDist > currDist && health <= LOW_LIMIT)
			score += 2;
		else if (newDist > currDist)
			score += 0;
		else;
		
		if (newDist <= shootRange  && !unit.isEnemy && CheckNoObstacles(unit.gameObject))
		{
			if (unit.GetComponent(Damage).Health() <= LOW_LIMIT)
				actScore = 2;
			else
				actScore = 1;
			//var pScore : int = unit.GetComponent(Damage).maxHP - unit.GetComponent(Damage).Health();
			//if (pScore + 1 > actScore && !unit.isEnemy)
			//	actScore = pScore;
		}
	}
	
	score += actScore;
			
	return score;
}

function GetTargetTile () {
	var tiles : List.<Hexagon> = currentTile.HexagonsInRange(moveRange);
	
	var targetTile : Hexagon = null;
	var bestScore : int = 0;
	
	for (tile in tiles) {
		var score : int = RankTile(tile);
		if (score > bestScore) {
			bestScore = score;
			targetTile = tile;
		}
	}
	
	if (targetTile == null) return currentTile;
	return targetTile;
}

function GetBestShootTargetByTile (tile : Hexagon)
{
	if (!unitManager) return;
	var units : List.<Unit> = unitManager.Units();
	var actScore : int = 0;
	var targetUnit : Unit = null;
	var pTargetUnit : Unit = null;
	
	//targetUnit = units[Mathf.FloorToInt(Random.Range(0.0, units.Count()))];
	
	//while (targetUnit.isEnemy)
	//	targetUnit = units[Mathf.FloorToInt(Random.Range(0.0, units.Count()))];
	
	var potentialTargets : List.<Unit> = new List.<Unit>();
	
	for (unit in units) {
		var newDist : double = (unit.transform.position - tile.transform.position).magnitude;
		
		if (newDist <= shootRange && !unit.isEnemy)
		{
			if (unit.GetComponent(Damage).Health() <= LOW_LIMIT) {
				pTargetUnit = unit;
				actScore = 2;
			} else {
				actScore = 1;
				potentialTargets.Add(unit);
			}
			/*	
			var pScore : int = unit.GetComponent(Damage).maxHP - unit.GetComponent(Damage).Health();
			if (pScore + 1 > actScore && !unit.isEnemy) {
				actScore = pScore;
				targetUnit = unit;
			}
			*/
		}
	}
	
	if (pTargetUnit) return pTargetUnit.gameObject;
	if (potentialTargets.Count() <= 0) return null;
	targetUnit = potentialTargets[Mathf.FloorToInt(Random.Range(0.0, potentialTargets.Count()))];
	if (targetUnit) return targetUnit.gameObject;
	return null;
}

function CheckNoObstacles (target: GameObject) {
	var dir : Vector3 = target.transform.position - transform.position;
	dir.Normalize();
	var ray : Ray = new Ray(transform.position, dir);
	var hit : RaycastHit;
	if (collider.Raycast(ray, hit, shootRange)) {
		var unit : Unit = hit.collider.GetComponent(Unit);
		if (unit) {
			if (!unit.isEnemy)
				return true;
		}
		return false;
	}
}

function EndTurn() {
	selected = false;
	currentTile.selectTile = null;
	Unhighlight();
	current = null;
	
	if (Hexagon.mouseDownTile)
		Hexagon.mouseDownTile.Unhighlight();
		
	Hexagon.mouseDownTile = null;
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

function ShootAt (target : GameObject, attackNum : int) {
	if (target == gameObject) return;
		
	var dir = target.transform.position - transform.position;
	resetRot = transform.rotation;
	transform.rotation = Quaternion.LookRotation(dir);

	shootTarget = target;
	
	//Animate yourself shooting
	var ani : Animator = GetComponentInChildren(Animator);
	if (ani) ani.SetTrigger("Shoot");
	
	if (attackNum == 1)
		Invoke("ShootLaser", 1.0);
	else if (attackNum == 2)
		Invoke("TossAttack", 1.0);
	else
		Invoke("ShootLaser", 1.0);
	
	cam.StallCam(2.5);
}

function ShootLaser() {
	var pos = GetComponentInChildren(UnitLocalAnimate).transform.position;
	var rot = Quaternion.identity;// transform.rotation;
	var l = Instantiate (projectile, pos, rot);
	l.GetComponent(Projectile).owner = gameObject;
	l.GetComponent(Projectile).ShootAt(shootTarget.gameObject);
	EndAct();
}

function TossAttack() {
	var pos = GetComponentInChildren(UnitLocalAnimate).transform.position;
	var rot = Quaternion.identity;// transform.rotation;
	var l = Instantiate (tossProjectile, pos, rot);
	l.GetComponent(Projectile).owner = gameObject;
	l.GetComponent(Projectile).ShootAt(shootTarget.gameObject);
	EndAct();
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
	if (Hexagon.mouseDownTile == currentTile)
		Hexagon.mouseDownTile = null;
		
	currentTile.occupant = null;
	//Unhighlight();
	Destroy(gameObject);
}

function IsDone()
{
	if (Projectile.animFlag)
		return false;
		
	return !canAct;
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
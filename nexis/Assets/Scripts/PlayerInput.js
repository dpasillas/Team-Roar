#pragma strict

private var gsm : GameStateManager;

private var enemies : GameObject[];
private var camTarget : GameObject;

public var projectile : GameObject;
public var selectionCube : Transform;

private var unitManager : PlayerUnitManager;
private var curr : Unit;

function Start () {
	gsm = GameObject.FindGameObjectWithTag("GSM").GetComponent(GameStateManager);

	enemies = GameObject.FindGameObjectsWithTag("EnemyUnit");
	camTarget = GameObject.FindGameObjectWithTag("SelectionCamera");
	
	unitManager = FindObjectOfType(PlayerUnitManager);
}

function Update () {
	
	UpdateCamera();

	UpdateState();
	
	//The following are unit-reliant actions
	curr = unitManager.CurrentUnit();
	if (!curr) return;
	
	SetCameraFollow(curr);
	MouseAction();
	UnitAction();
	TabAction();
}

function UpdateCamera() {
	// Raycast point
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	if(Physics.Raycast(ray, hit, 100)) PaintSquare(hit.point);
	CameraRotateAction();
}

function UpdateState() {
	var state = gsm.GetState();
	if (state != GameState.PlayerTurn) 
		return;
	
	if (unitManager.TurnIsOver()) {	//Check if units are done
		Debug.Log("End Player Turn");
		gsm.ChangeState(GameState.EnemyTurn);
	}
}

function BeginTurn() {
	Debug.Log("Begin Player Turn");
	unitManager.BeginTurn();
}

function SetCameraFollow(next : Unit) {
	if (!next) return;
	camTarget.GetComponent(CameraTarget).SetTarget(next.gameObject);
}

function MouseAction() {
	if (Input.GetMouseButtonDown(0) && curr.CanMove()) { //Left Mouse
		curr.MoveTo(selectionCube.transform.position);
		curr.EndMove();
	}
}

function UnitAction() {
	if (Input.GetKeyDown(KeyCode.E))	//End Turn Manually
		curr.EndAct();

	if (Input.GetKeyDown(KeyCode.S) && curr.CanAct()) {
		var result = curr.ShootAt(enemies[0]);
		if (!result)
			Debug.Log("Can't shoot...");
		else {
			var pos = curr.gameObject.GetComponentInChildren(UnitLocalAnimate).transform.position;
			var rot = curr.transform.rotation;
			var l = Instantiate (projectile, pos, rot);
			l.GetComponent(Laser).SetTarget(enemies[0].GetComponentInChildren(UnitLocalAnimate).gameObject);
			Debug.Log("Enemy health is now: " + enemies[0].GetComponent(Unit).health);
		}
		curr.EndAct();
	}
}

function TabAction() {
	if (Input.GetKeyDown(KeyCode.Tab)) {
		var next : Unit = unitManager.NextUnit();
		Debug.Log("Selecting " + next.unitName);
	}
}

function CameraRotateAction() {
	if (Input.GetKeyDown(KeyCode.RightArrow))
		camTarget.GetComponent(CameraTarget).RotateRight();
	if (Input.GetKeyDown(KeyCode.LeftArrow))
		camTarget.GetComponent(CameraTarget).RotateLeft();
}

function PaintSquare( point : Vector3 )
{
	var gridPoint : Vector3;
	gridPoint.x = Mathf.FloorToInt(point.x);
	gridPoint.y = 0.0;
	gridPoint.z = Mathf.FloorToInt(point.z);
	
	if (curr) {
		var unitPos = curr.transform.position + Vector3(-0.5, 0, -0.5);
		unitPos.y = 0.0;
		if ( (gridPoint - unitPos).magnitude <= curr.moveRange )
			selectionCube.transform.position = gridPoint;
	} else {
		selectionCube.transform.position = gridPoint;
	}
}
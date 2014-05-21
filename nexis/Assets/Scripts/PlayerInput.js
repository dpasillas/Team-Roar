#pragma strict

private var gsm : GameStateManager;
private var unitManager : PlayerUnitManager;
private var enemies : EnemyUnitManager;
private var camTarget : CameraTarget;

public var selectionCube : Transform;
public var selectIndicator : Transform;

private var curr : Unit;
private var enemySelect : Unit;
private var promptString : String = "...";

function Start () {
	gsm = FindObjectOfType(GameStateManager);
	camTarget = FindObjectOfType(CameraTarget);	
	enemies = FindObjectOfType(EnemyUnitManager);
	unitManager = FindObjectOfType(PlayerUnitManager);
}

function Update () {
	if (gsm.GetState() == GameState.PlayerTurn) {
		if (unitManager.GameOver()) {
			gsm.ChangeState(GameState.GameOver);
		}
	}

	if (gsm.GetState() != GameState.PlayerTurn) return;

	if (enemies.ActiveCount() <= 0.0) {
		promptString = "YOU WIN!";
		return;
	}

	UpdateCamera();
	UpdateState();
	
	//The following are unit-reliant actions
	curr = unitManager.CurrentUnit();
	if (!curr) return;

	//Point camera at enemy if selected
	if (!camTarget.IsStalling()) {
		if (enemySelect) SetCameraFollow(enemySelect);
		else {
			SetCameraFollow(curr);
			curr.Select();
		}
	}
	
	MouseAction();
	UnitAction();
	TabAction();
	SelectAction();
	CancelSelect();
}

function UpdateCamera() {
	var minFov : float = 15f;
	var maxFov : float = 90f;
	var speed : float = 5f;
	
	var fov : float = Camera.main.fieldOfView;
	fov -= Input.GetAxis("Mouse ScrollWheel") * speed;
	fov = Mathf.Clamp(fov, minFov, maxFov);
	Camera.main.fieldOfView = fov;

	CameraRotateAction();
	
	// Raycast point
	//var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	//var hit : RaycastHit;
	//if(Physics.Raycast(ray, hit, 100)) PaintSquare(hit.point);
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
	curr = unitManager.CurrentUnit();
	curr.Select();
}

function SetCameraFollow(next : Unit) {
	if (!next) return;
	camTarget.SetTarget(next.gameObject);
	selectIndicator.transform.position = next.transform.position;
	selectIndicator.transform.position.y = 0.1;
}

function MouseAction() {
	if (gsm.GetMenuState() != MenuState.None) return;
}

function UnitAction() {
	var mState : MenuState = gsm.GetMenuState();
	if (Input.GetKeyDown(KeyCode.O)) {	//End Turn Manually
		enemySelect = null;
		curr.EndAct();
		curr.Deselect();
	}

	//if (mState == MenuState.AttackDown && curr.CanAct()) {
	if (Input.GetKeyDown(KeyCode.X) && curr.CanAct()) {
		if (!enemySelect) return;
		var dist = (enemySelect.transform.position - curr.transform.position).magnitude;
		if (dist > curr.shootRange) {
			promptString = "You can't shoot that far...";
			gsm.SetMenuState(MenuState.None);
			return;
		}
		curr.ShootAt(enemySelect.gameObject);
		promptString = "Enemy Hit";
		enemySelect.Unhighlight();
		enemySelect = null;
		curr.EndAct();
		camTarget.StallCam(2.5f);
	}
	
	gsm.SetMenuState(MenuState.None);
}

function TabAction() {
	if (Input.GetKeyDown(KeyCode.Tab)) {
		curr.Deselect();
		var next : Unit = unitManager.NextUnit();
		next.Select();
		promptString = "Unit Health: " + next.health;
	}
}

function SelectAction () {
	if (Input.GetKeyDown(KeyCode.E)) {
		if (enemies.ActiveCount() <= 0) return;
		if (!curr) return;
		
		curr.Deselect();
		
		if (enemySelect)
			enemySelect.Unhighlight();
			
		enemySelect = enemies.NextUnit();
		
		if (!enemySelect) return; //Catch null reference to enemy... temporary
		enemySelect.current = enemySelect;
		enemySelect.Highlight();
		
		promptString = "Enemy Health: " + enemySelect.health;
		var dist = (enemySelect.transform.position - curr.transform.position).magnitude;
		if (dist > curr.shootRange)
			promptString = "You can't shoot that far...";
	}
}

function CancelSelect () {
	if (Input.GetKeyDown(KeyCode.R)) {
		if (!enemySelect) return;
		enemySelect.Unhighlight();
		enemySelect.current = curr;
		enemySelect = null;
		curr.Select();
	}
}

function CameraRotateAction() {
	if (Input.GetKeyDown(KeyCode.A))
		camTarget.RotateRight();
	if (Input.GetKeyDown(KeyCode.D))
		camTarget.RotateLeft();
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

function OnGUI () {
	GUILayout.Label(promptString);
}
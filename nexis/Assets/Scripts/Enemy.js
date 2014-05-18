#pragma strict

private var gsm : GameStateManager;
private var cam : CameraTarget;
private var enemies : EnemyUnitManager;
private var pum : PlayerUnitManager;

private var isRunning : boolean;
private var unitsLeft : int;
private var waitEnd : boolean;
private var spawnPoints : Array;

function Start () {
	gsm = FindObjectOfType(GameStateManager);
	cam = FindObjectOfType(CameraTarget);
	enemies = FindObjectOfType(EnemyUnitManager);
	pum = FindObjectOfType(PlayerUnitManager);

	isRunning = false;
	
	//spawnPoints = new Array();
	//var base = Vector3(5, 0, 15);
	
	/*
	for (var i = 0; i < enemies.ActiveCount(); ++i) {
		var x : int = Mathf.FloorToInt(Random.Range(0.0, 5.0));
		var z : int = Mathf.FloorToInt(Random.Range(0.0, -5.0));
		var p : Vector3 = base + Vector3(x, 0, z);
		
		var curr : Unit = enemies.CurrentUnit();
		curr.transform.position = p;
		curr.MoveTo(p);
		enemies.NextUnit();
	}
	*/
}

function Update () {
	if (!isRunning) return;
	
	if (gsm.GetState() != GameState.EnemyTurn) return;
	
	if (unitsLeft <= 0) {
		isRunning = false;
		gsm.ChangeState(GameState.PlayerTurn);
		return;
	}
	
	if (gsm.GetState() == GameState.EnemyTurn) {
		if (pum.GameOver()) {
			gsm.ChangeState(GameState.GameOver);
			return;
		}
	}
	
	var curr : Unit = enemies.CurrentUnit();
	if (!curr) return;
	
	if (curr.EnemyUnitDone()) {
		//WaitEndTurn(2.0f);
		unitsLeft--;
		if (unitsLeft <= 0) return;
		StartNextUnit();
	}
}
function StartNextUnit () {
	var curr : Unit;
	curr = enemies.NextUnit();
	var rTarget : Unit = pum.RandomUnit();
	if (!rTarget) return;

	var newP : Vector2 = Random.insideUnitCircle * 5;
	newP = Vector2(curr.transform.position.x, curr.transform.position.z) + newP;
	var moveP : Vector3 = curr.transform.position;
	moveP.x = Mathf.FloorToInt(newP.x);
	moveP.z = Mathf.FloorToInt(newP.y);
		
	//Debug.Log(dir);
	
	//dir.x = Mathf.FloorToInt(dir.x);
	//dir.z = Mathf.FloorToInt(dir.z);
	
	//curr.MoveTo(curr.transform.position + Vector3(3, 0, 0));
	curr.MoveTo(moveP);
	curr.EnemySetTarget(pum.RandomUnit().gameObject);
	cam.SetTarget(curr.gameObject);
	curr.EnemyUnitBegin();
}

function WaitEndTurn(time : float) {
	waitEnd = true;
	var timer : float = time;
	
	while (timer > 0.0) {
		timer -= Time.deltaTime;
		yield;
	}
	
	unitsLeft--;
	if (unitsLeft <= 0) return;
	StartNextUnit();
	waitEnd = false;
}

function DoEnemyStuff () {

	yield WaitForSeconds(1);
	
	isRunning = true;
	unitsLeft = enemies.ActiveCount();

	StartNextUnit();
}
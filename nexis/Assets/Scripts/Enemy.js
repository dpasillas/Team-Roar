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
		unitsLeft--;
		if (unitsLeft <= 0) return;
		StartNextUnit();
	}
}
function StartNextUnit () {
	var curr : Unit;
	curr = enemies.NextUnit();
	if (!curr) return;
	
	var rTarget : Unit = pum.RandomUnit();
	if (!rTarget) return;

	var newP : Vector2 = Random.insideUnitCircle * 5;
	newP = Vector2(curr.transform.position.x, curr.transform.position.z) + newP;
	var moveP : Vector3 = curr.transform.position;
	moveP.x = Mathf.FloorToInt(newP.x);
	moveP.z = Mathf.FloorToInt(newP.y);

	//curr.MoveTo(moveP);
	curr.EnemySetTarget(rTarget.gameObject);
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
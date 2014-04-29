#pragma strict

private var gsm : GameStateManager;
private var cam : CameraTarget;
private var enemyUnits : GameObject[];

private var isRunning;


function Start () {
	gsm = GameObject.FindGameObjectWithTag("GSM").GetComponent(GameStateManager);
	cam = FindObjectOfType(CameraTarget);
	enemyUnits = GameObject.FindGameObjectsWithTag("EnemyUnit");

	isRunning = false;
}

function Update () {
}

function DoEnemyStuff () {
	cam.SetTarget(enemyUnits[0]);

	Debug.Log("Waiting for 3 seconds...");
	yield WaitForSeconds(3);
	Debug.Log("Enemy done waiting...");

	gsm.ChangeState(GameState.PlayerTurn);
}
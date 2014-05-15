#pragma strict

enum GameState { Init, PlayerTurn, EnemyTurn, GameOver }
enum MenuState { None, AttackDown, EndturnDown, Disabled }

static var state : GameState;

private var player : GameObject;
private var enemy : GameObject;

private var menuItemDown : boolean;
private var menuState : MenuState;

private var selectedTile : Hexagon;

function Start () {
	player = GameObject.FindGameObjectWithTag("Player");
	enemy = GameObject.FindGameObjectWithTag("Enemy");
	state = GameState.Init;
	menuItemDown = false;
	menuState = MenuState.None;
}

function Update () {
	if (state == GameState.Init)
		ChangeState(GameState.PlayerTurn);
}

function ChangeState ( newState : GameState ) {
	//Transitions on change
	state = newState;
	
	switch (state) {
		case GameState.Init:
			Debug.Log("Switched to Init");
			ChangeState(GameState.PlayerTurn);
			break;
		case GameState.PlayerTurn:
			Debug.Log("Switched to Player");
			player.GetComponent(PlayerInput).BeginTurn();
			break;
		case GameState.EnemyTurn:
			Debug.Log("Switched to Enemy");
			menuState = MenuState.Disabled;
			enemy.GetComponent(Enemy).DoEnemyStuff();
			break;
	}
}

function GetState () {
	return state;
}

function SetMenuState (state : MenuState) {
	menuState = state;
}

function GetMenuState () {
	return menuState;
}

function OnGUI() {
	if (state == GameState.GameOver)
		GUILayout.Label("GAME OVER");
}

function SetCurrent(tile : Hexagon) {
	selectedTile = tile;
	Debug.Log("Selected tile: " + selectedTile.getRow() + " , " + selectedTile.getColumn());
}

function GetCurrent() {
	return selectedTile;
}

function InitGame () {
}
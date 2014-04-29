﻿#pragma strict

enum GameState { Init, PlayerTurn, EnemyTurn }

static var state : GameState;

private var player : GameObject;
private var enemy : GameObject;

function Start () {
	player = GameObject.FindGameObjectWithTag("Player");
	enemy = GameObject.FindGameObjectWithTag("Enemy");
	state = GameState.Init;
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
			enemy.GetComponent(Enemy).DoEnemyStuff();
			break;
	}
}

function GetState () {
	return state;
}
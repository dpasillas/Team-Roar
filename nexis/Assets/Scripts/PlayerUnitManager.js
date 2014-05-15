#pragma strict

private var units : Array; //Javascript array of units
private var activeList : Array;
private var inactiveList : Array;

private var NUMUNITS : int = 3;

public var UNIT_PREFAB : GameObject;

private var grid : HexagonGrid;

function Start () {
	//Get reference to grid
	grid = FindObjectOfType(HexagonGrid);

	//Create new units on play now
	units = new Array();
	var i : int;
	for (i = 0; i < NUMUNITS; ++i) {
		var obj : GameObject = Instantiate(UNIT_PREFAB);
		var unit : Unit = obj.GetComponent(Unit);
		
		var col : int = Mathf.FloorToInt(Random.Range(2.0, 8.0));
		var row : int = Mathf.FloorToInt(Random.Range(2.0, 8.0));
		
		unit.initUnit(grid.Tile(col, row));
		
		Debug.Log(unit.transform.position);
		units.Push(unit);
	}
	
	activeList = new Array();
	inactiveList = new Array(units);
}

function Update () {
	if (activeList.length <= 0) return;
	
	if (activeList[0] == null) {
		activeList.Shift();
		return;
	}
	
	var currUnit = activeList[0] as Unit;
	if (!currUnit.CanAct()) {
		inactiveList.Push(activeList.Shift() as Unit);
	}
}

function CurrentUnit() {
	if (activeList.length <= 0) return null;
	return activeList[0] as Unit;
}

function NextUnit() {
	if (activeList.length <= 0) return null;
	activeList.Push(activeList.Shift() as Unit);
	return activeList[0] as Unit;
}

function RandomUnit() {
	if (inactiveList.length <= 0) return null;
	var index : int = Mathf.FloorToInt(Random.Range(0.0, inactiveList.length));
	return inactiveList[index] as Unit;
}

function BeginTurn() {
	while (inactiveList.length > 0) {
		var unit : Unit = inactiveList.Shift() as Unit;
		unit.BeginMove();
		unit.BeginAct();
		activeList.Push(unit);
	}
}

function TurnIsOver() {
	if (activeList.length <= 0) return true;
	return false;
}

function ActiveCount() {
	return activeList.length;
}

function GameOver() {
	if (activeList.length <= 0 && inactiveList.length <= 0) return true;
	return false;
}

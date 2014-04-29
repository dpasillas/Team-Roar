#pragma strict

private var units : Array; //Javascript array of units
private var activeList : Array;
private var inactiveList : Array;

function Start () {
	var gObjs = GameObject.FindGameObjectsWithTag("PlayerUnit");
	//var g_units : Unit[] =  as Unit[];
	units = new Array();
	for (var u : GameObject in gObjs) 
		units.Push(u.GetComponent(Unit));
	//units = new Array(g_units); 
	activeList = new Array();
	inactiveList = new Array(units);
}


function Update () {
	if (activeList.length <= 0) return;
	
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

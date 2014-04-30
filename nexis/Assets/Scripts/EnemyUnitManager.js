#pragma strict

private var units : Array; //Javascript array of units
private var activeList : Array;
private var inactiveList : Array;

function Start () {
	var gObjs = GameObject.FindGameObjectsWithTag("EnemyUnit");
	//var g_units : Unit[] =  as Unit[];
	units = new Array();
	for (var u : GameObject in gObjs) 
		units.Push(u.GetComponent(Unit));
	//units = new Array(g_units); 
	activeList = new Array(units);
	inactiveList = new Array();
	
	for (var unit : Unit in activeList)
		Debug.Log(unit);
}


function Update () {
	if (activeList.length <= 0) return;

	if (activeList[0] == null) {
		activeList.Shift();
		return;
	}

	var currUnit = activeList[0] as Unit;
	if (currUnit.health <= 0) {
		activeList.Shift();
		return;	
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

function ActiveCount() {
	return activeList.length;
}


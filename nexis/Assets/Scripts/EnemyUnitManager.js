#pragma strict

private var units : Array; //Javascript array of units
private var activeList : Array;
private var inactiveList : Array;

private var grid : HexagonGrid;

function Start () {
	//Get reference to grid
	grid = FindObjectOfType(HexagonGrid);

	var gObjs = GameObject.FindGameObjectsWithTag("EnemyUnit");
	units = new Array();
	
	var i : int = 0;
	for (var obj : GameObject in gObjs) {
		var unit : Unit = obj.GetComponent(Unit);
		
		var col : int = Mathf.FloorToInt(Random.Range(4, 8));
		var row : int = Mathf.FloorToInt(Random.Range(4, 8));
		
		while (grid.Tile(col, row).occupant) {
			col = Mathf.FloorToInt(Random.Range(4, 8));
			row = Mathf.FloorToInt(Random.Range(4, 8));
		}
		
		unit.initUnit(grid.Tile(col, row));
		
		var uinfo : UnitInfo = obj.GetComponent(UnitInfo);
		uinfo.unitName = "Enemy " + i;
		++i;
		
		units.Push(unit);
	}

	activeList = new Array(units);
	inactiveList = new Array();
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


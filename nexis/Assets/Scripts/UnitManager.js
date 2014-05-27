#pragma strict

import System.Collections.Generic;
import System.Linq;

private var grid : HexagonGrid;

public var SCOUT_PREFAB : GameObject;
public var SNIPER_PREFAB : GameObject;
public var SUPPORT_PREFAB : GameObject;
public var HEAVY_PREFAB : GameObject;

private var units : List.<Unit>;

private var NUMUNITS : int = 3;
private var MAXSPEED : int = 1;

function Start () {
	units = List.<Unit>();

	//Get reference to grid
	grid = FindObjectOfType(HexagonGrid);
	
	InitPlayerUnits();
	InitEnemyUnits();
	
	SortUnits();
	BeginTurn();
}

function InitEnemyUnits()
{
	var gObjs = GameObject.FindGameObjectsWithTag("EnemyUnit");
	var i : int = 0;
	var col : int;
	var row : int;
	var unit : Unit;
	
	//Add enemy units
	for (var obj : GameObject in gObjs) {
		unit = obj.GetComponent(Unit);
		
		col = Mathf.FloorToInt(Random.Range(4, 8));
		row = Mathf.FloorToInt(Random.Range(4, 8));
		
		while (grid.Tile(col, row).occupant) {
			col = Mathf.FloorToInt(Random.Range(4, 8));
			row = Mathf.FloorToInt(Random.Range(4, 8));
		}
		
		unit.InitUnit(grid.Tile(col, row), true);
		unit.GetComponent(UnitInfo).speed = Mathf.FloorToInt(Random.Range(0.0, 40.0));
		
		var uinfo : UnitInfo = obj.GetComponent(UnitInfo);
		uinfo.unitName = "Enemy " + i;
		++i;
		
		units.Add(unit);
	}
}

function InitPlayerUnits()
{
	var i : int = 0;
	var col : int;
	var row : int;
	var unit : Unit;
	
	NUMUNITS = PlayerPrefs.GetInt("num_units");
	//Add player units
	for (i = 0; i < NUMUNITS; ++i) {
		col = Mathf.FloorToInt(Random.Range(2.0, 8.0));
		row = Mathf.FloorToInt(Random.Range(2.0, 8.0));
			
		while (grid.Tile(col, row).occupant) {
			col = Mathf.FloorToInt(Random.Range(2, 8));
			row = Mathf.FloorToInt(Random.Range(2, 8));
		}
	
		var tile : Hexagon = grid.Tile(col,row);
		var pos : Vector3 = tile.transform.position;
		var rot : Quaternion = tile.transform.rotation;
	
		var prepend : String = "unit_" + i.ToString() + "_";		
		var obj : GameObject;
		var type : int = PlayerPrefs.GetInt(prepend + "type");
		switch(type) {
			case 0:
				obj = Instantiate(SCOUT_PREFAB, pos, rot);
				break;
			case 1:
				obj = Instantiate(SUPPORT_PREFAB, pos, rot);
				break;
			case 2:
				obj = Instantiate(SNIPER_PREFAB, pos, rot);
				break;
			case 3:
				obj = Instantiate(HEAVY_PREFAB, pos, rot);
				break;
			default:
				obj = Instantiate(SCOUT_PREFAB, pos, rot);
				break;
		}
		
		unit = obj.GetComponent(Unit);
		
		unit.InitUnit(grid.Tile(col, row), false);
		unit.GetComponent(UnitInfo).speed = Mathf.FloorToInt(Random.Range(50.0, 100.0));
		
		units.Add(unit);
		
		var uSpeed : int = unit.GetComponent(UnitInfo).speed;
		if (uSpeed > MAXSPEED) MAXSPEED = uSpeed;
	}
}

function BeginTurn()
{
	CleanupUnits();
	if (units.Count() <= 0) return null;
	var next : Unit = units[0] as Unit;
	next.BeginTurn();
}

function CurrentUnit()
{
	CleanupUnits();
	if (units.Count() <= 0) return null;
	var ret : Unit = units[0] as Unit;
	//units.RemoveAt(0);
	//units.Add(ret);
	return ret;
}

function CycleTurn()
{
	//Cleanup dead units
	CleanupUnits();
	
	//Nothing left to do?... Bad case proceed with caution
	if (units.Count() <= 0) return null;
	
	var old : Unit = units[0] as Unit;
	units.RemoveAt(0);
	units.Add(old);
	
	BeginTurn();
}

function CleanupUnits()
{
	units.RemoveAll( function(unit) {
		return unit == null;
	});
}

function SortUnits()
{
	units.Sort(CompareDescending);
}

function Units()
{
	return units as List.<Unit>;
}

function CompareDescending (a : Unit, b : Unit)
{
	var aSpeed = a.GetComponent(UnitInfo).speed;
	var bSpeed = b.GetComponent(UnitInfo).speed;
	if (aSpeed == bSpeed) return 0;
	if (aSpeed > bSpeed) return -1;
	if (aSpeed < bSpeed) return 1;
}

function CheckUnitEnded()
{
	if (!units[0].CanAct()) {
		CycleTurn();
	}
}

function IsEnemyTurn() 
{
	return units[0].isEnemy;
}

function GameOver()
{
	return false;
}

function TurnIsOver()
{
	return false;
}

function RandomUnit()
{
	return units[0] as Unit;
}

function Update () 
{
	CheckUnitEnded();
}
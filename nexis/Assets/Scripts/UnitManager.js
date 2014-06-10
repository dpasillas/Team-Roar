#pragma strict

import System.Collections.Generic;
import System.Linq;

private var grid : HexagonGrid;

public var SCOUT_PREFAB : GameObject;
public var SNIPER_PREFAB : GameObject;
public var SUPPORT_PREFAB : GameObject;
public var HEAVY_PREFAB : GameObject;

public var enemy_material : Material;
/*
public var EN_SCOUT_PREFAB : GameObject;
public var EN_SNIPER_PREFAB : GameObject;
public var EN_SUPPORT_PREFAB : GameObject;
public var EN_HEAVY_PREFAB : GameObject;
*/
private var units : List.<Unit>;

private var NUM_UNITS : int = 3;
private var NUM_ENEMIES : int = 0;
private var MAXSPEED : int = 1;

function Start () {
	units = List.<Unit>();

	//Get reference to grid
	grid = FindObjectOfType(HexagonGrid);
	loadFromFile(0);
	//InitPlayerUnits();
	//InitEnemyUnits();
	
	SortUnits();
	BeginTurn();
}

function loadFromFile(level : int) {
	var filename : String = "level" + level + ".dat";
	var reader : System.IO.TextReader = System.IO.File.OpenText(filename);
	
	var value : int = -1;
	//var cols : int = reader.Read();
	//var minRows : int = reader.Read();
	
	var col : int = 0;
	var row : int = -1;
	
	var obj : GameObject = null;
	var unit : Unit = null;
	
	NUM_UNITS = PlayerPrefs.GetInt("num_units");
	
	var i : int = 0;
	
	while( true ) {
		value = reader.Read();
		if(value == -1)
			break;
			
		row++;
			
		var tile : Hexagon = grid.Tile(col,row);
		var c : char = value;
		
		switch(c) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				if(i < NUM_UNITS) {
					createUnit(getUnitType(i),tile,false,i);
					i++;
				}
				break;
			case 'o':
			case 'O':
				//do nothing.  Tile remains empty
				break;
			case 'x':
			case 'X':
				tile.setWall();
				break;
			case 'c':
			case 'C':
				createUnit(SCOUT_PREFAB,tile,true,-1);
				break;
			case 'n':
			case 'N':
				createUnit(SNIPER_PREFAB,tile,true,-1);
				break;
			case 'h':
			case 'H':
				createUnit(HEAVY_PREFAB,tile,true,-1);
				break;
			case 'u':
			case 'U':
				createUnit(SUPPORT_PREFAB,tile,true,-1);
				break;
			case '\n':
				col++;
				row = -1;
				break;
			default:;
		}
	}
	
	NUM_UNITS = Mathf.Min(i, NUM_UNITS);
	return;
}

function getUnitType(i : int) {
	var prepend : String = "unit_" + i + "_";
	var type : int = PlayerPrefs.GetInt(prepend + "type");
	switch(type) {
		case 0:
			return SCOUT_PREFAB;
		case 1:
			return SUPPORT_PREFAB;
		case 2:
			return SNIPER_PREFAB;
		case 3:
			return HEAVY_PREFAB;
		default:
			return SCOUT_PREFAB;
	}
}

function createUnit(prefab : GameObject, tile : Hexagon, enemy : boolean, i : int) {
	var obj : GameObject = Instantiate(prefab, tile.transform.position, tile.transform.rotation);
	var unit : Unit = obj.GetComponent(Unit);
	
	unit.InitUnit(tile,enemy);
	unit.GetComponent(UnitInfo).speed = Mathf.FloorToInt(Random.Range(0.0, 100.0));
	
	if(enemy) {
		var renderers : Component[] = obj.GetComponentsInChildren(MeshRenderer);
		
		Debug.Log("Renderers: " + renderers.Length);
		for( var renderer : MeshRenderer in renderers)
			renderer.material = enemy_material;
		
		var uinfo : UnitInfo = obj.GetComponent(UnitInfo);
		uinfo.unitName = "Enemy " + NUM_ENEMIES;
		
		NUM_ENEMIES++;
	} else{
		unit.GetComponent(UnitInfo).loadUnitStats(i);
	}
	
	units.Add(unit);
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
		
		col = Mathf.FloorToInt(Random.Range(5, 10));
		row = Mathf.FloorToInt(Random.Range(5, 10));
		
		while (grid.Tile(col, row).occupant) {
			col = Mathf.FloorToInt(Random.Range(5, 10));
			row = Mathf.FloorToInt(Random.Range(5, 10));
		}
		
		unit.InitUnit(grid.Tile(col, row), true);
		unit.GetComponent(UnitInfo).speed = Mathf.FloorToInt(Random.Range(0.0, 100.0));
		
		var uinfo : UnitInfo = obj.GetComponent(UnitInfo);
		uinfo.unitName = "Enemy " + i;
		++i;
		
		units.Add(unit);
		NUM_ENEMIES++;
	}
}

function InitPlayerUnits()
{
	var i : int = 0;
	var col : int;
	var row : int;
	var unit : Unit;
	
	NUM_UNITS = PlayerPrefs.GetInt("num_units");
	//Add player units
	for (i = 0; i < NUM_UNITS; ++i) {
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
		unit.GetComponent(UnitInfo).speed = Mathf.FloorToInt(Random.Range(0.0, 100.0));
		unit.GetComponent(UnitInfo).loadUnitStats(i);
		
		
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
	
	if (GameOver())
		return;
	
	//Nothing left to do?... Bad case proceed with caution
	if (units.Count() <= 0) return null;
	
	var old : Unit = units[0] as Unit;
	old.EndTurn();
	units.RemoveAt(0);
	units.Add(old);
	
	BeginTurn();
}

function CleanupUnits()
{
	units.RemoveAll( function(unit) {
		if (unit == null) return true;
		if (!unit.gameObject.activeSelf)
		{
			if (unit.isEnemy) --NUM_ENEMIES; 
			else --NUM_UNITS;
			
			unit.Die();
			return true;
		}
		return false;
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
	if (units[0].IsDone() ) {
		CycleTurn();
	}
}

function IsEnemyTurn() 
{
	return units[0].isEnemy;
}

function GameOver()
{
	return (NUM_UNITS <= 0) || (NUM_ENEMIES <= 0);
}

function DidPlayerWin()
{
	if (NUM_ENEMIES <= 0) return true;
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

function EnemyCount()
{
	return NUM_ENEMIES;
}

function UnitAvgPos()
{
	var sum = Vector3.zero;
	for (unit in units)
		sum += unit.transform.position;
	
	return sum / units.Count();
}

function Update () 
{
	//if (Projectile.animFlag) {
	//	Debug.Log("Stalling animation");	
	//	return;
	//}
	if (GameOver())
		return;
	
	CheckUnitEnded();
}
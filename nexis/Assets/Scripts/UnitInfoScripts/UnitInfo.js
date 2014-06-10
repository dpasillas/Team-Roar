#pragma strict

public class UnitInfo extends MonoBehaviour
{
	var unitName : String;
	var className : String;
	var unitClass : int;
	var currentHealth : int;
	var maxHealth : int;
	var maxHealthBarWidth : int;
	var atk : int;
	var def : int;
	var dex : int;
	var speed : int;
	var scuiObj : GameObject;
	
	private var damage : Damage;
	
	function Start() {
		damage = GetComponent(Damage);
	}
	
	function Update() 
	{
		currentHealth = damage.Health();
	}
	
	function loadUnitStats(index : int)
	{
		/*
		//var scui : StatChangeUnitInfo = new StatChangeUnitInfo();
		PropertyList.deserializePropertyList(scui, index);
		Debug.Log("DESERIALIZING");
		
		unitName = scui.unitName;
		unitClass = scui.unitClass;
		currentHealth = scui.hp;
		maxHealth = scui.maxHP;
		maxHealthBarWidth = scui.hpBarWidth;
		atk = scui.atk;
		def = scui.def;
		dex = scui.dex;
		speed = scui.dex;
		*/
		
		deserializePropertyList(this, index);
		
		var classNum = unitClass;
		if (classNum == 0) {
			className = "Scout";
		}
		else if (classNum == 1) {
			className = "Support";
		}
		else if (classNum == 2) {
			className = "Sniper";
		}
		else if (classNum == 3) {
			className = "Heavy";
		}
		else {
			Debug.Log("Error: invalid class number");
		}
		
		
		//Debug.Log("UNIT NAME: " + scui.unitName);
	}
}

// Loads info - read from property list
function deserializePropertyList (scui : UnitInfo, index : int) {
	Debug.Log("Deserializing # " + index);
	var unit_key : String = "unit_" + index.ToString();
	var prepend : String = unit_key + "_";

	// Generate keys used to lookup unit info
	var name_key			= prepend + "name";
	var type_key 			= prepend + "type";
	var lv_key 				= prepend + "lv";
	var maxLv_key			= prepend + "maxLv";
	var hpBarWidth_key 		= prepend + "hpBarWidth";
	var exp_key 			= prepend + "exp";
	var hp_key 				= prepend + "hp";
	var maxHP_key 			= prepend + "maxHP";
	var atk_key 			= prepend + "atk";
	var def_key 			= prepend + "def";
	var dex_key 			= prepend + "dex";
	var atkOrig_key 		= prepend + "atkOrig";
	var defOrig_key 		= prepend + "defOrig";
	var dexOrig_key 		= prepend + "dexOrig";
	var statPoints_key 		= prepend + "statPoints";
	var statPointsOrig_key 	= prepend + "statPointsOrig";
	var unitIsCurrent_key 	= prepend + "unitIsCurrent";

	// Read unit info from the property list
	scui.unitName 		= PlayerPrefs.GetString(name_key);
	scui.unitClass 		= PlayerPrefs.GetInt(type_key);
	scui.currentHealth			= PlayerPrefs.GetInt(hp_key);
	scui.maxHealth		= PlayerPrefs.GetInt(maxHP_key);
	scui.maxHealthBarWidth 	= PlayerPrefs.GetInt(hpBarWidth_key);
	scui.atk 			= PlayerPrefs.GetInt(atk_key);
	scui.def 			= PlayerPrefs.GetInt(def_key);
	scui.dex 			= PlayerPrefs.GetInt(dex_key);
	scui.speed = scui.dex;
	
	Debug.Log("PREPEND: " + dex_key + " NAME: " + PlayerPrefs.GetString(dex_key));
	Debug.Log("HAS KEY" + PlayerPrefs.HasKey(dex_key));
}

/*

// write to property list
function serializePropertyList (scui : UnitInfo, index : int) {
	var unit_key : String = "unit_" + index.ToString();
	var prepend : String = unit_key + "_";

	// generate keys
	var name_key = prepend + "name";
	var type_key = prepend + "type";
	var lv_key = prepend + "lv";
	var maxLv_key = prepend + "maxLv";
	var exp_key = prepend + "exp";
	var hp_key = prepend + "hp";
	var maxHP_key = prepend + "maxHP";
	var atk_key = prepend + "atk";
	var def_key = prepend + "def";
	var dex_key = prepend + "dex";
	var atkOrig_key = prepend + "atkOrig";
	var defOrig_key = prepend + "defOrig";
	var dexOrig_key = prepend + "dexOrig";
	var statPoints_key = prepend + "statPoints";
	var statPointsOrig_key = prepend + "statPointsOrig";
	var unitIsCurrent_key = prepend + "unitIsCurrent";

	// get data
	var name : String = scui.unitName;
	var type : int = scui.unitClass;
	var hp : int = scui.hp;
	var maxHP : int = scui.maxHP;
	//var lv : int = scui.lv;
	//var maxLv : int = scui.maxLv;
	//var exp : int = scui.exp;
	var atk : int = scui.atk;
	var def : int = scui.def;
	var dex : int = scui.dex;
	var atkOrig : int = atk;
	var defOrig : int = def;
	var dexOrig : int = dex;
	var statPoints : int = scui.statPoints;
	var statPointsOrig : int = scui.statPoints;
	var unitIsCurrent : int = scui.unitIsCurrent;

	// Write unit info to property list
	PlayerPrefs.SetString(name_key, name);
	PlayerPrefs.SetInt(type_key, type);
	PlayerPrefs.SetInt(hp_key, hp);
	PlayerPrefs.SetInt(maxHP_key, maxHP);
	PlayerPrefs.SetInt(lv_key, lv);
	PlayerPrefs.SetInt(maxLv_key, maxLv);
	PlayerPrefs.SetInt(exp_key, exp);
	PlayerPrefs.SetInt(atk_key, atk);
	PlayerPrefs.SetInt(def_key, def);
	PlayerPrefs.SetInt(dex_key, dex);
	PlayerPrefs.SetInt(atkOrig_key, atkOrig);
	PlayerPrefs.SetInt(defOrig_key, defOrig);
	PlayerPrefs.SetInt(dexOrig_key, dexOrig);
	PlayerPrefs.SetInt(statPoints_key, statPoints);
	PlayerPrefs.SetInt(statPointsOrig_key, statPointsOrig);
	PlayerPrefs.SetInt(unitIsCurrent_key, unitIsCurrent);
}

*/
#pragma strict

// "creates" the property list
public static function initPropertyList () {
	//Init Units
	var num_units : int = 6;
	PlayerPrefs.SetInt("num_units", num_units);
	var save : int = 1;
	PlayerPrefs.SetInt("SaveExists", save);

	// For each unit set info
	for (var i : int = 0; i < num_units; ++i) {
		var unit_key : String = "unit_" + i.ToString();
		var prepend : String = unit_key + "_";

		// generate keys
		var name_key = prepend + "name";
		var type_key = prepend + "type";
		var lv_key = prepend + "lv";
		var maxLv_key = prepend + "maxLv";
		var exp_key = prepend + "exp";
		var hp_key = prepend + "hp";
		var maxHP_key = prepend + "maxHP";
		var hpBarWidth_key = prepend + "hpBarWidth";
		var atk_key = prepend + "atk";
		var def_key = prepend + "def";
		var dex_key = prepend + "dex";
		var atkOrig_key = prepend + "atkOrig";
		var defOrig_key = prepend + "defOrig";
		var dexOrig_key = prepend + "dexOrig";
		var statPoints_key = prepend + "statPoints";
		var statPointsOrig_key = prepend + "statPointsOrig";
		var statIncrement_key = prepend + "statIncrement";
		var unitIsCurrent_key = prepend + "unitIsCurrent";

		// get data
		var name : String;

		var type : int = i;
		if(i > 3)
			type = Random.Range(0, 3);

		var hp : int = 100;
		var maxHP : int = 100;
		var hpBarWidth : int = 295;
		var lv : int = 1;
		var maxLv : int = 20;
		var exp : int = 0;
		var atk : int;
		var def : int;
		var dex : int;
		var atkOrig : int = atk;
		var defOrig : int = def;
		var dexOrig : int = dex;
		var statPoints : int = 0;
		var statPointsOrig : int = 0;
		var unitIsCurrent : int = 0;

		// Generate stats based on type
		switch(type)
		{
			case 0: // SCOUT
				name = "McScout";
				atk = 45;
				def = 40;
				dex = 55;
				atkOrig = atk;
				defOrig = def;
				dexOrig = dex;
				break;

			case 1: // SUPPORT
				name = "Healsalot";
				atk = 25;
				def = 40;
				dex = 40;
				atkOrig = atk;
				defOrig = def;
				dexOrig = dex;
				break;

			case 2: // SNIPER
				name = "Snypen";
				atk = 75;
				def = 15;
				dex = 75;
				atkOrig = atk;
				defOrig = def;
				dexOrig = dex;
				break;

			case 3: // HEAVY
				name = "Heavy";
				atk = 50;
				def = 65;
				dex = 30;
				atkOrig = atk;
				defOrig = def;
				dexOrig = dex;
				break;

			default:
				// Debug.Log("classNum: " + classNum);
				name = "INVALID";
				atk = 0;
				def = 0;
				dex = 0;
				atkOrig = atk;
				defOrig = def;
				dexOrig = dex;
				break;
		}

		// Write unit info to property list
		PlayerPrefs.SetString(name_key, name);
		PlayerPrefs.SetInt(type_key, type);
		PlayerPrefs.SetInt(hp_key, hp);
		PlayerPrefs.SetInt(maxHP_key, maxHP);
		PlayerPrefs.SetInt(hpBarWidth_key, hpBarWidth);
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
}


// "deletes" the property list
function clearPropertyList () {
	PlayerPrefs.DeleteAll();
}

// manually save property list to disk
function savePropertyList () {
	PlayerPrefs.Save();
}

function getListSize (ul : UnitList) {
	//Init Units
	var num_units : int = PlayerPrefs.GetInt("num_units");
	ul.listSize = num_units;
}

// Loads info - read from property list
public static function deserializePropertyList (scui : StatChangeUnitInfo, index : int) {
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
	scui.hp 			= PlayerPrefs.GetInt(hp_key);
	scui.maxHP 			= PlayerPrefs.GetInt(maxHP_key);
	scui.hpBarWidth 	= PlayerPrefs.GetInt(hpBarWidth_key);
	scui.exp 			= PlayerPrefs.GetInt(exp_key);
	scui.lv 			= PlayerPrefs.GetInt(lv_key);
	scui.maxLv 			= PlayerPrefs.GetInt(maxLv_key);
	scui.atk 			= PlayerPrefs.GetInt(atk_key);
	scui.def 			= PlayerPrefs.GetInt(def_key);
	scui.dex 			= PlayerPrefs.GetInt(dex_key);
	scui.atkOrig 		= PlayerPrefs.GetInt(atkOrig_key);
	scui.defOrig 		= PlayerPrefs.GetInt(defOrig_key);
	scui.dexOrig 		= PlayerPrefs.GetInt(dexOrig_key);
	scui.statPoints 	= PlayerPrefs.GetInt(statPoints_key);
	scui.statPointsOrig = PlayerPrefs.GetInt(statPointsOrig_key);
	scui.unitIsCurrent 	= PlayerPrefs.GetInt(unitIsCurrent_key);
}

// write to property list
function serializePropertyList (scui : StatChangeUnitInfo, index : int) {
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
	var lv : int = scui.lv;
	var maxLv : int = scui.maxLv;
	var exp : int = scui.exp;
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
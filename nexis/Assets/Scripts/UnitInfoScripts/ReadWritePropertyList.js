#pragma strict

function deserializePropertyList (ui : UnitInfo) {
	//Init Units
	var num_units : int = PlayerPrefs.GetInt("num_units");
	
	for (var i : int = 0; i < num_units; ++i) {
		var unit_key : String = "unit_" + i.ToString();
		var prepend : String = unit_key + "_";
		
		// Generate keys used to lookup unit info
		var name_key = prepend + "name";
		var type_key = prepend + "type";
		var atk_key = prepend + "atk";
		var def_key = prepend + "def";
		var dex_key = prepend + "dex";
		
		// Read unit info from the property list
		ui.unitName = PlayerPrefs.GetString(name_key);
		ui.unitClass = PlayerPrefs.GetInt(type_key);
		ui.atk = PlayerPrefs.GetInt(atk_key);
		ui.def = PlayerPrefs.GetInt(def_key);
		ui.dex = PlayerPrefs.GetInt(dex_key);
	}
}

function serializePropertyList (ui : UnitInfo) {
	//Init Units
	var num_units : int = 4;
	PlayerPrefs.SetInt("num_units", num_units);

	for (var i : int = 0; i < num_units; ++i) {
		var unit_key : String = "unit_" + i.ToString();
		var prepend : String = unit_key + "_";

		var name_key = prepend + "name";
		var name : String = "PlayerUnit " + i.ToString();
		var type_key = prepend + "type";
		var type : int = i;
		var atk_key = prepend + "atk";
		var atk : int = 100;
		var def_key = prepend + "def";
		var def : int = 100;
		var dex_key = prepend + "dex";
		var dex : int = 100;
														//var values = new Array(name, type);
														//var serialized = values.join(",");
		// Write unitinfo to property list
		PlayerPrefs.SetString(name_key, name);
		PlayerPrefs.SetInt(type_key, type);
		PlayerPrefs.SetInt(atk_key, atk);
		PlayerPrefs.SetInt(def_key, def);
		PlayerPrefs.SetInt(dex_key, dex);
	}
}
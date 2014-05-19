#pragma strict

public var reset : boolean = true;

function Awake () {
	if (reset) {
		PlayerPrefs.DeleteAll();
		Init();
	}
}

function Init() {
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
		
		//var values = new Array(name, type);
		//var serialized = values.join(",");
		
		PlayerPrefs.SetString(name_key, name);
		PlayerPrefs.SetInt(type_key, type);
	}
}
#pragma strict

var scui : StatChangeUnitInfo;

function Start () {
	//scui = FindObjectOfType(StatChangeUnitInfo);	// Reference to the GUI Manager
}

function Update () {
}

function OnMouseEnter () {
	if (!StatChangeUnitInfo.current) {
		Debug.Log("Returning");
		return;
	}
	scui = StatChangeUnitInfo.current;
	
	if(transform.parent.name == "SectionAtk")
		scui.currentSelection = 0;
	if(transform.parent.name == "SectionDef") {
		Debug.Log("Section Defense Mouse Hover");
		scui.currentSelection = 1;
		
	}
	if(transform.parent.name == "SectionDex")
		scui.currentSelection = 2;
}
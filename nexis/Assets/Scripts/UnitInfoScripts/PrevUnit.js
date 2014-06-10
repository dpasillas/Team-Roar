#pragma strict

var ulScript : UnitList;
var unitChangeLeft : Texture2D;
var unitChangeLeftHL : Texture2D;

function Start () {
	ulScript = FindObjectOfType(UnitList);
}

function Update () {
	
}

function OnMouseDown () {
	if(ulScript.finishedMovement) {
		ulScript.moveCurrentUnitRight = true;
		ulScript.finishedMovement = false;
		guiTexture.texture = unitChangeLeftHL;
	}
}

function OnMouseUp () {
	guiTexture.texture = unitChangeLeft;
}
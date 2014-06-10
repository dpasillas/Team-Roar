#pragma strict

var ulScript : UnitList;
var unitChangeRight : Texture2D;
var unitChangeRightHL : Texture2D;

function Start () {
	ulScript = FindObjectOfType(UnitList);
}

function Update () {
	
}

function OnMouseDown () {
	if(ulScript.finishedMovement) {
		ulScript.moveCurrentUnitLeft = true;
		ulScript.finishedMovement = false;
		guiTexture.texture = unitChangeRightHL;
	}
}

function OnMouseUp () {
	guiTexture.texture = unitChangeRight;
}
#pragma strict

var save_button_idle : Texture2D;
var save_button_hover : Texture2D;
var ulScript : UnitList;

function Start () {
	ulScript = FindObjectOfType(UnitList);
}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = save_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = save_button_idle;
}

function OnMouseDown()
{
	ulScript.WriteSaveFile();
	transform.GetChild(0).gameObject.SetActive(true);
}

function OnMouseUp ()
{
	transform.GetChild(0).gameObject.SetActive(false);
}
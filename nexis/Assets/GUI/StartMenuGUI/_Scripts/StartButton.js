#pragma strict

var start_button_idle : Texture2D;
var start_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = start_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = start_button_idle;
}

function OnMouseDown()
{
	Application.LoadLevel("level1");
}
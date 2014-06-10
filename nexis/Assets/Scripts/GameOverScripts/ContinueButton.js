#pragma strict

var continue_button_idle : Texture2D;
var continue_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = continue_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = continue_button_idle;
}

function OnMouseDown()
{
	Application.LoadLevel("StatChangeMenu");
}
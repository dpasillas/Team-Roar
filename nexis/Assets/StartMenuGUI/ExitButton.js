#pragma strict

var exit_button_idle : Texture2D;
var exit_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = exit_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = exit_button_idle;
}

function OnMouseDown()
{
	Application.Quit();
}
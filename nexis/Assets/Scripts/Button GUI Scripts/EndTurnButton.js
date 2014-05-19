#pragma strict

var end_button_idle : Texture2D;
var end_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = end_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = end_button_idle;
}
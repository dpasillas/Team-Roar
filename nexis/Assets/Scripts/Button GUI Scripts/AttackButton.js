#pragma strict

var move_button_idle : Texture2D;
var move_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = move_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = move_button_idle;
}
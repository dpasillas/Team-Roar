#pragma strict

var retry_button_idle : Texture2D;
var retry_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = retry_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = retry_button_idle;
}

function OnMouseDown()
{
	Application.LoadLevel("StatChangeMenu");
}
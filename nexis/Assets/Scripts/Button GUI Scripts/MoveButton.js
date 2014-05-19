#pragma strict

var attack_button_idle : Texture2D;
var attack_button_hover : Texture2D;

function Start () {

}

function Update () {
	
}

function OnMouseEnter()
{
	guiTexture.texture = attack_button_hover;
}

function OnMouseExit()
{
	guiTexture.texture = attack_button_idle;
}
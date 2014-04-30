#pragma strict

var button_idle : Texture2D;
var button_hover : Texture2D;
var button_disabled : Texture2D;

private var gsm : GameStateManager;

function Start () {
	gsm = FindObjectOfType(GameStateManager);
}

function Update () {
	if (gsm.GetMenuState() == MenuState.Disabled)
		guiTexture.texture = button_disabled;
}

function OnMouseEnter()
{
	guiTexture.texture = button_hover;
}

function OnMouseDown ()
{
	gsm.SetMenuState(MenuState.AttackDown);
}

function OnMouseExit()
{
	guiTexture.texture = button_idle;
}
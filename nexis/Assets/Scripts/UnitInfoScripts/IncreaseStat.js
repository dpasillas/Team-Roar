#pragma strict

var statChangeArrowRight : Texture2D;
var statChangeArrowRightHL : Texture2D;
var scui : StatChangeUnitInfo;

function Start () {
}

function Update () {
//	if(Input.GetKeyDown(KeyCode.RightArrow)) {
//		if(scui.statPoints > 0) {
//			guiTexture.texture = statChangeArrowRightHL;
//			scui.statIncrement = 1;
//		}
//		else
//			scui.statIncrement = 0;
//	}
//	
//	if(Input.GetKeyUp(KeyCode.RightArrow))
//		guiTexture.texture = statChangeArrowRight;
}

function OnMouseDown () {
	scui = StatChangeUnitInfo.current;
	
	if(scui.statPoints > 0) {
		guiTexture.texture = statChangeArrowRightHL;
		scui.increaseStat();
	}
	else
		scui.statIncrement = 0;
}

function OnMouseUp () {
	guiTexture.texture = statChangeArrowRight;
}
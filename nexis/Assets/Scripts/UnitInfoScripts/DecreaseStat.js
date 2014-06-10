#pragma strict

var statChangeArrowLeft : Texture2D;
var statChangeArrowLeftHL : Texture2D;
var scui : StatChangeUnitInfo;

function Start () {
}

function Update () {
//	if(Input.GetKeyDown(KeyCode.LeftArrow)) {
//        if(scui.statPoints < scui.statPointsOrig) {
//            // check against base stat
//            if(scui.currentSelection == 0) {
//                if(scui.atk != scui.atkOrig)
//                    guiTexture.texture = statChangeArrowLeftHL;
//                else
//                    guiTexture.texture = statChangeArrowLeft;
//            }
//            else if(scui.currentSelection == 1) {
//                if(scui.def != scui.defOrig)
//                    guiTexture.texture = statChangeArrowLeftHL;
//                else
//                    guiTexture.texture = statChangeArrowLeft;
//            }
//            else {	// if(scui.currentSelection == 2)
//                if(scui.dex != scui.dexOrig)
//                    guiTexture.texture = statChangeArrowLeftHL;
//                else
//                    guiTexture.texture = statChangeArrowLeft;
//            }
//            scui.statIncrement = -1;
//        }
//    	else
//	        scui.statIncrement = 0;
//    }
//
//	if(Input.GetKeyUp(KeyCode.LeftArrow))
//		guiTexture.texture = statChangeArrowLeft;
}

function OnMouseDown () {
	scui = StatChangeUnitInfo.current;
	
	if(scui.statPoints < scui.statPointsOrig) {
		guiTexture.texture = statChangeArrowLeftHL;
		scui.decreaseStat();
	}
	else
		scui.statIncrement = 0;
}

function OnMouseUp () {
	guiTexture.texture = statChangeArrowLeft;
}
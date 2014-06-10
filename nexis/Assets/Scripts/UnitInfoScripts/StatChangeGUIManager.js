#pragma strict

public class StatChangeGUIManager extends MonoBehaviour {
	// function Start () {}

	function Update () {
//		var cur : Unit = Unit.current;
//		if (cur) {
//			renderGUI(cur.GetComponent(StatChangeUnitInfo));
//			Debug.Log("Rendering GUI...");
//		}
	}
	
	function renderGUI (scui : StatChangeUnitInfo) {
		var subChild : Transform;
		var i : int;
		var j : int;

		for(i = 0; i < transform.GetChild(0).childCount; ++i) {
			var child = transform.GetChild(0).GetChild(i);

			// GUI Text info
			if (child.name == "UnitName")
				child.guiText.text = scui.unitName;

			if (child.name == "UnitClass") {
				var classNum = scui.unitClass;

				// Assign GUIText to respective class
				switch(classNum) {
					case 0: // SCOUT
						child.guiText.text = "Scout";
						break;
					case 1: // SUPPORT
						child.guiText.text = "Support";
						break;
					case 2: // SNIPER
						child.guiText.text = "Sniper";
						break;
					case 3: // HEAVY
						child.guiText.text = "Heavy";
						break;
					default:
						// Debug.Log("classNum: " + classNum);
						child.guiText.text = "INVALID";
						break;
				}
			}

			if(child.name == "UnitLv")
				child.guiText.text = "" + scui.lv;
				
			if(child.name == "UnitHealthMax" || child.name == "UnitHP")
				child.guiText.text = "" + scui.maxHP;
				
			if(child.name == "UnitAtk")
				child.guiText.text = "" + scui.atk;
				
			if(child.name == "UnitDef")
				child.guiText.text = "" + scui.def;
			
			if(child.name == "UnitDex")
				child.guiText.text = "" + scui.dex;
			
			// ====================================================================
			if(child.name == "SectionAtk") {
				if(scui.currentSelection == 0) {
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(true);	// render the current selection
					}
				}
				else {
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(false);	// don't render the selection
					}
				}
			}

			// ====================================================================
			if(child.name == "SectionDef") {
				if(scui.currentSelection == 1) {
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(true);	// render the selection
					}
				}
				else {
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(false);	// don't render the selection
					}
				}
			}
			
			// ====================================================================
			if(child.name == "SectionDex") {
				if(scui.currentSelection == 2) {			
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(true);	// render the selection
					}
				}
				else {
					for(j = 0; j < 3; ++j) {
						subChild = child.GetChild(j);
						subChild.gameObject.SetActive(false);	// don't render the selection
					}
				}
			}
			
			if(child.name == "UnitSP") {
				child.guiText.text = "" + scui.statPoints;
			}
		}
	}

	function statSelection (scui : StatChangeUnitInfo, statChildren : Array) {	
		statChildren = new Array();
		
		// Populate children array
		for(var i = 0; i < transform.GetChild(0).childCount; ++i)
		{
			var child = transform.GetChild(0).GetChild(i);
			if(child.name == "UnitAtk")
				statChildren.push(child);
			if(child.name == "UnitDef")
				statChildren.push(child);
			if(child.name == "UnitDex")
				statChildren.push(child);
		}
	}

}

#pragma strict

public class GUIManager extends MonoBehaviour
{
	enum UnitClasses { Scout, Support }

	function Start () {

	}

	function Update () {
		var cur : Unit = Unit.current;
		if (cur)
			renderGUIText(cur.GetComponent(UnitInfo));
	}

	function initUnitInfo(ui : UnitInfo)
	{
	// this will be where we need to read from the plist
	// also write a function to write to plist
		ui.unitName = "Bob";
		ui.unitClass = 0;
		ui.currentHealth = 100;
		ui.maxHealth = 100;
		ui.maxHealthBarWidth = 295;
		ui.atk = 75;
		ui.def = 50;
		ui.dex = 25;
	}
	
	function renderGUIText(ui : UnitInfo)
	{	
		for(var i = 0; i < transform.GetChild(0).childCount; ++i)
		{
			var child = transform.GetChild(0).GetChild(i);
			// GUI Text info
			if (child.name == "UnitName") {
				child.guiText.text = ui.unitName;
			}
			if (child.name == "UnitClass") {
				var classNum = ui.unitClass;
				if (classNum == 0) {
					child.guiText.text = "Scout";
				}
				else if (classNum == 1) {
					child.guiText.text = "Support";
				}
				else if (classNum == 2) {
					child.guiText.text = "Sniper";
				}
				else if (classNum == 3) {
					child.guiText.text = "Heavy";
				}
				else {
					Debug.Log("Error: invalid class number");
				}
			}
			
			if(child.name == "UnitHealthCurrent")
				child.guiText.text = "" + ui.currentHealth;
			if(child.name == "UnitHealthMax" || child.name == "UnitHP")
				child.guiText.text = "" + ui.maxHealth;
			if(child.name == "UnitAtk")
				child.guiText.text = "" + ui.atk;
			if(child.name == "UnitDef")
				child.guiText.text = "" + ui.def;
			if(child.name == "UnitDex")
				child.guiText.text = "" + ui.dex;

			// Health Bars
			if(child.name == "UnitHPAmount")
				child.guiTexture.pixelInset.width = ui.maxHealthBarWidth * ui.currentHealth / 100;
			
			if(child.name == "UnitHPContainer")
				child.guiTexture.pixelInset.width = ui.maxHealthBarWidth;	
		}
		// Debug.Log("" + transform.GetChild(0).childCount);
	}
}

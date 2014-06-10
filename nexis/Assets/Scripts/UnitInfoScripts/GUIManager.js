#pragma strict

public class GUIManager extends MonoBehaviour
{
	enum UnitClasses { Scout, Support }
	
	private var cur : Unit;

	function Start () {

	}

	function Update () {
		if (Unit.mouseDownUnit)
			cur = Unit.mouseDownUnit;
		else if (Unit.current)
			cur = Unit.current;
			
		if (cur)
			renderGUIText(cur.GetComponent(UnitInfo));
	}

	function initInfo(ui : UnitInfo)
	{
		/*
		ui.unitName = "Bob";
		ui.className = "Scout";
		ui.currentHealth = 100;
		ui.maxHealth = 100;
		ui.maxHealthBarWidth = 295;
		*/
	}
	
	function renderGUIText(ui : UnitInfo)
	{	
		for(var i = 0; i < transform.GetChild(0).childCount; ++i)
		{
			var child = transform.GetChild(0).GetChild(i);
			
			// GUI Text info
			if(child.name == "UnitName")
				child.guiText.text = ui.unitName;
			if(child.name == "UnitClass")
				child.guiText.text = ui.className;
			if(child.name == "UnitHealthCurrent")
				child.guiText.text = "" + ui.currentHealth;
			if(child.name == "UnitHealthMax")
				child.guiText.text = "" + ui.maxHealth;

			// Health Bars
			if(child.name == "UnitHPAmount")
			{
				child.guiTexture.pixelInset.width = ui.maxHealthBarWidth * ui.currentHealth / 100;
			}
			
			if(child.name == "UnitHPContainer")
				child.guiTexture.pixelInset.width = ui.maxHealthBarWidth;	
		}
		// Debug.Log("" + transform.GetChild(0).childCount);
	}
}
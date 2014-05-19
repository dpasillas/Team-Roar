#pragma strict

public class UnitInfo extends MonoBehaviour
{
	var unitName : String;
	var className : String;
	var currentHealth : int;
	var maxHealth : int;
	var maxHealthBarWidth : int;
	//var guiManagerScript : GUIManager;
	
	function Start() {
		//guiManagerScript = FindObjectOfType(GUIManager);
		//guiManagerScript.initInfo(this);
	}
	
	function Update() 
	{
		
		if(Input.GetKeyDown("d"))	// damage
		{
			currentHealth -= 1;
			if(currentHealth < 0)
				currentHealth = 0;
		}
		
		if(Input.GetKeyDown("h"))	// heal
		{
			currentHealth += 10;
			if(currentHealth > maxHealth)
				currentHealth = maxHealth;
		}
		
		//guiManagerScript.renderGUIText(this);
		
	}
}

#pragma strict

public class StatChangeUnitInfo extends MonoBehaviour {
	// ===================================
	// public vars
	// ==========================================
	// Identity
	var unitName : String;
	var unitClass : int;

	// Level and experience
	var lv : int;
	var maxLv : int;
	var exp : int;

	// Stats
	var hp : int;
	var maxHP : int;
	var hpBarWidth : int;				// health bar texture width
	var atk : int;
	var def : int;
	var dex : int;
	var atkOrig : int;
	var defOrig : int;
	var dexOrig : int;

	// Stat modification
	var statChildren : Array;			// array of stats which are children of GUI
	var currentSelection : int;			// the current placement of the cursor on the stats
	var statPoints : int;				// stat points (SP) that can be used after leveling up
	var statPointsOrig : int;			// the original amount of SP
	var statIncrement : int;			// flag for incrementing stats
	var unitIsCurrent : int;

	// Script references
	var propertyListScript : PropertyList;
	var guiManagerScript : StatChangeGUIManager;

	public static var current : StatChangeUnitInfo;

	// ===================================
	// Start Function
	// ==========================================
	function Start () {
		// Get references to necessary scrips
		guiManagerScript = FindObjectOfType(StatChangeGUIManager);	// Reference to the GUI Manager
		propertyListScript = FindObjectOfType(PropertyList);		// Reference to the plist
		guiManagerScript.statSelection(this, statChildren);			// Create an array of stats for selecting
	}

	// ===================================
	// Update Function
	// ==========================================
	function Update () {

		if(current == this) {
			// Get exp
			if(Input.GetKeyDown(KeyCode.L))
				gainExp();

			// Increase stat depending on where the selection is
			if (Input.GetKeyDown(KeyCode.LeftArrow))
				decreaseStat();

			if (Input.GetKeyDown(KeyCode.RightArrow))
				increaseStat();

			// Move statSelection up and down
			if(Input.GetKeyDown(KeyCode.UpArrow))
				decreaseSelection();
			if(Input.GetKeyDown(KeyCode.DownArrow))
				increaseSelection();

			guiManagerScript.renderGUI(this);
			levelUp();
		}
	} // fucntion Update ()

	function gainExp () {
		exp += 13;
		Debug.Log("Current Exp: " + exp);
	} // function gainExp ()

	function levelUp () {
		if(lv == maxLv)
			return;

		if(exp >= lv * 100) {
			exp = exp - (lv * 100);			// reset exp and apply leftover
			lv++;							// increment level
			statPoints += 10;				// give unit stat points to use
			statPointsOrig = statPoints;	// update statPointsOrig
		}
	} // function levelUp ()

	function increaseStat () {
		if(statPoints > 0) {
			if (currentSelection == 0) {
				atk++;
				statPoints--;
			}
			else if (currentSelection == 1) {
				def++;
				statPoints--;
			}
			else if (currentSelection == 2) {
				dex++;
				statPoints--;
			}
		}
	}

	function decreaseStat () {
		if (statPoints < statPointsOrig) {
			if (currentSelection == 0) {
				if(atk > atkOrig) {
					atk--;
					statPoints++;
				}
			}
			else if (currentSelection == 1) {
				if(def > defOrig) {
					def--;
					statPoints++;
				}
			}
			else if (currentSelection == 2) {
				if(dex > dexOrig) {
					dex--;
					statPoints++;
				}
			}
		}
	}

	function decreaseSelection () {
		if(currentSelection > 0)
			currentSelection--;
		else
			currentSelection = 2;
	}

	function increaseSelection () {
		if(currentSelection < 2)
			currentSelection++;
		else
			currentSelection = 0;
	}
}

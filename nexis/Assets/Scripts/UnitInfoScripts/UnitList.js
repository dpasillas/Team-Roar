#pragma strict

public class UnitList extends MonoBehaviour {
	var listSize : int;
	var unitPrefab : GameObject;
	var unitsArray : Array;
	var currentUnitIndex : int;
	var firstUnit : GameObject;
	var previousUnit : GameObject;
	var currentUnit : GameObject;
	var nextUnit : GameObject;
	var leftTransformReference : GameObject;
	var leftPositionReference : Vector3;
	var leftRotationReference : Quaternion;
	var centerTransformReference : GameObject;
	var centerPositionReference : Vector3;
	var centerRotationReference : Quaternion;
	var rightTransformReference : GameObject;
	var rightPositionReference : Vector3;
	var rightRotationReference : Quaternion;
	var moveFirstUnit : boolean;
	var moveCurrentUnitLeft : boolean;
	var moveNextUnitCenter : boolean;
	var movePrevUnitCenter : boolean;
	var moveCurrentUnitRight : boolean;
	var finishedMovement : boolean;
	
	private var xVel = 0.0;
	private var yVel = 0.0;
	private var zVel = 0.0;
	private var switchSpeed = 5;
	
	// Script references
	var propertyListScript : PropertyList;
	var guiManagerScript : StatChangeGUIManager;
	
	// ========================================
	// Start Function
	// ============================================================================================
	function Start () {
		// Get references to necessary scrips
		guiManagerScript 	= FindObjectOfType(StatChangeGUIManager);	// Reference to the GUI Manager
		propertyListScript 	= FindObjectOfType(PropertyList);			// Reference to the plist
		
		// Set transform references for unit placements
		leftPositionReference 	= leftTransformReference.transform.localPosition;
		leftRotationReference 	= leftTransformReference.transform.localRotation;
		centerPositionReference = centerTransformReference.transform.localPosition;
		centerRotationReference = centerTransformReference.transform.localRotation;
		rightPositionReference 	= rightTransformReference.transform.localPosition;
		rightRotationReference 	= rightTransformReference.transform.localRotation;
		
		// Check if a save file exists and load it if it does
		if (PlayerPrefs.GetInt("SaveExists") == 1) {
			Debug.Log("Save file exists!");
			LoadSaveFile();		// Loads save file
		}
		else {	// If save file doesn't exist, initialize a default one
			Debug.Log("Save file doesn't exist!");
			CreateSaveFile();	// Initialize save file
			LoadSaveFile();		// Now load the generated file
		}
		
		// Moves the first Unit into view
		moveFirstUnit = true;
	}

	function Update () {
		if (moveFirstUnit) {
			var x = Mathf.SmoothDamp(firstUnit.transform.position.x, centerPositionReference.x, xVel, switchSpeed * Time.deltaTime);
			var y = Mathf.SmoothDamp(firstUnit.transform.position.y, centerPositionReference.y, yVel, switchSpeed * Time.deltaTime);
			var z = Mathf.SmoothDamp(firstUnit.transform.position.z, centerPositionReference.z, zVel, switchSpeed * Time.deltaTime);
			firstUnit.transform.position = Vector3(x, y, z);
			finishedMovement = false;
			if (firstUnit.transform.position == centerPositionReference) {
				moveFirstUnit = false;
				finishedMovement = true;
			}
		}

		if (Input.GetKeyDown(KeyCode.RightShift) && finishedMovement) {
			moveCurrentUnitLeft = true;
			finishedMovement = false;
		}
		
		if (Input.GetKeyDown(KeyCode.LeftShift) && finishedMovement) {
			moveCurrentUnitRight = true;
			finishedMovement = false;
		}
		
//		if (Input.GetKeyDown(KeyCode.S))
//			WriteSaveFile();
		
//		if(Input.GetKeyDown(KeyCode.X))
//			propertyListScript.clearPropertyList();
		
		updateUnitReferences();
		ShiftLeft();
		ShiftRight();
	}
	
	function CreateSaveFile() {
		propertyListScript.initPropertyList();
		propertyListScript.savePropertyList();
	}

	function LoadSaveFile() {
		propertyListScript.getListSize(this);
		unitsArray = new Array();
		for(var i = 0; i < listSize; ++i) {
			var obj = Instantiate(unitPrefab, rightPositionReference, rightRotationReference) as GameObject;
			var scui = obj.AddComponent(StatChangeUnitInfo);
			propertyListScript.deserializePropertyList(scui, i);
			unitsArray.push(obj);
		}
		currentUnitIndex = 0;
		firstUnit = unitsArray[currentUnitIndex];
		StatChangeUnitInfo.current = firstUnit.GetComponent(StatChangeUnitInfo);
	}
	
	function WriteSaveFile () {
		for(var i = 0; i < listSize; ++i) {
			var obj : GameObject = unitsArray[i];
			var scui = obj.GetComponent(StatChangeUnitInfo);
			propertyListScript.serializePropertyList(scui, i);
			unitsArray.push(obj);
		}
		propertyListScript.savePropertyList();
	}
	
	function updateUnitReferences() {
		if(currentUnitIndex == 0)
			previousUnit = null;
		else {
			previousUnit = unitsArray[currentUnitIndex - 1];
			previousUnit.GetComponent(StatChangeUnitInfo).unitIsCurrent = 0;
		}

		currentUnit = unitsArray[currentUnitIndex];
		StatChangeUnitInfo.current = currentUnit.GetComponent(StatChangeUnitInfo);

		if(currentUnitIndex == listSize - 1)
			nextUnit = null;
		else {
			nextUnit = unitsArray[currentUnitIndex + 1];
			nextUnit.GetComponent(StatChangeUnitInfo).unitIsCurrent = 0;
		}
	}
	
	function ShiftLeft() {
		if (moveCurrentUnitLeft) {
			var xLeft = Mathf.SmoothDamp(currentUnit.transform.position.x, leftPositionReference.x, xVel, switchSpeed * Time.deltaTime);
			var yLeft = Mathf.SmoothDamp(currentUnit.transform.position.y, leftPositionReference.y, yVel, switchSpeed * Time.deltaTime);
			var zLeft = Mathf.SmoothDamp(currentUnit.transform.position.z, leftPositionReference.z, zVel, switchSpeed * Time.deltaTime);
			currentUnit.transform.position = Vector3(xLeft, yLeft, zLeft);
			moveNextUnitCenter = false;
			
			if(currentUnit.transform.position == leftPositionReference) {
				moveCurrentUnitLeft = false;
				if(currentUnitIndex < listSize - 1)
					currentUnitIndex++;
				moveNextUnitCenter = true;
			}
		}

		if (moveNextUnitCenter) {
			var xRight = Mathf.SmoothDamp(currentUnit.transform.position.x, centerPositionReference.x, xVel, switchSpeed * Time.deltaTime);
			var yRight = Mathf.SmoothDamp(currentUnit.transform.position.y, centerPositionReference.y, yVel, switchSpeed * Time.deltaTime);
			var zRight = Mathf.SmoothDamp(currentUnit.transform.position.z, centerPositionReference.z, zVel, switchSpeed * Time.deltaTime);
			currentUnit.transform.position = Vector3(xRight, yRight, zRight);

			if (currentUnit.transform.position == centerPositionReference) {
				moveCurrentUnitLeft = false;
				moveNextUnitCenter = false;
				finishedMovement = true;
			}
		}
	}

	function ShiftRight() {
		if (moveCurrentUnitRight) {
			var xRight = Mathf.SmoothDamp(currentUnit.transform.position.x, rightPositionReference.x, xVel, switchSpeed * Time.deltaTime);
			var yRight = Mathf.SmoothDamp(currentUnit.transform.position.y, rightPositionReference.y, yVel, switchSpeed * Time.deltaTime);
			var zRight = Mathf.SmoothDamp(currentUnit.transform.position.z, rightPositionReference.z, zVel, switchSpeed * Time.deltaTime);
			currentUnit.transform.position = Vector3(xRight, yRight, zRight);
			movePrevUnitCenter = false;
			
			if(currentUnit.transform.position == rightPositionReference) {
				moveCurrentUnitRight = false;
				if(currentUnitIndex > 0)
					currentUnitIndex--;
				movePrevUnitCenter = true;
			}
		}

		if (movePrevUnitCenter) {
			var xLeft = Mathf.SmoothDamp(currentUnit.transform.position.x, centerPositionReference.x, xVel, switchSpeed * Time.deltaTime);
			var yLeft = Mathf.SmoothDamp(currentUnit.transform.position.y, centerPositionReference.y, yVel, switchSpeed * Time.deltaTime);
			var zLeft = Mathf.SmoothDamp(currentUnit.transform.position.z, centerPositionReference.z, zVel, switchSpeed * Time.deltaTime);
			currentUnit.transform.position = Vector3(xLeft, yLeft, zLeft);

			if (currentUnit.transform.position == centerPositionReference) {
				moveCurrentUnitRight = false;
				movePrevUnitCenter = false;
				finishedMovement = true;
			}
		}
	}
}
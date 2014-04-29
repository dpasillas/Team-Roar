#pragma strict

public var speed : float = 20.0;
private var targetObject : GameObject;
private var targetPos : Vector3;

public var rotateSpeed : float = 150.0;
private var isRotating : boolean;

function Start () {
	isRotating = false;
}

function Update () {
	if (targetObject != null)
		transform.position = Vector3.MoveTowards(transform.position, targetPos, Time.deltaTime * speed);
}

function RotateObject (thisTransform : Transform, degrees : Vector3, seconds : float) {
	if (isRotating) return;
	isRotating = true;

	var currRotation = thisTransform.rotation;
	var targetRotation = thisTransform.rotation * Quaternion.Euler(degrees);
	//var targetRotation = Quaternion.AngleAxis(90, Vector3.up);
	Debug.Log(targetRotation);
	var t = 0.0;
	var rate = 1.0/seconds;
	while (t < 1.0) {
		t += Time.deltaTime * rate;
		thisTransform.rotation = Quaternion.Slerp(currRotation, targetRotation, t);
		yield;
	}

	isRotating = false;
}

function RotateRight () {
	RotateObject(transform, Vector3(0, 90, 0), 0.5);
}

function RotateLeft () {
	RotateObject(transform, Vector3(0, -90, 0), 0.5);
}

function SetTarget (gObject : GameObject)
{
	targetObject = gObject;
	targetPos = targetObject.transform.position;
}
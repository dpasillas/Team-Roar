#pragma strict

public var speed : float = 5.0;

function Start () {

}

function Update () {
	transform.Rotate(Vector3.up, speed * Time.deltaTime);
}
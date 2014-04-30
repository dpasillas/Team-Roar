#pragma strict

public var speed : float = 5.0;

function Start () {
	speed += Random.Range(0.0, 100.0);
}

function Update () {
	transform.Rotate(Vector3.up, speed * Time.deltaTime);
}
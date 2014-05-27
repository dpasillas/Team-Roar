﻿#pragma strict

public class UnitInfo extends MonoBehaviour
{
	var unitName : String;
	var className : String;
	var currentHealth : int;
	var maxHealth : int;
	var maxHealthBarWidth : int;
	var speed : int;
	private var damage : Damage;
	
	function Start() {
		damage = GetComponent(Damage);
	}
	
	function Update() 
	{
		currentHealth = damage.Health();
	}
	
	function Refresh()
	{
		currentHealth = damage.Health();
	}
}

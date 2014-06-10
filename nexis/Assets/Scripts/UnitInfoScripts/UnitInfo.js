#pragma strict

public class UnitInfo extends MonoBehaviour
{
	var unitName : String;
	var unitClass : int;
	var currentHealth : int;
	var maxHealth : int;
	var maxHealthBarWidth : int;
	var atk : int;
	var def : int;
	var dex : int;
	var speed : int;
	var scui : StatChangeUnitInfo;
	
	private var damage : Damage;
	
	function Start() {
		damage = GetComponent(Damage);
	}
	
	function Update() 
	{
		currentHealth = damage.Health();
	}
	
	function loadUnitStats(index : int)
	{
		var scui : StatChangeUnitInfo = new StatChangeUnitInfo();
		PropertyList.deserializePropertyList(scui, index);
		
		unitName = scui.unitName;
		unitClass = scui.unitClass;
		currentHealth = scui.hp;
		maxHealth = scui.maxHP;
		maxHealthBarWidth = scui.hpBarWidth;
		atk = scui.atk;
		def = scui.def;
		dex = scui.dex;
		speed = scui.dex;
	}
}

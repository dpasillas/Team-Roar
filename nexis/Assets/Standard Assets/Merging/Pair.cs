using UnityEngine;
using System.Collections;

public class Pair<K,V> {

	public K first;
	public V second;

	public Pair()
	{}

	public Pair(V v)
	{
		second = v;
	}

	public Pair(K k, V v)
	{
		first = k;
		second = v;
	}

}

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Linq;

public class Hexagon : MonoBehaviour {

	private Material currentBaseMat;
	public Material baseMat;
	public Material hoverMat;
	public Material moveMat;
	public Material selectMat;
	public Material obstacleMat;
	public GameObject wallPrefab;
	public GameObject tilePrefab;

	public static Hexagon currentTile = null;
	public static Hexagon selectTile = null;
	public static Hexagon hoverTile = null;
	public static Hexagon mouseDownTile = null;

	private int column = -1;
	private int row = -1;
	public List<Hexagon> neighbors;
	private Hexagon previous = null;
	public static Hexagon current = null;
	private int g = 0;
	private int f = 0;
	private static Shader[] shaders = {Shader.Find("Diffuse"), Shader.Find("Particles/Alpha Blended"), Shader.Find("Particles/Alpha Blended")};
	private static Color[] colors = {Color.white, new Color (0f, 0.5f, 0.5f, 0.5f), new Color(0.5f,0f,0f,0.5f)};
	private static string[] colorss = {"_Color", "_TintColor", "_TintColor"};
	private static int hid = 0;
	private int id = hid++;

	public bool enabled = true;


	//occupant is an obstacle, should be set and unset appropriately
	//			used for pathfinding********************************
	//public GameObject occupant = null;
	public enum OccupantType{WALL, TEAM_A, TEAM_B, TEAM_C, TEAM_D, GENERIC_OBSTACLE};
	public Pair<OccupantType, GameObject> occupant = null;
	void Awake() {

		Vector3[] newVertices = new Vector3[8];
		Vector3[] newNormals = new Vector3[8];
		Vector2[] newUV = new Vector2[8];
		int[] newTriangles = new int[36];


		newVertices [0] = new Vector3 (0f, 0f, 0f);
		for (int i = 1; i < 7; ++i)
			newVertices [i] = new Vector3 (Mathf.Cos (2 * Mathf.PI * (i - 1) / 6),
			                               0,
			                               Mathf.Sin (2 * Mathf.PI * (i - 1) / 6));
		newVertices [7] = new Vector3 (0f, 0f, 0f);
		newNormals [0] = new Vector3 (0f, 1f, 0f);
		for (int i = 1; i < 7; ++i) {
			newNormals[i] = (newVertices[i] + new Vector3(0,1,0));
		}
		newNormals [7] = new Vector3 (0, -1, 0);
		//for (int i = 0; i < 7; ++i)
		//	newUV [i] = new Vector2 (newVertices [i].x, newVertices [i].z);
		newUV [0] = new Vector2 (0.5f, 0.5f);
		newUV [1] = new Vector2 (1, 0.5f);
		newUV [2] = new Vector2 (1, 0);
		newUV [3] = new Vector2 (0, 0);
		newUV [4] = new Vector2 (0, 0.5f);
		newUV [5] = new Vector2 (0, 1);
		newUV [6] = new Vector2 (1, 1);
		newUV [7] = new Vector2 (0.5f, 0.5f);

		for (int i = 0; i < 6; ++i) {
			newTriangles[3*i] = 0;
			newTriangles[3*i+1] = (i + 2) % 7 + (i + 2) / 7;
			newTriangles[3*i+2] = i + 1;
		}

		//int[] newTriangles2 = new int[18];
		for (int i = 0; i < 6; ++i) {
			newTriangles[18+3*i] = 7;
			newTriangles[18+3*i+2] = (i + 2) % 7 + (i + 2) / 7;
			newTriangles[18+3*i+1] = i + 1;
		}

		gameObject.AddComponent("MeshFilter");
		gameObject.AddComponent("MeshRenderer");
		Mesh mesh = GetComponent<MeshFilter>().mesh;
		mesh.Clear ();
		mesh.vertices = newVertices;
		mesh.normals = newNormals;
		mesh.uv = newUV;
		mesh.triangles = newTriangles;

		gameObject.AddComponent ("MeshCollider");
		MeshCollider collider = GetComponent<MeshCollider> ();
		collider.sharedMesh = mesh;

		MeshRenderer mr = GetComponent<MeshRenderer> ();
		mr.material = baseMat;
		currentBaseMat = baseMat;
	}

	void Start()
	{
		
	}

	public void setTilePos(int i, int j)
	{
		column = i;
		row = j;
	}

	public int getRow()
	{
		return row;
	}

	public int getColumn()
	{
		return column;
	}

	public int distanceTo(int i, int j)
	{
		int di = Math.Abs(column - i);
		int dj = Math.Abs((row - column % 2) - (j - i % 2));

		//Debug.Log ("Distance:"+" ("+column+","+row+")"+"-("+i+","+j+"): "+(di + dj - Math.Min (di/2,dj)));

		return di + dj - Math.Min(di / 2, dj);
	}

	public int distanceTo(Hexagon other)
	{
		return distanceTo(other.column, other.row);
	}

	public void addNeighbor(Hexagon other)
	{
		neighbors.Add (other);
		other.neighbors.Add (this);
	}

	public List<Hexagon> getPathFrom(Hexagon goal)
	{
		return goal.getPathTo (this);
	}


	public List<Hexagon> getPathTo(Hexagon goal)
	{
		//cannot find a path to an occupied tile!
		if (this == goal || goal == null || goal.occupant != null)
			return new List<Hexagon> ();

		// openSet and closedSet should be some kind of priority queue
		var openSet = new SortedDictionary<Hexagon, Hexagon> (new HexComparer ());
		var closedSet = new SortedDictionary<Hexagon, Hexagon> (new HexIndexComparer());

		this.previous = null;
		this.g = 0;
		this.f = g + distanceTo (goal);
		
		openSet.Add (this, this);

		Hexagon current = null;

		while (openSet.Count > 0) {
			current = openSet.Keys.First();
			if(current == goal)
				return current.reconstructPath();

			openSet.Remove(current);
			closedSet.Add(current,current);

			for(int i = 0; i < current.neighbors.Count; ++i) {
				Hexagon neighbor = current.neighbors[i];
				if(neighbor.occupant != null || closedSet.ContainsKey(neighbor))
					continue;

				int tentative_g = current.g + 1;

				if( !openSet.ContainsKey(neighbor) || tentative_g < neighbor.g ) {
					openSet.Remove(neighbor);
					neighbor.previous = current;
					neighbor.g = tentative_g;
					neighbor.f = tentative_g + neighbor.distanceTo(goal);
					//if(!openSet.ContainsKey(neighbor))
					openSet.Add(neighbor, neighbor);
				}
			}
		}

		return new List<Hexagon> ();
	}

	public List<Hexagon> getPathFromCurrent()
	{
		return getPathFrom (current);
	}

	public List<Hexagon> reconstructPath()
	{
		List<Hexagon> list = null;
		if (previous == null)
			list = new List<Hexagon>();
		else
			list = previous.reconstructPath ();
		list.Add(this);
		return list;
	}

	public delegate bool action(Pair<Hexagon.OccupantType,GameObject> o, int d);
	public void breadthFirstDo(int depth, action a)
	{
		bool[] visited = new bool[hid+1];
		for(int i = 0; i < hid; ++i)
			visited[i] = false;
		
		Queue<KeyValuePair<Hexagon,int> > queue = new Queue< KeyValuePair<Hexagon,int> >();
		queue.Enqueue (new KeyValuePair<Hexagon, int>(this,0));
		
		while(queue.Count > 0) {
			KeyValuePair<Hexagon,int> pair = queue.Dequeue();
			Hexagon h = pair.Key;
			int d = pair.Value;
			
			if(visited[h.id])
				continue;
			
			visited[h.id] = true;

			bool cont = a(h.occupant,d);

			if(d < depth && cont) {
				for(int i = 0; i < h.neighbors.Count; ++i) {
					if(!visited[h.neighbors[i].id])
						queue.Enqueue(new KeyValuePair<Hexagon,int>(h.neighbors[i],d+1));
				}
			}
		}
	}

	public List<Hexagon> HexagonsInRange (int depth)
	{
		List<Hexagon> ret = new List<Hexagon>();

		bool[] visited = new bool[hid+1];
		for(int i = 0; i < hid; ++i)
			visited[i] = false;
		
		Queue<KeyValuePair<Hexagon,int> > queue = new Queue< KeyValuePair<Hexagon,int> >();
		queue.Enqueue (new KeyValuePair<Hexagon, int>(this,0));
		
		while(queue.Count > 0) {
			KeyValuePair<Hexagon,int> pair = queue.Dequeue();
			Hexagon h = pair.Key;
			int d = pair.Value;
			
			if(visited[h.id])
				continue;
			
			visited[h.id] = true;

			if (h != this && h.occupant == null)
				ret.Add (h);
			
			if(d < depth) {
				for(int i = 0; i < h.neighbors.Count; ++i) {
					if(!visited[h.neighbors[i].id])
						queue.Enqueue(new KeyValuePair<Hexagon,int>(h.neighbors[i],d+1));
				}
			}
		}

		return ret;
	}

	void breadthFirstHighlight(int depth, int mode, Texture tex)
	{
		bool[] visited = new bool[hid+1];
		for(int i = 0; i < hid; ++i)
			visited[i] = false;

		Queue<KeyValuePair<Hexagon,int> > queue = new Queue< KeyValuePair<Hexagon,int> >();
		queue.Enqueue (new KeyValuePair<Hexagon, int>(this,0));

		while(queue.Count > 0) {
			KeyValuePair<Hexagon,int> pair = queue.Dequeue();
			Hexagon h = pair.Key;
			int d = pair.Value;

			if(visited[h.id])
				continue;

			visited[h.id] = true;

			if(h != this) {
				Material mat = h.GetComponent<MeshRenderer> ().material;
				mat.SetTexture ("_MainTex", tex);
				mat.shader = shaders[mode];
				//mat.color = colors[mode];
				mat.SetColor(colorss[mode],colors[mode]);
			}

			if(d < depth) {
				for(int i = 0; i < h.neighbors.Count; ++i) {
					if(!visited[h.neighbors[i].id] && h.neighbors[i].occupant == null)
						queue.Enqueue(new KeyValuePair<Hexagon,int>(h.neighbors[i],d+1));
				}
			}
		}
	}

	void highlightMovement(int depth, int mode)
	{
		Texture tex = Resources.Load ("NexisTileHL") as Texture;
		breadthFirstHighlight (depth, mode, tex);
	}

	void unhighlightMovement (int depth)
	{
		Texture tex = Resources.Load ("NexisTile") as Texture;
		breadthFirstHighlight (depth, 0, tex);
	}

	
	public void HighlightSelect(bool changeCurrent)
	{
		renderer.material = selectMat;
		if (changeCurrent) currentBaseMat = selectMat;
	}

	public void HighlightMove(bool changeCurrent)
	{
		renderer.material = moveMat;
		if (changeCurrent) currentBaseMat = moveMat;
	}

	public void ToBaseMat()
	{
		renderer.material = currentBaseMat;
	}

	public void Unhighlight()
	{
		currentBaseMat = baseMat;
		renderer.material = currentBaseMat;
	}

	void OnMouseEnter()
	{	
		if (!enabled) return;
		renderer.material = hoverMat;
		hoverTile = this;
	}

	void OnMouseExit()
	{
		if (!enabled) return;
		renderer.material = currentBaseMat;
		hoverTile = null;
	}

	void OnMouseDown()
	{
		if (!enabled) return;
		ToggleMouseDown();
	}

	public void ToggleMouseDown()
	{
		if (occupant == null) {
			mouseDownTile = null;
			return;
		}
		
		if (mouseDownTile)
			mouseDownTile.Unhighlight();
		
		mouseDownTile = this;
		mouseDownTile.HighlightSelect(true);
	}

	public void HighlightRange(int depth, bool highlightOn)
	{
		bool[] visited = new bool[hid+1];
		for(int i = 0; i < hid; ++i)
			visited[i] = false;
		
		Queue<KeyValuePair<Hexagon,int> > queue = new Queue< KeyValuePair<Hexagon,int> >();
		queue.Enqueue (new KeyValuePair<Hexagon, int>(this,0));
		
		while(queue.Count > 0) {
			KeyValuePair<Hexagon,int> pair = queue.Dequeue();
			Hexagon h = pair.Key;
			int d = pair.Value;
			
			if(visited[h.id])
				continue;
			
			visited[h.id] = true;
			
			if(h != this) {
				if (highlightOn)
					h.HighlightMove(true);
				else
					h.Unhighlight();
			}
			
			if(d < depth) {
				for(int i = 0; i < h.neighbors.Count; ++i) {
					if(!visited[h.neighbors[i].id] && h.neighbors[i].occupant == null)
						queue.Enqueue(new KeyValuePair<Hexagon,int>(h.neighbors[i],d+1));
				}
			}
		}
	}

	/*
	int tmp = 0;
	void doIt()
	{
		unhighlightMovement (tmp);
	}
	*/

	/*
	void OnMouseDown()
	{
		if (this == current || current == null || this.occupant != null)
			return;
		List<Hexagon> list = current.getPathTo (this);
		
		this.occupant = current.occupant;
		current.occupant = null;
		current = this;

		StartCoroutine (MoveAlongPath (this.occupant.second, list));
		int depth = 1;
		highlightMovement (depth, 2);
		tmp = depth;
		Invoke ("doIt", 3f);
	}
	*/

	IEnumerator MoveAlongPath(GameObject obj, List<Hexagon> list)
	{
		float t = 0;
		float tw = 0;
		if (obj != null) {
			for(int i = 0; i < list.Count - 1; ++i) {
				Quaternion u = obj.transform.rotation;
				Vector3 a = list[i].transform.position;
				Vector3 b = list[i+1].transform.position;
				a.y = obj.transform.position.y;
				b.y = a.y;

				obj.transform.LookAt(obj.transform.position + b - a);
				Quaternion v = obj.transform.rotation;

				float angle = Quaternion.Angle(u,v);

				while(tw <= 1) {
					tw += Time.deltaTime * 360f / angle;
					if(tw < 1) {
						obj.transform.rotation = Quaternion.Lerp(u,v,tw);
						yield return null;
					} else {
						obj.transform.rotation = v;
					}
				}

				tw = 0;

				while(t < 1) {
					t += Time.deltaTime * 3;
					if(t <= 1) {
						obj.transform.position = a * (1 - t) + b * t;
						yield return null;
					} else {
						obj.transform.position = b;
					}
				}
				list[i+1].occupant = current.occupant;
				current.occupant = null;
				current = list[i+1];
				t = 0;
			}
		}
	}

	public void setOccupant(GameObject obj, OccupantType type = OccupantType.WALL)
	{
		if (obj == null) {
			occupant = null;
			return;
		}

		occupant = new Pair<OccupantType, GameObject> (type, obj);
		Damage d = obj.GetComponent<Damage> ();
		if (d != null)
			d.tile = this;
	}

	public void setAndPositionOccupant(GameObject obj, OccupantType type = OccupantType.WALL)
	{
		setOccupant (obj, type);
		obj.transform.position = this.transform.position;
		obj.transform.rotation = this.transform.rotation;
	}

	public void setWall()
	{
		GameObject wall = Instantiate(wallPrefab) as GameObject;
		setAndPositionOccupant(wall, OccupantType.WALL);
		Vector3 scale = wall.transform.localScale;
		scale.y = Mathf.FloorToInt(UnityEngine.Random.Range (1.0f, 3.0f));
		wall.transform.localScale = scale;
		//GameObject wall = new GameObject();
		//wall.renderer.material = selectMat;

		MeshRenderer[] renderers = wall.GetComponentsInChildren<MeshRenderer>();
		for (int i = 0; i < renderers.Count(); ++i)
			renderers[i].material = selectMat;

		for (int i = 0; i < scale.y * 3; ++i) {


			GameObject tile = Instantiate (tilePrefab) as GameObject;
			tile.GetComponent<Hexagon>().enabled = false;

			//Destroy (tile.GetComponent<MeshCollider>());
			tile.renderer.material = obstacleMat;
			tile.transform.position = this.transform.position;
			tile.transform.rotation = this.transform.rotation;

			Vector3 pos = tile.transform.position;
			pos.y = i * 0.50f + 0.01f;
			tile.transform.position = pos;
			tile.transform.parent = wall.transform;

		}

		wall.transform.parent = gameObject.transform;
	}

	private class HexComparer : IComparer<Hexagon>
	{
		public int Compare(Hexagon a, Hexagon b)
		{
			if (a.f == b.f)
				if(a.column == b.column)
					return a.row - b.row;
				else
					return a.column - b.column;
			return a.f - b.f;
		}
	}

	private class HexIndexComparer : IComparer<Hexagon>
	{
		public int Compare(Hexagon a, Hexagon b)
		{
			if(a.column == b.column)
				return a.row - b.row;
			else
				return a.column - b.column;
		}
	}
}
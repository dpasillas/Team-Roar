using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Linq;

public class HexagonColumn : MonoBehaviour {
	
	public Material mat;
	public Texture tex;
	
	private static Shader[] shaders = null;
	private static Color[] colors = {Color.white, new Color (0f, 0.5f, 0.5f, 0.5f), new Color(0.5f,0f,0f,0.5f)};
	private static string[] colorss = {"_Color", "_TintColor", "_TintColor"};

	public float height = 2;
	
	
	//occupant is an obstacle, should be set and unset appropriately
	//			used for pathfinding********************************
	public GameObject occupant = null;
	void Awake() {
		if(shaders == null) {
			shaders = new Shader[3];
			shaders[0] = Shader.Find("Diffuse");
			shaders[1] = Shader.Find("Particles/Alpha Blended");
			shaders[2] = Shader.Find("Particles/Alpha Blended");
		}

		
		Vector3[] newVertices = new Vector3[14];
		Vector3[] newNormals = new Vector3[14];
		Vector2[] newUV = new Vector2[14];
		int[] newTriangles = new int[24*3];
		
		
		newVertices [0] = new Vector3 (0f, height, 0f);
		for (int i = 1; i < 7; ++i)
			newVertices [i] = new Vector3 (Mathf.Cos (2 * Mathf.PI * (i - 1) / 6),
			                               height,
			                               Mathf.Sin (2 * Mathf.PI * (i - 1) / 6));
		for(int i = 7; i < 13; ++i)
			newVertices [i] = new Vector3 (Mathf.Cos (2 * Mathf.PI * (i - 1) / 6),
			                               0,
			                               Mathf.Sin (2 * Mathf.PI * (i - 1) / 6));

		newVertices [13] = new Vector3 (0f, 0f, 0f);
		newNormals [0] = new Vector3 (0f, 1f, 0f);
		for (int i = 1; i < 7; ++i) {
			newNormals[i] = (newVertices[i+6] + new Vector3(0,1,0));
			newNormals[i+6] = (newVertices[i+6] + new Vector3(0,-1,0));
		}
		newNormals [13] = new Vector3 (0, -1, 0);
		//for (int i = 0; i < 7; ++i)
		//	newUV [i] = new Vector2 (newVertices [i].x, newVertices [i].z);
		newUV [0] = new Vector2 (0.5f * 0.5f, 0.5f);
		newUV [1] = new Vector2 (1 * 0.5f, 0.5f);
		newUV [2] = new Vector2 (1 * 0.5f, 0);
		newUV [3] = new Vector2 (0 * 0.5f, 0);
		newUV [4] = new Vector2 (0 * 0.5f, 0.5f);
		newUV [5] = new Vector2 (0 * 0.5f, 1);
		newUV [6] = new Vector2 (1 * 0.5f, 1);

		newUV [13] = new Vector2 (0.5f * 0.5f + 0.5f, 0.5f);
		newUV [7] = new Vector2 (1 * 0.5f + 0.5f, 0.5f);
		newUV [8] = new Vector2 (1 * 0.5f + 0.5f, 0);
		newUV [9] = new Vector2 (0 * 0.5f + 0.5f, 0);
		newUV [10] = new Vector2 (0 * 0.5f + 0.5f, 0.5f);
		newUV [11] = new Vector2 (0 * 0.5f + 0.5f, 1);
		newUV [12] = new Vector2 (1 * 0.5f + 0.5f, 1);
		
		for (int i = 0; i < 6; ++i) {
			newTriangles[3*i] = 0;
			newTriangles[3*i+1] = (i + 2) % 7 + (i + 2) / 7;
			newTriangles[3*i+2] = i + 1;
		}

		for (int i = 1; i < 7; ++i) {
			newTriangles[15 + 3*i] = i;
			newTriangles[15 + 3*i + 1] = (i+1) % 7 + (i+1) / 7;
			newTriangles[15 + 3*i + 2] = i+6;
		}

		for (int i = 1; i < 7; ++i) {
			newTriangles[33 + 3*i] = i+6;
			newTriangles[33 + 3*i + 1] = (i+1) % 7 + (i+1) / 7;
			newTriangles[33 + 3*i + 2] = (i+1) % 7 + (i+1) / 7 + 6;
		}

		for (int i = 0; i < 6; ++i) {
			newTriangles[54 + 3*i] = i+7;
			newTriangles[54 + 3*i+1] = (i + 2) % 7 + (i + 2) / 7 + 6;
			newTriangles[54 + 3*i+2] = 13;
		}
		
		//int[] newTriangles2 = new int[18];
		/*for (int i = 0; i < 6; ++i) {
			newTriangles[18+3*i] = 7;
			newTriangles[18+3*i+2] = (i + 2) % 7 + (i + 2) / 7;
			newTriangles[18+3*i+1] = i + 1;
		}*/
		
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
		mr.material = mat;
		mr.material.SetTexture ("_MainTex", tex);
	}
	
	void Start()
	{
		
	}
}
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class HexagonGrid : MonoBehaviour {

	// Use this for initialization
	public GameObject hexagon;
	public int columns = 5;
	public int minRows = 4;
	private Hexagon[][] hexagons;
	public GameObject obstacle;
	void Start () {
		hexagons = new Hexagon[columns][];
		for(int i = 0; i < columns; ++i) 
			hexagons[i] = new Hexagon[minRows+ i%2];

		for (int i = 0; i < columns; ++i){
			for (int j = 0; j < minRows + (i%2); ++j) {
				GameObject obj = (GameObject)Instantiate (hexagon,transform.position,transform.rotation);
				obj.transform.parent = transform;
				obj.transform.Translate(
					new Vector3(i * 3.0f/2 - (columns - 1.0f) * 3.0f/4,
				                0,
				                j * 2 * Mathf.Sin(Mathf.PI / 3) - (i%2) * Mathf.Sin(Mathf.PI / 3)
				            		- (minRows - 1) * Mathf.Sin (Mathf.PI / 3)));
				hexagons[i][j] = obj.GetComponent<Hexagon>();
				if(hexagons[i][j] == null)
					Debug.Log("Hexagon error!");
				hexagons[i][j].setTilePos(i,j);

				//double roll = Random.Range(0.0f, 100.0f);
				//if (roll < 10.0)
				//	hexagons[i][j].setWall();
			}
		}

		//connect even columns with odd columns to the right
		//don't go the the last column because we're checking right
		for (int i = 0; i < columns-1; i += 2) {
			for(int j = 0; j < minRows; ++j){
				hexagons[i][j].addNeighbor (hexagons[i+1][j]);

				hexagons[i][j].addNeighbor (hexagons[i+1][j+1]);
			}
		}
		//2 of 6 connections handled

		//connect odd columns with even columns to the right
		//don't go the the last column because we're checking right
		for (int i = 1; i < columns-1; i += 2) {
			//first row can't connect right-up, do only right-down
			hexagons[i][0].addNeighbor (hexagons[i+1][0]);

			for(int j = 1; j < minRows; ++j){
				hexagons[i][j].addNeighbor (hexagons[i+1][j]);
				
				hexagons[i][j].addNeighbor (hexagons[i+1][j-1]);
			}

			//last row can't connect right-down, do only right-up
			hexagons[i][minRows].addNeighbor (hexagons[i+1][minRows-1]);
		}
		//4 of 6 connections handled

		//connect rows going up and down
		for (int i = 0; i < columns; ++i) {
			for (int j = 0; j < minRows + i%2 -1; ++j) {
				hexagons[i][j].addNeighbor (hexagons[i][j+1]);
			}
		}
		//6 of 6 connections handled

		Hexagon.current = hexagons [0] [0];

		if (obstacle != null) {
			for(int i = 0; i < columns-1; ++i){
				Hexagon hex = hexagons[i][1];
				hex.setOccupant(Instantiate(obstacle,
				                           hex.transform.position,
				                           hex.transform.rotation) as GameObject);
				hex.occupant.second.transform.parent = this.transform;
			}
		}

		/*
		hexagons[0][0].setAndPositionOccupant(GameObject.Find ("Cube"),Hexagon.OccupantType.TEAM_A);

		int midx = columns / 2;
		int leftx = midx - 1;
		int rightx = midx + 1;

		int midz = minRows / 2;
		int topz = midz - 1;
		int botz = midz + 1;

		int a = 0;//leftx % 2;
		int b = -(midx % 2);


		hexagons[leftx][midz - a].setAndPositionOccupant( GameObject.Find ("Sphere0"), Hexagon.OccupantType.TEAM_B);
		hexagons[leftx][botz - a].setAndPositionOccupant( GameObject.Find ("Sphere1"), Hexagon.OccupantType.TEAM_B);
		hexagons[midx][topz - b].setAndPositionOccupant( GameObject.Find ("Sphere2"), Hexagon.OccupantType.TEAM_B);
		hexagons[midx][midz - b].setAndPositionOccupant( GameObject.Find ("Sphere3"), Hexagon.OccupantType.TEAM_B);
		hexagons[midx][botz - b].setAndPositionOccupant( GameObject.Find ("Sphere4"), Hexagon.OccupantType.TEAM_B);
		hexagons[rightx][midz - a].setAndPositionOccupant( GameObject.Find ("Sphere5"), Hexagon.OccupantType.TEAM_B);
		hexagons[rightx][botz - a].setAndPositionOccupant( GameObject.Find ("Sphere6"), Hexagon.OccupantType.TEAM_B);
		*/
	}

	public Hexagon Tile (int col, int row)
	{
		if(col < 0 || col >= hexagons.Length)
			return null;
		if(row < 0 || row >= hexagons[col].Length)
			return null;
		return hexagons[col][row];
	}
}

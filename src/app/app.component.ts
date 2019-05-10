import { Component } from '@angular/core';
import * as _ from 'underscore';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass']
})
export class AppComponent {

	title = 'knights-tour';
	size:number = null;

	startTime:any;
	endTime:any;
	solutionFound:boolean = false;

	chessBoard:any = [];
	xMove = null;
	yMove = null;

	running:boolean = true;

	boardSize = 0;

	type = "DFS";

	resetBoard(size){
		this.solutionFound = false;
		this.chessBoard = [];
		for(var i = 0; i < size ; i++){
			this.chessBoard[i] = [];
			for(var j = 0; j<size; j++){
				this.chessBoard[i][j] = -1;
			}
		}
	}

	createBoard(size){
		size = parseInt(size);
		this.boardSize = size*size;
		this.resetBoard(size);
	}

	public dFSIsSafe(x, y, sol){
		if(x>=0 && x<this.size && y>=0 && y<this.size && sol[x][y] == -1)
			return 1;
		else
			return -1;
	}

	public solveDFSMove(x, y, count, sol, xMove,yMove){
		if (count == this.size*this.size)
			return 1;
		let x1,y1;
		for(var i = 0; i < 8; i++) //8 for 8 moves of a knight
		{
			x1 = x + xMove[i];
			y1 = y + yMove[i];

			if(this.dFSIsSafe(x1, y1, sol)==1)
			{
				sol[x1][y1] = count;
				if(this.solveDFSMove(x1, y1, count+1, sol, xMove, yMove) == 1)
					return 1;

				sol[x1][y1] = -1;
									
			}
			
		}
		return -1;
	}

	solveDFSTour(start_x, start_y){
		if(this.solveDFSMove(start_x, start_y, 1, this.chessBoard, this.xMove, this.yMove) == 1)
		{
			this.endTime = window.performance.now();
			
			//console.log(this.endTime);
			this.solutionFound = true;
			
		}
		else
			alert("Solution doesn't exist");
	}

	checkMovesBrute(tour, visited){
		var possMoves = [];
		var currentPosition = {
			x: tour[tour.length-1].x,
			y: tour[tour.length-1].y
		};

		var board_dimension = this.size;

		var x = currentPosition.x;
		var y = currentPosition.y;

		/*ArrayList<Position> possMoves = new ArrayList<>();
		Position current_position = tour.get(tour.size()-1);
		int x = current_position.getXcoord();
		int y = current_position.getYcoord();

		if(x >= 0 && y >= 0)*/
		if(x-2 >= 0 && y+1 < board_dimension){
			if(visited[x-2][y+1] != 1) {
				possMoves.push({x: x-2, y: y+1});
			}
		}
		if(x-2 >= 0 && y-1 >= 0){
			if(visited[x-2][y-1] != 1){
				possMoves.push({x: x-2, y: y-1});
			}
		}
		if(x-1 >= 0 && y+2 < board_dimension){
			if(visited[x-1][y+2] != 1){
			possMoves.push({x: x-1, y: y+2});
			}
		}
		if(x-1 >= 0 && y-2 >= 0){
			if(visited[x-1][y-2] != 1){
			possMoves.push({x: x-1, y: y-2});
			}
		}
		if(x+1 < board_dimension && y-2 >= 0){
			if(visited[x+1][y-2] != 1){
			possMoves.push({x: x+1, y: y-2});
			}
		}
		if(x+1 < board_dimension && y+2 < board_dimension){
			if(visited[x+1][y+2] != 1){
			possMoves.push({x: x+1, y: y+2});
			}
		}
		if(x+2 < board_dimension && y-1 >= 0){ 
			if(visited[x+2][y-1] != 1){
			possMoves.push({x: x+2, y: y-1});
			}
		}
		if(x+2 < board_dimension && y+1 < board_dimension){
			if(visited[x+2][y+1] != 1){
			possMoves.push({x: x+2, y: y+1});
			}
		}
		return possMoves;
	}

	public bruteForceBacktrack(current, visited){
		
		if(current.length >= this.boardSize){
			//console.log("SOLVED");
			this.running = false;
		}
		else{
			var moves = this.checkMovesBrute(current, visited);

			for(var index in moves){
				current.push(moves[index]);
				visited[moves[index].x][moves[index].y] = 1;
				this.bruteForceBacktrack(current, visited);

				if(!this.running){
					return;
				}
				else
				{
					current.pop(index);
					visited[moves[index].x][moves[index].y] = 0;
				}
			}
		}
	}

	currentTour = [];
	visited = [];
	bruteForceTour(x, y){
		this.currentTour = [];
		var initial_position = {x: x, y: y};

		this.currentTour.push(initial_position);
		this.visited = [];
		this.running = true;

		for(var i = 0; i < this.size; i++)
		{
			this.visited[i] = [];
			for(var j = 0; j < this.size; j++)
			{
				this.visited[i][j]=0;
			}
		}

		this.visited[initial_position.x][initial_position.y] = 1;
		this.bruteForceBacktrack(this.currentTour, this.visited);
		//console.log(this.currentTour);
		for(var i = 0; i < this.size; i++)
		{
			this.chessBoard[i] = [];
			for(var j = 0; j < this.size; j++)
			{
				this.chessBoard[i][j]=0;
			}
		}
		
		var self = this;

		_.each(self.currentTour, function(value, key){
			self.chessBoard[value.x][value.y] = key;
		});
		//console.log('solved', this.chessBoard);
		this.endTime = window.performance.now();
		
		//console.log(this.endTime);
		this.solutionFound = true;

	}

	calcWeight(position, visited){
        var weight = 0;
        var x = position.x;
        var y = position.y;    

        if(x-2 >= 0 && y+1 < this.size && visited[x-2][y+1] != 1) {
            weight++;
        }
        if(x-2 >= 0 && y-1 >= 0 && visited[x-2][y-1] != 1){
            weight++;
        }
        if(x-1 >= 0 && y+2 < this.size && visited[x-1][y+2] != 1){
            weight++;
        }
        if(x-1 >= 0 && y-2 >= 0 && visited[x-1][y-2] != 1){
            weight++;
        }
        if(x+1 < this.size && y-2 >= 0 && visited[x+1][y-2] != 1){
            weight++;
        }
        if(x+1 < this.size && y+2 < this.size && visited[x+1][y+2] != 1){
            weight++;
        }
        if(x+2 < this.size && y-1 >= 0 && visited[x+2][y-1] != 1){
            weight++;
        }
        if(x+2 < this.size && y+1 < this.size && visited[x+2][y+1] != 1){
            weight++;
        }
        return weight;
    }

	nextMoveWarnsdorff(tour, visited){
		var nextMove = {};
		var possibleMoves = [];

		var current_position = tour[tour.length-1];

		var x = current_position.x;
		var y = current_position.y;

        var min_weight;

        var p:any;

        if(x-2 >= 0 && y+1 < this.size && visited[x-2][y+1] != 1) {
            p = {
            	x: x-2, 
            	y: y+1
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x-2 >= 0 && y-1 >= 0 && visited[x-2][y-1] != 1){
        	p = {
            	x: x-2, 
            	y: y-1,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x-1 >= 0 && y+2 < this.size && visited[x-1][y+2] != 1){
        	p = {
            	x: x-1, 
            	y: y+2,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x-1 >= 0 && y-2 >= 0 && visited[x-1][y-2] != 1){
        	p = {
            	x: x-1, 
            	y: y-2,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x+1 < this.size && y-2 >= 0 && visited[x+1][y-2] != 1){
        	p = {
            	x: x+1, 
            	y: y-2,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x+1 < this.size && y+2 < this.size && visited[x+1][y+2] != 1){
        	p = {
            	x: x+1, 
            	y: y+2,
            };
            p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x+2 < this.size && y-1 >= 0 && visited[x+2][y-1] != 1){
        	p = {
            	x: x+2, 
            	y: y-1,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        if(x+2 < this.size && y+1 < this.size && visited[x+2][y+1] != 1){
        	p = {
            	x: x+2, 
            	y: y+1,
            };
        	p.weight = this.calcWeight(p, visited);
            possibleMoves.push(p);
        }
        min_weight = 8;

        _.each(possibleMoves, function(value, key){
        	if (value.weight < min_weight)
        	{
        		min_weight = value.weight;
        	}
        });

        _.each(possibleMoves, function(value, key){
        	if(value.weight == min_weight)
        	{
        		nextMove = value;
        	}
        });

        return nextMove;
    }

	warnBacktrack(tour, visited){

        if(tour.length == this.boardSize){
            //console.log("SOLVED");
            this.running = false;
        }
        else{
        	var nextMove = this.nextMoveWarnsdorff(tour, visited);

            tour.push(nextMove);
            
            visited[nextMove['x']][nextMove['y']] = 1;
            this.warnBacktrack(tour, visited);
            if(!this.running){
                return;
            }
            else{
                tour.pop(nextMove);
                visited[nextMove['x']][nextMove['y']] = 0;
            }
            

        }
    }


	public heuristicTour(x, y){
		this.currentTour = [];
		var initial_position = {x: x, y: y};
		this.currentTour.push(initial_position);

		this.visited = [];
		this.running = true;

		for(var i = 0; i < this.size; i++)
		{
			this.visited[i] = [];
			for(var j = 0; j < this.size; j++)
			{
				this.visited[i][j]=0;
			}
		}

		this.visited[initial_position.x][initial_position.y] = 1;


		this.warnBacktrack(this.currentTour, this.visited);
		
		for(var i = 0; i < this.size; i++)
		{
			this.chessBoard[i] = [];
			for(var j = 0; j < this.size; j++)
			{
				this.chessBoard[i][j]=0;
			}
		}
		
		var self = this;

		_.each(self.currentTour, function(value, key){
			self.chessBoard[value.x][value.y] = key;
		});
		this.endTime = window.performance.now();
		
		//console.log(this.endTime);
		this.solutionFound = true;

	}
	
	solveTour(start_x, start_y, type){
		this.resetBoard(this.size);
		
		start_x--;
		start_y--;
		
		this.chessBoard[start_x][start_y] = 0;
		this.yMove = [2, 1, -1, -2, -2, -1, 1, 2];
		this.xMove = [1, 2, 2, 1, -1, -2, -2, -1];
		this.startTime = window.performance.now();

		//Insert swith case to check radio button values

		if(type == "DFS")
			this.solveDFSTour(start_x, start_y);
		else if(type == "Brute")
			this.bruteForceTour(start_x, start_y);
		else
			this.heuristicTour(start_x, start_y);

		//console.log(this.startTime);
		
	}

}

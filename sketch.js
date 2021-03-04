w = 20;
var k = 0;
var grid = [];
var rnds = [];
function setup() {
	var x = createCanvas(700, 700);
	x.parent("main");
	resetSketch();
	var button = createButton("Reset map");
	button.mousePressed(resetSketch);
	var randombutton = createButton("Generate random");
	randombutton.mousePressed(genrandom);
	button.parent("info");
	randombutton.parent("info");
}

function resetSketch(){
	k = 0;
	grid = [];
	rnds = [];
	cols = floor(width/w);
	rows = floor(height/w);

	for (var i = 0; i < rows*w; i=i+w) {
		for (var j = 0; j < cols*w; j=j+w) {
			var c = new Cell(i,j,k);
			grid.push(c);
			k++;
		}
	}
	//genrandom();
}


function draw() {
	stroke(255);
	//noStroke();
	fill(0);

	for (var i = 0; i < grid.length; i++) {
		grid[i].draw();
		grid[i].getneighbors();
		grid[i].checkdist();
		
	}

	for (var i = 0; i < grid.length; i++) {
		//Step 4 - Any dead cell with exactly three live neighbours becomes a live cell
		if (grid[i].alive == false) 
		{
			if (grid[i].neighbourcounter == 3){
				grid[i].revive();
			}
		}

		if (grid[i].alive) 
		{
			//Step 1 - Any live cell with fewer than two live neighbours dies
			if (grid[i].neighbourcounter < 2){
				grid[i].kill();
			}

			//Step 2 - Any live cell with two or three live neighbours lives on to the next generation.
			if (grid[i].neighbourcounter == 2 || grid[i].neighbourcounter == 3){
				grid[i].revive();
				//live on
			}
			//Step 3 - Any live cell with more than three live neighbours dies
			if (grid[i].neighbourcounter >3){
				grid[i].kill();
			}
		}
		
		
	}
}
function genrandom(){
	for (var i = 0; i < 300; i++) {
		var rnd = Math.floor(Math.random() * (grid.length - 1));
		rnds.push(rnd); 
	}

	for (var i = 0; i < rnds.length; i++) {
		grid[rnds[i]].revive();
	}
	
}

function acorn(){
	grid[10].revive();
	grid[(700/w) + 10].revive();
	grid[(700/w) + 8].revive();
	grid[((700/w) * 3) + 9].revive();
	grid[((700/w) * 4) + 10].revive();
	grid[((700/w) * 5) + 10].revive();
	grid[((700/w) * 6) + 10].revive();

}


function Cell(i,j,index){
	this.x = i;
	this.y = j;
	this.ind = index;
	this.alive = false;
	this.neighbors = [false,false,false,false,false,false,false,false];
	this.neighbourcounter = 0;
	this.draw = function(){
		if (this.alive) {
			fill(50,255,50);
		}
		else{
			fill(255,50,50);
		}
		rect(this.x, this.y, w, w);
	}
	this.makeWhite = function(){
		fill(255);
		rect(this.x, this.y, w, w);
	}
	this.checkdist = function(){
		if (dist(mouseX, mouseY, this.x, this.y) < w ){
			this.alive = true;
		}
	}
	this.revive = function(){
		this.alive = true;
	}
	this.kill = function(){
		this.alive = false;
	}

	this.getneighbors = function(){
		if(this.y != 0){
			this.top      	 = grid[this.ind - 1];
			this.topright 	 = grid[(this.ind - 1) + (700/w)];
			this.topleft 	 = grid[(this.ind - 1) - (700/w)];
		}

		if (this.x != (700 - w)) 
		{
			this.right  	 = grid[this.ind + (700/w)];
		}
		

		if (this.y != (700 - w)) 
		{
			this.bottomright = grid[(this.ind + 1) + (700/w)];
			this.bottom 	 = grid[this.ind + 1];
			this.bottomleft  = grid[(this.ind + 1) - (700/w)];
		}

		this.left   	 = grid[this.ind - (700/w)];



		if (this.top && this.top.alive == true && this.top.x == this.x)
		{
			this.neighbors[0] = true;
		}
		else{
			this.neighbors[0] = false;
		}




		if (this.topright && this.topright.alive == true && this.topright.x != this.x)
		{
			this.neighbors[1] = true;
		}
		else{
			this.neighbors[1] = false;
		}



		if (this.right && this.right.alive == true)
		{
			this.neighbors[2] = true;
		}
		else{
			this.neighbors[2] = false;
		}



		if (this.bottomright && this.bottomright.alive == true && this.bottomright.y == (this.y + w))
		{
			this.neighbors[3] = true;
		}
		else{
			this.neighbors[3] = false;
		}



		if (this.bottom && this.bottom.alive == true && this.bottom.x == this.x)
		{
			this.neighbors[4] = true;
		}
		else{
			this.neighbors[4] = false;
		}



		if (this.bottomleft && this.bottomleft.alive == true && this.bottomleft.y == (this.y + w))
		{
			this.neighbors[5] = true;
		}
		else{
			this.neighbors[5] = false;
		}



		if (this.left && this.left.alive == true)
		{
			this.neighbors[6] = true;
		}
		else{
			this.neighbors[6] = false;
		}



		if (this.topleft && this.topleft.alive == true && this.topleft.x != this.x)
		{
			this.neighbors[7] = true;
		}
		else{
			this.neighbors[7] = false;
		}



		this.neighbourcounter = 0;
		for(var i = 0; i < this.neighbors.length; i++){
			if(this.neighbors[i] == true)
				this.neighbourcounter++;
		}
	}



}

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


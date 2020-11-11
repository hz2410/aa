//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  //Listen for messages named 'data' from the server
  socket.on('data', function(obj) {
    console.log(obj);
    drawPos(obj);
  });
}

function mouseMoved() {
  //Grab mouse position
  let mousePos = { x: mouseX, y: mouseY };
  //Send mouse position object to the server
  socket.emit('data', mousePos);

  //Draw yourself? or Wait for server?
  // fill(0);
  // ellipse(mouseX, mouseY 10, 10);
}

//Expects an object with a and y properties
let battleships = []; //our array of all battleships
let myShip;  //this is ours
let lasers = []; //no lasers shot yet

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255); 
	frameRate(20);
	myShip = {
		'x':0,
		'y':0,
		'name': prompt('Name for your battleship?')
	};
	battleships.push(myShip);
	
	socket.on('update', updateBattleship);
}

function draw() {
	background(255);
	
	//update our own ship position
	myShip.x = mouseX; 
	myShip.y = mouseY;
	myShip.shooting = mouseIsPressed;
	socket.emit('update', myShip); //let others know of our new position

	//draw all battleships
	noStroke();
	fill(30, 30, 30, 90);
	for (let ship of battleships) { //draw each ship
		triangle(ship.x - 10, ship.y, ship.x, ship.y - 20, ship.x + 10, ship.y);
		if(ship.shooting){ //add a laser to the screen
			let newLaser = {
				x: ship.x,
				y: ship.y
			};
			lasers.push(newLaser);
		}
	}
	
	//draw any lasers that are shot
	stroke(0);
	for (let laser of lasers) {
		laser.y -= 10; //laser goes up a few pixels
		line(laser.x, laser.y, laser.x, laser.y - 10);
	}
	
	//remove lasers out of screen, for performance
	lasers = lasers.filter(function(l){ return l.y > 0}); 
}

function updateBattleship(ship) {
	//see if ship already exists
	let bs = battleships.filter(d=>d.name == ship.name);
	
	if(bs.length == 0){ //if a new ship, create a new one
		battleships.push(ship);
	}else{ //if exists, then update its data
		bs[0].x = ship.x;
		bs[0].y = ship.y;
		bs[0].shooting = ship.shooting;
	}
}


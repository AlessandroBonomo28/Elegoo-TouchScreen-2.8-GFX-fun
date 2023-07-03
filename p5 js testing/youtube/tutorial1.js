const raggio  =20;
const fallSpeed = 0.2;
let x = 0,y = 0;

let circles = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20,190,20);
  
  x = mouseX;
  y = mouseY;
  
  strokeWeight(5);
  point(x,y);
  
  strokeWeight(2);
  fill(255,255,0); // r g b 
  for(let i=0; i<circles.length; i++){
    circle(circles[i][0],circles[i][1],raggio);
    circles[i][1] += deltaTime *fallSpeed; 
    if(circles[i][1] >= height){
      circles[i][1] = 0;
    }
  }
  
  
  
  
}

function mouseClicked(){
  circles.push([x,y]);
}

function keyPressed(){
  if(key === 'r'){
    circles = []
  }
}
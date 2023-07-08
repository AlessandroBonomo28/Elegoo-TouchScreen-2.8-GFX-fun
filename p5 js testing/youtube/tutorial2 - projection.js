
let points = [
  [-1, -1, -1], // P1
  [1, -1, -1], // P2
  [1, 1, -1], // P3
  [-1, 1, -1], // P4
  [-1, -1, 1], // P5
  [1, -1, 1], // P6
  [1, 1, 1], // P7
  [-1, 1, 1] // P8
];


function setup() {
  createCanvas(500, 400);
}

const zNear= 0.1;
const zFar = 1000;

function computeDepth(z_vertex){
  let z = z_vertex * -(zNear + zFar)/(zNear - zFar);
  z += (2 *zNear * zFar)/(zNear - zFar);
  return z;
}

function draw() {
  background(220);
  for(let i = 0; i< points.length; i++){
    const aspectRatio = height/width;
    
    let translate_x = 1;
    let translate_y = 1.5;
    let translate_z =5;
    
    let x = (points[i][0]  + translate_x) * aspectRatio;
    let y = (points[i][1] + translate_y) * -1;
    let z = points[i][2] +translate_z;
    
    let zDepth = computeDepth(z);
    
    if(z!=0){ // normalizzazione -> -1,1
      x/=z;
      y/=z;
      zDepth/=z;
    }
    
    
    
    x = map(x,-1,1,0,width);
    y = map(y,-1,1,0,height);
    
    if(zDepth< 1){
      strokeWeight(5)
      point(x,y)
    }
    
  }
 
  
}

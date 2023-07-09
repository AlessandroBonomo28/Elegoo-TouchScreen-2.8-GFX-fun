let drops = [];

const dropLen =.10;
const speedDrop = 0.002;
const dropCount = 100;
const maxDistdrop = 3;

function setup() {
  createCanvas(500, 400);
  noCursor();
  for(let i=0;i<dropCount;i++){
    let drop =[];
    drop[0] = random(-2,2);
    drop[1] = random(-2,2);
    drop[2] = random(0,maxDistdrop);
    drops.push(drop);
  }
}



function draw() {
  background(0);
  
  for(let i = 0; i< dropCount; i++){
    const aspectRatio = height/width;
    
    
    drops[i][2] -= deltaTime*speedDrop;
    
    const xMov = map(mouseX,0,width,-1,1);
    const yMov = map(mouseY,0,height,-1,1);
    
    let translate_x = 0;
    let translate_y = 0;
    let translate_z =0;
    
    
    
    drops[i][0] -= xMov * deltaTime*speedDrop
    drops[i][1] -= yMov * deltaTime*speedDrop
    if(drops[i][2]<0){
      drops[i][0] = random(-2 + xMov*2,2 + xMov*2);
      drops[i][1] = random(-2 + yMov*2,2 + yMov*2);
      drops[i][2] = maxDistdrop;
    }
      
    
    let x = drops[i][0] * aspectRatio + translate_x;
    let y = drops[i][1] + translate_y * -1;
    let z = drops[i][2] +translate_z;
    
    
    let x2 = x; 
    let y2 = y;
    let z2 = z+dropLen;
    
    
    if(z!=0){ // normalizzazione -> -1,1
      x/=z;
      y/=z;
    }
    
    if(z2!=0){
      x2/=z2;
      y2/=z2;
    }
    
    
    x = map(x,-1,1,0,width);
    y = map(y,-1,1,0,height);
    
    x2 = map(x2,-1,1,0,width);
    y2 = map(y2,-1,1,0,height);
    
    stroke(145,224,255)
    const weight = map(z,0,maxDistdrop, 5,0);
    strokeWeight(weight);
    line(x,y,x2,y2);

    
  }
  
}
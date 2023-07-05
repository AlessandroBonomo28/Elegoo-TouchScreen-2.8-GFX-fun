let stars = [];


const speedStar = 0.001;
const starCount = 200;
const maxDistStar = 3;
function setup() {
  createCanvas(500, 400);
  
  for(let i=0;i<starCount;i++){
    let star =[];
    star[0] = random(-2,2);
    star[1] = random(-2,2);
    star[2] = random(0,maxDistStar);
    stars.push(star);
  }
}



function draw() {
  background(0);
  
  for(let i = 0; i< starCount; i++){
    const aspectRatio = height/width;
    
    
    stars[i][2] -= deltaTime*speedStar;
    
    const xMov = map(mouseX,0,width,-1,1);
    const yMov = map(mouseY,0,height,-1,1);
    
    let translate_x = 0;
    let translate_y = 0;
    let translate_z =0;
    
    
    
    stars[i][0] -= xMov * deltaTime*speedStar
    stars[i][1] -= yMov * deltaTime*speedStar
    if(stars[i][2]<0){
      stars[i][0] = random(-2 + xMov*2,2 + xMov*2);
      stars[i][1] = random(-2 + yMov*2,2 + yMov*2);
      stars[i][2] = maxDistStar;
    }
      
    
    let x = stars[i][0] * aspectRatio + translate_x;
    let y = stars[i][1] + translate_y * -1;
    let z = stars[i][2] +translate_z;
    
    
    if(z!=0){ // normalizzazione -> -1,1
      x/=z;
      y/=z;
    }
    
    
    
    x = map(x,-1,1,0,width);
    y = map(y,-1,1,0,height);
    fill(255)
    const r = map(z,0,maxDistStar, 5,0);
    ellipse(x,y,r,r)
    
  }
  
}

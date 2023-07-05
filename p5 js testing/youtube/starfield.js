let stars  =[];

const starCount = 100;
const maxDist  =3;
const speedStar = 0.001;
function setup() {
  createCanvas(600, 400);
  
  for(let i= 0; i<starCount;i++){
    let star = [];
    star[0] = random(-1,1);
    star[1] = random(-1,1);
    
    star[2] = random(maxDist/8,maxDist);
    stars.push(star);
  }
}

function draw() {
  background(0);
  for(let i= 0; i<starCount;i++){
    const aspectRatio = height/width;
    
    stars[i][2] -= deltaTime * speedStar;
    
    const xMov = map(mouseX,0,width,-1,1);
    const yMov = map(mouseY,0,height,-1,1);
    
    stars[i][0] -= xMov*deltaTime*speedStar;
    stars[i][1] -= yMov*deltaTime*speedStar;
    
    if(stars[i][2]<0){
      stars[i][0] = random(-1 + xMov,1 + xMov);
      stars[i][1] = random(-1 + yMov,1 + yMov);

      stars[i][2] = random(0,maxDist);
    }
    
    let x = stars[i][0] * aspectRatio;
    let y = stars[i][1];
    let z = stars[i][2];
    
    if(z!=0){
      x/=z;
      y/=z;
    }
    x = map(x,-1,1,0,width);
    y = map(y,-1,1,0,height);
    
    
    
    fill(255)
    const r = map(z,maxDist/8,maxDist,5,0);
    ellipse(x,y,r,r)
  }
  
  
}

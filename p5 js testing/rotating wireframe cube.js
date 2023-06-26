
const points = [
  [-1, -1, -1], // P1
  [1, -1, -1], // P2
  [1, 1, -1], // P3
  [-1, 1, -1], // P4
  [-1, -1, 1], // P5
  [1, -1, 1], // P6
  [1, 1, 1], // P7
  [-1, 1, 1] // P8
];
const widthWindow = 400;
const heightWindow = 400;

const zFar = 1000;
const zNear = 0.1;


const aspectRatio = heightWindow/widthWindow;

let projectionMatrix = [
  [aspectRatio, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, (zFar + zNear)/(zNear - zFar), (2*zFar*zNear)/(zNear - zFar)],
  [0, 0, -1, 0]
];

function getLookAtMatrix(vUp,vRight,vDirLook,vPos){
  let rotation = [
    [vUp[0], vUp[1], vUp[2], 0],
    [vRight[0], vRight[1], vRight[2], 0],
    [vDirLook[0], vDirLook[1], vDirLook[2], 0],
    [0, 0, 0, 1]
  ];
  let translation = [
    [1, 0, 0, -vPos[0]],
    [0, 1, 0, -vPos[1]],
    [0, 0, 1, -vPos[2]],
    [0, 0, 0, 1],
  ];
  return mat4x4(rotation,translation);
}

function getRotationMatrix(yaw, pitch, roll) {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);

  const rotationMatrix = [
    [
      cosYaw * cosRoll + sinYaw * sinPitch * sinRoll,
      -cosYaw * sinRoll + sinYaw * sinPitch * cosRoll,
      sinYaw * cosPitch,
      0
    ],
    [
      cosPitch * sinRoll,
      cosPitch * cosRoll,
      -sinPitch,
      0
    ],
    [
      -sinYaw * cosRoll + cosYaw * sinPitch * sinRoll,
      sinYaw * sinRoll + cosYaw * sinPitch * cosRoll,
      cosYaw * cosPitch,
      0
    ],
    [0, 0, 0, 1.0]
  ];

  return rotationMatrix;
}

function getRotationMatrixY(angle){
  let rotationMatrixY = [
    [Math.cos(angle), 0, Math.sin(angle), 0],
    [0, 1, 0, 0],
    [-Math.sin(angle), 0, Math.cos(angle), 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixY;
}
function getRotationMatrixX(angle){
  let rotationMatrixX = [
    [1, 0, 0, 0],
    [0, cos(angle), -sin(angle), 0],
    [0, sin(angle), cos(angle), 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixX;
}
function getRotationMatrixZ(angle){
  let rotationMatrixZ = [
    [Math.cos(angle), -Math.sin(angle), 0, 0],
    [Math.sin(angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixZ;
}
function perspectiveProjection(p, projectionMatrix) {
  
  
  const pointVector = [p[0],p[1],p[2], 1.0];
  
  // Moltiplica il vettore punto per la matrice di proiezione
  const projectedVector = multiplyMatrixVector(pointVector,projectionMatrix);
  const w = projectedVector[3];
  
  if(w!=0) {
    // Normalizza il risultato dividendo per la coordinata w proiettata
    return [projectedVector[0]/w,projectedVector[1]/w,projectedVector[2]/w];
  }
  return [projectedVector[0],projectedVector[1],projectedVector[2]];
}

function multiplyMatrixVector(vector,matrix) {
  const result = [];
  
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    
    result[i] = sum;
  }
  return result;
}


function mat4x4(mat1, mat2) {
  const result = [];
  
  for (let i = 0; i < 4; i++) {
    result[i] = [];
    
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      
      for (let k = 0; k < 4; k++) {
        sum += mat1[i][k] * mat2[k][j];
      }
      
      result[i][j] = sum;
    }
  }
  
  return result;
}




let sumAngle = 0;

function setup() {
  createCanvas(400, 400);
}



function draw() {
  background(220);
  
  let projected_points= [];
  for(let i=0;i<points.length;i++){
     
    let angle = sumAngle ;
    
    const vUp = [0,1,0];
    const vRight = [-1,0,0]; // reversed X perchè mi trovo meglio così
    const vDirLook = [0,0,1];
    const vPos = [0,0,0];
    const viewMatrix = getLookAtMatrix(vUp,vRight,vDirLook,vPos);
    let viewSpace = multiplyMatrixVector([...points[i],1],viewMatrix);
    
    let rotated =  multiplyMatrixVector(viewSpace,
                                          getRotationMatrix(angle,0,0));
    
    
    rotated[2]+=map(mouseY, 0, height, -50, 50);// translate z 
    rotated[1]+= 0; // translate y 
    rotated[0]+= 1; // translate x 
    
    let projected = perspectiveProjection(rotated,projectionMatrix);
    // map to canvas space
    let x = map(projected[0], -1.0, 1.0, 0.0, 400.0);
    let y = map(projected[1], -1.0, 1.0, 0.0, 400.0);
    let z = projected[2]; // z buffer
    
    if(z<1){ // clip dots
      stroke('black');
      strokeWeight(10);
      point(x,y);
    }
    
    projected_points.push([x,y,z]);
  }
  
  // Connect lines between vertices
  for (let i = 0; i < 4; i++) {
    let j = (i + 1) % 4;
    
    if (projected_points[i][2] >= 1 ||
        projected_points[j][2] >= 1 ||
        projected_points[j + 4][2] >= 1) // clip lines
      continue;
    
    if(i===0) stroke('blue');
    if(i===1) stroke('red');
    if(i===2) stroke('green');
    if(i===3) stroke('black');
    strokeWeight(1);
    line(projected_points[i][0], projected_points[i][1],
         projected_points[j][0], projected_points[j][1]);
    line(projected_points[i + 4][0], projected_points[i + 4][1],
         projected_points[j + 4][0], projected_points[j + 4][1]);
    line(projected_points[i][0], projected_points[i][1],
         projected_points[i + 4][0], projected_points[i + 4][1]);
  }
  
  sumAngle += deltaTime* PI/1000;

}


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
const zFar = 3;
const zNear = 1;

let projectionMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, (zFar + zNear)/(zNear - zFar), (2*zFar*zNear)/(zNear - zFar)],
  [0, 0, -1, 0]
];


let widthWindow = 400;
let heightWindow = 400;





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
    [0, 0, 0, 1]
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
function perspectiveProjection(point, projectionMatrix) {
  const [x, y, z] = point;
  
  const pointVector = [x, y, z, 1];
  
  // Moltiplica il vettore punto per la matrice di proiezione
  const projectedVector = multiplyMatrixVector(pointVector,projectionMatrix);
  const w = projectedVector[3];
  let projectedPoint =  [x,y,z];
  if(w!=0) {
    // Normalizza il risultato dividendo per la coordinata w proiettata
    projectedPoint = projectedPoint.map(x => x/w);
  }
  return projectedPoint;
}

function multiplyMatrixVector(vector,matrix) {
  const result = [];
  
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    
    result.push(sum);
  }
  
  return result;
}



function multiplyVectorByMatrix(vector, matrix) {
  let result = [];
  for (let i = 0; i < 4; i++) {
    let sum = 0;
    for (let j = 0; j < 4; j++) {
      sum += vector[j] * matrix[j][i];
    }
    result[i] = sum;
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
    
    let rotated =  multiplyVectorByMatrix([...points[i],1],
                                          getRotationMatrix(angle,0,0));
    rotated[2]+=5;// translate z 
    rotated[1]+= 0; // translate y 
    rotated[0]+= 0; // translate x 
    
    let projected = perspectiveProjection(rotated,projectionMatrix);
    // map to canvas space
    let x = map(projected[0], -1.0, 1.0, 0.0, 400.0);
    let y = map(projected[1], -1.0, 1.0, 0.0, 400.0);
    let z = projected[2];
    stroke('black');
    strokeWeight(10);
    point(x,y);
    projected_points.push([x,y,z]);
  }
  
  // Connect lines between vertices
  for (let i = 0; i < 4; i++) {
    let j = (i + 1) % 4;
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


let isTextVisible = true;
let drawDebugEnabled = true;

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

function d2rad(x) {return x*180/Math.PI}

const widthWindow = 400;
const heightWindow = 400;

const zFar = 1000;
const zNear = 0.1;


const aspectRatio = heightWindow/widthWindow;


/* 
*-------------------------------
*|     Axis orientation!!!     |
*_______________________________
* In questo esempio se metto tutte le dir =1 mi trovo
* con un left handed system, con origine nell'angolo in basso a sinistra.
*
* Visto che in p5 js l'origine 0,0 si trova 
* nell'angolo in alto a sinistra
* quindi devo mettere yDir = -1 (ribaltare la y)
*
* Nota che se sei in openGl l'origine è in basso a sinistra
* e quindi yDir = 1, (non si ribalta la y).
* Inoltre openGl usa un sistema right handed 
* (asse z punta dallo schermo alla persona)
* quindi zDir = -1;
*/
const xDir = 1;
const yDir = -1; 
const zDir = 1;
let projectionMatrix = [
  [aspectRatio*xDir, 0, 0, 0],
  [0, yDir, 0, 0],
  [0, 0, -zDir*(zFar + zNear)/(zNear - zFar), (2*zFar*zNear)/(zNear - zFar)],
  [0, 0, zDir, 0]
];


function getLookAtMatrix(vUp,vRight,vDirLook,vPos){
  let rotation = [
    [vRight[0], vRight[1], vRight[2], 0],
    [vUp[0], vUp[1], vUp[2], 0],
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


function getRotationMatrixArbitraryAxis(a,theta){
  const mat = [
      [
        a[0]*a[0]*(1-Math.cos(theta))+Math.cos(theta), 
        a[0]*a[1]*(1-Math.cos(theta))+a[2]*Math.sin(theta),
        a[0]*a[2]*(1-Math.cos(theta))-a[1]*Math.sin(theta),
        0
      ],
      [
        a[0]*a[1]*(1-Math.cos(theta))-a[2]*Math.sin(theta),
        a[1]*a[1]*(1-Math.cos(theta))+Math.cos(theta),
        a[1]*a[2]*(1-Math.cos(theta))+a[0]*Math.sin(theta),
        0
      ],
      [
        a[0]*a[2]*(1-Math.cos(theta))+a[1]*Math.sin(theta),
        a[1]*a[2]*(1-Math.cos(theta))-a[0]*Math.sin(theta),
        a[2]*a[2]*(1-Math.cos(theta))+Math.cos(theta),
        0
      ],
      [
        0,0,0,1
      ]
    ];
  return mat;
}

// ci 6 modi diversi per combinare yaw pitch e roll.
// questo metodo non è universale, meglio utilizzare singolarmente le matrici X,Y,Z oppure
// utilizzare la funzione di rotazione su asse arbitrario.
function getRotationMatrix(yaw, pitch, roll) {
  const yawMatrix = getRotationMatrixY(yaw);
  const pitchMatrix = getRotationMatrixX(pitch);
  const rollMatrix = getRotationMatrixZ(roll);
  // roll * yaw * pitch
  // le rotazioni applicate in ordine: 1) pitch rotation, 2) yaw rotation, 3) roll rotation
  return mat4x4(rollMatrix,mat4x4(yawMatrix,pitchMatrix));
  
}

function getRotationMatrixY(angle){
  let rotationMatrixY = [
    [Math.cos(angle), 0, -Math.sin(angle), 0],
    [0, 1, 0, 0],
    [Math.sin(angle), 0, Math.cos(angle), 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixY;
}
function getRotationMatrixX(angle){
  let rotationMatrixX = [
    [1, 0, 0, 0],
    [0, cos(angle), sin(angle), 0],
    [0, -sin(angle), cos(angle), 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixX;
}
function getRotationMatrixZ(angle){
  let rotationMatrixZ = [
    [Math.cos(angle), Math.sin(angle), 0, 0],
    [-Math.sin(angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  return rotationMatrixZ;
}

function perspectiveProjection(p, projectionMatrix) {
  
  
  const pointVector = [p[0],p[1],p[2], 1.0];
  
  // Moltiplica il vettore punto per la matrice di proiezione
  const projectedVector = multiplyVectorMatrix(pointVector,projectionMatrix);
  const w = projectedVector[3];
  
  if(w!=0) {
    // Normalizza il risultato dividendo per la coordinata w proiettata
    return [projectedVector[0]/w,projectedVector[1]/w,projectedVector[2]/w];
  }
  return [projectedVector[0],projectedVector[1],projectedVector[2]];
}

function multiplyVectorMatrix(vector,matrix) {
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

function crossProduct(v1, v2) {
  const x = v1[1] * v2[2] - v1[2] * v2[1];
  const y = v1[2] * v2[0] - v1[0] * v2[2];
  const z = v1[0] * v2[1] - v1[1] * v2[0];
  return [x, y, z];
}

function vec3Len(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function vec3normalize(v){
  const len = vec3Len(v);
  if(len == 0)return v;
  return [v[0]/len,v[1]/len,v[2]/len];
}

let isCursorLocked = true;
let sumAngle = 0;

let isDragging = false;
let startX, startY;
let xDrag = 0;
let yDrag = 0;

function setup() {
  createCanvas(400, 400);
  noCursor();
  
  // normalize model vertices from -1,1 -> 0,1 (Opzionale)
  for(let i=0;i<points.length;i++){
    points[i] = points[i].map(x=>map(x,-1,1,0,1));
  }
}

let vDirLook = [0,0,1];
let vUp = [0,1,0];
let offset = [0,0,0];

function draw() {
  background(220);
  if (isDragging) {
    updateLook();
  }
  
  let projected_points= [];
  const angle = sumAngle ;
    
  const vRight = crossProduct(vUp,vDirLook);
  const vPos = [0 + offset[0],
                0 + offset[1],
                0 + offset[2]];
  const viewMatrix = getLookAtMatrix(vUp,vRight,vDirLook,vPos);
  
  for(let i=0;i<points.length;i++){
     
    
    
    const axis = vec3normalize([0,1,0]);
    const rotMatrix = getRotationMatrixArbitraryAxis(axis,angle);
    //getRotationMatrix(0,0,angle);
    
    const rotated =  multiplyVectorMatrix([...points[i],1],
                                          rotMatrix);
    
    let translated = rotated;
    translated[2]+= 2; // translate z 
    translated[1]+= -1.5; // translate y 
    translated[0]+= 0.5; // translate x 
    
    let viewSpace = multiplyVectorMatrix(translated,viewMatrix);
    
    
    let projected = perspectiveProjection(viewSpace,projectionMatrix);
    // map to canvas space
    let x = map(projected[0], -1.0, 1.0, 0.0, 400.0);
    let y = map(projected[1], -1.0, 1.0, 0.0, 400.0);
    let z = projected[2]; // z buffer
    
    if(z<1){ // clip dots
      stroke('black');
      strokeWeight(10);
      point(x,y);
      
      if(isTextVisible){
        strokeWeight(0);
        textSize(10);
        textAlign(LEFT, CENTER);
        const off = 10;
        // Print the text
        const _x = round(translated[0],1);
        const _y = round(translated[1],1);
        const _z = round(translated[2],1);
        text("("+_x+","+_y+","+_z+")", x+off,y+off);
      }
      
    }
    
    projected_points.push([x,y,z]);
  }
  
  // draw debug text in left upper corner
  strokeWeight(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("Look: ("+vDirLook.map(x=>round(x,1))+")",5,20);
  text("Position: ("+offset.map(x=>round(x,1))+")",5,40);
  
  if(drawDebugEnabled){
    strokeWeight(2);
    drawDebugAxis(viewMatrix);
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
  
  sumAngle += deltaTime* PI/5000;

}

let relativeMovement = true;
function keyPressed() {
  const unit = 0.50;
  if(!relativeMovement){
    if (key === 'w') { // +z
      offset[2] += unit;
    } else if (key === 's') { // -z
      offset[2] -= unit;
    } else if (key === 'a') { // -x
      offset[0] -= unit;
    } else if (key === 'd') { // +x
      offset[0] += unit;
    }
  } else {
    const vRight = crossProduct(vUp,vDirLook);
    if (key === 'w') {
      offset[0] += vDirLook[0];
      offset[1] += vDirLook[1];
      offset[2] += vDirLook[2];
    } else if (key === 's') { // -z
      offset[0] -= vDirLook[0];
      offset[1] -= vDirLook[1];
      offset[2] -= vDirLook[2];
    } else if(key === 'a'){
      offset[0] -= vRight[0];
      offset[1] -= vRight[1];
      offset[2] -= vRight[2];
    } else if (key === 'd') { // +x
      offset[0] += vRight[0];
      offset[1] += vRight[1];
      offset[2] += vRight[2];
    }
  }
  
  if(key === ' '){ // space +y
    offset[1] +=unit;
  }
  else if(key === 'Shift'){// -y
    offset[1]-=unit;
  }
  else if(key === 't'){
    isTextVisible = !isTextVisible;
  }
  else if(key ==='1'){
    drawDebugEnabled = !drawDebugEnabled;
  } else if(key === 'r'){
    relativeMovement = !relativeMovement;
  }
}

function mousePressed() {
  isDragging = true;
  startX = mouseX;
  startY = mouseY;
}

function mouseDragged() {
  const speed = 0.05;
  const deltaX = (mouseX - startX) * speed;
  const deltaY = (mouseY - startY) * speed;
  
  xDrag += deltaX;
  yDrag += deltaY;
  
}

function mouseReleased() {
  isDragging = false;
}

function updateLook() {
  const speed = 0.3;
  const jaw = map(xDrag, 0, width, 0, 2*Math.PI) * speed;
  const pitch = map(yDrag, 0, height, 0, 2*Math.PI) * speed;
  vDirLook =  multiplyVectorMatrix([0,0,1],
                                   getRotationMatrix(-jaw,-pitch,0));
  vUp =  multiplyVectorMatrix([0,1,0],
                              getRotationMatrix(-jaw,-pitch,0));
  //vDirLook = [sin(jaw),0,cos(jaw)];
}



// Disegna l'asse di debug
function drawDebugAxis(viewMatrix) {
  const o = [0, 0, 0, 1];
  // Calcola la posizione dell'origine nel sistema di coordinate dello schermo
  let origin = multiplyVectorMatrix(o, viewMatrix);
  origin = perspectiveProjection(origin, projectionMatrix);
  if (origin[2] < 1) {
    origin = origin.map(x => map(x, -1, 1, 0, 400));
    
    // Disegna l'asse X
    const xAxis = [1, 0, 0, 1];
    let xEnd = multiplyVectorMatrix(xAxis, viewMatrix);
    xEnd = perspectiveProjection(xEnd, projectionMatrix);
    if (xEnd[2] < 1) {
      xEnd = xEnd.map(x => map(x, -1, 1, 0, 400));
      stroke('red');
      line(origin[0], origin[1], xEnd[0], xEnd[1]);
      text("x", xEnd[0], xEnd[1]);
    }

    // Disegna l'asse Y
    const yAxis = [0, 1, 0, 1];
    let yEnd = multiplyVectorMatrix(yAxis, viewMatrix);
    yEnd = perspectiveProjection(yEnd, projectionMatrix);
    if (yEnd[2] < 1) {
      yEnd = yEnd.map(x => map(x, -1, 1, 0, 400));
      stroke('green');
      line(origin[0], origin[1], yEnd[0], yEnd[1]);
      text("y", yEnd[0], yEnd[1]);
    }

    // Disegna l'asse Z
    const zAxis = [0, 0, 1, 1];
    let zEnd = multiplyVectorMatrix(zAxis, viewMatrix);
    zEnd = perspectiveProjection(zEnd, projectionMatrix);
    if (zEnd[2] < 1) {
      zEnd = zEnd.map(x => map(x, -1, 1, 0, 400));
      stroke('blue');
      line(origin[0], origin[1], zEnd[0], zEnd[1]);
      text("z", zEnd[0], zEnd[1]);
    }
  }
}


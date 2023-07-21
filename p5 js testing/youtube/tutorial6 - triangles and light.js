const zNear= 0.1;
const zFar = 1000;
const winWidth = 800;
const winHeight = 400;
const aspectRatio = winHeight/winWidth;

let lightDirection = [0,0,1];

let cameraYaw = 0;
let cameraPitch = 0;
let playerPos = [0,0,0]

let vUp = [0,1,0];
let vRight = [1,0,0];
let vForward = [0,0,1];

let isTextVisible = true;
let isDragging = false;
let xDrag = 0,yDrag = 0;
let startX,startY;


// clockwise triangle vertex ordering
let triangles = [
  // SOUTH
  [0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    1.0, 1.0, 0.0],
  [0.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 0.0, 0.0],

  // EAST
  [1.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 1.0, 1.0],
  [1.0, 0.0, 0.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0],

  // NORTH
  [1.0, 0.0, 1.0,    1.0, 1.0, 1.0,    0.0, 1.0, 1.0],
  [1.0, 0.0, 1.0,    0.0, 1.0, 1.0,    0.0, 0.0, 1.0],

  // WEST
  [0.0, 0.0, 1.0,    0.0, 1.0, 1.0,    0.0, 1.0, 0.0],
  [0.0, 0.0, 1.0,    0.0, 1.0, 0.0,    0.0, 0.0, 0.0],

  // TOP
  [0.0, 1.0, 0.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0],
  [0.0, 1.0, 0.0,    1.0, 1.0, 1.0,    1.0, 1.0, 0.0],

  // BOTTOM
  [1.0, 0.0, 1.0,    0.0, 0.0, 1.0,    0.0, 0.0, 0.0],
  [1.0, 0.0, 1.0,    0.0, 0.0, 0.0,    1.0, 0.0, 0.0],
];


let projectionMatrix = [
  [aspectRatio, 0, 0, 0],
  [0, -1, 0, 0],
  [0, 0, -(zFar + zNear)/(zNear - zFar), (2*zFar*zNear)/(zNear -   zFar)],
  [0, 0,1 , 0]
];

function vec3Len(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function vec3normalize(v){
  const len = vec3Len(v);
  if(len == 0)return v;
  return [v[0]/len,v[1]/len,v[2]/len];
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
function getRotationMatrixY(angle){
  angle = -angle;
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
function crossProduct(v1, v2) {
  const x = v1[1] * v2[2] - v1[2] * v2[1];
  const y = v1[2] * v2[0] - v1[0] * v2[2];
  const z = v1[0] * v2[1] - v1[1] * v2[0];
  return [x, y, z];
}

function sub(v1,v2){
  return [v1[0]-v2[0],v1[1]-v2[1], v1[2]-v2[2]];
}

function dotProduct(v1,v2){
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

function getLookAtMatrix(vUp,vRight,vForward,vPos){
  let rotation = [
    [vRight[0], vRight[1], vRight[2], 0],
    [vUp[0], vUp[1], vUp[2], 0],
    [vForward[0], vForward[1], vForward[2], 0],
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

function setup() {
  createCanvas(winWidth, winHeight);
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

let angleSum = 0;
function draw() {
  let projected_triangles = [];
  background(220);
  stroke('black');
  
  for(let i= 0; i< triangles.length; i++){
    let triWorldSpace = [];
    for(let j= 0; j< 3; j++){
      let vertice = [triangles[i][j*3], // x
                     triangles[i][(j*3)+1], // y
                     triangles[i][(j*3)+2], // z
                     1]; // w
      
      let translate_x = 1;
      let translate_y = 0;
      let translate_z =2;

      let scale_x = 1;
      let scale_y = 1;
      let scale_z =1;

      scale_x = scale_y = scale_z =0.8;

      const scaleMatrix = [
        [scale_x,0,0,0],
        [0,scale_y,0,0],
        [0,0,scale_z,0],
        [0,0,0,1],
      ];

      const translationMatrix = [
        [1,0,0,translate_x],
        [0,1,0,translate_y],
        [0,0,1,translate_z],
        [0,0,0,1],
      ];
      let axisRotation = vec3normalize([1,1,1]);

      let matRotation = 
          getRotationMatrixArbitraryAxis(axisRotation,angleSum);
      //getRotationMatrixY(angleSum);

      let matTranslationScaleRotation = mat4x4(mat4x4(translationMatrix,scaleMatrix),matRotation);


      //vertice = multiplyVectorMatrix(vertice,matRotation);
      vertice = multiplyVectorMatrix(vertice,matTranslationScaleRotation);
      
      triWorldSpace = [...triWorldSpace,vertice[0],vertice[1],vertice[2]]
    }
    // [ x,y,z ]
    // [ x,y,z , x,y,z ]
    // [ x,y,z , x,y,z ,x,y,z]
    
    const v1 = [triWorldSpace[0], // x
               triWorldSpace[1], // y
               triWorldSpace[2]]; // z
               
    const v2 = [triWorldSpace[3], // x
               triWorldSpace[4], // y
               triWorldSpace[5]] // z;
    
    const v3 = [triWorldSpace[6], // x
               triWorldSpace[7], // y
               triWorldSpace[8]]; // z
               
    let triNormal = crossProduct(sub(v2,v1),sub(v3,v1));
    triNormal = vec3normalize(triNormal);
    
    const lookAtTriangle = sub(playerPos,triWorldSpace);
    
    const visible = -dotProduct(lookAtTriangle,triNormal);
    const shading = -dotProduct(lightDirection,triNormal);
    if(visible > 0) continue; // triangolo non visibile (Eye > 90°)
    
    let triViewSpace = [];
    for(let j= 0; j< 3; j++){
      let vertice = [triWorldSpace[j*3], // x
                     triWorldSpace[(j*3)+1], // y
                     triWorldSpace[(j*3)+2], // z
                     1]; // w
      
       vertice = multiplyVectorMatrix(vertice,getLookAtMatrix(
          vUp,vRight,vForward,playerPos
        ));
      triViewSpace = [...triViewSpace,vertice[0],vertice[1],vertice[2]]
    }
    
    let triScreenSpace = [];
    for(let j= 0; j< 3; j++){
      let vertice = [triViewSpace[j*3], // x
                     triViewSpace[(j*3)+1], // y
                     triViewSpace[(j*3)+2], // z
                     1]; // w
      
      let projected = multiplyVectorMatrix(vertice,projectionMatrix);
      let x = projected[0];
      let y = projected[1];
      let zDepth = projected[2];
      let z = projected[3];

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
        if(isTextVisible){
          strokeWeight(0);
          textSize(10);
          textAlign(LEFT, CENTER);
          const off = 10;
          const _x = round(triWorldSpace[j*3] ,1);
          const _y = round(triWorldSpace[j*3+1] ,1);
          const _z = round(triWorldSpace[j*3+2] ,1);
          text("("+_x+","+_y+","+_z+")", x+off,y+off);
        }
      }

      triScreenSpace = [...triScreenSpace,x,y,zDepth];
    }
    triScreenSpace.shading = shading
    projected_triangles.push(triScreenSpace)
  }
  
  
  
  function avgZDepth(tri){
    return (tri[2] +tri[5]+tri[8])/3;
  }
  function compareZDepth(a, b) {
    return   avgZDepth(b) - avgZDepth(a); 
  }
  projected_triangles.sort(compareZDepth);
  
  for(let i=0;i<projected_triangles.length;i++){
    if(projected_triangles[i][2] <1 &&
       projected_triangles[i][5] <1 &&
       projected_triangles[i][8] <1) { // clipping easy zDepths >= 1
      
      
      strokeWeight(1)
      fill(255 * max(projected_triangles[i].shading, 0.15));
      triangle(projected_triangles[i][0],projected_triangles[i][1],
             projected_triangles[i][3],projected_triangles[i][4],
             projected_triangles[i][6],projected_triangles[i][7])
    }
    
  }
   
  fill(0)
  strokeWeight(0);
  textSize(15);
  textAlign(LEFT, CENTER);
  const _yaw = round(cameraYaw * (180/Math.PI) % 360,1);
  const _pitch  = round(cameraPitch * (180/Math.PI) % 360,1);
  text("Position: ("+playerPos.map(x=>round(x,1))+")",5,40);
  text("Rotation: ("+_yaw+"°,"+_pitch+"°,0)",5,20);
  
  if(isDragging)
    updateLook();
  
  angleSum += deltaTime * Math.PI/5000;
  if(angleSum >= Math.PI*2 )
    angleSum =0;
  
  
  renderAxis([1,0,0],'red','X');
  renderAxis([0,1,0],'green','Y');
  renderAxis([0,0,1],'blue','Z');
  
}

let usingRelativeMovement = false;

function keyPressed() {
  const unit = 0.50;
  if(usingRelativeMovement){
    if (key === 'w') { // +z
      playerPos[2] += unit;
    } else if (key === 's') { // -z
      playerPos[2] -= unit;
    } else if (key === 'a') { // -x
      playerPos[0] -= unit;
    } else if (key === 'd') { // +x
      playerPos[0] += unit;
    } 
  } else {
    const vRight = crossProduct(vUp,vForward);
    if (key === 'w') {
      playerPos[0] += vForward[0];
      playerPos[1] += vForward[1];
      playerPos[2] += vForward[2];
    } else if (key === 's') { // -z
      playerPos[0] -= vForward[0];
      playerPos[1] -= vForward[1];
      playerPos[2] -= vForward[2];
    } else if(key === 'a'){
      playerPos[0] -= vRight[0];
      playerPos[1] -= vRight[1];
      playerPos[2] -= vRight[2];
    } else if (key === 'd') { // +x
      playerPos[0] += vRight[0];
      playerPos[1] += vRight[1];
      playerPos[2] += vRight[2];
    }
  }
  
  if(key === ' '){ // space +y
    playerPos[1] +=unit;
  }
  else if(key === 'Shift'){// -y
    playerPos[1]-=unit;
  }
  else if(key === 't'){
    isTextVisible = !isTextVisible;
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


function updateLook(){  
  const speed = 0.3;
  cameraYaw = map(xDrag, 0, width, 0, 2*Math.PI) * speed;
  cameraPitch = map(yDrag, 0, width, 0, 2*Math.PI) * speed;
  
  let rotationMat = mat4x4(getRotationMatrixY(cameraYaw), getRotationMatrixX(-cameraPitch));
  
  vForward =  multiplyVectorMatrix([0,0,1],rotationMat);
  vUp = multiplyVectorMatrix([0,1,0],rotationMat);
  
  vRight = crossProduct(vUp,vForward)
  
}

function renderAxis(axis,aColor,aText){
  axis = [...axis,1];
  const viewMatrix = getLookAtMatrix(vUp,vRight,vForward,playerPos);
  const o = [0, 0, 0, 1];
  // Calcola la posizione dell'origine nel sistema di coordinate dello schermo
  let origin = multiplyVectorMatrix(o,viewMatrix );
  origin = multiplyVectorMatrix(origin, projectionMatrix);
  let z = origin[3];
  if(z!=0){
    origin = origin.map(x => x/=z);
  }
  if (origin[2] < 1) {
    origin[0] = map(origin[0], -1, 1, 0, width);
    origin[1] = map(origin[1], -1, 1, 0, height);
    let xEnd = multiplyVectorMatrix(axis, viewMatrix);
    xEnd = multiplyVectorMatrix(xEnd, projectionMatrix);
    z = xEnd[3];
    if(z!=0){
      xEnd = xEnd.map(x => x/=z);
    }
    if (xEnd[2] < 1) {
      xEnd[0] = map(xEnd[0], -1, 1, 0, width);
      xEnd[1] = map(xEnd[1], -1, 1, 0, height);
      stroke(aColor);
      strokeWeight(2);
      line(origin[0], origin[1], xEnd[0], xEnd[1]);
      text(aText, xEnd[0], xEnd[1]);
    }
  }
  
}



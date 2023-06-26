#include <Elegoo_GFX.h>    // Core graphics library
#include <Elegoo_TFTLCD.h> // Hardware-specific library
#include <FrameBuffer.h>
// The control pins for the LCD can be assigned to any digital or
// analog pins...but we'll use the analog pins as this allows us to
// double up the pins with the touch screen (see the TFT paint example).
#define LCD_CS A3 // Chip Select goes to Analog 3
#define LCD_CD A2 // Command/Data goes to Analog 2
#define LCD_WR A1 // LCD Write goes to Analog 1
#define LCD_RD A0 // LCD Read goes to Analog 0

#define LCD_RESET A4 // Can alternately just connect to Arduino's reset pin


// Assign human-readable names to some common 16-bit color values:
#define	BLACK   0x0000
#define	BLUE    0x001F
#define	RED     0xF800
#define	GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

Elegoo_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);
// If using the shield, all control and data lines are fixed, and
// a simpler declaration can optionally be used:
// Elegoo_TFTLCD tft;

// ------------- My GFX ----------------

inline void getRotationMatrix(float yaw, float pitch, float roll, const float translate[3],  float outMatrix[4][4]) {
  const float cosYaw = cos(yaw);
  const float sinYaw = sin(yaw);
  const float cosPitch = cos(pitch);
  const float sinPitch = sin(pitch);
  const float cosRoll = cos(roll);
  const float sinRoll = sin(roll);

  outMatrix[0][0] = cosYaw * cosRoll + sinYaw * sinPitch * sinRoll;
  outMatrix[0][1] = -cosYaw * sinRoll + sinYaw * sinPitch * cosRoll;
  outMatrix[0][2] = sinYaw * cosPitch;
  outMatrix[0][3] = 0;

  outMatrix[1][0] = cosPitch * sinRoll;
  outMatrix[1][1] = cosPitch * cosRoll;
  outMatrix[1][2] = -sinPitch;
  outMatrix[1][3] = 0;

  outMatrix[2][0] = -sinYaw * cosRoll + cosYaw * sinPitch * sinRoll;
  outMatrix[2][1] = sinYaw * sinRoll + cosYaw * sinPitch * cosRoll;
  outMatrix[2][2] = cosYaw * cosPitch;
  outMatrix[2][3] = 0;

  outMatrix[3][0] = translate[0];
  outMatrix[3][1] = translate[1];
  outMatrix[3][2] = translate[2];
  outMatrix[3][3] = 1;
}
void getRotationMatrix(float yaw, float pitch, float roll, float outMatrix[4][4], bool useDefaultTranslate = true) {
  if (useDefaultTranslate) {
    const float defaultTranslate[3] = {0,0,0};
    getRotationMatrix(yaw, pitch, roll, defaultTranslate, outMatrix);
  }
}


inline void multiplyMatrixVector(const float vector[4], const float matrix[4][4], float outvec[4]) {
  for (byte i = 0; i < 4; i++) {
    outvec[i] = 0;
    for (byte j = 0; j < 4; j++) {
      outvec[i] += vector[j] * matrix[j][i];
    }
  }
}

const float zFar = 1000;
const float zNear = 0.1;
const float aspectRatio = 1.33 * 0.5; // 320/240 (h/w schermo * h/w frame)

const float PROGMEM projectionMatrix[4][4] = {
  {aspectRatio, 0, 0, 0},
  {0, 1, 0, 0},
  {0, 0, (zFar + zNear) / (zNear - zFar), (2 * zFar * zNear) / (zNear - zFar)},
  {0, 0, -1, 0}
};


inline void project_point(const float vector[4], float outvec[4]) {
  // fast multiply matrix vector
  for (byte i = 0; i < 4; i++) {
    outvec[i] = 0;
    for (byte j = 0; j < 4; j++) {
      outvec[i] += vector[j] *  pgm_read_float_near(&projectionMatrix[j][i]);
    }
  }
  if (outvec[3] != 0) {
    outvec[0] /= outvec[3];
    outvec[1] /= outvec[3];
    outvec[2] /= outvec[3];
  }
}




const float PROGMEM points[8][3] = {
    {-1, -1, -1}, // P1
    {1, -1, -1},  // P2
    {1, 1, -1},   // P3
    {-1, 1, -1},  // P4
    {-1, -1, 1},  // P5
    {1, -1, 1},   // P6
    {1, 1, 1},    // P7
    {-1, 1, 1}    // P8
  };

// ------------- GFX


unsigned int windowHeight;
unsigned int windowWidth;

unsigned int halfWindowHeight;
unsigned int halfWindowWidth;

const unsigned int frameWidth = 52;
const unsigned int frameHeight = 26;

const unsigned int halfFrameWidth = frameWidth / 2;
const unsigned int halfFrameHeight = frameHeight / 2;

FrameBuffer frameBuffer(frameWidth,frameHeight);

void setup(void) {
  Serial.begin(9600);
  Serial.println(F("TFT LCD test"));
#ifdef USE_Elegoo_SHIELD_PINOUT
  Serial.println(F("Using Elegoo 2.8\" TFT Arduino Shield Pinout"));
#else
  Serial.println(F("Using Elegoo 2.8\" TFT Breakout Board Pinout"));
#endif

  Serial.print(F("TFT size is ")); Serial.print(tft.width()); Serial.print(F("x")); Serial.println(tft.height());
  tft.reset();

  uint16_t identifier = tft.readID();
   if(identifier == 0x9325) {
    Serial.println(F("Found ILI9325 LCD driver"));
  } else if(identifier == 0x9328) {
    Serial.println(F("Found ILI9328 LCD driver"));
  } else if(identifier == 0x4535) {
    Serial.println(F("Found LGDP4535 LCD driver"));
  }else if(identifier == 0x7575) {
    Serial.println(F("Found HX8347G LCD driver"));
  } else if(identifier == 0x9341) {
    Serial.println(F("Found ILI9341 LCD driver"));
  } else if(identifier == 0x8357) {
    Serial.println(F("Found HX8357D LCD driver"));
  } else if(identifier==0x0101)
  {     
      identifier=0x9341;
       Serial.println(F("Found 0x9341 LCD driver"));
  }else {
    Serial.print(F("Unknown LCD driver chip: "));
    Serial.println(identifier, HEX);
    Serial.println(F("If using the Elegoo 2.8\" TFT Arduino shield, the line:"));
    Serial.println(F("  #define USE_Elegoo_SHIELD_PINOUT"));
    Serial.println(F("should appear in the library header (Elegoo_TFT.h)."));
    Serial.println(F("If using the breakout board, it should NOT be #defined!"));
    Serial.println(F("Also if using the breakout, double-check that all wiring"));
    Serial.println(F("matches the tutorial."));
    identifier=0x9341;
  
  }

  tft.begin(identifier);
  tft.setRotation(0);
  windowHeight = tft.height();
  windowWidth = tft.width();
  halfWindowHeight = windowHeight / 2;
  halfWindowWidth = windowWidth / 2;
  tft.fillScreen(BLACK);

  tft.setTextColor(WHITE);               
  tft.setTextSize(2);
  tft.setCursor(10, windowHeight - 40);   
  tft.println(F("Frame buffer mode")); 
  tft.setTextColor(RED); 
  tft.setTextSize(3);
  tft.setCursor(20, halfWindowHeight+20);   
  tft.println(F("Fast VS slow render mode")); 
  tft.flush(); // per evitare errori di rendering dopo le print
}

float angle = 0;
byte color1;
byte color2;
byte color3;
float projected_points[8][3] = {};
const float translation[3] = {0,0,10}; 
byte mode = 0;
float outMatrix[4][4] = {};
float transformated[4] = {};
float outvec[4] = {};


void loop(void) {
  if(mode == 1){ // slow mode
    color1 = 128;
    color2 = 180;
    color3 = 240;
    frameBuffer.setMode8bitGrayScale();
  }
  else{
    color1 = 0x1a;
    color2 = 0xe1;
    color3 = 0x46;
    frameBuffer.setMode8bitColor();
  }

  if(mode == 0 || 1)
    getRotationMatrix(angle,angle,angle,translation, outMatrix);
  if(mode == 2)
    getRotationMatrix(angle,angle,0,translation, outMatrix);
  if(mode == 3)
    getRotationMatrix(angle,0,angle,translation, outMatrix);
  
  for(byte i=0;i<8;i++){
    float vector[4] = {pgm_read_float_near(&points[i][0]), 
                       pgm_read_float_near(&points[i][1]), 
                       pgm_read_float_near(&points[i][2]), 1};
    multiplyMatrixVector(vector, outMatrix, transformated);
    project_point(transformated, outvec);

    // map to window coordinates (-1,1) -> (0,deviceWidth)
    outvec[0] = (outvec[0] + 1) * halfFrameWidth;
    outvec[1] = (outvec[1] + 1) * halfFrameHeight;

    projected_points[i][0] = outvec[0];
    projected_points[i][1] = outvec[1];
    projected_points[i][2] = outvec[2];
  }
  // disegna 12 linee (4 * 3 linee per ciclo)
  for(byte i=0;i<4;i++){
    byte j = (i + 1) % 4;
    frameBuffer.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[j][0], projected_points[j][1], color1); 
    frameBuffer.drawLine(projected_points[i + 4][0], projected_points[i + 4][1],
         projected_points[j + 4][0], projected_points[j + 4][1], color2);
    frameBuffer.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[i + 4][0], projected_points[i + 4][1], color3);
  }
  
  switch (mode)
  {
    case 0:
    frameBuffer.drawBuffer(&tft,5);
    break;

    case 1:
    frameBuffer.drawBufferSlowTecnique(&tft,5); // slow mode
    break;

    case 2:
    frameBuffer.drawFastHLinesBuffer(&tft,5);
    break;

    case 3:
    frameBuffer.drawFastVLinesBuffer(&tft,5);
    break;
    default:
    tft.fillScreen(YELLOW);
    break;
  }

  frameBuffer.resetBuffer();

  if(angle == 0){
    tft.flush();
    tft.fillRect(windowWidth-15, windowHeight-40, 25, 40, BLACK);
    tft.setTextColor(WHITE); 
    tft.setTextSize(2);
    tft.setCursor(windowWidth-15, windowHeight-40);  
    tft.flush();
    tft.print(mode);
    tft.flush(); // TODO risolvere il print produce artefatti anche con i flush
    
  }

  angle += PI/18; 
  
  if(angle>=2*PI){
     angle = 0;
     mode++;
     if(mode>3)
      mode = 0;

  // prima di disegnare linee verticali o orizzontali pulisci lo schermo
  // per evitare artefatti
  if(mode == 3 || mode == 2) 
    tft.fillRect(0,0,frameWidth*5,frameHeight*5, BLACK);
  }
  
}

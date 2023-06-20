// IMPORTANT: ELEGOO_TFTLCD LIBRARY MUST BE SPECIFICALLY
// CONFIGURED FOR EITHER THE TFT SHIELD OR THE BREAKOUT BOARD.
// SEE RELEVANT COMMENTS IN Elegoo_TFTLCD.h FOR SETUP.
//Technical support:goodtft@163.com

#include <Elegoo_GFX.h>    // Core graphics library
#include <Elegoo_TFTLCD.h> // Hardware-specific library

// The control pins for the LCD can be assigned to any digital or
// analog pins...but we'll use the analog pins as this allows us to
// double up the pins with the touch screen (see the TFT paint example).
#define LCD_CS A3 // Chip Select goes to Analog 3
#define LCD_CD A2 // Command/Data goes to Analog 2
#define LCD_WR A1 // LCD Write goes to Analog 1
#define LCD_RD A0 // LCD Read goes to Analog 0

#define LCD_RESET A4 // Can alternately just connect to Arduino's reset pin

// When using the BREAKOUT BOARD only, use these 8 data lines to the LCD:
// For the Arduino Uno, Duemilanove, Diecimila, etc.:
//   D0 connects to digital pin 8  (Notice these are
//   D1 connects to digital pin 9   NOT in order!)
//   D2 connects to digital pin 2
//   D3 connects to digital pin 3
//   D4 connects to digital pin 4
//   D5 connects to digital pin 5
//   D6 connects to digital pin 6
//   D7 connects to digital pin 7
// For the Arduino Mega, use digital pins 22 through 29
// (on the 2-row header at the end of the board).

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

// ------------- GFX

// fai un overload che accetti la stessa funzione getRotationMatrix ma senza translate



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
    // Utilizza il valore di default per il parametro translate
    const float defaultTranslate[3] = {0,0,0};
    getRotationMatrix(yaw, pitch, roll, defaultTranslate, outMatrix);
  }
}


inline void multiplyMatrixVector(const float vector[4], const float matrix[4][4], float outvec[4]) {
  for (int i = 0; i < 4; i++) {
    outvec[i] = 0;
    for (int j = 0; j < 4; j++) {
      outvec[i] += vector[j] * matrix[j][i];
    }
  }
}


inline void project_point(const float vector[4], float projectionMatrix[4][4] , float outvec[4]) {
  multiplyMatrixVector(vector, projectionMatrix, outvec);
  if (outvec[3] != 0) {
    outvec[0] /= outvec[3];
    outvec[1] /= outvec[3];
    outvec[2] /= outvec[3];
  }
}

const float zFar = 1000;
const float zNear = 0.1;

float projectionMatrix[4][4] = {
  {1, 0, 0, 0},
  {0, 1, 0, 0},
  {0, 0, (zFar + zNear) / (zNear - zFar), (2 * zFar * zNear) / (zNear - zFar)},
  {0, 0, -1, 0}
};

const float points[8][3] = {
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
unsigned long currentTime;      // Tempo corrente
unsigned long previousTime = 0; // Tempo precedente
float deltaTime;                // Delta time in secondi


int windowHeight;
int windowWidth;

int halfWindowHeight;
int halfWindowWidth;

void setup(void) {
  Serial.begin(9600);
  Serial.println(F("TFT LCD test"));

#ifdef USE_Elegoo_SHIELD_PINOUT
  Serial.println(F("Using Elegoo 2.8\" TFT Arduino Shield Pinout"));
#else
  Serial.println(F("Using Elegoo 2.8\" TFT Breakout Board Pinout"));
#endif

  Serial.print("TFT size is "); Serial.print(tft.width()); Serial.print("x"); Serial.println(tft.height());
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
  projectionMatrix[0][0] = (float)windowHeight /(float)windowWidth;
  tft.fillScreen(BLACK);

  tft.setTextColor(GREEN);                // Set Text Proporties
  tft.setTextSize(2);
  tft.setCursor(40, 20);
  tft.println("Wireframe Cube"); 
}
bool drawPoints = false;
float angle = 0;

float projected_points[8][3] = {};
const float translation[3] = {0,0,25}; 
void loop(void) {
  currentTime = micros();              // Ottenere il tempo corrente in microsecondi
  deltaTime = (currentTime - previousTime) / 1000000.0; // Calcolare il delta time in secondi
  previousTime = currentTime;          // Aggiornare il tempo precedente

  for( int i=0;i<8;i++){
    float vector[4] = {points[i][0], points[i][1], points[i][2], 1};
    float outMatrix[4][4] = {};
    float transformated[4] = {};
    getRotationMatrix(angle,angle,angle,translation, outMatrix);
    multiplyMatrixVector(vector, outMatrix, transformated);
    float outvec[4] = {};
    project_point(transformated,projectionMatrix, outvec);

    // map to window coordinates (-1,1) -> (0,windowWidth)
    outvec[0] = (outvec[0] + 1) * halfWindowWidth;
    outvec[1] = (outvec[1] + 1) * halfWindowHeight;

    projected_points[i][0] = outvec[0];
    projected_points[i][1] = outvec[1];
    projected_points[i][2] = outvec[2];
  }
  if(drawPoints)
    for(int i=0; i<8;i++){
      // disegna 8 cerchi 
      tft.fillCircle(projected_points[i][0], projected_points[i][1], 2, WHITE);
    }
  
  // disegna 12 linee (4 * 3 linee per ciclo)
  for(int i=0;i<4;i++){
    int j = (i + 1) % 4;
    tft.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[j][0], projected_points[j][1], BLUE);
    tft.drawLine(projected_points[i + 4][0], projected_points[i + 4][1],
         projected_points[j + 4][0], projected_points[j + 4][1], RED);
    tft.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[i + 4][0], projected_points[i + 4][1], GREEN);
  }
  delayMicroseconds(deltaTime);

  for(int i=0;i<4;i++){
    int j = (i + 1) % 4;
    tft.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[j][0], projected_points[j][1], BLACK);
    tft.drawLine(projected_points[i + 4][0], projected_points[i + 4][1],
         projected_points[j + 4][0], projected_points[j + 4][1], BLACK);
    tft.drawLine(projected_points[i][0], projected_points[i][1],
         projected_points[i + 4][0], projected_points[i + 4][1], BLACK);
  }
  // fill circles in black
  if(drawPoints)
    for(int i=0; i<8;i++){
      tft.fillCircle(projected_points[i][0], projected_points[i][1], 2, BLACK);
    }
  angle += PI/12 * deltaTime * 5; 
  if(angle>=2*PI){
     angle = 0;
     drawPoints =!drawPoints;
  }
}

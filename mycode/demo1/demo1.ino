
#include <Elegoo_GFX.h>                   // Core graphics library
#include <Elegoo_TFTLCD.h>                // Hardware-specific library
#include <TouchScreen.h>                  // Touch Support

#define TS_MINX 920
#define TS_MINY 120
#define TS_MAXX 150
#define TS_MAXY 940
#define YP A3                             // must be an analog pin, use "An" notation!
#define XM A2                             // must be an analog pin, use "An" notation!
#define YM 9                              // can be a digital pin
#define XP 8                              // can be a digital pin

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

// macros for color (16 bit)
#define BLACK   0x0000
#define BLUE    0x001F
#define RED     0xF800
#define GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

#define LCD_CS A3                         // Chip Select goes to Analog 3
#define LCD_CD A2                         // Command/Data goes to Analog 2
#define LCD_WR A1                         // LCD Write goes to Analog 1
#define LCD_RD A0                         // LCD Read goes to Analog 0
#define LCD_RESET A4                      // Can alternately just connect to Arduino's reset pin

Elegoo_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);

void setup() {
  pinMode(13,OUTPUT);
  Serial.begin(9600);
  tft.reset();                            // Reset LCD
  tft.begin(0x9341);                      // Initialise LCD
  tft.fillScreen(BLACK);                  // Black Background
  tft.fillRect(0,0,240,160,GREEN);        // Upper GREEN Rectange
  tft.fillRect(0,160,240,160,RED);        // Lower RED Rectange
  tft.drawRect(0,0,240,160,WHITE);        // White borders to the rectangles
  tft.drawRect(0,160,240,160,WHITE);
  tft.setTextColor(WHITE);                // Set Text Proporties
  tft.setTextSize(2);
  tft.setCursor(80, 80);
  tft.println("Turn ON");                 // Write Text on LCD
  tft.setCursor(80, 240);
  tft.println("Turn OFF");
}
boolean led_state = false;
boolean old_state = false;
void loop() {
  TSPoint p = ts.getPoint();
  
  if (p.z > 10 && p.z < 1000)             // Check touch validity
  {
    p.x = map(p.x, TS_MINX, TS_MAXX, tft.width(), 0);
    p.y = map(p.y, TS_MINY, TS_MAXY, tft.height(), 0);
    if (p.x > 0 && p.x < 240)
    {
      if (p.y > 0 && p.y < 160)
      {
        old_state = led_state;
        led_state = true;   // Touched in Green rectangle
        digitalWrite(13,1);               
      } 
      else if (p.y > 160 && p.y < 320)
      {
        old_state = led_state; 
        led_state = false;               // Touched in RED rectangle
          
      } 
    }
    if(old_state!=led_state){
      //Serial.print("LED State changed to ");
      //Serial.println(led_state);  
      digitalWrite(13,led_state);   
    }
            // Print the status of the LED
  }
}
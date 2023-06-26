#ifndef _FRAME_BUFFER_H
#define _FRAME_BUFFER_H

#include "../Elegoo_GFX/Elegoo_GFX.h"
#include "../Elegoo_TFTLCD/Elegoo_TFTLCD.h"

class FrameBuffer : public Elegoo_GFX {
public:
  FrameBuffer(int16_t w, int16_t h);
  ~FrameBuffer();
  void drawPixel(int16_t x, int16_t y, uint16_t color) override;
  
  void drawBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor);
  void drawBuffer(Elegoo_TFTLCD *tft, int16_t scaleX, int16_t scaleY);

  void drawFastHLinesBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor);
  void drawFastVLinesBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor);
  

  void drawBufferSlowTecnique(Elegoo_TFTLCD *tft, int16_t scaleFactor);
  
  void resetBuffer();
  byte* bufferPointer;
  void setMode8bitColor();
  void setMode8bitGrayScale();
private:
  inline uint16_t read16bitColorFromBuffer(uint32_t index);
  byte _mode;
};

#endif 

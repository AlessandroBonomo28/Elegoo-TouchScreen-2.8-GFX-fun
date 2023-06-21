#ifndef _FRAME_BUFFER_H
#define _FRAME_BUFFER_H

#include "../Elegoo_GFX/Elegoo_GFX.h"
#include "../Elegoo_TFTLCD/Elegoo_TFTLCD.h"

class FrameBuffer : public Elegoo_GFX {
public:
  FrameBuffer(int16_t w, int16_t h);
  ~FrameBuffer();
  void drawPixel(int16_t x, int16_t y, uint16_t color) override;
  void drawBuffer(Elegoo_TFTLCD *tft);
  void resetBuffer();
  byte* bufferPointer;
private:
  
};

#endif 

#include "FrameBuffer.h"

FrameBuffer::FrameBuffer(int16_t w, int16_t h) : Elegoo_GFX(w, h) {
  // (viene chiamato prima il costruttore di elegoo_GFX e poi questo)
  bufferPointer = new byte[_width * _height]; // Allocazione del buffer array
  resetBuffer();
  setMode8bitColor();
}

FrameBuffer::~FrameBuffer() {
  delete[] bufferPointer; // Deallocazione del buffer array nel distruttore
}

void FrameBuffer::setMode8bitColor(){
  _mode = 1;
}

void FrameBuffer::setMode8bitGrayScale(){
  _mode = 0;
}

void FrameBuffer::drawPixel(int16_t x, int16_t y, uint16_t color) {
  if((x < 0) || (y < 0) || (x >= _width) || (y >= _height)) return;
  uint32_t index = y * _width + x;
  bufferPointer[index] = color;
}


inline uint16_t FrameBuffer::read16bitColorFromBuffer(uint32_t index) {
  byte color8bit = bufferPointer[index];
  if (_mode == 1) {
    // RGB mode (0-255)
    uint16_t color16bit = static_cast<uint16_t>(color8bit) << 8;
    color16bit |= color8bit;
    return color16bit;
  } else {
    // Grayscale mode
    return ((color8bit >> 3) << 11) | ((color8bit >> 2) << 5) | (color8bit >> 3);
  }
}

void FrameBuffer::drawFastVLinesBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  uint16_t last_color;
  uint16_t last_x;
  uint32_t index;
  
  for (int16_t x = 0; x < _width; x++) {
    index = x;
    last_color = read16bitColorFromBuffer(index);
    last_x = 0;
    
    for (int16_t y = 0; y < _height; y++) {
      index = y * _width + x;
      
      if (last_color != read16bitColorFromBuffer(index) || y == _height - 1) {
        tft->drawFastVLine(x * scaleFactor, last_x * scaleFactor, (y - last_x + 1) * scaleFactor, last_color);
        last_x = y + 1;
        last_color = read16bitColorFromBuffer(index);
      }
    }
  }
}



void FrameBuffer::drawFastHLinesBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  uint16_t last_color;
  uint16_t last_x;
  uint32_t index;
  for (int16_t y = 0; y < _height; y++) {
    index = y * _width;
    last_color = read16bitColorFromBuffer(index);
    last_x=0;
    for (int16_t x = 0; x < _width; x ++) {
       index = y * _width + x ;
      
      if(last_color!= read16bitColorFromBuffer(index) || x == _width-1){
        tft->drawFastHLine(last_x*scaleFactor, y*scaleFactor, (x-last_x)*scaleFactor, last_color);
        last_x = x;
        last_color = read16bitColorFromBuffer(index);
      }
    }
  }
}

void FrameBuffer::drawBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  drawBuffer(tft, scaleFactor, scaleFactor);
}


void FrameBuffer::drawBuffer(Elegoo_TFTLCD *tft, int16_t scaleX, int16_t scaleY) {
  uint16_t last_color;
  uint16_t last_x;
  uint32_t index;
  for (int16_t y = 0; y < _height; y++) {
    index = y * _width;
    last_color = read16bitColorFromBuffer(index);
    last_x=0;
    for (int16_t x = 0; x < _width; x ++) {
       index = y * _width + x ;
      
      if(last_color!= read16bitColorFromBuffer(index) || x == _width-1){
        tft->fillRect(last_x*scaleX, y*scaleY, (x-last_x)*scaleX, scaleY, last_color);
        last_x = x;
        last_color = read16bitColorFromBuffer(index);
      }
    }
  }
}

void FrameBuffer::drawBufferSlowTecnique(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  for (int16_t y = 0; y < _height; y ++) {
    for (int16_t x = 0; x < _width; x ++) {
      uint32_t index = y * _width + x;
      uint16_t color16bit = read16bitColorFromBuffer(index);

      tft->fillRect(x*scaleFactor, y*scaleFactor, scaleFactor, scaleFactor, color16bit);
    }
  }
}

void FrameBuffer::resetBuffer() {
  memset(bufferPointer, 0, _width * _height * sizeof(byte));
}

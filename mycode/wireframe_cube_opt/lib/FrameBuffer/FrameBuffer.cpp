#include "FrameBuffer.h"

FrameBuffer::FrameBuffer(int16_t w, int16_t h) : Elegoo_GFX(w, h) {
  // (viene chiamato prima il costruttore di elegoo_GFX e poi questo)
  bufferPointer = new uint8_t[_width * _height]; // Allocazione del buffer array
  resetBuffer();
}

FrameBuffer::~FrameBuffer() {
  delete[] bufferPointer; // Deallocazione del buffer array nel distruttore
}

void FrameBuffer::drawPixel(int16_t x, int16_t y, uint16_t color) {
  if((x < 0) || (y < 0) || (x >= _width) || (y >= _height)) return;
  uint32_t index = y * _width + x;
  bufferPointer[index] = color;
}

void FrameBuffer::drawBuffer(Elegoo_TFTLCD *tft) {
  for (int16_t y = 0; y < _height; y++) {
    for (int16_t x = 0; x < _width; x++) {
      uint32_t index = y * _width + x;
      uint8_t color = bufferPointer[index];
      if (color == 0) {
        color = 0x0000; // default black
      }
      tft->drawPixel(x, y, color);
    }
  }
}

void FrameBuffer::resetBuffer() {
  memset(bufferPointer, 0x0000, _width * _height * sizeof(uint8_t));
}

char* FrameBuffer::hello() {
  // ritorna _width e _height
  char* buffer = new char[100];
  sprintf(buffer, "Hello from FrameBuffer: %d x %d", _width, _height);
  return buffer;
}

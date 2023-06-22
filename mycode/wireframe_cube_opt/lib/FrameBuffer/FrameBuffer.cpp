#include "FrameBuffer.h"

FrameBuffer::FrameBuffer(int16_t w, int16_t h) : Elegoo_GFX(w, h) {
  // (viene chiamato prima il costruttore di elegoo_GFX e poi questo)
  bufferPointer = new byte[_width * _height]; // Allocazione del buffer array
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

void FrameBuffer::drawBuffer(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  int16_t scaledWidth = _width * scaleFactor;
  int16_t scaledHeight = _height * scaleFactor;

  for (int16_t y = 0; y < scaledHeight; y += scaleFactor) {
    for (int16_t x = 0; x < scaledWidth; x += scaleFactor) {
      uint32_t index = y / scaleFactor * _width + x / scaleFactor;
      byte color = bufferPointer[index];

      tft->fillRect(x, y, scaleFactor, scaleFactor, color);
    }
  }
}

void FrameBuffer::drawBufferUsingFastLines(Elegoo_TFTLCD *tft, int16_t scaleFactor) {
  int16_t scaledWidth = _width * scaleFactor;
  int16_t scaledHeight = _height * scaleFactor;

  for (int16_t y = 0; y < scaledHeight; y += scaleFactor) {
    for (int16_t x = 0; x < scaledWidth; x += scaleFactor) {
      uint32_t index = y / scaleFactor * _width + x / scaleFactor;
      byte color = bufferPointer[index];

      tft->drawFastVLine(x, y , scaleFactor, color);
    }
  }
}


void FrameBuffer::drawBuffer(Elegoo_TFTLCD *tft, int16_t rectWidth, int16_t rectHeight) {
  int16_t scaledWidth = _width * rectWidth;
  int16_t scaledHeight = _height * rectHeight;

  for (int16_t y = 0; y < scaledHeight; y += rectHeight) {
    for (int16_t x = 0; x < scaledWidth; x += rectWidth) {
      uint32_t index = y / rectHeight * _width + x / rectWidth;
      byte color = bufferPointer[index];

      tft->fillRect(x, y, rectWidth, rectHeight, color);
    }
  }
}




void FrameBuffer::resetBuffer() {
  memset(bufferPointer, 0, _width * _height * sizeof(byte));
}

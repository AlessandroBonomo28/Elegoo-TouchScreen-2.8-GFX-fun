#include <iostream>
#include <iomanip>
#include <fstream>

uint16_t convert16b(uint8_t color8bit) {
    uint16_t color16bit = static_cast<uint16_t>(color8bit) << 8;
    color16bit |= color8bit;
    return color16bit;
}

int main() {
    std::ofstream outputFile("colors.txt");
    if (outputFile.is_open()) {
        for (int color = 0; color <= 255; color++) {
            uint8_t color8bit = static_cast<uint8_t>(color);
            uint16_t convertedColor = convert16b(color8bit);
            outputFile << std::setfill('0') << std::setw(2) << std::hex << static_cast<int>(color8bit) << ":0x" << std::setfill('0') << std::setw(4) << convertedColor << std::endl;
        }
        outputFile.close();
        std::cout << "Output saved to colors.txt" << std::endl;
    }
    else {
        std::cout << "Unable to open the file." << std::endl;
    }

    return 0;
}

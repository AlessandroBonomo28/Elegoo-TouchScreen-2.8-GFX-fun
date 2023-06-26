# Elegoo 2.8 Inch Touch Screen Control Code

Questo repository contiene il codice necessario per controllare lo shield touchscreen Elegoo 2.8 pollici. Lo shield è compatibile con Arduino.

## Documentazione

Nella cartella "Elegoo 2.8 Inch Touch Screen User Manual V1.00.2019.12.06" è presente la documentazione ufficiale dello shield. Al suo interno troverai gli esempi forniti da Elegoo, oltre alle librerie necessarie per il corretto funzionamento. È importante includere queste librerie nel tuo progetto Arduino.

## Utilizzo delle librerie

Per includere le librerie nel tuo progetto Arduino, segui i seguenti passaggi:

1. Copia la cartella della libreria desiderata (ad esempio "Elegoo_GFX" o "Elegoo_TFTLCD") nella cartella "libraries" del tuo ambiente di sviluppo Arduino.
2. Riavvia l'IDE di Arduino, se è già in esecuzione.
3. Seleziona il tuo schetch principale (main.ino) e vai su "Sketch" -> "Include Library" per includere la libreria desiderata nel tuo progetto.

Ricorda che il nome del file principale (main.ino) dovrebbe avere lo stesso nome della directory genitore. Tutti i file nella stessa directory del file principale (main.ino) verranno considerati librerie di supporto per il progetto.

Gli altri progetti che troverai nella cartella "mycode" saranno progetti sviluppati nell'IDE **Platformio**

## Struttura del progetto

La struttura del progetto è la seguente:

```
├── Elegoo 2.8 Inch Touch Screen User Manual V1.00.2019.12.06
│   ├── Arduinotest code instruction.txt
│   ├── Elegoo 2.8 inch Touch Screen User Manual（Arduino-Deutsche）V1.00.2017.06.01.pdf
│   ├── Elegoo 2.8 inch Touch Screen User Manual（Arduino-English）V1.00.2017.04.12.pdf
│   ├── Example01-Simple test
│   ├── Example02-DisplayString
│   ├── Example03-graphicstest
│   ├── Example04-Touch
│   ├── Example05-ShowBMP
│   ├── Example06-Phonecal
│   └── Install libraries
│       ├── Elegoo_GFX
│       ├── Elegoo_TFTLCD
│       └── TouchScreen
├── LICENSE
├── README.md
└── mycode
    └── demo1
        ├── demo1.ino
        └── functions.ino
```

Nella cartella "Elegoo 2.8 Inch Touch Screen User Manual V1.00.2019.12.06" troverai la documentazione ufficiale e le librerie necessarie per utilizzare lo shield touchscreen Elegoo 2.8 pollici.

La cartella "mycode" contiene gli sketch di esempio personalizzati. Per utilizzarli, apri il file .ino corrispondente utilizzando l'IDE di Arduino. Il nome del file .ino principale dovrebbe essere identico al nome della directory genitore. Eventuali file aggiuntivi presenti nella stessa directory verranno considerati librerie di supporto.

## Nota 
*Se il caricamento del codice impiega troppo tempo probabilmente c'è un problema con la comuncazione seriale, io ho risolto cambiando porta usb (cambiando COM).*

*Readme automaticamente generato da ChatGPT*

## Riferimenti
http://codeofthedamned.com/index.php/3d-projection-and-matrix-transforms

https://en.wikipedia.org/wiki/Rotation_matrix

https://www.makeritalia.org/tutorial/2019/06/13/ottimizzare-sram-arduino/

https://en.wikipedia.org/wiki/8-bit_color

formula (r,g,b)-> 16 bit: https://stackoverflow.com/questions/13720937/c-defined-16bit-high-color

https://stackoverflow.com/questions/6482089/are-there-standard-8-bit-color-palettes

https://www.rapidtables.com/web/color/RGB_Color.html

CAMERA SPACE : https://learnopengl.com/Getting-started/Camera

https://webtocom.com/demo/divisori/

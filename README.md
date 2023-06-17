# README - Elegoo 2.8 Inch Touch Screen Control Code

Questo repository contiene il codice necessario per controllare lo shield touchscreen Elegoo 2.8 pollici. Lo shield è compatibile con Arduino.

## Documentazione

Nella cartella "Elegoo 2.8 Inch Touch Screen User Manual V1.00.2019.12.06" è presente la documentazione ufficiale dello shield. Al suo interno troverai gli esempi forniti da Elegoo, oltre alle librerie necessarie per il corretto funzionamento. È importante includere queste librerie nel tuo progetto Arduino.

## Utilizzo delle librerie

Per includere le librerie nel tuo progetto Arduino, segui i seguenti passaggi:

1. Copia la cartella della libreria desiderata (ad esempio "Elegoo_GFX" o "Elegoo_TFTLCD") nella cartella "libraries" del tuo ambiente di sviluppo Arduino.
2. Riavvia l'IDE di Arduino, se è già in esecuzione.
3. Seleziona il tuo schetch principale (main.ino) e vai su "Sketch" -> "Include Library" per includere la libreria desiderata nel tuo progetto.

Ricorda che il nome del file principale (main.ino) dovrebbe avere lo stesso nome della directory genitore. Tutti i file nella stessa directory del file principale (main.ino) verranno considerati librerie di supporto per il progetto.

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
Se il caricamento del codice impiega troppo tempo probabilmente ec'è un problema con la comuncazione seriale, io ho risolto cambiando porta usb (cambiando com)
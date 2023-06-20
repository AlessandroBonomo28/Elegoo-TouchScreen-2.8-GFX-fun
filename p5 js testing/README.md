# Scripts p5 js
Questi script permettono di fare testing grafici. p5 è una libreria molto semplice per disegnare a schermo. Necessita solo di un broser 
(https://editor.p5js.org/)[Link per online p5 editor]

## Note 

### Ottimizzazione prestazioni

- inline nelle funzioni piccole per suggerire al compilatore di ottimizzare al funzione.
- dichiarazioni di variabili fuori dal loop per non allocare continuamente spazio.
- tecnica frame buffer
- drawFastline (funziona solo per linee orizzontali e verticali quindi non diagonali)
- invece di pulire tutto lo schermo 
### Right and left handed coordinate systems

(https://www.evl.uic.edu/ralph/508S98/coordinates.html)[articolo che spiega come distinguere left handed da right handed]
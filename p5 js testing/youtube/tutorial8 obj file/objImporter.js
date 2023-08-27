class ObjImporter{
  constructor(){
    this.importDone = false;
    this.triangoli = [];
    this.vertici = [];
    let fileInput = createFileInput(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        this.importDone = false;
        this.triangoli = [];
        this.vertici = [];
        this.parseData(data);
        this.importDone = true;
        print(this.triangoli.length+" triangles imported.");
      };
      reader.readAsText(file.file);
    });
  }

  parseData(data){
    let inputStr = data 
    let charK = '\n';
    let i=0, j = 0;

    while ((j = inputStr.indexOf(charK, i)) !== -1) {
      this.parseLine(inputStr.substring(i, j))
      i = j + 1;
    }
    this.parseLine(inputStr.substring(i))
  }
   parseVertex(data){
    let splitted = data.split(' ')
    this.vertici.push(splitted)
  }
  
  parseFace(data){
    let splitted = data.split(' ')
    let triRead = [];
    for(let i =0;i<splitted.length;i++){
      if(splitted[i].includes('/')){
        let slashSplit = splitted[i].split('/');
        triRead = [...triRead, ...this.vertici[slashSplit[0]-1]];
      } else {
        triRead = [...triRead, ...this.vertici[splitted[i]-1]];
      }
    }
    //print(triRead)
    this.triangoli.push(triRead);
  }
  
  parseLine(lineData){
    if(lineData[0]=='v' && lineData[1]!='n' && lineData[1]!='t'){
      this.parseVertex(lineData.substring(2))
    } else if(lineData[0] == 'f'){
      this.parseFace(lineData.substring(2))
    }
  }
}
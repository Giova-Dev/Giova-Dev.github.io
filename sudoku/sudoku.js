
function disegna(){
    
    let table = document.getElementById("mainTable");
    
    for(let i = 0; i < 9; i++){
        
        let tr = document.createElement("tr");
        
        for(let j = 0; j < 9; j++){
            
            let td = document.createElement("td");
            
            if(j % 3 == 0){
                td.style.borderLeft = "5px solid black";
            }
            
            if(j == 8){
                td.style.borderRight = "5px solid black";
            }
            
            if(i % 3 == 0){
                td.style.borderTop = "5px solid black";
            }
            
            if(i == 8){
                td.style.borderBottom = "5px solid black";
            }
            
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
}


//var vec = [[]];         // rappresenta l'intera tabella 9x9
var vec = Array.from({ length: 9 }, () => Array(9).fill(null));
var microTable = Array.from({ length: 9 }, () => Array(9).fill(null));  // ogni riga rappresenta una delle 9 micro tabelle 3x3

var i = 0;

var numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
var numPassi = 0;       // contatore passi senza interruzione
var numInterr = 0;      // contatore passi interrotti

// DEBUG
var res = 0;
var media;
var tentativi = 0;


function benchMark(){
    pulisciBenchMark();
    let tentativi = parseInt(prompt("Inserisci il numero di tentativi:"));
    let limite = parseInt(prompt("Inserisci il limite:"));
    let passi = parseInt(prompt("Inserisci il numero di passi:"));
    let interruzioni = parseInt(prompt("Inserisci il numero di interruzioni:"));
    
    for(let i = 0; i < tentativi; i++)
    start(limite, passi, interruzioni);
    
    document.getElementById("stats").textContent = "limite: " + limite + ', passi: ' + passi + ', interruzioni: ' + interruzioni;
}

function pulisciBenchMark(){
    // BENCHMARK
    res = 0;
    media = null;
    tentativi = 0;
}


function start(DEBUG_lim, DEBUG_pass, DEBUG_int){
    
    pulisci();
    
    // riga: vec[i / 9].includes(n)
    // colonna: myColContains(vec, i % 9, n)
    // quadrato: microTable[myIndexToSubtable(i)].includes(n)
    
    document.getElementById("result").textContent = "Riusciti: "+ res;
    document.getElementById("media").textContent = "Media: "+ media;
    document.getElementById("tent").textContent = "Tentativi: "+ (++tentativi);
    
    
    let debugPassi = 0;
    
    let td = document.querySelectorAll('#mainTable td');
    
    const def = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    while(i < 81){
        
        if(debugPassi++ > DEBUG_lim){
            console.log("\n LIMITE MASSIMO \n");
            if(media == null){
                media = i;
            } else{
                media = (media * (tentativi - 1) + 1 + i)/(tentativi);
            }
            return;
        }

        let escludi = union(union(union(vec[Math.floor(i / 9)], myColContains(vec, i % 9)), microTable[myIndexToSubtable(i)]), numEscludi[Math.floor(i / 9)]);
        
        let aux = myArrayRand(substrac(def, escludi));
        
        if(aux != null){
            vec[Math.floor(i / 9)][i % 9] = aux;
            microTable[myIndexToSubtable(i)][myIndexToSubtableCell(i)] = aux;
            
            td[i].textContent = aux;
            
            i++;
            
            numPassi++;
            
            if(numPassi > DEBUG_pass || numInterr > DEBUG_int){
                numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
                numInterr = 0;
            }
            
            // cambio riga
            if(Math.floor(i / 9) != Math.floor((i + 1) / 9)){
                numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
                numInterr = 0;
            }
            
            console.log("i: ", i, ", numPassi: ", numPassi);            
        } else{
            console.log("Passo indietro");
            console.log("numEscludi: ", numEscludi[Math.floor(i / 9)]);
            console.log("numInterr: ", numInterr);
            passoIndietro(td, DEBUG_pass, DEBUG_int);
        }
    }
    if(media == null){
        media = i;
    } else{
        media = (media * (tentativi - 1) + 1 + i)/(tentativi);
    }
    res += 1;
    console.log(res);
}

function passoIndietro(td, DEBUG_pass, DEBUG_int){
    // console.log("Eseguo passo indietro");

    numPassi = 0;
    numInterr++;
    i--;
    
    
    if(numPassi > DEBUG_pass || numInterr > DEBUG_int){
        numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
        numInterr = 0;
    }
    
    // cambio riga
    if(Math.floor(i / 9) != Math.floor((i + 1) / 9)){
        numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
        numInterr = 0;
    }
    
    const lastNum = vec[Math.floor(i / 9)][i % 9];
    console.log("lastNum: ", lastNum);
    
    console.log("before push:\n", numEscludi[Math.floor(i / 9)]);
    numEscludi[Math.floor(i / 9)].push(lastNum);
    console.log("after push:\n", numEscludi[Math.floor(i / 9)]);
    
    vec[Math.floor(i / 9)][i % 9] = null;
    microTable[myIndexToSubtable(i)][myIndexToSubtableCell(i)] = null;
    
    td[i].textContent = null;
    
}

function pulisci(){
    let td = document.querySelectorAll('#mainTable td');
    
    for(let i = 0; i < td.length; i++)
    td[i].textContent = null;
    
    vec = Array.from({ length: 9 }, () => Array(9).fill(null));
    microTable = Array.from({ length: 9 }, () => Array(9).fill(null));  // ogni riga rappresenta una delle 9 micro tabelle 3x3
    
    i = 0;
    
    numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
    numPassi = 0;  
    numInterr = 0;
}

/*
let td = document.querySelectorAll('#mainTable td');

for(let i = 0; i < 81; i++){
    let n = myRand(0, 9);
    
    // un numero non può essere contenuto 2 volte nella stessa riga
    vec[i / 9].includes(n)
    
    // un numero non può essere contenuto 2 volte nella stessa colonna
    myColContains(vec, i % 9, n)
    
    // un numero non può essere contenuto 2 volte nella stessa cella 3x3
    microTable[myIndexToSubtable(i)].includes(n)
    
    
    // condizioni passo indietro
    
    
    // passo indietro
    vec[i / 9].splice(i%9, 1)
    microTable[myIndexToSubtable(i)].pop()
    i--
}
*/



// FUNZIONI DI UTILITA'

function myIndexToSubtable(cellIndex) {
    // dato un indice restituisce il numero di subTable in cui tale indice è situato
    
    const row = Math.floor(Math.floor(cellIndex / 9));
    const col = cellIndex % 9;
    
    
    const subTableRow = Math.floor(row / 3);
    const subTableCol = Math.floor(col / 3);
    
    const subTableIndex = subTableRow * 3 + subTableCol;
    
    return subTableIndex;
}

function myIndexToSubtableCell(cellIndex){
    // dato un indice restituisce l'indice realtivo alla subTable in cui è situato
    
    const current_row = Math.floor(Math.floor(cellIndex / 9));
    const subTable_row = Math.floor(Math.floor(cellIndex % 3));
    
    const subTableIndex = subTable_row + current_row * 3;
    
    return subTableIndex;
}

/*
DA RIMUOVERE

function myColContains(matrice, indiceColonna, elemento) {
    const colonna = matrice.map(row => row[indiceColonna]);
    return colonna.includes(elemento);
}
*/

function myColContains(matrice, indiceColonna) {
    // data una matrice ed un indice di colonna restituisce gli elementi di tale colonna
    const colonna = matrice.map(row => row[indiceColonna]);
    return colonna;
}


function myRand(min, max) {
    // genera un numero casuale fra min e max compresi
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function myArrayRand(arr) {
    // resistuisce un elemento casuale dell'array
    if (arr.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// operazioni su insiemi (array visti come insiemi)

function union(arr1, arr2){
    return [...new Set([...arr1, ...arr2])];
}

function intersec(arr1, arr2){
    return arr1.filter(element => arr2.includes(element));
}

function substrac(arr1, arr2){
    return arr1.filter(element => !arr2.includes(element));
}
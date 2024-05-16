
function disegna(){
    
    let table = document.getElementById("mainTable");
    
    for(let i = 0; i < 9; i++){
        
        let tr = document.createElement("tr");
        
        for(let j = 0; j < 9; j++){
            
            let td = document.createElement("td");
            td.contentEditable = true;
            td.addEventListener("input", function() { // Aggiungi un gestore di eventi input
                checkNumber(this, i, j); // Richiama la funzione checkNumber passando la cella modificata e il suo indice
            });
            
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
    
    for(let i = 0; i < tentativi; i++)
    start();
}

function pulisciBenchMark(){
    // BENCHMARK
    res = 0;
    media = null;
    tentativi = 0;
}

// SCOPRI
function scopri(){
    /*
    1) i numeri iniziali devono formare uno
    schema simmetrico rispetto al centro
    della griglia;
    2) deve esistere una unica soluzione;
    3) i numeri iniziali dovrebbero essere
    meno di 30
    */
    let td = document.querySelectorAll('#mainTable td');
    let num = Array.from(Array(81).keys());
    
    for(let i = 0; i < myRand(17, 20); i++){
        let aux = myArrayRand(num);
        
        let index = num.indexOf(aux);
        if (index !== -1) {
            num.splice(index, 1);
        }
        console.log("num: ", num);

        td[aux].textContent = vec[Math.floor(aux / 9)][aux % 9];
        td[aux].contentEditable = false;
        
        let mirrored = mirror(aux);
        td[mirrored].textContent = vec[Math.floor(mirrored / 9)][mirrored % 9];
        td[mirrored].contentEditable = false;
    }
}

function mirror(index){
    const row = Math.floor(index / 9);
    const col = index % 9;
    
    const mirroredRow = 8 - row;
    const mirroredCol = 8 - col;
    
    return mirroredRow * 9 + mirroredCol;
}

function checkNumber(cell, i, j) {
    var value = parseInt(cell.innerText);
    if (!isNaN(value)) {
        if(value == vec[i][j]){
            cell.style.backgroundColor = "green";
        } else{
            cell.style.backgroundColor = "red";
        }
    } else{
        cell.style.backgroundColor = "white";
    }
}

// FINE SCOPRI

function start(){
    
    pulisci();
    
    // riga: vec[i / 9].includes(n)
    // colonna: myColContains(vec, i % 9, n)
    // quadrato: microTable[myIndexToSubtable(i)].includes(n)
    
    document.getElementById("result").textContent = "Riusciti: "+ res;
    document.getElementById("media").textContent = "Media: "+ media;
    document.getElementById("tent").textContent = "Tentativi: "+ (++tentativi);
    
    let td = document.querySelectorAll('#mainTable td');
    
    const def = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    while(i < 81){
        
        let escludi = union(union(union(vec[Math.floor(i / 9)], myColContains(vec, i % 9)), microTable[myIndexToSubtable(i)]), numEscludi[Math.floor(i / 9)]);
        
        let aux = myArrayRand(substrac(def, escludi));
        
        if(aux != null){
            vec[Math.floor(i / 9)][i % 9] = aux;
            microTable[myIndexToSubtable(i)][myIndexToSubtableCell(i)] = aux;
            
            //    td[i].textContent = aux;
            
            i++;
            
        } else{
            console.log("aux: ", aux, ", pos: ", i, "\nInizio passo indietro");
            if(!passoIndietro(td)){
                if(media == null){
                    media = i;
                } else{
                    media = (media * (tentativi - 1) + 1 + i)/(tentativi);
                }
                start();
                return;
            };
        }
    }
    if(media == null){
        media = i;
    } else{
        media = (media * (tentativi - 1) + 1 + i)/(tentativi);
    }
    res += 1;
    console.log(res);

    scopri();
}

function passoIndietro(td){
    console.clear();
    console.log("Passo indietro");
    
    const def = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    let rowEmpty = true;
    
    let freezed = Array(9).fill(false);
    let newCycle = true;
    
    let posVuota = i;
    let escludi_start = union(union(myColContains(vec, i % 9), microTable[myIndexToSubtable(i)]), numEscludi[Math.floor(i / 9)]);
    
    let DEBUG_counter = 0;
    
    if(Math.floor(i / 9) == Math.floor((i + 1)/ 9)){
        i++;
    }
    
    while(rowEmpty && i > 0){
        
        DEBUG_counter++;
        if(DEBUG_counter > 30){
            return false;
        }
        
        console.log("pos: ", i, "\n counter: ", DEBUG_counter);
        
        if(Math.floor(i / 9) == Math.floor(posVuota/ 9)){            // passo cella successiva, se rimango sulla stessa riga
            
            let mancanti = substrac(def, vec[Math.floor(i / 9)]);
            
            if(mancanti.length === 0){
                console.log("Mancanti vuoto: ", mancanti);
                rowEmpty = false;
                break;
            }
            
            // provo ad inserire i mancanti nella cella successiva
            let escludi = union(union(myColContains(vec, i % 9), microTable[myIndexToSubtable(i)]), numEscludi[Math.floor(i / 9)]);
            let aux = myArrayRand(substrac(mancanti, escludi));
            
            //console.log("Mancanti: ", mancanti);
            //console.log("Escludi: ", escludi);
            
            console.log("aux: ", aux);
            // console.log("freezed: ", freezed[Math.floor(i % 9)]);
            
            if(aux != null && !freezed[Math.floor(i % 9)]){
                
                console.log("Vettore prima: ", vec[Math.floor(i / 9)]);
                
                // considero la posizione di partenza
                const oldNum = vec[Math.floor(i / 9)][i % 9];
                
                // considero la posizione corrente
                if(newCycle){
                    freezed[Math.floor(i % 9)] = true;              // la cella non può più essere cambiata, solo se ho ricominciato il ciclo
                    newCycle = false;
                }
                vec[Math.floor(i / 9)][i % 9] = aux;
                microTable[myIndexToSubtable(i)][myIndexToSubtableCell(i)] = aux;
                
                //    td[i].textContent = aux;
                
                console.log("Vettore dopo: ", vec[Math.floor(i / 9)]);
                
                if(!escludi_start.includes(oldNum)) {
                    freezed[Math.floor(posVuota / 9)] = true;              // la cella non può più essere cambiata
                    
                    vec[Math.floor(posVuota / 9)][posVuota % 9] = oldNum;
                    microTable[myIndexToSubtable(posVuota)][myIndexToSubtableCell(posVuota)] = oldNum;
                    
                    //td[posVuota].textContent = oldNum;
                    
                }
                
            } else{
                console.log("Nessun inserimento");
            }   
            
            i++;
            
        } else{          
            i--;        // torno nell'ultima cella della riga precedente
            newCycle = true;
            
            console.log("ricomincio la riga");                              
            i = Math.floor(i / 9) * 9;      
        }
    }
    
    i = Math.floor(i / 9) * 9 + 9;  // nuova riga
    console.log("FINE PASSO INDIETRO, i: ", i);
    return true;
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
    
    console.clear();
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
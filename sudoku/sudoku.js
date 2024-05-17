

function disegna(){
    
    let table = document.getElementById("mainTable");
    
    for(let i = 0; i < 9; i++){
        
        let tr = document.createElement("tr");
        
        for(let j = 0; j < 9; j++){
            
            let td = document.createElement("td");
            td.contentEditable = false;
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

var completati = 0;

// TROVA COPPIE

function coppie_verticali(td, num){
    
    console.clear();
    
    let rimossi = 0;
    
    let index_1 = 0;
    let index_2 = index_1 + 9;
    
    let cur_index_1 = 3;
    let cur_index_2 = cur_index_1 + 9;
    
    for(let sub = 0; sub < 3; sub++){                           //per ogni sottocella
        for(let x = 0; x < 6; x++){                                  // per ogni colonna
            for(let k = 0; k < 3; k++){                                 // 3 combinazioni possibili
                //console.log("Combinazione ", k + 1);
                
                index_1 = x + (k%2) * 9 + sub * 27;
                index_2 = x + (k%2 + 1) * 9 + sub * 27 + Math.floor(k/2) * 9;
                
                cur_index_1 = (Math.floor(index_1/3) + 1) * 3;
                cur_index_2 = (Math.floor(index_2/3) + 1) * 3 ;
                
                for(let j = 0; j < (6 - Math.floor((index_1%9)/3) * 3); j++){         //controllo righe
                    
                    let num1 = vec[Math.floor(index_1/9)][index_1%9];
                    let num2 = vec[Math.floor(index_2/9)][index_2%9];
                    let cur_num1 =  vec[Math.floor(cur_index_1/9)][cur_index_1%9];
                    let cur_num2 =  vec[Math.floor(cur_index_2/9)][cur_index_2%9];
                    
                    if(num1 == cur_num2 && num2 == cur_num1){
                        // coppia
                        
                        // scopri uno fra i 4
                        let __aux = myArrayRand([index_1, index_2, cur_index_1, cur_index_2]);
                        let __index = num.indexOf(__aux);
                        if (__index !== -1) {
                            num.splice(__index, 1);
                        }
                        td[__aux].textContent = vec[Math.floor(__aux / 9)][__aux % 9];
                        td[__aux].contentEditable = false;
                        
                        let mirrored = mirror(__aux);
                        td[mirrored].textContent = vec[Math.floor(mirrored / 9)][mirrored % 9];
                        td[mirrored].contentEditable = false;
                        
                        rimossi++;
                        
                        break;
                    } else if(num1 == cur_num2 || num2 == cur_num1){
                        // coppia impossibile
                        console.log("COPPIA IMPOSSIBILE");
                        break;
                    }
                    
                    cur_index_1++;
                    cur_index_2++;
                }
            }
        }
    }
    
    return rimossi;
}


function coppie_orizzontali(td, num){
    
    console.clear();
    
    let rimossi = 0;
    
    let index_1 = 0;
    let index_2 = index_1 + 9;
    
    let cur_index_1 = 3;
    let cur_index_2 = cur_index_1 + 9;
    
    for(let sub = 0; sub < 3; sub++){                           //per ogni sottocella
        for(let x = 0; x < 6; x++){                                  // per ogni riga
            for(let k = 0; k < 3; k++){                                 // 3 combinazioni possibili
                //console.log("Combinazione ", k + 1);
                
                index_1 = x * 9 + (k%2) + sub * 3;
                index_2 = x * 9 + (k%2 + 1) + sub * 3 + Math.floor(k/2);
                
                cur_index_1 = (Math.floor(index_1/27) + 1) * 27 + index_1%9;
                cur_index_2 = (Math.floor(index_2/27) + 1) * 27 + index_2%9;
                
                console.log(index_1 +" " + Math.floor(index_1/27));
                for(let j = 0; j < (6 - Math.floor(index_1/27) * 3); j++){         //controllo righe
                    
                    let num1 = vec[Math.floor(index_1/9)][index_1%9];
                    let num2 = vec[Math.floor(index_2/9)][index_2%9];
                    let cur_num1 =  vec[Math.floor(cur_index_1/9)][cur_index_1%9];
                    let cur_num2 =  vec[Math.floor(cur_index_2/9)][cur_index_2%9];
                    
                    if(num1 == cur_num2 && num2 == cur_num1){
                        // coppia
                        
                        // scopri uno fra i 4
                        let __aux = myArrayRand([index_1, index_2, cur_index_1, cur_index_2]);
                        let __index = num.indexOf(__aux);
                        if (__index !== -1) {
                            num.splice(__index, 1);
                            
                            td[__aux].textContent = vec[Math.floor(__aux / 9)][__aux % 9];
                            td[__aux].contentEditable = false;
                            
                            let mirrored = mirror(__aux);
                            td[mirrored].textContent = vec[Math.floor(mirrored / 9)][mirrored % 9];
                            td[mirrored].contentEditable = false;
                            
                            rimossi++;
                        }
                        
                        
                        break;
                    } else if(num1 == cur_num2 || num2 == cur_num1){
                        // coppia impossibile
                        console.log("COPPIA IMPOSSIBILE");
                        break;
                    }
                    
                    cur_index_1 += 9;
                    cur_index_2 += 9;
                }
            }
        }
    }
    
    return rimossi;
}


// SCOPRI
function scopri(diff){
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
    
    let scoperti = coppie_verticali(td, num);
    scoperti += coppie_orizzontali(td, num);
    
    for(let i = scoperti; i < myRand(17, 20) + diff * 5; i++){
        let aux = myArrayRand(num);
        
        let index = num.indexOf(aux);
        if (index !== -1) {
            num.splice(index, 1);
        }
        //console.log("num: ", num);
        
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
    let value = parseInt(cell.innerText);
    
    if (isNaN(value) || value < 1 || value > 9) {
        cell.innerText = '';
        cell.style.boxShadow = '';
    } else if (!isNaN(value)) {
        if(value == vec[i][j]){
            cell.style.boxShadow = '';
            cell.contentEditable = false;
            completati++;
            
            if(completati >= 81){
                fine();
            }
            
        } else{
            // cell.style.backgroundColor = "red";
            cell.style.boxShadow = 'inset 0 0 20px 10px red';
        }
    }
}

function fine(){
    const messageElement = document.getElementById('completato');
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 1.5 * 1000);
}

// FINE SCOPRI

function start(){
    
    pulisci();
    
    let td = document.querySelectorAll('#mainTable td');
    
    const def = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    while(i < 81){
        
        let escludi = union(union(union(vec[Math.floor(i / 9)], myColContains(vec, i % 9)), microTable[myIndexToSubtable(i)]), numEscludi[Math.floor(i / 9)]);
        
        let aux = myArrayRand(substrac(def, escludi));
        
        if(aux != null){
            vec[Math.floor(i / 9)][i % 9] = aux;
            microTable[myIndexToSubtable(i)][myIndexToSubtableCell(i)] = aux;
            
            i++;
            
        } else{
            console.log("aux: ", aux, ", pos: ", i, "\nInizio passo indietro");
            if(!passoIndietro(td)){
                start();
                return;
            };
        }
    }
    
    
    showModalita();
}

function showModalita() {
    var modalita = document.getElementById("modalita");
    modalita.style.display = "block";
}

function chooseDifficulty(difficulty) {
    hideModalita();
    scopri(difficulty);
}

function hideModalita() {
    var modalita = document.getElementById("modalita");
    modalita.style.display = "none";
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
    
    for(let i = 0; i < td.length; i++){
        td[i].textContent = null;
        td[i].style.backgroundColor = "white";
        td[i].contentEditable = true;
        td[i].style.boxShadow = '';
    }
    vec = Array.from({ length: 9 }, () => Array(9).fill(null));
    microTable = Array.from({ length: 9 }, () => Array(9).fill(null));  // ogni riga rappresenta una delle 9 micro tabelle 3x3
    
    i = 0;
    
    numEscludi = Array.from({ length: 9 }, () => Array(9).fill(null));
    completati = 0;
    
    console.clear();
}




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


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


var vec = [[]];         // rappresenta l'intera tabella 9x9

var microTable = [[]];  // ogni riga rappresenta una delle 9 micro tabelle 3x3



// elem mancanti riga ∩ elem mancanti col ∩ eleme mancanti subtable / {numero da escludere}
//      se vuoto ==> passo indietro escludendo elemento aggiunto in precedenza

function start(){
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
    
}


function test(){
    for (let i = 0; i <= 80; i++) {
        const subTableIndex = myIndexToSubtable(i);
        console.log(`Cella ${i}: Sottotabella 3x3 ${subTableIndex}`);
    }
}




// FUNZIONI DI UTILITA'

function myIndexToSubtable(cellIndex) {
    
    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;


    const subTableRow = Math.floor(row / 3);
    const subTableCol = Math.floor(col / 3);

    const subTableIndex = subTableRow * 3 + subTableCol;

    return subTableIndex;
}


function myColContains(matrice, indiceColonna, elemento) {
    const colonna = matrice.map(row => row[indiceColonna]);
    return colonna.includes(elemento);
}

function myRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function myArrayRand(arr) {
    if (arr.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

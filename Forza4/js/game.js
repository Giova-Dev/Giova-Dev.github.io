
const NUM_ROW = 6;
const NUM_COL = 7;
const TEMPO = 1800;

function PLAYER(num_) {
    switch(num_){
        case 1: return "player1";
        case 2: return "player2";
        default: return null;
    }
}

function COLOR(num_) {
    switch(num_){
        case 1: return "RED";
        case 2: return "YELLOW";
        default: return null;
    }
}

let currPlayer = PLAYER(0);

let avviato = false;


function disegna(){
    let tabella = document.createElement("div");
    tabella.classList.add("tabella");


    for(let i = 0; i < NUM_ROW; i++){
        let row = document.createElement("div");
        row.classList.add("riga");

        for(let j = 0; j < NUM_COL; j++){
            let cell = document.createElement("input");

            cell.addEventListener("click", cellaCliccata);
            cell.setAttribute("readonly", "readonly");

            cell.id = Number(i * NUM_COL + j);
            cell.classList.add("cella");

            row.appendChild(cell);
        }

        tabella.appendChild(row);
    }


    let container = document.getElementById("container");
    container.appendChild(tabella);
}


function cellaCliccata(event){
    if(!avviato)
        return;

    let target = event.target || event.srcElement;
    let id = Number(target.id);

    // cerco la prima cella della colonna
    id = id%NUM_COL;

    // prima cella gia' occupata ==> ignoro input
    if(document.getElementById(id).classList.contains("player1") || document.getElementById(id).classList.contains("player2"))
        return;

    let newId = id;

    // cerco la cella più bassa libera
    while(!document.getElementById(id).classList.contains("player1") && !document.getElementById(id).classList.contains("player2")){
        newId = id + NUM_COL;

        // fuori range
        if(newId >= NUM_COL * NUM_ROW)
            break;
        
        // cella sotto libera?
        if(!document.getElementById(newId).classList.contains("player1") &&
                    !document.getElementById(newId).classList.contains("player2"))
            id = newId;
        else{
            id = newId - NUM_COL;
            break;
        }
    }
    

    let newTarget = document.getElementById(id);

    newTarget.classList.add(PLAYER(currPlayer));

    cercaCombinazione(Number(id), currPlayer);

    currPlayer = (currPlayer === 1) ? 2 : 1;
}


function cercaCombinazione(pos, player_){
    console.clear();
    let win = false;

    const currRow = Math.floor(pos / NUM_COL);
    const currCol = pos%NUM_COL;

    // orizzontale
    let x = currRow * NUM_COL;      // x coordinata della prima cella della riga 
    let consecutive = 0;
    
    while(x < (currRow * NUM_COL + NUM_COL) && !win){      
        if(document.getElementById(x).classList.contains(PLAYER(player_))){
            consecutive++;
            if(consecutive == 4)
                win = true;
        }
        else
            consecutive = 0;

        x++;
    }

    

    //verticale
    let y = currCol;                // y coordinata della prima cella della colonna 
    consecutive = 0;

    while(y < (NUM_COL * NUM_ROW - currCol) && !win){   
        if(document.getElementById(y).classList.contains(PLAYER(player_))){
            consecutive++;
            if(consecutive == 4)
                win = true;
        }
        else
            consecutive = 0;

        y += NUM_COL;
    }

    
    //diagonale alto-sx => basso-dx
    let start = diagonaleAltoSx(pos);
    let row_ = Math.floor(start / NUM_COL);
    let col_ = start % NUM_COL;
    consecutive = 0;

    while(row_ < NUM_ROW && col_ < NUM_COL && !win){
        const cellId = (row_ * NUM_COL + col_);
        console.log("Cerco in cella (", row_, ", ", col_, ")");
        if (document.getElementById(cellId).classList.contains(PLAYER(player_))) {
            consecutive++;
            console.log("TROVATO");
            if (consecutive == 4) {
                win = true;
                break;
            }
        } else {
            consecutive = 0;
        }

        console.log("Consecutivi: ", consecutive);
        // Avanza lungo la diagonale basso-dx
        row_++;
        col_++;
    }

    //diagonale alto-dx => basso-sx
    start = diagonaleAltoDx(pos);
    row_ = Math.floor(start / NUM_COL);
    col_ = start % NUM_COL;
    consecutive = 0;

    while(row_ < NUM_ROW && col_ >= 0 && !win){
        const cellId = (row_ * NUM_COL + col_);
        
        if (document.getElementById(cellId).classList.contains(PLAYER(player_))) {
            consecutive++;
            if (consecutive == 4) {
                win = true;
                break;
            }
        } else {
            consecutive = 0;
        }

        // Avanza lungo la diagonale basso-dx
        row_++;
        col_--;
    }

    if(win)
        endGame();

}

function diagonaleAltoSx(pos_) {
    const row = Math.floor(pos_ / NUM_COL);
    const col = pos_ % NUM_COL;

    // Calcola la cella più in alto a sinistra sulla diagonale principale
    let startRow = row;
    let startCol = col;

    while (startRow > 0 && startCol > 0) {
        startRow--;
        startCol--;
    }

    // Ritorna il numero della cella
    return startRow * NUM_COL + startCol;
}

function diagonaleAltoDx(pos_) {
    const row = Math.floor(pos_ / NUM_COL);
    const col = pos_ % NUM_COL;

    // Calcola la cella più in alto a destra sulla diagonale secondaria
    let startRow = row;
    let startCol = col;

    while (startRow > 0 && startCol < NUM_COL - 1) {
        startRow--;
        startCol++;
    }

    // Ritorna il numero della cella
    return startRow * NUM_COL + startCol;
}


function pulisci(){
    for(let i = 0; i < NUM_COL * NUM_ROW; i++){
        let cella = document.getElementById(i);

        cella.classList.remove("player1");
        cella.classList.remove("player2");
    }
}


function startGame(event){
    event.preventDefault();
    changeButtonState();
    pulisci();
    avviato = true;

    currPlayer = 1;
}

function endGame(){
    avviato = false;
    changeButtonState();

    showNotification(COLOR(currPlayer) + " has won");
}


function changeButtonState(){
    let start = document.getElementById("start");
    start.disabled = !start.disabled;
}


function inizializza(){
    disegna();

    let start = document.getElementById("start");
    start.addEventListener("click", startGame);
}


// Funzione per mostrare il messaggio di avviso
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('p');
    messageElement.textContent = message;
    
    // Mostra la notifica
    notification.style.display = 'flex';
    notification.style.visibility = 'visible';
}

// Funzione per chiudere la notifica
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.visibility = 'hidden';
}

document.addEventListener("DOMContentLoaded", inizializza);
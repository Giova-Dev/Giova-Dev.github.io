/*
domain: 'dev-8vae70bb4pd8od0b.us.auth0.com',
client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
*/
auth0.createAuth0Client({
    domain: "dev-8vae70bb4pd8od0b.us.auth0.com",
    clientId: "sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V",
    cacheLocation: "localstorage",
    authorizationParams: {
        redirect_uri: window.location.origin
    }
}).then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("login-button");
    
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.loginWithRedirect();
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = isAuthenticated ? await auth0Client.getUser() : null;
   
    if (location.search.includes("state=") && 
        (location.search.includes("code=") || location.search.includes("error="))) {
        try {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        } catch (error) {
            console.log("Error handling redirect callback");
        }
    }

    // Assumes a button with id "logout" in the DOM
    const logoutButton = document.getElementById("logout-button");
    
    logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.logout();
    });
    
    const userDataContainer = document.getElementById("user-data-container");
    
    // Assumes an element with id "profile" in the DOM
    const profileElement = document.getElementById("profile");

    // Avvia il conto alla rovescia
    const now = new Date();
    const targetDate = new Date('December 1, 2024 00:00:00');
    const waiterElement = document.getElementById("waiter");
    
    if (isAuthenticated) {
        profileElement.style.display = "block";
        /*
        profileElement.innerHTML = `
            <p>${userProfile.name}</p>
            <p>${userProfile.email}</p>
            <p>${userProfile.app_metadata}</p>
            <img src="${userProfile.picture}" />
        `;
        */

        if(now < targetDate){
            userDataContainer.style.display = "none";
            waiterElement.style.display = "block";
            startCountdown();
        } else{
            userDataContainer.style.display = "block";
            waiterElement.style.display = "none";
        }
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        

        searchByName(userProfile.name);

    } else {
        profileElement.style.display = "none";
        loginButton.style.display = "block"; 
        logoutButton.style.display = "none"; 
        userDataContainer.style.display = "none";
        waiterElement.style.display = "none";
    }
});


// Funzione per calcolare e visualizzare il conto alla rovescia
function updateCountdown() {
    const now = new Date();
    const targetDate = new Date('December 1, 2024 00:00:00'); // Data dell'estrazione
    const timeDifference = targetDate - now;

    if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('waiter').innerHTML = `
            <p>Mancano <strong>${days}</strong> giorni <strong>${hours}</strong> ore <strong>${minutes}</strong> minuti <strong>${seconds}</strong> secondi all'estrazione!</p>
        `;
    } else {
        document.getElementById('waiter').innerHTML = "<p>È arrivato il momento! 🎉</p>";
    }
}

// Funzione per avviare il conto alla rovescia ogni secondo
function startCountdown() {
    setInterval(updateCountdown, 1000);
}


// BACKGROUND MUSIC
function inizializza(){
    var audio = new Audio("res/All I Want For Christmas Is You.mp3");
    audio.play();
    audio.loop = true;
}

document.addEventListener("click", inizializza);
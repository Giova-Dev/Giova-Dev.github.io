// auth.js
document.addEventListener('DOMContentLoaded', async () => {
    const auth0 = await createAuth0Client({
        domain: 'dev-8vae70bb4pd8od0b.us.auth0.com',
        client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
        cacheLocation: 'localstorage',
    });

    // Funzione per gestire l'interfaccia basata sullo stato di autenticazione
    async function handleAuth() {
        const isAuthenticated = await auth0.isAuthenticated();

        if (isAuthenticated) {
            const user = await auth0.getUser();
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('search-container').style.display = 'block';
            document.getElementById('logout-button').style.display = 'inline-block';

            // Recupera il metadato 'user' dall'oggetto user
            const userMetadata = user['https://your-app-url.com/user']; // Assicurati di usare il namespace corretto
            if (userMetadata) {
                processUserMetadata(userMetadata);
            } else {
                console.log('Metadato user non trovato.');
            }

            // Effettua la ricerca automatica con il nome dell'utente
            searchByName(user.name);
        } else {
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('search-container').style.display = 'none';
        }
    }

    function processUserMetadata(userMetadata) {
        // Logica per utilizzare il metadato 'user'
        console.log('Metadato utente:', userMetadata);
        // Ad esempio, puoi mostrare un messaggio personalizzato
        document.getElementById('result').textContent = `Ciao, ${userMetadata}!`;
    }

    // Gestione login
    document.getElementById('login-button').addEventListener('click', () => {
        auth0.loginWithRedirect({
            redirect_uri: window.location.origin
        });
    });

    // Gestione logout
    document.getElementById('logout-button').addEventListener('click', () => {
        auth0.logout({
            returnTo: window.location.origin
        });
    });

    // Gestione del reindirizzamento post-login
    if (window.location.search.includes('code=')) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, '/');
    }

    // Chiama la funzione per impostare l'interfaccia
    handleAuth();
});




/*
// auth.js
document.addEventListener('DOMContentLoaded', async () => {
    // Configura l'SDK con le credenziali di Auth0
    const auth0 = await createAuth0Client({
        domain: 'dev-8vae70bb4pd8od0b.us.auth0.com',
        client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
        cacheLocation: 'localstorage', // Persistenza
    });

    // Controlla se l'utente è autenticato
    const isAuthenticated = await auth0.isAuthenticated();
    
    // Gestisce lo stato dell'autenticazione
    if (isAuthenticated) {
        const user = await auth0.getUser();
        document.getElementById('result').textContent = `Bentornato, ${user.name}!`;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline-block';
    } else {
        document.getElementById('login-button').style.display = 'inline-block';
        document.getElementById('logout-button').style.display = 'none';
    }

    // Login
    document.getElementById('login-button').addEventListener('click', () => {
        auth0.loginWithRedirect({
            redirect_uri: window.location.origin
        });
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', () => {
        auth0.logout({
            returnTo: window.location.origin
        });
    });

    // Gestione del reindirizzamento post-login
    if (window.location.search.includes('code=')) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, '/');
    }
});
*/
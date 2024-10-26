// auth.js
document.addEventListener('DOMContentLoaded', async () => {
    const auth0 = await createAuth0Client({
        domain: 'dev-8vae70bb4pd8od0b.us.auth0.com', // Inserisci il tuo dominio Auth0
        client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V', // Inserisci il tuo Client ID
        cacheLocation: 'localstorage',
    });

    async function handleAuth() {
        const isAuthenticated = await auth0.isAuthenticated();

        if (isAuthenticated) {
            const user = await auth0.getUser();
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('user-data-container').style.display = 'block';
            document.getElementById('logout-button').style.display = 'inline-block';

            // Mostra i metadati dell'utente
            displayUserMetadata(user);
        } else {
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('user-data-container').style.display = 'none';
        }
    }

    function displayUserMetadata(user) {
        // Logica per visualizzare i metadati dell'utente
        const userDataDiv = document.getElementById('user-data');
        userDataDiv.innerHTML = `
            <p><strong>Nome:</strong> ${user.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
            <p><strong>Identificativo:</strong> ${user.sub || 'N/A'}</p>
            <p><strong>Metadati Personalizzati:</strong> ${user['https://giova-dev.github.io/user'] || 'N/A'}</p>
            <p><strong>Avatar:</strong> <img src="${user.picture || ''}" alt="Avatar" style="width: 50px; height: 50px;" /></p>
        `;
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

    // Chiama la funzione per gestire l'autenticazione
    handleAuth();
});

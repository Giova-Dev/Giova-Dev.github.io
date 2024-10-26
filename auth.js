/*
    domain: 'dev-8vae70bb4pd8od0b.us.auth0.com',
    client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
*/
document.addEventListener('DOMContentLoaded', async () => {
    const auth0 = await createAuth0Client({
        domain: 'dev-8vae70bb4pd8od0b.us.auth0.com',
        client_id: 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
    });

    // Gestione del reindirizzamento post-login
    if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0.getUser();
        document.getElementById('user-data').innerHTML = `
            <pre>${JSON.stringify(user, null, 2)}</pre>
        `;
        document.getElementById('user-data-container').style.display = 'block';
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline-block';
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('user-data-container').style.display = 'none';
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
});

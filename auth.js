let auth0;

const initializeAuth0 = async () => {
    auth0 = await createAuth0Client({
        domain = 'dev-8vae70bb4pd8od0b.us.auth0.com',
        clientId = 'sGI9Rm6cKhNl0jhdvv2dRiHo0UScgn7V',
        redirect_uri: window.location.origin,
    });
};

const updateUI = (user) => {
    const userDataContainer = document.getElementById('user-data-container');
    const userDataDiv = document.getElementById('user-data');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    if (user) {
        userDataDiv.innerHTML = `
            <pre>${JSON.stringify(user, null, 2)}</pre>
        `;
        userDataContainer.style.display = 'block';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        userDataContainer.style.display = 'none';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
};

window.onload = async () => {
    await initializeAuth0();
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0.getUser();
        updateUI(user);
    }

    document.getElementById('login-button').addEventListener('click', async () => {
        await auth0.loginWithRedirect();
    });

    document.getElementById('logout-button').addEventListener('click', async () => {
        await auth0.logout({ returnTo: window.location.origin });
        updateUI(null);
    });
};
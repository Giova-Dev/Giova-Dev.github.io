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
            console.error("Error handling redirect callback:", error);
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
    
    if (isAuthenticated) {
        profileElement.style.display = "block";
        profileElement.innerHTML = `
        <p>${userProfile.name}</p>
        <img src="${userProfile.picture}" />
        `;
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        userDataContainer.style.display = "none";
    } else {
        profileElement.style.display = "none";
        loginButton.style.display = "block"; 
        logoutButton.style.display = "none"; 
        userDataContainer.style.display = "block";
    }
});
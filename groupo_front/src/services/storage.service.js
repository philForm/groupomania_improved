/**
 * Sauvegarde le token de l'utilisateur dans le localStorage :
 * @param {String} token 
 */
const saveToken = (token) => {
    localStorage.setItem("token", token);
};

/**
 * Retire le token du localStorage lors de la deconnexion :
 */
const logOut = () => {
    localStorage.removeItem("token");
};

/**
 * Vérifie la présence d'un token dans le localStorage :
 * @returns { boolean }
 */
const isLogged = () => {

    const data = JSON.parse(localStorage.getItem("token"));
    let token
    if (data) {
        token = data.token
    }
    return !!token // !! : transforme n'importe quelle variable en boolean
};

/**
 * Récupère l'id de l'utilisateur du localStorage :
 * @returns {String} : userId
 */
const idCompare = () => {
    if (JSON.parse(localStorage.getItem("token"))) {
        const { userId } = JSON.parse(localStorage.getItem("token"));
        return userId;
    }
}

/**
 * Récupère le token dans le localStorage
 * @returns {String}
 */
const recupToken = () => {
    const data = JSON.parse(localStorage.getItem("token"));
    let token
    if (data) {
        token = data.token
    }
    return token
}

/**
 * Récupère le rôle de l'utilisateur du localStorage :
 * @returns {number}
 */
const recupRole = () => {
    const data = JSON.parse(localStorage.getItem("token"));
    let role
    if (data) {
        role = data.user_role.data[0]
    }
    return role
}

export const tokenService = {
    saveToken, logOut, isLogged, idCompare, recupToken, recupRole
};
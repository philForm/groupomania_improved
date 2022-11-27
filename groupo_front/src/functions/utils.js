/**
 * Formate la date provenant de la BDD
 * @param {*} item 
 * @returns {String} : date formatée
 */
const dateFormat = (item) => {
    let dateElt = {
        hour: "2-digit", minute: "2-digit", weekday: "long", year: "numeric", month: "short", day: "numeric",
    };

    let time = Date.parse(item);

    let date = new Date(time).toLocaleDateString("fr-FR", dateElt);

    return date.toString();
}

export { dateFormat };
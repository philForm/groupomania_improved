
/**
 * Vérifie que les champs du formulaire ne sont pas vides
 * @param {object} name : objet useRef
 * @param {object} control : objet useRef
 * @param {object} valid : contient un boolean et un string 
 * @param {String} classText : class injectée 
 */
const requiredForm = (name, control, valid, classText, classText2) => {
    if (name.current.value.length === 0) {
        control.current.classList.value = classText;
        control.current.innerText = valid.text;
        valid.bool = false;
    } else {
        control.current.classList.value = classText2;
        control.current.innerText = "";
    }
}

export { requiredForm };
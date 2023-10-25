import React, { useState, useRef, useContext } from 'react';
import { requiredForm } from '../../functions/users_functions.js';
import { accountService } from '../../services/account.service.js';
import { ThemeContext } from '../../contexts/ThemeContext.js';

const regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;


/**
 * Enregistre un utilisateur : 
 */
const Signup = (props) => {

    const { handleDarkTheme } = useContext(ThemeContext);

    const { textareaTheme, btnTheme } = handleDarkTheme

    const [validInput, setValidInput] = useState({
        bool: true,
        text: "Champ requis !"
    });
    const [verifEmail, setVerifEmail] = useState({
        bool: false,
        text: "L'email est invalide"
    });
    const [verifPassword, setVerifPassword] = useState({
        bool: false,
        text: {
            valid: "Veuillez retaper le mot de passe !",
            validConfirm: "Les mots de passe ne correspondent pas !"
        }
    });

    const firstName = useRef();
    const firstNameControl = useRef();
    const lastName = useRef();
    const lastNameControl = useRef()
    const email = useRef();
    const emailControl = useRef();
    const password = useRef();
    const passwordConfirm = useRef();
    const valid = useRef();
    const valid2 = useRef();
    const formVerif = useRef();

    /**
     * Soumission du formulaire d'inscription :
     */
    const handleSubmit = (e) => {

        e.preventDefault();

        setValidInput({
            ...validInput,
            validInput: {
                bool: true,
            }
        })


        setVerifEmail({
            ...verifEmail,
            verifEmail: {
                bool: false,
            }
        });

        setVerifPassword({
            ...verifPassword,
            verifPassword: {
                bool: false,
            }
        })

        requiredForm(firstName, firstNameControl, validInput, "my_red", "invalid-feedback");
        requiredForm(lastName, lastNameControl, validInput, "my_red", "invalid-feedback");
        requiredForm(email, emailControl, validInput, "my_red", "invalid-feedback");
        requiredForm(password, valid, validInput, "my_red", "invalid-feedback");
        requiredForm(passwordConfirm, valid2, validInput, "my_red", "invalid-feedback");

        // Si le champ de l'email n'est pas vide
        if (email.current.value.length !== 0) {
            // Si l'email est valide
            if (regexEmail.test(email.current.value)) {

                emailControl.current.classList.value = "invalid-feedback";
                verifEmail.bool = true;
            }
            // Si l'email n'est pas valide
            else {
                emailControl.current.classList.value = "my_red";
                emailControl.current.innerText = verifEmail.text;
                verifEmail.bool = false;
            }
        }

        // Si les champs du mot de passe ne sont pas vides :
        if (password.current.value.length !== 0 || passwordConfirm.current.value.length !== 0) {
            // Si les deux mots de passe correspondent :
            if (password.current.value === passwordConfirm.current.value) {
                valid.current.classList.value = "invalid-feedback";
                valid2.current.classList.value = "invalid-feedback";
                verifPassword.bool = true;
            }
            else {
                valid.current.classList.value = "my_red";
                valid2.current.classList.value = "my_red";
                valid.current.innerText = verifPassword.text.valid
                valid2.current.innerText = verifPassword.text.validConfirm
                password.current.value = "";
                passwordConfirm.current.value = "";
                verifPassword.bool = false;
            }
        }

        if (verifEmail.bool && verifPassword.bool && validInput.bool) {

            const credentials = {
                firstname: firstName.current.value,
                lastname: lastName.current.value,
                email: email.current.value,
                password: password.current.value,
                picture: ""
            };

            accountService.signup(credentials)
                .then((res) => {
                    // Si tout s'est bien passé, l'utilisateur est créé :
                    if (res.status === 201) {
                        props.dispForm();
                    }
                    // Si l'email existe déjà dans la BDD :
                    if (res.data.message) {
                        emailControl.current.classList.value = "my_red";
                        emailControl.current.innerText = res.data.message;
                    }
                    // Si le mot de passe n'est pas assez sécurisé :
                    if (res.data.message2) {
                        valid.current.classList.value = "my_red";
                        valid.current.innerText = res.data.message2.pass;
                        valid2.current.classList.value = "my_red";
                        valid2.current.innerText = res.data.message2.pass2;

                    }
                })
                .catch(err => console.error(err));
        };

        // Pour changer l'attribut isvalid
        console.log(valid.current.attributes[0].value)

    };

    return (
        <div className={`form`}>
            <h2>Enregistrement</h2>
            <form id="form" noValidate onSubmit={handleSubmit} ref={formVerif} name="signup_form">
                <div className='disp_flex_column'>
                    <label htmlFor='signup_firstname'>Prénom</label>
                    <input
                        ref={firstName}
                        id='signup_firstname'
                        className={textareaTheme}
                        name='firtName'
                        type="text"
                        placeholder="Prénom"
                        required
                    />
                    <span ref={firstNameControl} />
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='signup_lastname'>Nom</label>
                    <input
                        ref={lastName}
                        className={textareaTheme}
                        required
                        id='signup_lastname'
                        name='lastName'
                        type="text"
                        placeholder="Nom"
                    />
                    <span ref={lastNameControl} />
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='signup_email'>Email</label>
                    <input
                        className={textareaTheme}
                        ref={email}
                        id='signup_email'

                        type="email"
                        name='email'
                        placeholder="Email"
                        autocomplete="off"
                        required
                    />
                    <span type="invalid" ref={emailControl}>
                        {/* {verifEmail.text} */}
                    </span>
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='signup_pass'>Mot de passe</label>
                    <input
                        ref={password}
                        id='signup_pass'
                        className={textareaTheme}
                        type="password"
                        name='password'
                        placeholder="Mot de passe"
                        autocomplete="new-password"
                        required />
                    <span type="invalid" ref={valid} >
                        {/* {verifPassword.text.valid} */}
                    </span >
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='signup_pass_confirm'>Confirmation du mot de passe</label>
                    <input
                        ref={passwordConfirm}
                        id='signup_pass_confirm'
                        className={textareaTheme}
                        type="password"
                        name='password-confirm'
                        placeholder="Confirmation du mot de passe"
                        required />
                    <span type="invalid" ref={valid2} >
                        {/* {verifPassword.text.validConfirm} */}
                    </ span>
                </div>
                <button
                    className={btnTheme}
                    type="submit"
                >Inscription</button>
            </form>
        </div>
    );
};

export default Signup;
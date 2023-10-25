import { useEffect, useRef, useState } from "react";
import Signup from "../Signup";
import Login from "../Login";

import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import './formElem.css'

/**
 * Formulaires d'enregistrement et de connexion :
 */
const FormElem = () => {

    const [displaySignup, setDisplaySignup] = useState(false);
    const [displayLogin, setDisplayLogin] = useState(true);

    const { theme } = useContext(ThemeContext);

    const signup = useRef();
    const login = useRef();
    // const span = useRef();


    /**
     * Alterne l'affichage entre signup et login
    */
    const displayForm = () => {
        console.log("signup : " + signup.current.classList);
        console.log("login : " + login.current.classList);
        // if (login.current.classList.contains("disp_none")) {
        if (login.current.classList.contains("disp_none")) {
            console.log('login ==> disp_none')
            login.current.classList.remove("disp_none");
            login.current.classList.add("wid");
            signup.current.classList.add("disp_none");
            signup.current.classList.remove("wid");

            setDisplaySignup(false);
            console.log(displaySignup)
            setDisplayLogin(true);
            console.log(displayLogin)

        } else {
            login.current.classList.remove("wid");
            login.current.classList.add("disp_none");
            signup.current.classList.remove("disp_none");
            signup.current.classList.add("wid");

            // signup.current.className = "wid btn-primary-dark";

            setDisplaySignup(true);
            setDisplayLogin(false);
        };
    };

    const handleDarkTheme = () => {
        if (theme) {
            signup.current.classList.add('btn-primary-dark');
            signup.current.classList.remove('btn-primary');
            login.current.classList.add('btn-primary-dark')
            login.current.classList.remove('btn-primary')
        }
        else {
            signup.current.classList.remove('btn-primary-dark');
            signup.current.classList.add('btn-primary');
            login.current.classList.remove('btn-primary-dark')
            login.current.classList.add('btn-primary')

        }


    }

    useEffect(() => {
        handleDarkTheme()
    }, [theme])

    // const handleDarkTheme = () => theme ? 'btn-primary-dark' : "btn-primary";

    return (
        <div className="App" >
            <div className={`form_1 ${theme ? 'posts__container-dark' : 'form_1-color'}`} >
                <button
                    className="disp_none btn-primary"
                    onClick={displayForm}
                    id="signup"
                    ref={signup}>
                    Aller au formulaire de connexion
                </button>

                <button
                    className="wid btn-primary"
                    onClick={displayForm}
                    id="login"
                    ref={login}>
                    Aller au formulaire d'inscription
                </button>
                {displaySignup ?
                    <Signup dispForm={displayForm} /> : <Login />
                }
                {/* {displayLogin &&
                    <Login />
                } */}
                {/* <span className="disp_none" ref={span}>
                    Vous pouvez vous connecter !
                </span> */}
            </div>
        </div>
    );
};

export default FormElem;

import { useEffect, useRef, useState, useContext } from "react";
import Signup from "../Signup";
import Login from "../Login";

import { ThemeContext } from "../../contexts/ThemeContext";
import './formElem.css'

/**
 * Formulaires d'enregistrement et de connexion :
 */
const FormElem = () => {

    const [displaySignup, setDisplaySignup] = useState(false);
    const [displayLogin, setDisplayLogin] = useState(true);

    const { handleDarkTheme, theme } = useContext(ThemeContext);

    const { formTheme } = handleDarkTheme;

    const signup = useRef();
    const login = useRef();
    // const span = useRef();


    /**
     * Alterne l'affichage entre signup et login
    */
    const displayForm = () => {
        console.log("signup : " + signup.current.classList);
        console.log("login : " + login.current.classList);

        if (login.current.classList.contains("disp_none")) {
            login.current.classList.remove("disp_none");
            login.current.classList.add("wid");
            signup.current.classList.add("disp_none");
            signup.current.classList.remove("wid");

            setDisplaySignup(false);
            setDisplayLogin(true);

        } else {
            login.current.classList.remove("wid");
            login.current.classList.add("disp_none");
            signup.current.classList.remove("disp_none");
            signup.current.classList.add("wid");

            setDisplaySignup(true);
            setDisplayLogin(false);
        };
    };

    const handleLoginSignupDarkTheme = () => {
        if (theme) {
            signup.current.classList.add('btn-primary-dark');
            signup.current.classList.remove('btn-primary');
            login.current.classList.add('btn-primary-dark');
            login.current.classList.remove('btn-primary');
        }
        else {
            signup.current.classList.remove('btn-primary-dark');
            signup.current.classList.add('btn-primary');
            login.current.classList.remove('btn-primary-dark');
            login.current.classList.add('btn-primary');
        }


    };

    useEffect(() => {
        handleLoginSignupDarkTheme()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);


    return (
        <div className="App" >
            <div className={`form_1 ${formTheme}`} >
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
                {displaySignup && !displayLogin ?
                    <Signup dispForm={displayForm} /> : <Login />
                }
                {/* <span className="disp_none" ref={span}>
                    Vous pouvez vous connecter !
                </span> */}
            </div>
        </div>
    );
};

export default FormElem;

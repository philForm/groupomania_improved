import { useRef, useState } from "react";
import Signup from "../Signup";
import Login from "../Login";

import './formElem.css'

/**
 * Formulaires d'enregistrement et de connexion :
 */
const FormElem = () => {

    const [displaySignup, setDisplaySignup] = useState(false)
    const [displayLogin, setDisplayLogin] = useState(true)

    const signup = useRef();
    const login = useRef();
    const span = useRef();


    /**
     * Alterne l'affichage entre signup et login
     */
    const displayForm = () => {
        if (login.current.className === "disp_none") {
            login.current.className = "wid btn-primary";
            signup.current.className = "disp_none";
            setDisplaySignup(false);
            setDisplayLogin(true);

        } else {
            login.current.className = "disp_none";
            signup.current.className = "wid btn-primary";
            setDisplaySignup(true);
            setDisplayLogin(false);
        };
    };

    return (
        <div className="App" >
            <div className="form_1" >
                <button className="btn-primary disp_none" onClick={displayForm} id="signup" ref={signup}>
                    Aller au formulaire de connexion
                </button>

                <button className="btn-primary wid" onClick={displayForm} id="login" ref={login}>
                    Aller au formulaire d'inscription
                </button>
                {displaySignup &&
                    <Signup dispForm={displayForm} />
                }
                {displayLogin &&
                    <Login />
                }
                <span className="disp_none" ref={span}>
                    Vous pouvez vous connecter !
                </span>
            </div>
        </div>
    );
};

export default FormElem;

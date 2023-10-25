import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { tokenService } from '../../services/storage.service';

import "./login.css";
import { accountService } from '../../services/account.service';
import { ThemeContext } from '../../contexts/ThemeContext';

/**
 * Formulaire de connexion :
 */
const Login = () => {

    const { theme } = useContext(ThemeContext)

    const navigate = useNavigate();

    const email = useRef();
    const password = useRef();
    const errorMsg = useRef();

    /**
    * Soumission du formulaire :
    */
    const handleSubmit = async (e) => {

        e.preventDefault();

        const dataLogin = {
            email: email.current.value,
            password: password.current.value
        };

        await accountService.login(dataLogin)
            .then((res) => {
                if (res.status === 200) {
                    tokenService.saveToken(JSON.stringify(res.data));
                    navigate("/");
                }
            })
            .catch(err => {
                errorMsg.current.innerText = err.response.data.message;
                errorMsg.current.classList = "my_red";

            });


    };

    return (
        <div className="form">
            <h2>Connexion</h2>
            <form noValidate onSubmit={handleSubmit}>
                <div className='disp_flex_column'>
                    <label htmlFor='connect_email'>Email</label>
                    <input
                        ref={email}
                        id='connect_email'
                        className={theme && "textarea-dark"}
                        type="email"
                        name='email'
                        placeholder="Email"
                        autocomplete="off"
                        required
                    />
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='connect_pass'>Mot de passe</label>
                    <input
                        ref={password}
                        id="connect_pass"
                        className={theme && "textarea-dark"}
                        type="password"
                        placeholder="Mot de passe"
                        autocomplete="new-password"
                        required
                    />
                </div>
                <div className='login_error'>
                    <span type="invalid" ref={errorMsg} />
                    <button
                        className={theme ? 'btn-primary-dark' : 'btn-primary'}
                        type="submit"
                    >Connexion</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
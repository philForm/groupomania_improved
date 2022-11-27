import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { tokenService } from '../../services/storage_service';

import "./login.css";

/**
 * Formulaire de connexion :
 */
const Login = () => {

    const navigate = useNavigate();

    const email = useRef();
    const password = useRef();
    const errorMsg = useRef();

    /**
    * Sounission du formulaire :
    */
    const handleSubmit = async (e) => {

        e.preventDefault();

        const dataLogin = {
            email: email.current.value,
            password: password.current.value
        };

        axios.post(`${process.env.REACT_APP_URL_API}api/auth/login`, dataLogin)

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
                    <input className=''
                        ref={email}
                        id='connect_email'
                        type="email"
                        name='email'
                        placeholder="Email"
                        required
                    />
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='connect_pass'>Mot de passe</label>
                    <input
                        ref={password}
                        id="connect_pass"
                        type="password"
                        placeholder="Mot de passe"
                        required
                    />
                </div>
                <div className='login_error'>
                    <span type="invalid" ref={errorMsg} />
                    <button className='btn-primary' type="submit">Connexion</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
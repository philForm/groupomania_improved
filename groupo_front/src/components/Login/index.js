import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '@/services/storage.service';
import { accountService } from '@/services/account.service';
import { useTheme } from '@/hooks/useTheme';
import "@/components/Login/login.css";

/**
 * Formulaire de connexion :
 */
const Login = () => {

    const { textareaTheme, btnTheme } = useTheme();

    const navigate = useNavigate();

    const email = useRef();
    const password = useRef();
    const errorMsg = useRef();
    const viewRef = useRef();

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

    const viewPassword = () => {
        viewRef.current.classList.remove('fa-eye');
        viewRef.current.classList.add('fa-eye-slash');
        password.current.setAttribute('type', 'text');
        setTimeout(() => {
            viewRef.current.classList.remove('fa-eye-slash');
            viewRef.current.classList.add('fa-eye');
            password.current.setAttribute('type', 'password');
        }, 3000)
    }

    return (
        <div className="form">
            <h2>Connexion</h2>
            <form noValidate onSubmit={handleSubmit}>
                <div className='disp_flex_column'>
                    <label htmlFor='connect_email'>Email</label>
                    <input
                        ref={email}
                        id='connect_email'
                        className={textareaTheme}
                        type="email"
                        name='email'
                        placeholder="Email"
                        autocomplete="off"
                        required
                    />
                </div>
                <div className='disp_flex_column'>
                    <label htmlFor='connect_pass'>Mot de passe</label>
                    <div onClick={viewPassword} className={`${textareaTheme} input`}>
                        <input
                            ref={password}
                            id="connect_pass"
                            className={textareaTheme}
                            type="password"
                            placeholder="Mot de passe"
                            autocomplete="new-password"
                            required
                        />
                        <i className={`fa-regular fa-eye fa-lg`} ref={viewRef}></i>
                    </div>
                </div>
                <div className='login_error'>
                    <span type="invalid" ref={errorMsg} />
                    <button
                        className={btnTheme}
                        type="submit"
                    >Connexion
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import "../FormElem/formElem.css";
// import "../Home/home.css";
import { tokenService } from '../../services/storage.service';
import { accountService } from '../../services/account.service';
import { ThemeContext } from '../../contexts/ThemeContext';

import "./profil.css";

/**
 * Change ou ajoute l'image d'avatar au profil utilisateur :
 */
const Profil = () => {

    const navigate = useNavigate();

    // const [data, setData] = useState([])
    const [logo, setLogo] = useState({
        file: [],
        filepreview: null,
    });

    const { theme } = useContext(ThemeContext);

    const avatar = useRef();

    const userId = tokenService.idCompare();

    /**
     * Previsualisation de l'image :
     */
    const handleChangeImage = e => {

        if (e.target.files[0] !== undefined) {
            setLogo({
                ...logo,
                file: e.target.files[0],
                filepreview: URL.createObjectURL(e.target.files[0]),
            });
        } else {
            setLogo({
                ...logo,
                file: e.target.files[0],
                filepreview: null
            });
        }
    };

    const handleDarkThemeBtn = () => theme ? 'btn-primary-dark' : 'btn-primary';
    const handleDarkThemeForm = () => theme ? 'posts__container-dark' : 'form_1-color';

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Supprimer la prévisualisation :
        setLogo({
            ...logo,
            file: avatar.current.files[0],
            filepreview: null
        });

        let formData = new FormData();
        formData.append('image', avatar.current.files[0]);

        await accountService.signupAvatarUpdate(userId, formData)
            .then((res) => {
                if (res.status === 200) {
                    return res
                }
            })
            .catch(err => console.error(err));

        fetchData();

        // // Vide les champs du formulaire :
        // document.forms["profil_form"].reset();

        // // Redirection vers la page des posts :
        // navigate('/');
        redirection();

    };

    const redirection = () => {

        fetchData();

        // Vide les champs du formulaire :
        document.forms["profil_form"].reset();

        // Redirection vers la page des posts :
        navigate('/');
    };

    /**
     * Récupère dans la BDD les infos de l'utilisateur :
     */
    const fetchData = async () => {
        try {
            const result = await accountService.getUser(userId);

            // setData(result.data);
            document.getElementById('user_avatar').src = result.data.user_picture;
        }
        catch (error) {
            console.error(error);
        };
    };

    return (
        <div className='App'>
            <div className={`form_1 ${handleDarkThemeForm()}`}>
                <h2>Ajouter une image à votre profil</h2>
                <form noValidate onSubmit={handleSubmit} name="profil_form" >
                    <div className='disp_flex_column'>
                        <input
                            ref={avatar}
                            id='profil_avatar'
                            type="file"
                            name='avatar'
                            placeholder="avatar"
                            onChange={(e) => handleChangeImage(e)}
                            accept='image/jpg, image/jpeg, image/png image/gif'
                            aria-describedby="inputGroupPrepend"
                            required
                        />
                        <label
                            htmlFor='profil_avatar'
                            className={handleDarkThemeBtn()}
                        >Choisissez un nouvel avatar</label>
                        {logo.filepreview !== null &&
                            <div className='profil_preview'>
                                <img
                                    src={logo.filepreview}
                                    alt="UploadImage" />
                            </div>
                        }
                    </div>
                    <button
                        className={handleDarkThemeBtn()}
                        type="submit"
                    >Ajouter ou changer votre avatar
                    </button>
                    <button
                        className={handleDarkThemeBtn()}
                        onClick={redirection}
                    >Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profil;

import React, { useState, useRef, useContext } from 'react';
import { tokenService } from '../../services/storage.service';
import { accountService } from '../../services/account.service';
import { ThemeContext } from '../../contexts/ThemeContext';

/**
 * Création de Posts
 */
const PostCreate = (props) => {

    const [image, setImage] = useState({
        file: [],
        filepreview: null,
    });

    const { theme } = useContext(ThemeContext);


    const post = useRef();
    const picture = useRef();
    const form = useRef();

    // Récupération de token d'authentification du localStorage :
    const token = tokenService.recupToken();

    // Récupération de l'id du l'utilisateur du localStorage :
    const userId = tokenService.idCompare();

    /**
    * Prévisualisation de l'image :
    */
    const handleChangeImage = e => {
        if (e.target.files[0] !== undefined) {
            setImage({
                ...image,
                file: e.target.files[0],
                filepreview: URL.createObjectURL(e.target.files[0]),
            });
        } else {
            setImage({
                ...image,
                file: picture.current.files[0],
                filepreview: null
            });
        }
    };

    /**
    * Soumission du formulaire de création de post :
    */
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Supprimer la prévisualisation :
        setImage({
            ...image,
            file: picture.current.files[0],
            filepreview: null,
        });

        let data = new FormData();

        data.append('image', picture.current.files[0]);
        data.append('post', post.current.value);
        data.append('userId', userId);

        for (let item of data)
            console.log(item);

        await accountService.createPost(data, token)
            .then((res) => {
                if (res.status === 200) {
                    return res
                }
            })
            .catch(err => console.error(err));

        props.fetchData();

        // Vide les champs du formulaire :
        document.forms["post-create_form"].reset();

    };

    const handleDarkTheme = () =>
        theme ? 'btn-primary-dark' : "btn-primary";

    return (
        <div
            className={theme ? 'posts__container posts__container-dark' : 'posts__container'}
        >
            <form onSubmit={handleSubmit} ref={form} name="post-create_form">
                <div className='posts__form'>
                    <label htmlFor="post-create">Message</label><br />
                    <textarea
                        className={theme && "textarea-dark"}
                        type="textarea"
                        id='post-create'
                        name='post'
                        ref={post}
                    /><br />
                </div>
                <div className='posts__form'>
                    <input
                        type="file"
                        id='post-create_picture'
                        name='picture'
                        accept='image/jpg, image/jpeg, image/png image/gif'
                        onChange={(e) => handleChangeImage(e)}
                        ref={picture}
                    /><br />
                    <label htmlFor="post-create_picture"
                        // className='btn-primary disp-inl-block'
                        className={`${handleDarkTheme()} disp-inl-block`}
                    >Ajouter une image</label><br /><br />
                </div>
                {
                    image.filepreview !== null &&
                    <div className='posts_preview'>
                        <img
                            src={image.filepreview}
                            alt="UploadImage" />
                    </div>
                }
                <button
                    className={handleDarkTheme()}
                    type='submit'>Publier</button>
            </form >
        </div >
    );
};

export default PostCreate;

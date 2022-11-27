import React, { useState, Fragment, useRef } from 'react';
import axios from 'axios';
import { dateFormat } from '../../functions/utils';
import { tokenService } from '../../services/storage_service';

import "./posts.css";

/**
 * Publication et modification de posts :
 */
const Posts = ({ data, fetchData }) => {

    const [displayId, setDisplayId] = useState(null);

    const [userIdLocal, setUserIdLocal] = useState(tokenService.idCompare());

    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });

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

    // Récupération du token dans le localStorage :
    const token = tokenService.recupToken();

    // Récupération du rôle de l'utilisateur :
    const role = tokenService.recupRole();

    const form = useRef()
    const post = useRef()
    const picture = useRef()
    const contain = useRef()


    const toggle = (id) => {

        if (displayId === id) {
            setDisplayId(null);
        } else {
            setDisplayId(id);
        }
    }

    /**
     * Supprimer un post
     * @param {number} id : id du post :
     */
    const postDelete = async (id) => {

        let confirmation = false;
        confirmation = window.confirm(
            'Confirmer la suppression du message !'
        );

        if (confirmation) {

            await axios.delete(`${process.env.REACT_APP_URL_API}api/post/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then((res) => {
                    if (res.status === 200) {
                        return res
                    }
                })
                .catch(err => console.error(err));

            fetchData();
        };
    };

    /**
     * Modifier un post
     * @param {number} id : id du post :
     */
    const postUpdate = async (id, e) => {

        e.preventDefault();

        // Supprimer la prévisualisation :
        setImage({
            ...image,
            file: picture.current.files[0],
            filepreview: null
        });

        let formData = new FormData();

        // Récupère l'id de l'utilisateur propriétaire du post :
        const user = await axios.get(`${process.env.REACT_APP_URL_API}api/post/${id}`);

        formData.append('post', post.current.value);
        formData.append('image', picture.current.files[0]);
        formData.append('userId', user.data.userId);

        // Modification du post :
        await axios.put(`${process.env.REACT_APP_URL_API}api/post/${id}`, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    return res
                }
            })
            .catch(err => console.error(err));

        toggle();

        fetchData();
    };

    /**
    * 
    * @param {number} postId
    * @param {number} item : vôte effectué sur le post :
    */
    const postEvaluate = async (postId, item) => {
        let like = [];
        if (item === 1)
            like = [1, postId, userIdLocal];
        else
            like = [0, postId, userIdLocal];

        await axios.post(`${process.env.REACT_APP_URL_API}api/post/like`, {
            like: item,
            postId: postId
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(function (res) {
            document.getElementById("like1_" + res.data.post_id).textContent = res.data.like1;
            document.getElementById("like0_" + res.data.post_id).textContent = res.data.like0;
        }).catch(err => {
            console.log(err.response.statusText);
            document.getElementById(`error_${postId}`).textContent = "Vous n'êtes pas connecté !";
            document.getElementById(`error_${postId}`).classList.add("my_red");
        })
    };

    return (
        <Fragment>
            {data.map(item => (
                <div key={item.id} className='posts__container' id={`${item.id}`} data-id={`${item.id}`} ref={contain}>
                    <div className='posts__profil'>
                        <div>
                            <div className='posts__avatar'>
                                <img src={item.user_picture} alt="avatar" />
                            </div>

                            <div className='posts__mail'>
                                {item.email}
                            </div>
                        </div>
                        <div>
                            <div>
                                Posté le : {dateFormat(item.createdAt)}
                            </div>
                        </div>
                    </div>
                    {((userIdLocal === item.user_id) || role === 1) &&
                        <div className='posts__modif'>
                            <button
                                id={`btn-${item.id}`}
                                onClick={() => toggle(item.id)}
                                className="btn-primary"
                            >Modifier</button>
                            <button
                                className="btn-primary"
                                onClick={() => postDelete(item.id)}
                            >Supprimer</button>
                        </div>
                    }
                    {
                        (displayId === item.id) &&
                        <div>
                            <div className='posts__container'>
                                <form onSubmit={(e) => postUpdate(item.id, e)} ref={form}>
                                    <div className='posts__form'>
                                        <label htmlFor="post-update">Nouveau message</label><br />
                                        <textarea
                                            type="textarea"
                                            id='post-update'
                                            name='post'
                                            ref={post}
                                            defaultValue={item.post} >
                                        </textarea> <br />
                                    </div>
                                    <div className='posts__form'>
                                        <input
                                            type="file"
                                            id='posts_picture'
                                            name='picture'
                                            accept='image/jpg, image/jpeg, image/png image/gif'
                                            onChange={(e) => handleChangeImage(e)}
                                            ref={picture}
                                        />
                                        <br />
                                        <label htmlFor="posts_picture" className='btn-primary disp-inl-block'>Nouvelle image</label>
                                        <br /><br />
                                    </div>
                                    {image.filepreview !== null &&
                                        <div className='posts_preview'>
                                            <img
                                                src={image.filepreview}
                                                alt="UploadImage" />
                                        </div>
                                    }
                                    <button className='btn-primary' type='submit'>Publier</button>
                                </form>
                            </div>
                        </div>
                    }

                    <div className='posts__img'>
                        {(item.post_picture && item.post_picture !== "") ?
                            <img src={item.post_picture} alt="post" /> :
                            <img src='' alt='' />}
                    </div>
                    <div className='posts__post'>
                        {item.post}
                    </div>

                    <div className='posts__eval'>
                        <div className='posts__icon'>
                            <i onClick={() => postEvaluate(item.id, 1)} className="fa-solid fa-thumbs-up fa-lg"></i>
                            <span id={"like1_" + item.id}>{item.like1}</span>
                        </div>
                        <div className='posts__icon'>
                            <i onClick={() => postEvaluate(item.id, 0)} className="fa-solid fa-thumbs-down fa-lg"></i>
                            <span id={"like0_" + item.id}>{item.like0}</span>
                        </div>
                    </div>
                    <span
                        id={`error_${item.id}`}
                        type="invalid"
                    />
                </div>
            )
            )}
        </Fragment >
    );
};

export default Posts;
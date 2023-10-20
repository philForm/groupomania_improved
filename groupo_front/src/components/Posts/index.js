import React, { useState, Fragment, useRef } from 'react';
import axios from 'axios';
import { tokenService } from '../../services/storage_service';

import PostEvaluate from '../PostEvaluate';
import PostProfil from '../PostProfil';
import PostModifDelete from '../PostModifDelete';
import PostModifForm from '../PostModifForm';

import "./posts.css";

/**
 * Publication et modification de posts :
 */
const Posts = ({ data, fetchData }) => {

    const [displayId, setDisplayId] = useState(null);

    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });

    const userIdLocal = tokenService.idCompare();

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


    const toggle = (id) => displayId === id ? setDisplayId(null) : setDisplayId(id);



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


    return (
        <Fragment>
            {data.map(item => (
                <div key={item.id} className='posts__container' id={`${item.id}`} data-id={`${item.id}`} ref={contain}>
                    <PostProfil item={item} />
                    {((userIdLocal === item.user_id) || role === 1) &&

                        <PostModifDelete item={item} toggle={toggle} postdel={postDelete} />
                    }
                    {
                        (displayId === item.id) &&
                        <PostModifForm
                            postUpdate={postUpdate}
                            handleChangeImage={handleChangeImage}
                            item={item}
                            form={form}
                            post={post}
                            picture={picture}
                            image={image}
                        />
                    }

                    <div className='posts__img'>
                        {(item.post_picture && item.post_picture !== "") &&
                            <img src={item.post_picture} alt="post" />
                        }
                    </div>
                    <div className='posts__post'>
                        {item.post}
                    </div>
                    <PostEvaluate token={token} item={item} />
                </div>
            )
            )}
        </Fragment >
    );
};

export default Posts;
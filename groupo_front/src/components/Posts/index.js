import React, { useState, Fragment, useRef, useContext } from 'react';
import { tokenService } from '@/services/storage.service';
import { accountService } from '@/services/account.service';

import PostEvaluate from '@/components/PostEvaluate';
import PostProfil from '@/components/PostProfil';
import PostModifDelete from '@/components/PostModifDelete';
import PostModifForm from '@/components/PostModifForm';

import { ThemeContext } from '@/contexts/ThemeContext';

import "@/components/Posts/posts.css";

/**
 * Publication et modification de posts :
 */
const Posts = ({ data, fetchData }) => {



    const [displayId, setDisplayId] = useState(null);
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });

    const { theme } = useContext(ThemeContext);

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

            await accountService.deletePost(id, token)
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
        const user = await accountService.getId(id);

        formData.append('post', post.current.value);
        formData.append('image', picture.current.files[0]);
        formData.append('userId', user.data.userId);

        await accountService.updatePost(id, formData, token)
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
                <div key={item.id}
                    className={`posts__container ${theme && 'posts__container-dark'}`}
                    id={`${item.id}`} data-id={`${item.id}`}
                    ref={contain}
                >
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
                    <div
                        className={`posts__post ${theme && 'textarea-dark'}`}
                    >
                        {item.post}
                    </div>
                    <PostEvaluate token={token} item={item} userId={userIdLocal} />
                </div>
            )
            )}
        </Fragment >
    );
};

export default Posts;
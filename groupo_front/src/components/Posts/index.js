import React, { useState, Fragment, useRef } from 'react';
import { tokenService } from '@/services/storage.service';
import { accountService } from '@/services/account.service';

import PostEvaluate from '@/components/PostEvaluate';
import PostProfil from '@/components/PostProfil';
import PostModifDelete from '@/components/PostModifDelete';
import PostModifForm from '@/components/PostModifForm';
import PostComment from '@/components/PostComment';
// import CommentCreate from '@/components/CommentCreate';

import { useTheme } from '@/hooks/useTheme';

import "@/components/Posts/posts.css";

/**
 * Publication et modification de posts :
 */
const Posts = ({ data, fetchData }) => {

    console.log(data)

    const [displayId, setDisplayId] = useState(null);
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });

    // const [displayComment, setDisplayComment] = useState({
    //     disp: "disp_none",
    //     id: null
    // });
    const [displayComment, setDisplayComment] = useState(null);

    const [displayCreateComment, setDisplayCreateComment] = useState(false);

    const toggleCreateComment = (id) => displayCreateComment === id ? setDisplayCreateComment(null) : setDisplayCreateComment(id);


    const { textareaTheme, postTheme } = useTheme();

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

    const form = useRef();
    const post = useRef();
    const picture = useRef();
    const contain = useRef();

    const imgRef = useRef({});
    const postRef = useRef({});

    const btnDisplayRef = useRef({});
    console.log(btnDisplayRef)

    const toggle = (id) => displayId === id ? setDisplayId(null) : setDisplayId(id);

    const handleDisplayComment = (id, ref) => {
        if (ref.current[id].id)
            displayComment === id ? setDisplayComment(null) : setDisplayComment(id);
    };
    // const handleDisplayComment = (id) => {
    //     (displayComment === "disp_bloc" && id) ?
    //         setDisplayComment({
    //             ...displayComment,
    //             disp: "disp_none",
    //             id: null
    //         }) :
    //         setDisplayComment({
    //             ...displayComment,
    //             disp: "disp_bloc",
    //             id: id
    //         })
    // };

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
                if (res.status === 201) {
                    console.log(res)
                    imgRef.current[id].src = res.data.resData.postPicture;
                    postRef.current[id].innerText = res.data.resData.post;
                    return res
                }
            })
            .catch(err => console.error(err));
        // try {
        //     const result = accountService.updatePost(id, formData, token);
        //     setRes(result)
        //     console.log(res)
        //     if (result.status === 201) {
        //         // props.getCommentFunct({ postId: props.postId });
        //         // imgRef.current[item.id].innerText = result.data.newComment;
        //         // document.forms["comment-modif_form"].reset();
        //     }
        // }
        // catch (error) {

        // }

        toggle();

        // fetchData();
    };


    return (
        <Fragment>
            {data.map(item => (
                <div key={item.id}
                    className={`posts__container ${postTheme}`}
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
                            postRef={postRef}
                        />
                    }

                    <div className='posts__img'>
                        {(item.post_picture && item.post_picture !== "") &&
                            <img
                                src={item.post_picture}
                                alt="post"
                                ref={el => (imgRef.current[item.id]) = el}
                            />
                        }
                    </div>
                    <div
                        className={`posts__post ${textareaTheme}`}
                        ref={el => (postRef.current[item.id]) = el}
                    >
                        {item.post}
                    </div>
                    <PostComment
                        itemId={item.id}
                        userId={userIdLocal}
                        displayComment={displayComment}
                        handleDisplayComment={handleDisplayComment}
                        btnDisplayRef={btnDisplayRef}
                        // setDisplayCreateComment={setDisplayCreateComment}
                        displayCreateComment={displayCreateComment}
                    />
                    <PostEvaluate
                        token={token}
                        item={item}
                        userId={userIdLocal}
                        toggleCreateComment={toggleCreateComment}
                    />
                </div>
            )
            )}
        </Fragment >
    );
};

export default Posts;
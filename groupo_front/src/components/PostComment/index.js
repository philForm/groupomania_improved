import { useEffect, useRef, useState } from "react"
import { accountService } from "@/services/account.service";
import { tokenService } from "@/services/storage.service";
// import CommentModifDelete from "@/components/CommentModifDelete";
import CommentCreate from "@/components/CommentCreate";
import CommentModifForm from "@/components/CommentModifForm";

import { dateFormat } from "@/functions/utils";
import { useTheme } from "@/hooks/useTheme";

import '@/components/PostComment/postComment.css';

const PostComment = ({ itemId, userId, displayComment, handleDisplayComment, btnDisplayRef }) => {

    const userIdLocal = tokenService.idCompare();
    // Récupération du rôle de l'utilisateur :
    const role = tokenService.recupRole();

    const { textareaTheme, btnTheme } = useTheme();

    const [comment, setComment] = useState([]);

    const [display, setDisplay] = useState(null);

    // Récupération du token dans le localStorage :
    const token = tokenService.recupToken();

    const valueRef = useRef({});
    // const countRef = useRef({});

    const toggle = (id) => display === id ? setDisplay(null) : setDisplay(id);

    const postId = { postId: itemId };

    const getCommentFunct = async (id) => {

        try {
            const result = await accountService.getComment(id);
            setComment(result.data);
            console.log(result.data.length)

        }
        catch (error) {
            console.log(error);
        }
    }

    const handleDeleteComment = async (id, postId) => {
        let confirmation = false;
        confirmation = window.confirm(
            'Confirmer la suppression du commentaire !'
        );

        if (confirmation) {

            await accountService.deleteComment(id, token)
                .then((res) => {
                    if (res.status === 201) {
                        getCommentFunct({ postId: postId });
                        // return res
                    }
                })
                .catch(err => console.error(err));

        };
    }

    useEffect(() => {
        getCommentFunct(postId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // if (comment !== undefined)
    //     console.log(comment)
    // for (let item in comment) {
    //     console.log(comment[item].comment)
    // }
    console.log(comment.length)

    return (
        <>
            {userIdLocal && <CommentCreate
                postId={itemId}
                userId={userId}
                getCommentFunct={getCommentFunct}
            />}
            {comment.length !== 0 &&
                <>
                    <button
                        className={btnTheme}
                        id={`display-comment-${itemId}`}
                        onClick={() => handleDisplayComment(itemId, btnDisplayRef)}
                        ref={el => (btnDisplayRef.current[itemId]) = el}
                    >
                        {comment.length === 1 ? "Afficher le commentaire" : `Afficher les ${comment.length} commentaires`}
                    </button>
                    {/* <div className="comment__count">
                        <span>
                            {comment.length}
                        </span>
                    </div> */}
                </>
            }
            {comment && comment.map(item => (
                displayComment === item.postId &&
                <div
                    key={item.commentId}
                    className="">
                    {/* {((userIdLocal === item.userId) || role === 1) &&
                        <CommentModifDelete
                            item={item}
                            toggle={toggle}
                            btnDisplayRef={btnDisplayRef}
                            getCommentFunct={getCommentFunct}
                        />
                    } */}

                    {/* {display === item.commentId &&
                        <CommentModifForm
                            commentId={item.commentId}
                            userId={item.userId}
                            postId={itemId}
                            getCommentFunct={getCommentFunct}
                            valueRef={valueRef}
                        />
                    } */}
                    <div className="comment__user">
                        <div>
                            <div className="nav__avatar">
                                <img src={item.avatar} alt="avatar du commentateur" />
                            </div>
                            <div className="comment__date">
                                <p>
                                    {item.email}
                                </p>
                                <p>
                                    {dateFormat(item.createdAt)}
                                </p>
                            </div>
                        </div>
                        {((userIdLocal === item.userId) || role === 1) &&
                            <div className="">
                                <i
                                    onClick={() => toggle(item.commentId)}
                                    className={`${btnTheme} fa-solid fa-pen-nib`}
                                ></i>
                                <i
                                    onClick={() => handleDeleteComment(item.commentId, item.postId)}
                                    className={`${btnTheme} fa-solid fa-trash`}
                                ></i>
                            </div>
                        }
                    </div>
                    <div
                        id={`comment-${item.commentId}`}
                        className={`posts__post comment__post ${textareaTheme}`}
                        // rend la ref dynamique :
                        ref={el => (valueRef.current[item.commentId]) = el}
                    >
                        {item.comment}
                    </div>
                    {display === item.commentId &&
                        <CommentModifForm
                            commentId={item.commentId}
                            userId={item.userId}
                            // postId={itemId}
                            getCommentFunct={getCommentFunct}
                            valueRef={valueRef}
                            toggle={toggle}
                        />
                    }
                </div>
            )
            )}
        </>
    )
}

export default PostComment;

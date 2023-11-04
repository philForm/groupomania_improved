import React, { useRef, useEffect } from "react";
import { accountService } from "@/services/account.service";
import "@/components/PostEvaluate/postEvaluate.css";

const PostEvaluate = ({ token, item, userId }) => {

    console.log(item.id);
    console.log(userId);

    const like1Ref = useRef();
    const like0Ref = useRef();
    const errorRef = useRef();

    const thumbUpRef = useRef();
    const thumbDownRef = useRef();

    // Ajoute un visuel des like de l'utilisateur sur les posts lorsque celui-ci est connecté :
    const evalInit = async (userId) => {

        const userIdObj = {
            userId: userId,
            postId: item.id
        };

        if (userId && token) {
            try {
                await accountService.sendId(userIdObj, token)
                    .then((res) => {
                        console.log(res)
                        if (res.status === 200) {
                            if (res.data.evaluation.data[0] === 0)
                                thumbDownRef.current.classList.add("evaluate");
                            if (res.data.evaluation.data[0] === 1)
                                thumbUpRef.current.classList.add("evaluate");
                        }
                    })
            }
            catch (error) {
                console.error(error);
            };

        }
    };

    useEffect(() => {
        evalInit(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    /**
    * Evaluation des posts :
    * @param {number} postId
    * @param {number} item : vote effectué sur le post :
    */
    const postEvaluate = async (postId, like) => {

        const likeObj = {
            like: like,
            postId: postId
        };

        await accountService.likePost(likeObj, token)
            .then(res => {
                console.log(res);

                like1Ref.current.textContent = res.data.like1;
                like0Ref.current.textContent = res.data.like0;

                const evaluateView = () => {

                    const thumbUp = thumbUpRef.current;
                    const thumbDown = thumbDownRef.current;
                    const thumbUpContains = thumbUp.classList.contains("evaluate");
                    const thumbDownContains = thumbDown.classList.contains("evaluate");

                    // Si like est + et on clique sur - , passe de like à dislike :
                    if (thumbUpContains && like === 0) {
                        thumbUp.classList.remove("evaluate");
                        thumbDown.classList.add("evaluate");
                    }
                    // Si like est + et on clique sur + , retrait du like :
                    else if (thumbUpContains && like === 1) {
                        thumbUp.classList.remove("evaluate");
                        thumbDown.classList.remove("evaluate");
                    }
                    // Si like est - et on clique sur - , retrait du dislike :
                    else if (thumbDownContains && like === 0) {
                        thumbDown.classList.remove("evaluate");
                    }
                    // Si like est - et on clique sur + , passe de dislike à like :
                    else if (thumbDownContains && like === 1) {
                        thumbDown.classList.remove("evaluate");
                        thumbUp.classList.add("evaluate");
                    }
                    // Si aucun like et on clique sur + , passe à like :
                    else if ((
                        !thumbDownContains &&
                        !thumbUpContains
                    ) && like === 1) {
                        thumbUp.classList.add("evaluate");
                    }
                    // Si aucun like et on clique sur - , passe à dislike :
                    else if ((
                        !thumbDownContains &&
                        !thumbUpContains
                    ) && like === 0) {
                        thumbDown.classList.add("evaluate");
                    }
                };

                evaluateView();



            }).catch(err => {
                console.log(err.response.statusText);
                errorRef.current.textContent = "Vous n'êtes pas connecté !";
                errorRef.current.classList.add("my_red");
            })
    };

    return (
        <>
            <div className='posts__eval'>
                <div className='posts__icon'>
                    <i
                        onClick={() => postEvaluate(item.id, 1)}
                        className="fa-solid fa-thumbs-up fa-lg"
                        id={"thumb-up_" + item.id}
                        ref={thumbUpRef}

                    ></i>
                    <span id={"like1_" + item.id} ref={like1Ref}>{item.like1}</span>
                </div>
                <div className='posts__icon'>
                    <i
                        onClick={() => postEvaluate(item.id, 0)}
                        className="fa-solid fa-thumbs-down fa-lg"
                        id={"thumb-down_" + item.id}
                        ref={thumbDownRef}
                    ></i>
                    <span id={"like0_" + item.id} ref={like0Ref}>{item.like0}</span>
                </div>
            </div>
            <span
                ref={errorRef}
                id={`error_${item.id}`}
                type="invalid"
            />
        </>
    )
}

export default PostEvaluate;

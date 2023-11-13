import { useTheme } from "@/hooks/useTheme";
import { useRef, useState } from "react";

import { accountService } from "@/services/account.service";
import { tokenService } from "@/services/storage.service";

const CommentModifForm = (props) => {

    console.log(props)

    const token = tokenService.recupToken();

    const formRef = useRef();
    const commentRef = useRef();
    const btnSubmit = useRef();

    const { textareaTheme, btnTheme } = useTheme();

    const [res, setRes] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(commentRef.current.value);

        // if (commentRef.current.value) {

        let data = new FormData();

        data.append('comment', commentRef.current.value);
        // data.append('commentId', parseInt(props.commentId));
        data.append('userId', parseInt(props.userId));

        for (let item of data)
            console.log(item);

        // await accountService.updateComment(props.commentId, data, token)
        //     .then((res) => {
        //         if (res.status === 201) {
        //             return res
        //         }
        //     })
        //     .catch(err => console.error(err));
        try {
            const result = await accountService.updateComment(props.commentId, data, token);
            setRes(result)
            console.log(result)
            console.log(props.valueRef)
            if (result.data.message !== "Aucune modification !") {
                // props.getCommentFunct({ postId: props.postId });
                props.valueRef.current[props.commentId].innerText = result.data.newComment;
                commentRef.current.innerText = result.data.newComment;
            }
            // document.forms["comment-modif_form"].reset();
        }
        catch (error) {
            console.log(error);
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} ref={formRef} name="comment-modif_form">
                <div className='posts__form'>
                    <label htmlFor="comment-modif">Modifier votre commentaire</label><br />
                    <textarea
                        className={textareaTheme}
                        type="textarea"
                        id='comment-modif'
                        name='comment-modif'
                        ref={commentRef}
                        defaultValue={props.comment}
                    /><br />
                </div>
                <button
                    className={btnTheme}
                    ref={btnSubmit}
                    type='submit'>Modifier</button>
            </form >

        </div>
    )
}

export default CommentModifForm;

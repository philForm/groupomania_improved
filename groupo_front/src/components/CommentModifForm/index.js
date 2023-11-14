
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

    const [message, setMessage] = useState(props.valueRef.current[props.commentId].innerText);

    const handleMessageChange = e => {
        // 👇️ access textarea value
        setMessage(e.target.value);
        console.log(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(commentRef.current.value);
        console.log(commentRef);

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
                // document.forms["comment-modif_form"].reset();
                // commentRef.current.value = result.data.newComment;
                // console.log(commentRef.current.defaultValue);
                commentRef.current.defaultValue = props.valueRef.current[props.commentId].innerText;
                // console.log(commentRef.current.defaultValue);
            }
        }
        catch (error) {
            console.log(error);
        }

    };

    console.log(res)

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
                        value={message}
                        onChange={handleMessageChange}
                        defaultValue={props.valueRef.current[props.commentId].innerText}
                    /><br />
                </div>
                <button
                    className={btnTheme}
                    ref={btnSubmit}
                    type='submit'
                >Modifier
                </button>
            </form >

        </div>
    )
}

export default CommentModifForm;

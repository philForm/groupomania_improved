import { useTheme } from "@/hooks/useTheme";
import { useRef } from "react";

import { accountService } from "@/services/account.service";
import { tokenService } from "@/services/storage.service";


const CommentCreate = (props) => {

    console.log(props)

    const token = tokenService.recupToken();

    const formRef = useRef();
    const commentRef = useRef()

    const { textareaTheme, btnTheme } = useTheme()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(commentRef.current.value);

        let data = new FormData();

        data.append('comment', commentRef.current.value);
        data.append('postId', parseInt(props.postId));
        data.append('userId', parseInt(props.userId));

        for (let item of data)
            console.log(item);

        await accountService.createComment(data, token)
            .then((res) => {
                if (res.status === 200) {
                    return res
                }
            })
            .catch(err => console.error(err));

        props.getCommentFunct({ postId: props.postId });

        document.forms["comment-create_form"].reset();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} ref={formRef} name="comment-create_form">
                <div className='posts__form'>
                    <label htmlFor="comment-create">Commentaire</label><br />
                    <textarea
                        className={textareaTheme}
                        type="textarea"
                        id='comment-create'
                        name='comment'
                        ref={commentRef}
                    /><br />
                </div>
                <button
                    className={btnTheme}
                    type='submit'>Publier</button>
            </form >

        </div>
    )
}

export default CommentCreate;

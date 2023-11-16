import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const PostModifForm = ({ postUpdate, handleChangeImage, item, form, post, picture, image, postRef }) => {

    const { btnTheme, postTheme, textareaTheme } = useTheme();

    const [message, setMessage] = useState(postRef.current[item.id].innerText);

    const handleMessageChange = () => {
        // 👇️ access textarea value
        setMessage(post.current.value);
    };


    return (
        <div
            className={`posts__container ${postTheme}`}
        >
            <form onSubmit={(e) => postUpdate(item.id, e)} ref={form}>
                <div className='posts__form'>
                    <label htmlFor="post-update">Nouveau message</label><br />
                    <textarea
                        className={textareaTheme}
                        type="textarea"
                        id='post-update'
                        name='post'
                        ref={post}
                        onChange={handleMessageChange}
                        defaultValue={message}
                    >
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
                    <label
                        htmlFor="posts_picture"
                        className={`${btnTheme} disp-inl-block`}
                    >Nouvelle image</label>
                    <br /><br />
                </div>
                {image.filepreview !== null &&
                    <div className='posts_preview'>
                        <img
                            src={image.filepreview}
                            alt="UploadImage" />
                    </div>
                }
                <button
                    className={btnTheme}
                    type='submit'>Publier
                </button>
            </form>
        </div>
    )
}

export default PostModifForm;
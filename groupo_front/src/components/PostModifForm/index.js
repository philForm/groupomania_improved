
const PostModifForm = ({ postUpdate, handleChangeImage, item, form, post, picture, image }) => {

    return (
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
    )
}

export default PostModifForm;
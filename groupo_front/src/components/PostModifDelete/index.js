import React from 'react'

const PostModifDelete = ({ item, toggle, postdel }) => {

    return (
        <div className='posts__modif'>
            <button
                id={`btn-${item.id}`}
                onClick={() => toggle(item.id)}
                className="btn-primary"
            >Modifier</button>
            <button
                className="btn-primary"
                onClick={() => postdel(item.id)}
            >Supprimer</button>
        </div>
    )
}

export default PostModifDelete;
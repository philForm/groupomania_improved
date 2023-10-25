import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext';

const PostModifDelete = ({ item, toggle, postdel }) => {

    const { handleDarkTheme } = useContext(ThemeContext);

    const { btnTheme } = handleDarkTheme;

    return (
        <div className='posts__modif'>
            <button
                id={`btn-${item.id}`}
                onClick={() => toggle(item.id)}
                className={btnTheme}
            >Modifier</button>

            <button
                className={btnTheme}
                onClick={() => postdel(item.id)}
            >Supprimer</button>
        </div>
    )
}

export default PostModifDelete;
import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext';

const PostModifDelete = ({ item, toggle, postdel }) => {

    const { theme } = useContext(ThemeContext);

    const handleDarkTheme = () =>
        theme ? 'btn-primary-dark' : "btn-primary";

    return (
        <div className='posts__modif'>
            <button
                id={`btn-${item.id}`}
                onClick={() => toggle(item.id)}
                className={handleDarkTheme()}
            >Modifier</button>

            <button
                className={handleDarkTheme()}
                onClick={() => postdel(item.id)}
            >Supprimer</button>
        </div>
    )
}

export default PostModifDelete;
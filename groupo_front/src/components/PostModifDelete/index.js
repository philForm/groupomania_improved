import { useTheme } from '../../hooks/useTheme';

const PostModifDelete = ({ item, toggle, postdel }) => {

    const { btnTheme } = useTheme();

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
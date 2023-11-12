import { useTheme } from '@/hooks/useTheme';
import { accountService } from '@/services/account.service';
import { tokenService } from '@/services/storage.service';

const CommentModifDelete = ({ item, toggle, btnDisplayRef, getCommentFunct }) => {

    console.log(item)

    console.log(btnDisplayRef)

    const { btnTheme } = useTheme();

    // Récupération du token dans le localStorage :
    const token = tokenService.recupToken();

    const handleDeleteComment = async (id) => {
        let confirmation = false;
        confirmation = window.confirm(
            'Confirmer la suppression du commentaire !'
        );

        if (confirmation) {

            await accountService.deleteComment(id, token)
                .then((res) => {
                    if (res.status === 201) {
                        getCommentFunct({ postId: item.postId });
                        return res
                    }
                })
                .catch(err => console.error(err));

        };
    }

    return (
        <div className='posts__modif'>
            <button
                id={`btn-${item.commentId}`}
                onClick={() => toggle(item.commentId)}
                className={btnTheme}
            >Modifier</button>

            <button
                className={btnTheme}
                onClick={() => handleDeleteComment(item.commentId)}
            >Supprimer</button>
        </div>
    )
}

export default CommentModifDelete;
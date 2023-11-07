import { useEffect, useState } from "react"
import { accountService } from "@/services/account.service";
import { tokenService } from "@/services/storage.service";
import PostModifDelete from "@/components/PostModifDelete";
import CommentCreate from "@/components/CommentCreate";

import { dateFormat } from "@/functions/utils";
import { useTheme } from "@/hooks/useTheme";

import '@/components/PostComment/postComment.css';

const PostComment = ({ itemId, userId, displayComment, handleDisplayComment }) => {

    const userIdLocal = tokenService.idCompare();
    // Récupération du rôle de l'utilisateur :
    const role = tokenService.recupRole();

    const { textareaTheme, btnTheme } = useTheme();

    const [comment, setComment] = useState([]);

    const getCommentFunct = async () => {

        const postId = { postId: itemId };

        try {
            const result = await accountService.getComment(postId);
            if (result.data.length !== 0)
                setComment(result.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCommentFunct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (comment !== undefined)
        console.log(comment)
    for (let item in comment) {
        console.log(comment[item].comment)
    }

    return (
        <>
            {userIdLocal && <CommentCreate postId={itemId} userId={userId} />}
            <button
                className={btnTheme}
                onClick={() => handleDisplayComment(itemId)}
            >
                Afficher les commentaires
            </button>
            {comment && comment.map(item => (
                displayComment === item.postId &&
                <div
                    className="">
                    {((userIdLocal === item.userId) || role === 1) &&
                        <PostModifDelete item={item} />
                    }
                    <div key={item.postId} className="comment__user">
                        <div className="nav__avatar">
                            <img src={item.avatar} alt="avatar du commentateur" />
                        </div>
                        <div className="comment__date">
                            <p>
                                {item.email}
                            </p>
                            <p>
                                {dateFormat(item.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div key={item.postId} className={`posts__post comment__post ${textareaTheme}`}>
                        {item.comment}
                    </div>
                </div>
            )
            )}
        </>
    )
}

export default PostComment;

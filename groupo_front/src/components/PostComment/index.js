import { useEffect, useState } from "react"
import { accountService } from "@/services/account.service";
import { tokenService } from "@/services/storage.service";
import PostModifDelete from "@/components/PostModifDelete";

const PostComment = ({ item, userId }) => {

    const userIdLocal = tokenService.idCompare();
    // Récupération du rôle de l'utilisateur :
    const role = tokenService.recupRole();

    const [comment, setComment] = useState([]);

    const getCommentFunct = async () => {

        const postId = { postId: item };

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
            {comment.map(item => (
                (comment !== undefined) &&
                <>
                    {((userIdLocal === item.userId) || role === 1) &&

                        <PostModifDelete item={item} />
                    }
                    <div key={item.postId} className='posts__post'>{item.comment}</div>
                </>
            )
            )}
        </>
    )
}

export default PostComment;

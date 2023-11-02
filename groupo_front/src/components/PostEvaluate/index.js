import { accountService } from "@/services/account.service";
import "@/components/PostEvaluate/postEvaluate.css";

const PostEvaluate = ({ token, item, userId }) => {

    console.log(item);
    console.log(userId);

    /**
    * Evaluation des posts :
    * @param {number} postId
    * @param {number} item : vote effectué sur le post :
    */
    const postEvaluate = async (postId, like) => {

        const likeObj = {
            like: like,
            postId: postId
        };

        console.log(like)
        like = parseInt(like)

        await accountService.likePost(likeObj, token)
            .then(res => {
                console.log(res)

                const thumbUp = document.getElementById(`thumb-up_${res.data.post_id}`);
                const thumbDown = document.getElementById(`thumb-down_${res.data.post_id}`);

                document.getElementById("like1_" + res.data.post_id).textContent = res.data.like1;
                document.getElementById("like0_" + res.data.post_id).textContent = res.data.like0;

                // Si like est + et on clique sur - , passe de like à dislike :
                if (thumbUp.classList.contains("evaluate") && like === 0) {
                    thumbUp.classList.remove("evaluate")
                    thumbDown.classList.add("evaluate")
                    console.log("passe de like à dislike")
                }
                // Si like est + et on clique sur + , retrait du like :
                else if (thumbUp.classList.contains("evaluate") && like === 1) {
                    thumbUp.classList.remove("evaluate")
                    thumbDown.classList.remove("evaluate")
                    console.log("retrait du like")
                }
                // Si like est - et on clique sur - , retrait du dislike :
                else if (thumbDown.classList.contains("evaluate") && like === 0) {
                    thumbDown.classList.remove("evaluate")
                    console.log("retrait du dislike")
                }
                // Si like est - et on clique sur + , passe de dislike à like
                else if (thumbDown.classList.contains("evaluate") && like === 1) {
                    thumbDown.classList.remove("evaluate")
                    thumbUp.classList.add("evaluate")
                }
                // Si aucun like et on clique sur + , passe à like :
                else if ((
                    !thumbDown.classList.contains("evaluate") &&
                    !thumbUp.classList.contains("evaluate")
                ) && like === 1) {
                    thumbUp.classList.add("evaluate")
                }
                // Si aucun like et on clique sur - , passe à dislike :
                else if ((
                    !thumbDown.classList.contains("evaluate") &&
                    !thumbUp.classList.contains("evaluate")
                ) && like === 0) {
                    thumbDown.classList.add("evaluate")
                }


            }).catch(err => {
                console.log(err.response.statusText);
                document.getElementById(`error_${postId}`).textContent = "Vous n'êtes pas connecté !";
                document.getElementById(`error_${postId}`).classList.add("my_red");
            })
    };

    return (
        <>
            <div className='posts__eval'>
                <div className='posts__icon'>
                    <i
                        onClick={() => postEvaluate(item.id, 1)}
                        className="fa-solid fa-thumbs-up fa-lg"
                        id={"thumb-up_" + item.id}
                    ></i>
                    <span id={"like1_" + item.id}>{item.like1}</span>
                </div>
                <div className='posts__icon'>
                    <i
                        onClick={() => postEvaluate(item.id, 0)}
                        className="fa-solid fa-thumbs-down fa-lg"
                        id={"thumb-down_" + item.id}
                    ></i>
                    <span id={"like0_" + item.id}>{item.like0}</span>
                </div>
            </div>
            <span
                id={`error_${item.id}`}
                type="invalid"
            />
        </>
    )
}

export default PostEvaluate;

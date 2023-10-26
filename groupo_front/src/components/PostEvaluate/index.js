import { accountService } from "@/services/account.service";

const PostEvaluate = ({ token, item }) => {

    /**
    * Evaluation des posts :
    * @param {number} postId
    * @param {number} item : vote effectué sur le post :
    */
    const postEvaluate = async (postId, like) => {

        const likeObj = {
            like: like,
            postId: postId
        }

        await accountService.likePost(likeObj, token)
            .then(res => {
                document.getElementById("like1_" + res.data.post_id).textContent = res.data.like1;
                document.getElementById("like0_" + res.data.post_id).textContent = res.data.like0;
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
                    <i onClick={() => postEvaluate(item.id, 1)} className="fa-solid fa-thumbs-up fa-lg"></i>
                    <span id={"like1_" + item.id}>{item.like1}</span>
                </div>
                <div className='posts__icon'>
                    <i onClick={() => postEvaluate(item.id, 0)} className="fa-solid fa-thumbs-down fa-lg"></i>
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

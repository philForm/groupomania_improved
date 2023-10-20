import { dateFormat } from "../../functions/utils";

const PostProfil = ({ item }) => {
    return (
        <div className='posts__profil'>
            <div>
                <div className='posts__avatar'>
                    <img src={item.user_picture} alt="avatar" />
                </div>

                <div className='posts__mail'>
                    {item.email}
                </div>
            </div>
            <div>
                <div>
                    Posté le : {dateFormat(item.createdAt)}
                </div>
            </div>
        </div>
    )
}

export default PostProfil;

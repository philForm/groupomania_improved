import { dateFormat } from "../../functions/utils";
import { useTheme } from "../../hooks/useTheme";

const PostProfil = ({ item }) => {

    const { avatarTheme } = useTheme();

    return (
        <div className='posts__profil'>
            <div>
                <div
                    className={`posts__avatar ${avatarTheme}`}
                >
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

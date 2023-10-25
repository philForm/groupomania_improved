import { useContext } from "react";
import { dateFormat } from "../../functions/utils";
import { ThemeContext } from "../../contexts/ThemeContext";

const PostProfil = ({ item }) => {

    const { handleDarkTheme } = useContext(ThemeContext);

    const { avatarTheme } = handleDarkTheme;

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

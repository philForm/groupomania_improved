import { useContext } from "react";
import { dateFormat } from "../../functions/utils";
import { ThemeContext } from "../../contexts/ThemeContext";

const PostProfil = ({ item }) => {

    const { theme } = useContext(ThemeContext);

    return (
        <div className='posts__profil'>
            <div>
                <div
                    className={`posts__avatar ${theme && 'avatar-dark'}`}
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

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenService } from "@/services/storage.service";

import logo from "@/assets/logo_groupomania_navbar.png";
import shut from "@/assets/button-icon-shut-cliparts.png";

import { useTheme } from "@/hooks/useTheme";

import "@/components/Navbar/navbar.css";

/**
 * Barre de navigation :
 */
const Navbar = () => {

  const deconnect = useRef();
  const signup = useRef();

  const navigate = useNavigate();

  const { navTheme, connectTheme, avatarTheme, btnTxtTheme, toggleTheme } = useTheme();

  const [logged, setLogged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(tokenService.idCompare());
  // const [toggle, setToggle] = useState(false)


  /**
     * Connecte un utilisateur : 
     * @returns {boolean}
     */
  const isLogged = () => tokenService.isLogged() ? true : false;

  /**
   * Déconnecte un utilisateur :
   */
  const logout = () => {
    tokenService.logOut();
    deconnect.current.classList.value = "disp_none";
    isLogged(logged);
    setLogged(false);
    setUserId(null);
    navigate("/form");
  };

  return (
    <div
      className={`fixe nav nav__pad nav__height ${navTheme}`}
    >
      <div className="nav__logo">
        <img src={logo} alt="logo" className="logo App-logo" />

        <div className="vertical_center"
          // className={btnTheme}
          onClick={() => toggleTheme()}
        >
          <i className={`fa-regular ${btnTxtTheme}`}></i>
        </div>

      </div>
      <div
      // className="nav"
      >
        {isLogged(logged) ? (
          <div
            className={`connect ${connectTheme}`}
            ref={deconnect}>
            <div
              className={`nav__avatar ${avatarTheme}`}
            >
              <Link to={"/form/profil"}>
                <img
                  id="user_avatar"
                  // src={data.user_picture}
                  alt="avatar" />
              </Link>
            </div>
            <div className="popup">Changez l'image de votre avatar</div>
            <div className="nav__deconnect">
              <button
                onClick={logout}
                className="nav__deconnect"
              >
                <img src={shut} alt="icone de déconnexion" />
              </button>
            </div>
            <div className="popup">Déconnexion</div>
          </div>
        ) : (
          <ul className="nav nav_mob">
            <li className="">
              <Link className="" aria-current="page" to="/">Accueil</Link>
            </li>
            <li className="nav" id="nav-signup">
              <Link className="nav-link" ref={signup} to="/form">Inscription</Link>
            </li>
          </ul>
        )
        }
      </div>
    </div >
  )
};

export default Navbar; 
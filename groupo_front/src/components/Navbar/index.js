import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenService } from "../../services/storage_service";

import logo from "../../assets/logo_groupomania_navbar.png";
import shut from "../../assets/button-icon-shut-cliparts.png";

import "./navbar.css";

/**
 * Barre de navigation :
 */
const Navbar = () => {

  const deconnect = useRef();
  const signup = useRef();

  const navigate = useNavigate();

  const [logged, setLogged] = useState(false);
  const [userId, setUserId] = useState(tokenService.idCompare());
  const [data, setData] = useState([]);
  const [display, setDisplay] = useState(true)


  /**
   * Connecte un utilisateur :
   * @param {boolean} logged 
   * @returns {boolean}
   */
  const isLogged = (logged) => {
    if (tokenService.isLogged()) {
      logged = true;
      // setDisplay(false)
    } else {
      logged = false;
      // setDisplay(true)
    }
    return logged;
  };

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
    <div className="fixe nav nav__pad nav__height">
      <div>
        <img src={logo} alt="logo" className="logo App-logo" />
      </div>
      <div className="nav">
        {!isLogged(logged) &&
          <ul className="nav nav_mob">
            <li className="">
              <Link className="" aria-current="page" to="/">Accueil</Link>
            </li>
            <li className="nav" id="nav-signup">
              <Link className="nav-link" ref={signup} to="/form">Inscription</Link>
            </li>
          </ul>
        }
        {isLogged(logged) &&
          <div className="connect" ref={deconnect}>
            <div className='nav__avatar'>
              <Link to={"/form/profil"}>
                <img id="user_avatar" src={data.user_picture} alt="avatar" />
              </Link>
            </div>
            <div className="popup">Changez l'image de votre avatar</div>
            <div className="nav__deconnect">
              <button onClick={logout} className="nav__deconnect">
                <img src={shut} alt="icone de déconnexion" />
              </button>
            </div>
            <div className="popup">Déconnexion</div>
          </div>
        }
      </div>
    </div >
  )
};

export default Navbar; 
import { useEffect, useState } from "react";
import axios from "axios";
import PostCreate from "../PostCreate";
import Posts from "../Posts";

import "./home.css";
import { tokenService } from "../../services/storage_service";

/**
 * Création et listage de tous les posts :
 */
function Home() {

  const [data, setData] = useState([]);

  const userId = tokenService.idCompare();

  /**
   * Récupère dans la BDD les infos de l'utilisateur :
   */
  const fetchUser = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL_API}api/auth/${userId}`);
      document.getElementById('user_avatar').src = result.data.user_picture;
    }
    catch (error) {
      console.error(error);
    };

  };

  if (userId)
    fetchUser();

  /**
   * Récupère tous les posts de la BDD
   */
  const fetchData = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL_API}api/post`);
      // Le résultat est assigné à data du useState
      setData(result.data);
    }
    catch (error) {
      console.error(error);
    };
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {userId && <PostCreate fetchData={fetchData} />}
      <Posts data={data} fetchData={fetchData} />
    </div>
  );

};

export default Home;

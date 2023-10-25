import { useEffect, useState } from "react";
import PostCreate from "../PostCreate";
import Posts from "../Posts";

import { tokenService } from "../../services/storage.service";
import { accountService } from "../../services/account.service";

import "./home.css";

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
      const result = await accountService.getUser(userId)
      document.getElementById('user_avatar').src = result.data.user_picture;
    }
    catch (error) {
      console.error(error);
    };

  };


  /**
   * Récupère tous les posts de la BDD
  */
  const fetchData = async () => {
    try {
      const result = await accountService.getAllPosts();
      // Le résultat est assigné à data du useState
      setData(result.data);
    }
    catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    if (userId)
      fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

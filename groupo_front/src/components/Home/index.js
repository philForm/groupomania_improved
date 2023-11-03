import { useEffect, useState } from "react";
import PostCreate from "@/components/PostCreate";
import Posts from "@/components/Posts";

import { tokenService } from "@/services/storage.service";
import { accountService } from "@/services/account.service";

import "@/components/Home/home.css";

/**
 * Création et listage de tous les posts :
 */
const Home = () => {

  const [data, setData] = useState([]);

  const userId = tokenService.idCompare();
  const token = tokenService.recupToken();

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

  // Ajoute un visuel des like de l'utilisateur sur les posts lorsque celui-ci est connecté :
  (async (userId) => {

    const userIdObj = {
      userId: userId
    };

    if (userIdObj && token) {
      try {
        await accountService.sendId(userIdObj, token)
          .then((res) => {
            if (res.status === 200) {
              for (let item of res.data) {
                if (item.evaluation.data[0] === 0) {
                  document.getElementById(`thumb-down_${item.post}`).classList.add("evaluate");
                }
                if (item.evaluation.data[0] === 1) {
                  document.getElementById(`thumb-up_${item.post}`).classList.add("evaluate");
                }

              }
            }
          })
      }
      catch (error) {
        console.error(error);
      };

    }
  })(userId);



  return (
    <div className="App">
      {userId && <PostCreate fetchData={fetchData} />}
      <Posts data={data} fetchData={fetchData} />
    </div>
  );

};

export default Home;

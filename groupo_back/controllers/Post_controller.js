const { QueryTypes } = require("sequelize");
const fs = require("fs");
const Db = require("../db/db.js");
const utf8 = require("utf8");

/**
 * Renvoie l'Id de la requête et l'Id de la BDD. Permet de vérifier si un élément correspondant à l'id de la requête est présent dans la BDD :
 * @param {*} req 
 * @returns {object[]}
 */
const idOfBd = async (req, table) => {

    // Récupération de l'id dans les paramètres de la requête
    const reqId = JSON.parse(req.params.id);

    // Sélection dans la BDD l'élément ayant le même id que la requête.
    let dbId = await Db.query(
        `SELECT id FROM ${table} WHERE id = ?;`,
        // model :  `SELECT id FROM posts WHERE id = ?;`,
        // request,
        {
            replacements: [reqId],
            type: QueryTypes.SELECT
        }
    );

    let result
    for (let item in dbId) {
        result = dbId[item].id
        console.log(result);
    };
    return [result, reqId];

}


/**
 * Création d'un message
 */
const createPost = async (req, res, next) => {

    let { body, file } = req;
    let postPicture = "";

    // Création de l'URL de l'image
    if (file != undefined) {

        const name = file.filename
        postPicture = `${req.protocol}://${req.get('host')}/images/${name}`;

    }
    else
        postPicture = "";

    await Db.query(`
            INSERT INTO posts (post, post_picture, user_id)
            VALUES (?,?,?);`,
        {
            replacements: [
                body.post,
                postPicture,
                body.userId
            ],
            type: QueryTypes.INSERT
        }
    ).then(() => {
        res.status(201).json({ message: "Message envoyé !" });
    })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Envoie tous les messages
 */
const sendAllPosts = async (req, res, next) => {

    const [posts] = await Db.query(`
        SELECT email, user_picture, post, post_picture, posts.id, posts.user_id, posts.createdAt,
        IFNULL(B.like1, 0) AS like1, IFNULL(C.like0, 0) AS like0 
        FROM posts 
        INNER JOIN users 
        ON users.id = posts.user_id AND is_censored = 0
        LEFT OUTER JOIN
        (SELECT COUNT(*) as like1, post_id FROM likes WHERE post_like=1 GROUP BY post_id) B
        ON posts.id = B.post_id
        LEFT OUTER JOIN
        (SELECT COUNT(*) as like0, post_id FROM likes WHERE post_like=0 GROUP BY post_id) C
        ON posts.id = C.post_id
        ORDER BY posts.createdAt DESC;
        `
    )
    res.send(posts);

};



/**
 * Recherche le propriétaire d'un post :
 */
const postUserFind = async (req, res, next) => {
    const [user] = await Db.query(`
        SELECT user_id FROM posts WHERE id = ?`,
        {
            replacements: [req.params.id],
            type: QueryTypes.SELECT
        }
    );
    res.status(200).json({
        userId: user.user_id
    })
};

/**
 * Modifie un Post :
 */
const modifyPost = async (req, res, next) => {

    /// Tableau qui récupère les Ids renvoyés par idOfBd().
    // const tab = (await idOfBd(req, selectIdFromPost)).map(el => el);
    // const tab = (await idOfBd(req, "posts")).map(el => el);
    const [result, reqId] = await idOfBd(req, "posts");

    const { userId, role } = req.auth;

    let postPicture = "";

    /// Si dans la BDD un Id correspond à l'Id de la requête, le message est modifié  :
    if (result != undefined) {

        // On sélectionne dans la BDD les éléments visés par la modification :
        const [postBDD] = await Db.query(`
            SELECT post, post_picture FROM posts 
            WHERE id = ? 
            AND (user_id = ? OR ? = 1);`,
            {
                replacements: [reqId, userId, role],
                type: QueryTypes.SELECT
            }
        );
        // Création d'un OBJET vide qui recevra les réponses :
        let resObj = {}
        // On vérifie si une image est présente dans la requête :
        if (postBDD && req.file != undefined) {

            // Récupération du nom de l'image à partir de l'URL dans la BDD :
            const image = postBDD.post_picture.split('/images/')[1];
            // Si une image existe elle est supprimée du dossier :
            if (image) {
                // Suppression de l'ancienne image du dossier images :
                // fs.unlink(`images/${image}`, (err) => {
                //     if (err) throw err;
                // });
                try {
                    fs.unlink(`images/${image}`);
                } catch (err) {
                    console.log(err);
                }
            }

            // Envoi de l'URL de la nouvelle image dans la BDD :
            postPicture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            await Db.query(`
                UPDATE posts
                SET post_picture = ?
                WHERE id = ?;`,
                {
                    replacements: [postPicture, reqId],
                    type: QueryTypes.PUT
                }
            ).then(() => {
                resObj.message1 = "L'image a été modifiée !";
            })
                .catch(error => res.status(500).json({ error }));
        }
        // Vérification de la modification du message :
        if (postBDD && postBDD.post != req.body.post) {

            await Db.query(`
                UPDATE posts
                SET post = ?
                WHERE id = ?;`,
                {
                    replacements: [req.body.post, reqId],
                    type: QueryTypes.PUT
                }
            ).then(() => {
                resObj.message2 = "Le message a été modifié !";
            })
                .catch(error => res.status(500).json({ error }));

        };
        Object.keys(resObj).length !== 0 ?
            res.status(201).json(resObj)
            :
            res.status(201).json({ message: "Aucune modification !" });
    } else
        res.status(404).json({ message: "Post introuvable !" });
}

/**
 * Supprime un Post
 */
const deletePost = async (req, res, next) => {

    /// Tableau qui récupère les Ids renvoyés par idOfBd() :
    // const tab = (await idOfBd(req, selectIdFromPost)).map(el => el);
    const [result, reqId] = await idOfBd(req, "posts");

    const { userId, role } = req.auth;

    /// Si dans la BDD un Id correspond à l'Id de la requête, le message est supprimé.
    if (result != undefined) {
        // Sélection de l'URL de l'image à supprimer du dossier images :
        const [imageUrl] = await Db.query(`
            SELECT post_picture 
            FROM posts WHERE id = ? 
            AND (user_id = ? OR ? = 1);`,
            {
                replacements: [reqId, userId, role],
                type: QueryTypes.SELECT
            }
        );

        // Vérification de l'existence de l'URL de l'image :
        if (imageUrl && imageUrl.post_picture) {

            // Récupération du nom de l'image à partir de l'URL :
            const image = imageUrl.post_picture.split('/images/')[1];
            // Suppression de l'image :
            // fs.unlink(`images/${image}`, (err) => {
            //     if (err) throw err;
            // });
            try {
                fs.unlink(`images/${image}`);
            } catch (err) {
                console.log(err);
            }
        }
        // Suppression du post :
        await Db.query(`
            DELETE FROM posts
            WHERE id = ? 
            AND (user_id = ? OR ? = 1);`,
            {
                replacements: [reqId, userId, role],
                type: QueryTypes.DELETE
            }
        ).then(async () => {
            let [post] = await Db.query(`
                SELECT id FROM posts WHERE id = ?;`,
                {
                    replacements: [reqId],
                    type: QueryTypes.SELECT
                }
            );

            if (!post)
                res.status(201).json({ message: "Message supprimé !" });
            else
                res.status(401).json({ message: "Vous n'êtes pas autorisé à supprimer ce message !" });
        })
            .catch(error => res.status(500).json({ error }));
    } else
        res.status(404).json({ message: "Post introuvable !" });

}

/**
 * like et dislike :
 */
const postLiked = async (req, res, next) => {

    const { like, postId } = req.body
    const userId = req.auth.userId

    // Si l'utilisateur est connecté :
    if (userId) {

        // Vérification que l'utilisateur n'a pas déjà liked le post :
        const [likeBdd] = await Db.query(
            `SELECT * FROM likes WHERE post_id = ? AND user_id = ?;`,
            {
                replacements: [postId, userId],
                type: QueryTypes.SELECT
            }
        );

        // Si l'utilisateur n'a pas encore liked, on enregistre son like :
        if (likeBdd == undefined) {
            await Db.query(
                `INSERT INTO likes (post_like, post_id, user_id) VALUES (?,?,?);`,
                {
                    replacements: [like, postId, userId],
                    type: QueryTypes.INSERT
                }
            );

        }
        // Si l'utilisateur a déjà liked, on observe son vote dans la BDD :
        else {

            // Si le vote de la BDD est différent du nouveau vote, on modifie dans la BDD, et on met à jour le décompte des like et dislike :
            if (likeBdd.post_like.readInt8() !== like) {

                await Db.query(`
                    UPDATE likes
                    SET post_like = ?
                    WHERE id = ?;`,
                    {
                        replacements: [like, likeBdd.id],
                        type: QueryTypes.PUT
                    }
                );

            }
            // Si le vote est identique, on supprime l'évaluation :
            else {
                await Db.query(`
                    DELETE FROM likes 
                    WHERE id = ?;`,
                    {
                        replacements: [likeBdd.id],
                        type: QueryTypes.DELETE
                    }
                );
            };
        };

        let [postLikes] = await Db.query(`
            SELECT A.post_id, IFNULL(B.like1, 0) AS like1, IFNULL(C.like0, 0) AS like0 FROM
            (SELECT ? as post_id) A
            LEFT OUTER JOIN
            (SELECT COUNT(*) as like1, post_id FROM likes WHERE post_id=? AND post_like=1) B
            ON A.post_id = B.post_id
            LEFT OUTER JOIN
            (SELECT COUNT(*) as like0, post_id FROM likes WHERE post_id=? AND post_like=0) C
            ON A.post_id = C.post_id;
            `,
            {
                replacements: [postId, postId, postId],
                type: QueryTypes.SELECT
            }
        );
        res.send(postLikes);
    }
    else {
        res.status(401).json({ message: "Vous n'êtes pas connecté !" });
    };
};

/**
 * 
 */
const sendEvaluationForOneUser = async (req, res, next) => {

    const { userId, postId } = req.body;

    const [postsEval] = await Db.query(`
        SELECT 
        post_like  evaluation,
        user_id  utilisateur,
        post_id  post
        FROM likes
        WHERE user_id = ? AND post_id = ?;
        `,
        {
            replacements: [userId, postId],
            type: QueryTypes.SELECT
        }
    )
    res.send(postsEval);

};


const sendComment = async (req, res, next) => {

    const { postId } = req.body;

    const comments = await Db.query(`
        SELECT comments.id commentId, comment, user_id userId, post_id postId,
        users.user_picture avatar,
        users.email email,
        comments.id commentId,
        comments.createdAt
        FROM comments
        INNER JOIN users 
        ON users.id = comments.user_id
        WHERE post_id = ?
        ORDER BY comments.createdAt DESC;
        `,
        {
            replacements: [postId],
            type: QueryTypes.SELECT
        }
    )
    res.send(comments);
}

/**
 * Création d'un commentaire sur un post :
 */
const createComment = async (req, res, next) => {

    let { comment, postId, userId } = req.body;

    if (comment) {

        await Db.query(`
                INSERT INTO comments (comment, post_id, user_id)
                VALUES (?,?,?);`,
            {
                replacements: [
                    comment,
                    postId,
                    userId
                ],
                type: QueryTypes.INSERT
            }
        ).then(() => {
            res.status(201).json({ message: "Commentaire envoyé !" });
        })
            .catch(error => res.status(500).json({ error }));
    }
    else {
        res.status(201).json({ message: "Le commentaire est vide !" });
    }

};

/**
 * Modifie un commentaire sur un post et envoie le commentaire modifié :
 */
const modifyComment = async (req, res, next) => {
    /// Tableau qui récupère les Ids renvoyés par idOfBd().
    const [result, reqId] = await idOfBd(req, "comments");

    const { userId, role } = req.auth;
    console.log("req.auth : " + req.auth);
    console.log("req.body : " + req.body)

    console.log("req.body.userId : " + req.body.userId)
    console.log("req.body.comment : " + req.body.comment)

    /// Si dans la BDD un Id correspond à l'Id de la requête, le message est modifié :
    if (result != undefined) {

        // On sélectionne dans la BDD les éléments visés par la modification :
        const [postBDD] = await Db.query(`
            SELECT comment FROM comments 
            WHERE id = ? 
            AND (user_id = ? OR ? = 1);`,
            {
                replacements: [reqId, userId, role],
                type: QueryTypes.SELECT
            }
        );
        console.log("postBDD : " + postBDD.comment);
        // Création d'un OBJET vide qui recevra les réponses :
        let resObj = {}

        // Vérification de la modification du message :
        if (postBDD && postBDD.comment != req.body.comment) {

            await Db.query(`
                UPDATE comments
                SET comment = ?
                WHERE id = ?;`,
                {
                    replacements: [req.body.comment, reqId],
                    type: QueryTypes.PUT
                }
            ).then(() => {
                resObj.message = "Le message a été modifié !";
            })
                .catch(error => res.status(500).json({ error }));

            const [newComment] = await Db.query(
                `SELECT comment FROM comments WHERE id = ?`,
                {
                    replacements: [reqId],
                    type: QueryTypes.SELECT
                }
            )
            resObj.newComment = newComment.comment;
        };
        Object.keys(resObj).length !== 0 ?
            res.status(201).json(resObj)
            :
            res.status(201).json({ message: "Aucune modification !" });
    } else
        res.status(404).json({ message: "Commentaire introuvable !" });
};

/**
 * Supprime un Post
 */
const deleteComment = async (req, res, next) => {

    /// Tableau qui récupère les Ids renvoyés par idOfBd() :
    const [result, reqId] = await idOfBd(req, "comments");

    const { userId, role } = req.auth;

    /// Si dans la BDD un Id correspond à l'Id de la requête, le message est supprimé.
    if (result != undefined) {

        // Suppression du post :
        await Db.query(`
            DELETE FROM comments
            WHERE id = ? 
            AND (user_id = ? OR ? = 1);`,
            {
                replacements: [reqId, userId, role],
                type: QueryTypes.DELETE
            }
        ).then(async () => {
            let [comment] = await Db.query(`
                SELECT id FROM comments WHERE id = ?;`,
                {
                    replacements: [reqId],
                    type: QueryTypes.SELECT
                }
            );

            if (!comment)
                res.status(201).json({ message: "Commentaire supprimé !" });
            else
                res.status(401).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire !" });
        })
            .catch(error => res.status(500).json({ error }));
    } else
        res.status(404).json({ message: "Post introuvable !" });

}


module.exports = {
    createPost,
    createComment,
    sendAllPosts,
    sendComment,
    modifyPost,
    modifyComment,
    postUserFind,
    deletePost,
    deleteComment,
    postLiked,
    sendEvaluationForOneUser
};
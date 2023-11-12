const { Router } = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer_config");

const { createPost, sendAllPosts, modifyPost, deletePost, deleteComment, postUserFind, postLiked, sendEvaluationForOneUser, sendComment, createComment, modifyComment } = require("../controllers/Post_controller.js");


const postRouter = Router();

postRouter.post("/", auth, multer, createPost);
postRouter.post("/comment", sendComment);
postRouter.post("/comment/create", auth, createComment);
postRouter.post("/like", auth, postLiked);
postRouter.post("/like/eval", auth, sendEvaluationForOneUser);

postRouter.get("/", sendAllPosts);
postRouter.get("/:id", postUserFind);

postRouter.put("/:id", auth, multer, modifyPost);
postRouter.put("/comment/:id", auth, modifyComment);

postRouter.delete("/:id", auth, deletePost);
postRouter.delete("/comment/:id", auth, deleteComment)

module.exports = postRouter;
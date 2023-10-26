import Axios from "@/services/caller.service";

const login = (credentials) => {
    return Axios.post('api/auth/login', credentials);
};

const signup = (credentials) => {
    return Axios.post('api/auth/signup', credentials);
};

const signupAvatarUpdate = (userId, formData) => {
    return Axios.put(`api/auth/signup/${userId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    )
};

const getUser = (credentials) => {
    return Axios.get(`api/auth/${credentials}`);
};

const getAllPosts = () => {
    return Axios.get('api/post');
};

const getId = (id) => {
    return Axios.get(`api/post/${id}`)
};

const createPost = (data, token) => {
    return Axios.post('api/post', data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
    );
};

const updatePost = (id, data, token) => {
    return Axios.put(`api/post/${id}`, data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
    );
};

const deletePost = (id, token) => {
    return Axios.delete(`api/post/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

const likePost = (likeObj, token) => {
    return Axios.post('api/post/like', likeObj,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const accountService = {
    login, signup, signupAvatarUpdate, getUser, getAllPosts, getId, createPost, updatePost, deletePost, likePost
};
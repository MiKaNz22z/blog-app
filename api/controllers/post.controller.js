import Post from "../models/post.model.js";
import { errorHandle } from "../utils/error.js"

export const create = async (req, res, next) => {
    console.log(req.body);
    if(!req.user.isAdmin) {
        return next(errorHandle(403, "You are not allow to create post"));
    }
    if(!req.body.title || !req.body.content) {
        return next(errorHandle(400, "All fields are required"));
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-");
    const newPost = new Post({
        ...req.body, 
        slug, 
        userId: req.user.id,
    });
    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch(err) {
        next(err)
    }
}
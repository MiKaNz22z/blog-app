import { errorHandle } from '../utils/error.js';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId, parentId } = req.body;

        if(userId !== req.user.id){
            return next(errorHandle(403, 'You are not allowed to comment on this post'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
            parentId: parentId || null,
        });
        await newComment.save();

        res.status(200).json(newComment);
    }
    catch (error) {
        next(error);
    }
}

export const getPostComments = async (req, res, next) => {
    try {
        // Get all comments for the post
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        });

        // Organize comments into a tree structure
        const commentMap = {};
        const rootComments = [];

        // First pass: create a map of all comments
        comments.forEach(comment => {
            commentMap[comment._id] = {
                ...comment.toObject(),
                replies: []
            };
        });

        // Second pass: organize into tree structure
        comments.forEach(comment => {
            if (comment.parentId) {
                // This is a reply, add it to its parent's replies
                if (commentMap[comment.parentId]) {
                    commentMap[comment.parentId].replies.push(commentMap[comment._id]);
                }
            } else {
                // This is a root comment
                rootComments.push(commentMap[comment._id]);
            }
        });

        res.status(200).json(rootComments);
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandle(404, 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        // Like và unlike bài viết
        if(userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error){
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandle(404, 'Comment not found'));
        }

        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandle(403, 'You are not allowed to edit this comment'));
        }

        const editComment = await Comment.findByIdAndUpdate(req.params.commentId,{
            content: req.body.content,
        },
        {new: true}
    );
    res.status(200).json(editComment);
    } catch (error){
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandle(404, 'Comment not found'));
        }

        if(comment.userId !== req.user.id && !req.user.isAdmin && !req.user.isAuthor){
            return next(errorHandle(403, 'You are not allowed to delete this comment'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted');
    } catch (error){
        next(error);
    }
}

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isAuthor) {
      return next(errorHandle(403, 'You are not allowed to get all comments'));
    }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;

      // If userId is provided, get comments for that user's posts
      let query = {};
      if (req.query.userId) {
        // First get all posts by this user
        const userPosts = await Post.find({ userId: req.query.userId });
        const postIds = userPosts.map(post => post._id);
        // Then get comments for these posts
        query = { postId: { $in: postIds } };
      }

      const comments = await Comment.find(query)
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

      const totalComments = await Comment.countDocuments(query);
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthComments = await Comment.countDocuments({
        ...query,
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      next(error);
    }
  };

export const getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandle(404, 'Comment not found'));
        }
        res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };
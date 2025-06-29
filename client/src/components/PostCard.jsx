import{ Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AiOutlineComment } from "react-icons/ai";

function PostCard({ post }) {
  const [username, setUsername] = useState('');
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch(`/api/user/${post.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUsername(data.username);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchCommentCount = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${post._id}`);
        const data = await res.json();
        if (res.ok) {
          setCommentCount(data.length);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUsername();
    fetchCommentCount();
  }, [post.userId, post._id]);

  return (
    <div className="group w-full h-full relative">
         <img 
            src={post.image}
            className="w-full h-full object-cover inset-0" 
            alt="City Landscape" 
        />
        
        <div className="absolute w-full bottom-0 p-6 pr-6 bg-gradient-to-b from-transparent to-zinc-900">
            <Link to={`/category?category=${post.category}`} className='bg-gray-700 text-white p-1 text-xs hover:text-black cursor-pointer'>{post.category}</Link>
            <Link to={`/post/${post.slug}`}>
              <h2 className='text-white font-semibold text-2xl mt-2'>{post.title}</h2>
              <div className="flex gap-2 mt-2 justify-between">
                <div className="">
                  <Link to={`/author?authorId=${post.userId}`} className='text-white text-xs mr-2 uppercase hover:text-gray-300'>{username || 'Loading...'}</Link>
                  <span className='text-white text-xs'>
                    {post && new Date(post.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
               <div className="flex items-center gap-1">
                  <AiOutlineComment className='text-white text-xl' />
                  <span className='text-white text-xs'>
                    {commentCount} {commentCount === 1 ? 'bình luận' : 'bình luận'}
                  </span>
               </div>
              </div>
            </Link>
        </div>
    </div>
  )
}

export default PostCard

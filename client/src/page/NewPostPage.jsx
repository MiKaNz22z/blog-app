import React from 'react'
import NewPostCard from '../components/NewPostCard'
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from 'flowbite-react'
import CommentSection from "../components/CommentSection";

function NewPostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);  
    
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    },[postSlug]);

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();
                if(res.ok) {
                    setRecentPosts(data.posts);
                }
                console.log(data.posts);
            }
            fetchRecentPosts();
        } catch(err) {
            console.log(err.message);
        }
    }, [])
    
    if(loading) return <div className="flex justify-center items-center min-h-screen">
        <Spinner size='xl' />
    </div>
  return (
    <div className='bg-slate-100 pt-16'>
        <div className="bg-white max-w-5xl mx-auto px-20 py-24
            max-semi-lg:max-w-4xl
            max-md:mx-5 max-md:px-10 max-md:py-8
            max-semi-sm:p-5
        ">
            <div className="">
                <img src={post && post.image} className='w-full' alt="" />
                <h1 className='text-2xl text-black font-semibold pt-2'>{post && post.title}</h1>
                <div class="flex items-center text-blue-700 mt-2">
                    <span class="after:content-['/'] after:mx-2">Leave a Comment</span>
                    <Link to={`/search?category=${post && post.category}`} className="self-center">
                        <span class="after:content-['/'] after:mx-2">{post && post.category}</span>
                    </Link>
                    <span>By Admin</span>
                </div>
            </div>

            <div dangerouslySetInnerHTML={{__html: post && post.content}} className="mt-6 mx-auto w-full post-content"></div>
        </div>

        <div className="bg-white max-w-5xl mx-auto mt-16 px-10 py-14
            max-semi-lg:max-w-4xl
            max-md:mx-5 max-md:px-10 max-md:py-8
            max-semi-sm:p-5
        ">
            <h1 className='text-3xl text-black font-semibold'>Must Read</h1>
            <div className="grid grid-cols-2 gap-6 pt-6 max-semi-sm:grid-cols-1">
                {recentPosts && 
                    shuffleArray([...recentPosts])
                        .slice(0, 2)
                        .map((post) => <NewPostCard key={post._id} post={post} />)
                }
            </div>
        </div>

        <div className="bg-white max-w-5xl mx-auto mt-16 px-20 py-20
            max-semi-lg:max-w-4xl
            max-md:mx-5 max-md:px-10 max-md:py-8
            max-semi-sm:p-5
        ">
            <h1 className='text-2xl text-black font-semibold pt-2'>Leave a Comment</h1>
            <CommentSection postId={post._id}/>
        </div>
        
        <div className="pt-16"></div>
    </div>
  )
}

export default NewPostPage

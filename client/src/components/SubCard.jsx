import React from 'react'
import { Link } from 'react-router-dom'

export default function CardSearch({ post }) {
  return (
    <div className='flex overflow-hidden'>
      <Link to={`/post/${post.slug}`} className="flex-1 h-40 overflow-hidden">
          <img 
            src={post.image}
            className="w-full h-full object-cover" 
            alt="Health Industry" 
          />
      </Link>
      <div className="px-4 py-3 flex-1">
          <Link to={`/category?category=${post.category}`} className="bg-gray-700 text-white px-2 py-1 text-xs hover:text-black cursor-pointer">{post.category}</Link>
          <Link to={`/post/${post.slug}`}><h2 className="text-black font-semibold text-lg mt-2 line-clamp-3 text-ellipsis">{post.title}</h2></Link>
          <p className="text-xs text-gray-500 mt-2">
            {post && new Date(post.updatedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
      </div>

      {/* <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <h2 className='text-xl font-semibold line-clamp-2'>{post.title}</h2>
        <span className='italic text-sm'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div> */}
    </div>
  );
}

{/* <div className="flex overflow-hidden">
        <div className="w-full h-40 overflow-hidden">
            <img 
            src="https://imgcdn.stablediffusionweb.com/2024/4/7/daa887ce-077d-4675-a071-a33a6a79cd4d.jpg" 
            className="w-full h-full object-cover" 
            alt="Health Industry" 
            />
        </div>
        <div className="px-4 py-3">
            <Link className="bg-gray-700 text-white px-2 py-1 text-xs hover:text-black cursor-pointer">Health</Link>
            <h2 className="text-black font-semibold text-lg mt-2">The Health Industry Is Changing Fast. Here's How to Keep Pace</h2>
            <p className="text-xs text-gray-500 mt-2">June 28, 2021</p>
        </div>
    </div> */}

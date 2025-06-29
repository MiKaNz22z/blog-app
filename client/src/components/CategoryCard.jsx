import React from 'react'
import { Link } from 'react-router-dom'
import { FaAnglesRight } from "react-icons/fa6";

function CategoryCard({ post }) {
  return (
    <div>
      <div className="">
        <img className='w-full h-[450px] object-cover' src={post.image} alt="" />
        <h1 className='text-2xl font-bold mt-5 mb-2'>{post.title}</h1>
        <p className='text-md text-blue-700 mb-2'>{post.category}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} className='content text-gray-700'></div>
        <div className="mt-5 my-10">
            <Link to={`/post/${post.slug}`} className='text-md text-blue-700'>Đọc thêm...</Link>
        </div>
      </div>

      <div className="border-t border-gray-300 pb-9 w-full"></div>
      
    </div>
  )
}

export default CategoryCard

import React from 'react';
import { Link } from 'react-router-dom';

export default function NewPostCard({ post }) {
  // Kiểm tra nếu post không tồn tại
  if (!post) {
    return <div>No post data available.</div>;
  }

  // Đặt giá trị mặc định cho các trường có thể bị thiếu
  const {
    slug = '',
    image = 'https://via.placeholder.com/430x400', // Ảnh mặc định
    category = 'Uncategorized',
    title = 'No Title',
    content = 'No content available.',
  } = post;

  return (
    <div className='group relative w-full overflow-hidden transition-all'>
      <Link to={`/post/${slug}`} className='overflow-hidden'>
        <img
          src={image}
          alt='post cover'
          className='w-full h-48 max-md:h-96 max-semi-sm:h-80 max-sm:h-60 object-cover' // Thêm class để kiểm soát kích thước ảnh
        />
      </Link>
      <div className='flex flex-col gap-2 h-[calc(100%-12rem)]'> {/* Điều chỉnh chiều cao */}
        <Link to={`/category?category=${category}`} className='text-xs text-blue-500 font-semibold pt-4 pb-3'>
          {category}
        </Link>
        {/* Title với giới hạn 2 dòng và căn giữa nếu 1 dòng */}
        <Link to={`/post/${slug}`}>
          <h2 className='line-clamp-2 text-2xl text-black font-bold'>
            {title}
          </h2>
        </Link>
        <div className="py-1">
          <span className='text-gray-500 text-xs mr-2'>Admin</span>
          <span className='text-gray-500 text-xs'>
            {post && new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        {/* Content với giới hạn 3 dòng */}
        <div dangerouslySetInnerHTML={{ __html: content }} className='content text-gray-700'>
        </div>
      </div>
    </div>
  );
}
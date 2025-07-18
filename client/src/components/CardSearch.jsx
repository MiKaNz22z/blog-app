import { Link } from 'react-router-dom';

export default function CardSearch({ post }) {
  return (
    <div className='group relative w-[420px] border hover:border-2 h-[400px] overflow-hidden transition-all'>
      <Link to={`/post/${post.slug}`}>
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
          Đọc bài viết
        </Link>
      </div>
    </div>
  );
}
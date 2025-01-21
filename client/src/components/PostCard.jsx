import{ Link } from 'react-router-dom';
function PostCard({ post }) {
  return (
    <div className="group w-full h-full relative">
         <img 
            src={post.image}
            className="w-full h-full object-cover inset-0" 
            alt="City Landscape" 
        />
        
        <div className="absolute w-full bottom-0 p-6 pr-16 bg-gradient-to-b from-transparent to-zinc-900">
            <Link to={`/category?category=${post.category}`} className='bg-gray-700 text-white p-1 text-xs hover:text-black cursor-pointer'>{post.category}</Link>
            <Link to={`/post/${post.slug}`}>
              <h2 className='text-white font-semibold text-2xl mt-2'>{post.title}</h2>
              <div className="flex gap-2 mt-2">
                <span className='text-white text-xs mr-2'>Admin</span>
                <span className='text-white text-xs'>
                  {post && new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </Link>
        </div>
    </div>
  )
}

export default PostCard

import { Link } from 'react-router-dom';

function Card ({ post }) {
  return (
    <div className="group w-full h-full relative">
        {/* <img 
            src={post.image}
            className="w-full h-full object-cover inset-0" 
            alt="City Landscape" 
        /> */}

        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div> */}
        {/* <div className="absolute bottom-0 p-6 pr-16 bg-gradient-to-b from-transparent to-zinc-900">
            <Link className='bg-gray-700 text-white p-1 text-xs hover:text-black cursor-pointer'>{post.category}</Link>
            <Link to={`/post/${post.slug}`}>
              <h2 className='text-white font-semibold text-3xl mt-2'>{post.title}</h2>
              <div className="flex gap-2 mt-2">
                  <p className='text-xs text-white'>akbarh</p>
                  <p className='text-xs text-white'>June 28, 2021</p>
              </div>
            </Link>
        </div> */}
    </div>
  );
};

export default Card;
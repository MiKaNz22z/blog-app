import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import NewPostCard from '../components/NewPostCard';
import Card from '../components/Card';
import SubCard from '../components/SubCard';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import CardSearch from '../components/CardSearch';

export default function Home() {
  const [posts, setPosts] = useState([]);

  const filteredPosts = posts.filter(post => {
    // Kiểm tra xem post.category có tồn tại và khớp với "thethao" không
    return post.category && post.category.trim().toLowerCase() === "thethao";
  });
  
  const slicedPosts = filteredPosts.slice(0, 3);
  
  console.log("Filtered Posts:", filteredPosts);
  console.log("Sliced Posts:", slicedPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className='mx-5 max-md:mx-5'>
      <div className="">
        <div className='
          flex gap-6 p-20 px-0 max-w-7xl mx-auto items-stretch
          max-semi-lg:max-w-5xl 
          max-md:max-w-3xl 
          max-semi-sm:max-w-2xl max-semi-sm:flex-col
        '>
            {posts && posts.length > 0 && (
              <div className="flex-1">
                {posts.slice(0, 1).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            {posts && posts.length > 0 && (
              <div className="flex-1 flex flex-col gap-3">
                {posts.slice(1, 4).map((post) => (
                  <SubCard key={post._id} post={post} />
                ))}
              </div>
            )}
        </div>

        <div className="border-t border-gray-500 max-w-7xl mx-auto p-6"></div>
        
        <div className="">
          {posts && posts.length > 0 && (
            <div 
              className="
                grid grid-cols-6 grid-rows-1 gap-7 max-w-7xl mx-auto mb-16 
                max-md:mx-3 max-md:max-w-3xl max-md:grid-cols-3 max-md:grid-rows-2 
                max-semi-sm:max-w-2xl
                max-sm:grid-cols-2 max-sm:grid-rows-3
              "
            >
              {posts.slice(3, 9).map((post) => (
                <div className="flex-1 flex-col" key={post._id}>
                  <span className='text-xs text-gray-500 mb-2'>{post.category}</span>
                  <Link to={`/post/${post.slug}`}><h3 className='text-md font-bold text-black line-clamp-2'>{post.title}</h3></Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto flex justify-between gap-3 max-md:flex-col">
          <div className="max-md:w-full">
            <img src="https://websitedemos.net/business-blog-04/wp-content/uploads/sites/895/2021/07/business-blog-wide-promo-banner.jpg" alt="" />
          </div>
          <div className="bg-white p-6 shadow-md w-[40%] max-md:w-full">
            <h2 className='text-md font-bold mb-3  text-black'>CÁC BÀI VIẾT NỔI BẬT BẠN KHÔNG NÊN BỎ LỠ!</h2>
            <p className='text-md text-gray-700 mb-16'>Chúng tôi sẽ gửi bạn email tổng hợp những bài viết đáng đọc nhất tuần qua.</p>
            <button className='p-3 w-full border text-black border-black hover:bg-black hover:text-white transition-all'>
              <Link to='sign-in' className='font-semibold'>Đăng ký!</Link>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16">
        <div className="flex justify-between mb-8">
          <h2 className='text-4xl font-semibold text-black'>Thể thao</h2>
          <Link to='/category?category=thethao' className='flex justify-center items-center relative gap-2 font-semibold'>
            <p className='text-lg text-black'>Xem thêm</p> 
            <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
          </Link>
        </div>
        {posts && posts.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-1 gap-4 max-md:grid-cols-1 max-md:gap-10">
          {posts.
            filter((post) => post.category === "thethao")
            .slice(0, 3)
            .map(post => (
              <NewPostCard key={post._id} post={post} />
            ))
          }
        </div>
        )}
      </div>

      <div className="border-t border-gray-500 max-w-7xl mx-auto"></div>

      <div className="max-w-7xl mx-auto py-16">
        <div className="flex justify-between mb-8">
          <h2 className='text-4xl font-semibold text-black'>Đời sống</h2>
          <Link to='/category?category=doisong' className='flex justify-center items-center relative gap-2 font-semibold'>
            <p className='text-lg text-black'>Xem thêm</p> 
            <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
          </Link>
        </div>

        <div className="grid grid-cols-2 items-stretch max-md:grid-cols-1 max-md:gap-3">
          {posts
            .filter((post) => post.category === "doisong")
            .slice(0, 2).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-500 max-w-7xl mx-auto"></div>

      <div className="max-w-7xl mx-auto py-16">
        <div className="flex justify-between mb-8">
          <h2 className='text-4xl font-semibold text-black'>Xã hội</h2>
          <Link to='/category?category=xahoi' className='flex justify-center items-center relative gap-2 font-semibold'>
            <p className='text-lg text-black'>Xem thêm</p> 
            <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
          </Link>
        </div>

        {posts && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-md:gap-10">
          {posts.
            filter((post) => post.category === "xahoi")
            .slice(0, 3)
            .map(post => (
              <NewPostCard key={post._id} post={post} />
            ))
          }
        </div>
        )}
      </div>

      <div className="border-t border-gray-500 max-w-7xl mx-auto"></div>

      <div className='max-w-7xl mx-auto py-16 grid grid-cols-2 gap-20 max-md:grid-cols-1'>
        <div className="">
          <div className="flex justify-between mb-8">
            <h2 className='text-4xl font-semibold text-black'>Game</h2>
            <Link to='/category?category=game' className='flex justify-center items-center relative gap-2 font-semibold'>
              <p className='text-lg text-black'>Xem thêm</p> 
              <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
            </Link>
          </div>
          {posts && posts.length > 0 && (
            <div className="">
              {posts.
                filter((post) => post.category === "game")
                .slice(0, 1)
                .map(post => (
                  <NewPostCard key={post._id} post={post} />
                ))
              }
            </div>
          )}

          {posts && posts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-10 max-md:grid-cols-1 max-md:gap-10">
              {posts.
                filter((post) => post.category === "game")
                .slice(1, 3)
                .map(post => (
                  <NewPostCard key={post._id} post={post} />
                ))
              }
            </div>
          )} 
        </div>

        <div className="">
          <div className="flex justify-between mb-8">
            <h2 className='text-4xl font-semibold text-black'>Sức khỏe</h2>
            <Link to='/category?category=suckhoe' className='flex justify-center items-center relative gap-2 font-semibold'>
              <p className='text-lg text-black'>Xem thêm</p> 
              <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
            </Link>
          </div>
          <div className="">
            {posts.
              filter((post) => post.category === "suckhoe")
              .slice(0, 1)
              .map(post => (
                <NewPostCard key={post._id} post={post} />
              ))
            }
          </div>
          {posts && posts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-10 max-md:grid-cols-1 max-md:gap-10">
              {posts.
                filter((post) => post.category === "suckhoe")
                .slice(1, 3)
                .map(post => (
                  <NewPostCard key={post._id} post={post} />
                ))
              }
            </div>
          )} 
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16">
        <div className="flex justify-between mb-8">
          <h2 className='text-4xl font-semibold text-black'>Công nghệ</h2>
          <Link to='/category?category=congnghe' className='flex justify-center items-center relative gap-2 font-semibold'>
            <p className='text-lg text-black'>Xem thêm</p> 
            <FaArrowRightToBracket className='' style={{ color: 'black' }}/>
          </Link>
        </div>

        <div className="grid grid-cols-2 items-stretch max-md:grid-cols-1 max-md:gap-3">
          {posts
            .filter((post) => post.category === "congnghe")
            .slice(0, 2).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

    </div>
  );
}

// { <div>
//   <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
//     <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
//     <p className='text-gray-500 text-xs sm:text-sm'>
//       Here you'll find a variety of articles and tutorials on topics such as
//       web development, software engineering, and programming languages.
//     </p>
//     <Link
//       to='/search'
//       className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
//     >
//       Xem thêm posts
//     </Link>
//   </div>
//   <div className='p-3 bg-amber-100 dark:bg-slate-700'>
//     <CallToAction />
//   </div>

//   <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
//     {posts && posts.length > 0 && (
//       <div className='flex flex-col gap-6'>
//         <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
//         <div className='flex flex-wrap gap-4'>
//           {posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         </div>
//         <Link
//           to={'/search'}
//           className='text-lg text-teal-500 hover:underline text-center'
//         >
//           Xem thêm posts
//         </Link>
//       </div>
//     )}
//   </div>
// </div>}
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import CategoryList from '../components/CategoryList';

function Category() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const location = useLocation();

    // Lấy category từ URL
    const categoryFromUrl = new URLSearchParams(location.search).get('category') || 'uncategorized';

    // Fetch bài viết theo category
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post/getposts?category=${categoryFromUrl}&sort=desc`);
                if (!res.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await res.json();
                setPosts(data.posts);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [categoryFromUrl]);

    useEffect(() => {
      const fetchAllCategories = async () => {
          try {
              const res = await fetch('/api/post/getposts'); // Fetch tất cả bài viết
              if (!res.ok) {
                  throw new Error('Failed to fetch posts');
              }
              const data = await res.json();
              const categories = data.posts.map(post => post.category); // Lấy tất cả categories
              const uniqueCategories = [...new Set(categories)]; // Loại bỏ trùng lặp
              setAllCategories(uniqueCategories); // Lưu vào state
          } catch (error) {
              console.error(error);
          }
      };
      fetchAllCategories();
    }, []);

    // Xử lý "Show more"
    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {
            const res = await fetch(`/api/post/getposts?category=${categoryFromUrl}&sort=desc&startIndex=${startIndex}`);
            if (!res.ok) {
                throw new Error('Failed to fetch more posts');
            }
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='bg-slate-100 py-16'>
            <div className="max-w-7xl mx-auto flex max-md:flex-col">
                <div className="
                    w-[70%] border-r border-gray-300 pr-16 mx-5
                    max-md:w-[100%] max-md:pr-0 max-md:border-none
                ">
                    <h1 className='text-4xl text-blue-700 font-bold m-10'>{categoryFromUrl.toUpperCase()}</h1>
                    <div className="border-t border-gray-300 pb-9 w-full"></div>

                    {/* Hiển thị bài viết */}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found in this category.</p>
                    )}
                    {!loading && posts.length > 0 && (
                        <div className="flex flex-col gap-8">
                            {posts.map((post) => (
                                <CategoryCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Nút "Show more" */}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full text-center'
                        >
                            Show more...
                        </button>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-[30%] pl-16 mx-5 max-md:w-[100%] max-md:pr-0 max-md:pl-0">
                    <h3 className='text-xl font-bold mb-6'>Recent Posts</h3>
                    {posts && posts.length > 0 && (
                      <div className="flex flex-col gap-3 mb-11">
                        {posts.slice(0, 4).map((post) =>(
                          <Link key={post._id} to={`/post/${post.slug}`} className='text-md text-blue-700 hover:text-gray-700'>
                              {post.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    <img
                        src="https://websitedemos.net/business-blog-04/wp-content/uploads/sites/895/2021/06/business-blog-promo-news-image-2.jpg"
                        className='mb-11'
                        alt="Promo"
                    />

                    <div className="">
                        <h3 className='text-xl font-bold mb-6'>Categories</h3>
                        {allCategories.map((category, index) => (
                            <div className="flex flex-col gap-6">
                              <Link
                                key={index}
                                to={`/category?category=${category}`}
                                className='text-md text-blue-700 hover:text-gray-700'
                              >
                                  {category || 'Uncategorized'}
                              </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Category;
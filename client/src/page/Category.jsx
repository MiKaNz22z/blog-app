import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import CategoryList from '../components/CategoryList';
import { Spinner } from 'flowbite-react';

function Category() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allCategories, setAllCategories] = useState([]);
    const location = useLocation();
    const postsPerPage = 3; // Số bài viết hiển thị trên mỗi trang

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
                // Tính tổng số trang
                setTotalPages(Math.ceil(data.posts.length / postsPerPage));
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

    // Tính toán các bài viết cần hiển thị cho trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
    };

    // Hàm sinh mảng số trang cần hiển thị với dấu ...
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị 2 trang đầu, 2 trang cuối, 2 trang quanh trang hiện tại
            const left = Math.max(2, currentPage - 1);
            const right = Math.min(totalPages - 1, currentPage + 1);

            pages.push(1);
            if (left > 2) pages.push('...');

            for (let i = left; i <= right; i++) {
                pages.push(i);
            }

            if (right < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size='xl' />
            </div>
        );
    }

    return (
        <div className='bg-slate-100 py-16'>
            <div className="max-w-7xl mx-auto flex
                max-md:flex-col max-md:max-w-3xl max-md:mx-5
                max-semi-lg:max-w-5xl 
                max-semi-sm:max-w-2xl max-semi-sm:flex-col
            ">
                <div className="
                    w-[70%] border-r border-gray-300 pr-16
                    max-md:w-[100%] max-md:pr-0 max-md:border-none
                ">
                    <h1 className='text-4xl text-blue-700 font-bold m-10'>{categoryFromUrl.toUpperCase()}</h1>
                    <div className="border-t border-gray-300 pb-9 w-full"></div>

                    {/* Hiển thị bài viết */}
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>Không tìm thấy bài viết với danh mục này.</p>
                    )}
                    {!loading && posts.length > 0 && (
                        <div className="flex flex-col gap-8">
                            {currentPosts.map((post, index) => (
                                <div key={post._id} className={`${index % 2 === 0 ? 'text-gray-800' : 'text-blue-600'}`}>
                                    <CategoryCard post={post} />
                                </div>
                            ))}
                            {/* {currentPosts.map((post, index) => (
                                <div key={post._id} className={`${index === 0 ? '' : index % 2 === 0 ? 'text-blue-700' : 'text-cyan-600'}`}>
                                    <CategoryCard post={post} />
                                </div>
                            ))} */}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && posts.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md text-xl flex justify-center items-center ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-blue-100'
                                }`}
                                aria-label="Previous"
                            >
                                &#60;
                            </button>
                            {getPageNumbers().map((page, idx) =>
                                page === '...'
                                    ? <span key={idx} className="px-3 py-2 text-gray-400">...</span>
                                    : <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-md ${
                                            currentPage === page
                                                ? 'bg-cyan-400 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                            )}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md text-xl flex justify-center items-center ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-blue-100'
                                }`}
                                aria-label="Next"
                            >
                                &#62;
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-[30%] pl-16 max-md:w-[100%] max-md:pr-0 max-md:pl-0">
                    <h3 className='text-xl font-bold mb-6'>Bài viết gần đây</h3>
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
                        <h3 className='text-xl font-bold mb-6'>Danh mục</h3>
                        {allCategories.map((category, index) => (
                            <div key={index} className="flex flex-col gap-6">
                              <Link
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
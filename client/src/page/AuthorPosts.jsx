import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import { Spinner } from 'flowbite-react';

function AuthorPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [authorName, setAuthorName] = useState('');
    const [authorAvatar, setAuthorAvatar] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [authorCreatedAt, setAuthorCreatedAt] = useState('');
    const [authorPhone, setAuthorPhone] = useState('');
    const [authorDOB, setAuthorDOB] = useState('');
    const [authorAddress, setAuthorAddress] = useState('');
    const location = useLocation();
    const postsPerPage = 3; // Số bài viết hiển thị trên mỗi trang

    // Get author ID from URL
    const authorId = new URLSearchParams(location.search).get('authorId');

    // Fetch posts by author
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post/getposts?userId=${authorId}&sort=desc`);
                if (!res.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await res.json();
                setPosts(data.posts);
                // Tính tổng số trang
                setTotalPages(Math.ceil(data.posts.length / postsPerPage));

                // Fetch author name và thông tin khác
                const userRes = await fetch(`/api/user/${authorId}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    console.log('User data:', userData); // DEBUG
                    setAuthorName(userData.username);
                    // Ưu tiên lấy profilePicture
                    let avatarUrl = '';
                    if (userData.profilePicture) {
                        if (userData.profilePicture.startsWith('http')) {
                            avatarUrl = userData.profilePicture;
                        } else if (userData.profilePicture.startsWith('/')) {
                            avatarUrl = `${window.location.origin}${userData.profilePicture}`;
                        } else {
                            avatarUrl = `${window.location.origin}/uploads/${userData.profilePicture}`;
                        }
                    } else if (userData.avatar) {
                        if (userData.avatar.startsWith('http')) {
                            avatarUrl = userData.avatar;
                        } else if (userData.avatar.startsWith('/')) {
                            avatarUrl = `${window.location.origin}${userData.avatar}`;
                        } else {
                            avatarUrl = `${window.location.origin}/uploads/${userData.avatar}`;
                        }
                    } else {
                        avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.username);
                    }
                    setAuthorAvatar(avatarUrl);
                    setAuthorEmail(userData.email || '');
                    setAuthorCreatedAt(userData.createdAt || '');
                    setAuthorPhone(userData.phone || '');
                    setAuthorDOB(userData.dateOfBirth || '');
                    setAuthorAddress(userData.address || '');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (authorId) {
            fetchPosts();
        }
    }, [authorId]);

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
        <div className='bg-slate-100 py-10 min-h-screen'>
            <div className="max-w-7xl mx-auto flex max-md:flex-col max-md:max-w-3xl max-md:mx-3 max-lg:px-4 gap-8">
                {/* Main content */}
                <div className="w-[70%] border-r border-gray-300 pr-16 max-lg:pr-6 max-md:w-full max-md:pr-0 max-md:border-none">
                    <h1 className='text-3xl md:text-4xl text-blue-700 font-bold m-6 md:m-10 text-center md:text-left'>Đăng bởi {authorName}</h1>
                    <div className="border-t border-gray-300 pb-6 w-full"></div>

                    {/* Display posts */}
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500 text-center'>Không tìm thấy bài viết với tác giả này.</p>
                    )}
                    {!loading && posts.length > 0 && (
                        <div className="flex flex-col gap-8">
                            {currentPosts.map((post) => (
                                <CategoryCard key={post._id} post={post} />
                            ))}
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

                {/* Sidebar - Author Info */}
                <div className="w-[30%] max-md:w-full max-md:pl-0 max-md:pr-0 pl-8 max-lg:pl-4 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-4 bg-white rounded-lg shadow-md p-6 md:p-8 mb-11 w-full max-w-xs mx-auto max-md:mb-6">
                        <div className="relative flex flex-col items-center w-full">
                            <img
                                src={authorAvatar}
                                alt="Author Avatar"
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                            />
                        </div>
                        {/* Tên và số điện thoại căn giữa */}
                        <div className="flex flex-col items-center mt-2 mb-4 w-full">
                            <span className="text-2xl font-bold text-gray-800 uppercase text-center break-words">{authorName}</span>
                            {authorPhone && (
                                <span className="text-md text-gray-500 mt-1 text-center break-words">{authorPhone}</span>
                            )}
                        </div>
                        {/* Thông tin chi tiết với icon */}
                        <div className="w-full flex flex-col gap-2">
                            {authorEmail && (
                                <div className="flex items-center gap-3 py-2 border-b">
                                    <span className="text-slate-500 bg-slate-200 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 break-words">{authorEmail}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 py-2 border-b">
                                <span className="text-slate-500 bg-slate-200 rounded-full p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75A2.25 2.25 0 0117.75 22.5h-11.5A2.25 2.25 0 014.5 20.25v-.75z" />
                                    </svg>
                                </span>
                                <span className="text-gray-800 break-words">{authorName}</span>
                            </div>
                            {authorDOB && (
                                <div className="flex items-center gap-3 py-2 border-b">
                                    <span className="text-slate-500 bg-slate-200 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 7.5v11.25A2.25 2.25 0 004.5 21z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 break-words">{new Date(authorDOB).toLocaleDateString('en-GB')}</span>
                                </div>
                            )}
                            {authorAddress && (
                                <div className="flex items-center gap-3 py-2 border-b">
                                    <span className="text-slate-500 bg-slate-200 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 break-words">{authorAddress}</span>
                                </div>
                            )}
                            {authorCreatedAt && (
                                <div className="flex items-center gap-3 py-2 border-b">
                                    <span className="text-slate-500 bg-slate-200 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 7.5v11.25A2.25 2.25 0 004.5 21z" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-800 break-words">{new Date(authorCreatedAt).toLocaleDateString('en-GB')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthorPosts; 
import { Table, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiOutlineUserAdd, HiSearch } from "react-icons/hi";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = currentUser.isAdmin 
          ? '/api/post/getposts'
          : `/api/post/getposts?userId=${currentUser._id}`;
        
        const res = await fetch(url);
        const data = await res.json();
        if(res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 9) {
            setShowMore(false);
          }
          // Fetch usernames for all posts
          const userIds = [...new Set(data.posts.map(post => post.userId))];
          const names = { ...usernames };
          for (const userId of userIds) {
            if (!names[userId]) {
              const userRes = await fetch(`/api/user/${userId}`);
              const userData = await userRes.json();
              if (userRes.ok) {
                names[userId] = userData.username;
              }
            }
          }
          setUsernames(names);
        }
      } catch (err) { 
        console.log(err.message);
      }
    }
    if(currentUser.isAdmin || currentUser.isAuthor) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin])

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const url = currentUser.isAdmin 
        ? `/api/post/getposts?startIndex=${startIndex}`
        : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
        // Fetch usernames for new posts
        const userIds = [...new Set(data.posts.map(post => post.userId))];
        const names = { ...usernames };
        for (const userId of userIds) {
          if (!names[userId]) {
            const userRes = await fetch(`/api/user/${userId}`);
            const userData = await userRes.json();
            if (userRes.ok) {
              names[userId] = userData.username;
            }
          }
        }
        setUsernames(names);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Lọc bài viết dựa trên từ khóa tìm kiếm
  const filteredPosts = userPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usernames[post.userId] && usernames[post.userId].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hiển thị tất cả hoặc chỉ 10 bài viết đầu tiên
  const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, 10);

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {(currentUser.isAdmin || currentUser.isAuthor) && userPosts.length > 0 ? (
        <>
          <div className="flex justify-end mb-4">
            <TextInput
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, danh mục hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96"
              icon={HiSearch}
            />
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày cập nhật</Table.HeadCell>
              <Table.HeadCell>Hình ảnh</Table.HeadCell>
              <Table.HeadCell>Tiêu đề</Table.HeadCell>
              <Table.HeadCell>Tác giả</Table.HeadCell>
              <Table.HeadCell>Danh mục</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
              <Table.HeadCell>Sửa</Table.HeadCell>
            </Table.Head>
            {displayedPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-14 h-10 rounded-md bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <Link to={`/post/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {usernames[post.userId] || 'Loading...'}
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Xóa
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Sửa</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          <div className="flex justify-center gap-4 mt-4">
            {!showAll && showMore && (
              <button onClick={handleShowMore} className="text-teal-500 hover:underline">
                Xem thêm
              </button>
            )}
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-teal-500 hover:underline"
            >
              {showAll ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          </div>
        </>
      ) : (
        <p>Bạn chưa có bài viết nào!</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Bạn có chắc muốn xóa bài viết này ?</h3>
            <div className="flex justify-between gap-4">
              <Button color='failure' onClick={handleDeletePost}>Có, tôi chắc</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Không, hủy</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashPosts;

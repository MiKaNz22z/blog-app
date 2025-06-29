import { Table, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle, HiSearch } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [ comments, setComments ] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [ showModal, setShowModal ] = useState(false);
  const [ commentsIdToDelete, setCommentsIdToDelete ] = useState(null);
  const [ postTitles, setPostTitles ] = useState({});
  const [ usernames, setUsernames ] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // If admin, fetch all comments. If author, fetch only comments on their posts
        const url = currentUser.isAdmin 
          ? '/api/comment/getcomments'
          : `/api/comment/getcomments?userId=${currentUser._id}`;
        
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
          // Fetch post titles for all comments
          const postIds = [...new Set(data.comments.map(comment => comment.postId))];
          const titles = {};
          for (const postId of postIds) {
            const postRes = await fetch(`/api/post/getposts?postId=${postId}`);
            const postData = await postRes.json();
            if (postRes.ok && postData.posts.length > 0) {
              titles[postId] = postData.posts[0].title;
            }
          }
          setPostTitles(titles);

          // Fetch usernames for all comments
          const userIds = [...new Set(data.comments.map(comment => comment.userId))];
          const names = {};
          for (const userId of userIds) {
            const userRes = await fetch(`/api/user/${userId}`);
            const userData = await userRes.json();
            if (userRes.ok) {
              names[userId] = userData.username;
            }
          }
          setUsernames(names);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin || currentUser.isAuthor) {
      fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin]);

   const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      // If admin, fetch all comments. If author, fetch only comments on their posts
      const url = currentUser.isAdmin 
        ? `/api/comment/getcomments?startIndex=${startIndex}`
        : `/api/comment/getcomments?userId=${currentUser._id}&startIndex=${startIndex}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
        // Fetch post titles for new comments
        const postIds = [...new Set(data.comments.map(comment => comment.postId))];
        const titles = { ...postTitles };
        for (const postId of postIds) {
          if (!titles[postId]) {
            const postRes = await fetch(`/api/post/getposts?postId=${postId}`);
            const postData = await postRes.json();
            if (postRes.ok && postData.posts.length > 0) {
              titles[postId] = postData.posts[0].title;
            }
          }
        }
        setPostTitles(titles);

        // Fetch usernames for new comments
        const userIds = [...new Set(data.comments.map(comment => comment.userId))];
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

  const handleDeleteComments = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentsIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentsIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Lọc bình luận dựa trên từ khóa tìm kiếm
  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usernames[comment.userId] && usernames[comment.userId].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (postTitles[comment.postId] && postTitles[comment.postId].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hiển thị tất cả hoặc chỉ 10 bình luận đầu tiên
  const displayedComments = showAll ? filteredComments : filteredComments.slice(0, 10);

  return (  
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {(currentUser.isAdmin || currentUser.isAuthor) && comments.length > 0 ? (
        <>
          <div className="flex justify-end mb-4">
            <TextInput
              type="text"
              placeholder="Tìm kiếm theo nội dung, người dùng hoặc bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96"
              icon={HiSearch}
            />
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày đăng</Table.HeadCell>
              <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
              <Table.HeadCell>Số lượng like</Table.HeadCell>
              <Table.HeadCell>Tên bài viết</Table.HeadCell>
              <Table.HeadCell>Tác giả</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
            </Table.Head>
            {displayedComments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>
                    {postTitles[comment.postId] || 'Loading...'}
                  </Table.Cell>
                  <Table.Cell>
                    {usernames[comment.userId] || 'Loading...'}
                  </Table.Cell>
                  <Table.Cell>
                    <span 
                      onClick={() => {
                        setShowModal(true);
                        setCommentsIdToDelete(comment._id);
                      }} 
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Xóa
                    </span>
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
        <p className="text-center text-gray-500 mt-5">Không tìm thấy bình luận!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Bạn có chắc muốn xóa bình luận này ?</h3>
            <div className="flex justify-between gap-4">
              <Button color='failure' onClick={handleDeleteComments}>Có, tôi chắc</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Không, hủy</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments;

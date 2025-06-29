import { Table, Button, Modal, ToggleSwitch, TextInput } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiSearch } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [ users, setUsers ] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [ showModal, setShowModal ] = useState(false);
  const [ userIdToDelete, setUserIdToDelete ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?`)
        const data = await res.json()
        console.log(data);
        if(res.ok) {
          setUsers(data.users);
          if(data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (err) { 
        console.log(err.message);
      }
    }
    if(currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id])

   const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAuthorRoleChange = async (userId, isAuthor) => {
    try {
      const res = await fetch(`/api/user/update-role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAuthor: !isAuthor }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? { ...user, isAuthor: !isAuthor } : user))
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if(res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hiển thị tất cả hoặc chỉ 10 người dùng đầu tiên
  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 10);
  
  return (  
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="flex justify-end mb-4">
            <TextInput
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96"
              icon={HiSearch}
            />
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày gia nhập</Table.HeadCell>
              <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
              <Table.HeadCell>Tên người dùng</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Tác giả</Table.HeadCell>
              <Table.HeadCell>Cấp quyền</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
            </Table.Head>
            {displayedUsers.filter(user => !user.isAdmin).map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover rounded-full bg-gray-500"/>
                  </Table.Cell>
                  <Table.Cell>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAuthor ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>) }
                  </Table.Cell>
                  <Table.Cell>
                    <ToggleSwitch
                      checked={user.isAuthor}
                      onChange={() => handleAuthorRoleChange(user._id, user.isAuthor)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <span 
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p> Hiện không có người dùng nào!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Bạn có chắc muốn xóa người dùng này ?</h3>
            <div className="flex justify-between gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Có, tôi chắc</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Không, hủy</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashUsers;

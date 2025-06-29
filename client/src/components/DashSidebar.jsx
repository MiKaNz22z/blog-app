import { Sidebar } from "flowbite-react";
import { HiAnnotation, HiArrowRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DashSidebar() {
    const location = useLocation();
    const {currentUser} = useSelector((state) => state.user);
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
        setTab(tabFromUrl);
        }
    }, [location.search])

    const handleSignout = async () => {
      try {
        const res = await fetch('api/user/signout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        if(!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch(error) {
        console.log(error.message);
      }
    }
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {
            currentUser && currentUser.isAdmin && (
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                    Dashboard
                </Sidebar.Item>
              </Link>
            )
          }
            <Link to='/dashboard?tab=profile'>
              <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : currentUser.isAuthor ? 'Author' : 'User'} labelColor='dark' as='div'>
                  Thông tin
              </Sidebar.Item>
            </Link>

            {(currentUser.isAdmin || currentUser.isAuthor) && (
              <Link to='/dashboard?tab=posts'>
                <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
                  Bài viết
                </Sidebar.Item>
              </Link>
            )}

            {(currentUser.isAdmin || currentUser.isAuthor) && (
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                  Bình luận
                </Sidebar.Item>
              </Link>
            )}

            {currentUser.isAdmin && (
              <>
                <Link to='/dashboard?tab=users'>
                  <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                    Người dùng
                  </Sidebar.Item>
                </Link>
              </>
            )}
            
            <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={handleSignout}>
                Đăng xuất
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar

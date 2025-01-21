import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toogleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState, useRef } from "react";

function Header() {
    const path = useLocation.pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector((state) => state.theme) 
    const [ searchTerm, setSearchTerm ] = useState('');

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    }, [location.search])

    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
      console.log('Toggle clicked, isOpen:', !isOpen);
      setIsOpen(!isOpen);
    };

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

    const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('searchTerm', searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }

    const [showSearchInput, setShowSearchInput] = useState(false);
    const searchContainerRef = useRef(null);

    const handleSearchClick = () => {
        setShowSearchInput(true);
    };

    const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setShowSearchInput(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
  return (
    <div className="mb-5 max-md:shadow-lg">
      <Navbar className="flex items-center justify-between mt-2 max-md:max-w-4xl">
        <form className="relative flex-1 max-md:hidden " ref={searchContainerRef} onSubmit={handleSubmit}>

          <div onClick={handleSearchClick} className="cursor-pointer max-md:hidden">
              <FaSearch />
          </div>

          <div 
              className={`absolute -bottom-5 left-5 bg-white border border-black transition-all duration-300 ease-in-out 
              ${showSearchInput ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}
              style={{ overflow: 'hidden' }}
          >
              <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-full p-4 border-none outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
        </form>

        <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
          <img 
            src="https://websitedemos.net/business-blog-04/wp-content/uploads/sites/895/2021/06/business-blog-site-logo.svg" 
            alt="" 
            className="mx-auto" 
          />
        </Link>
        
        <div className="flex gap-2 md:order-2 flex-1 justify-end">
          { currentUser ? (
              <Dropdown arrowIcon={false} inline label={
                <Avatar 
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                />
              }>
                <Dropdown.Item>
                  <span className="block text-sm">@{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                </Dropdown.Item>
                <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
              </Dropdown>
            ) :
            (<Link to="sign-in">
              <button className='px-10 py-2 border text-black border-black font-semibold hover:bg-black hover:text-white transition-all max-[830px]:hidden'>
                Sign in
              </button>
            </Link>)
          }
        </div>

        <Navbar.Toggle className="ml-2" onClick={toggleNavbar}/>
          <Navbar.Collapse className={`mx-auto max-w-5xl flex justify-between text-gray-600 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
            <Navbar.Link  active={path === "/"} as={'div'}>
              <Link to='/' className='px-2 text-[16px] hover:text-black'>Trang chủ</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/category?category=thethao"} as={'div'}>
              <Link to='/category?category=thethao' className='px-2 text-[16px] hover:text-black'>Thể thao</Link>
            </Navbar.Link>
            
            <Navbar.Link  active={path === "/category?category=congnghe"} as={'div'}>
              <Link to='/category?category=congnghe' className='px-2 text-[16px] hover:text-black'>Công nghệ</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/category?category=suckhoe"} as={'div'}>
              <Link to='/category?category=suckhoe' className='px-2 text-[16px] hover:text-black'>Sức khỏe</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/category?category=game"} as={'div'}>
              <Link to='/category?category=game' className='px-2 text-[16px] hover:text-black'>Game</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/category?category=doisong"} as={'div'}>
              <Link to='/category?category=doisong' className='px-2 text-[16px] hover:text-black'>Đời sống</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/category?category=xahoi"} as={'div'}>
              <Link to='/category?category=xahoi' className='px-2 text-[16px] hover:text-black'>Xã hội</Link>
            </Navbar.Link>

            <Navbar.Link  active={path === "/"} as={'div'}>
              <Link to='/category?category=uncategorized' className='px-2 text-[16px] hover:text-black'>Uncategorized</Link>
            </Navbar.Link>
            {currentUser ? (
              <div className="">Hello</div>
            ) : (
              <Link to="sign-in">
              <button className='mt-5 w-full px-10 py-2 border text-black border-black font-semibold hover:bg-black hover:text-white transition-all'>
                Sign in
              </button>
            </Link>
            )}
          </Navbar.Collapse>

          {/* <Navbar.Collapse>
              <Navbar.Link active={path === "/"} as={'div'}>
                  <Link to='/'>
                      Home
                  </Link>
              </Navbar.Link>

              <Navbar.Link active={path === "/about"} as={'div'}>
                  <Link to='/about'>
                      About
                  </Link>
              </Navbar.Link>

              <Navbar.Link active={path === "/projects"} as={'div'}>
                  <Link to='/projects'>
                      Projects
                  </Link>
              </Navbar.Link>
          </Navbar.Collapse> */}
      </Navbar>
      <div className="flex justify-center items-center mt-2 max-md:hidden">
          <div className="mx-auto max-w-5xl flex gap-5 font-semibold text-gray-600">
            <div>
              <Link to='/' className='px-2 text-[16px] hover:text-black'>Trang chủ</Link>
            </div>

            <div>
              <Link to='/category?category=thethao' className='px-2 text-[16px] w-full hover:text-black'>Thể thao</Link>
            </div>
            
            <div >
              <Link to='/category?category=congnghe' className='px-2 text-[16px] hover:text-black'>Công nghệ</Link>
            </div>

            <div >
              <Link to='/category?category=suckhoe' className='px-2 text-[16px] hover:text-black'>Sức khỏe</Link>
            </div>

            <div>
              <Link to='/category?category=game' className='px-2 text-[16px] hover:text-black'>Game</Link>
            </div>

            <div>
              <Link to='/category?category=doisong' className='px-2 text-[16px] hover:text-black'>Đời sống</Link>
            </div>

            <div>
              <Link to='/category?category=xahoi' className='px-2 text-[16px] hover:text-black'>Xã hội</Link>
            </div>

            <div >
              <Link to='/category?category=uncategorized' className='px-2 text-[16px] hover:text-black'>Uncategorized</Link>
            </div>
          </div>
      </div>        
    </div>
  )
}

export default Header

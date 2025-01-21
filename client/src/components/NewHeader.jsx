import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa';
import { Button, Navbar, TextInput } from 'flowbite-react'

function NewHeader() {
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
    <div className='max-w-7xl mx-auto'>
      <Navbar className="flex items-center justify-between mt-2 ">
        <div className="flex-1 relative" ref={searchContainerRef}>
                <div onClick={handleSearchClick} className="cursor-pointer">
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
                    />
                    </div>
                </div>
            <img 
                src="https://websitedemos.net/business-blog-04/wp-content/uploads/sites/895/2021/06/business-blog-site-logo.svg" 
                alt="" 
                className="mx-auto" 
            />
            <div className="flex-1 flex justify-end">
                <button className='px-10 py-2 border text-black border-black hover:bg-black hover:text-white transition-all'>
                    <Link to='sign-in' className='font-semibold'>Subscribe</Link>
                </button>
            </div>
        </Navbar>

        <div className="flex justify-center items-center mt-2 mb-5">
            <div className="flex justify-between text-gray-500">
                <Link className='px-5 hover:text-black'>Home</Link>
                <Link className='px-5 hover:text-black'>Stock Market</Link>
                <Link className='px-5 hover:text-black'>Technology</Link>
                <Link className='px-5 hover:text-black'>Politics</Link>
                <Link className='px-5 hover:text-black'>Automobile</Link>
                <Link className='px-5 hover:text-black'>Health</Link>
                <Link className='px-5 hover:text-black'>Interactive Sessions</Link>
            </div>
        </div>
    </div>
  )
}

export default NewHeader

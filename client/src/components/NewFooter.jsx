import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa'
import { useSelector } from 'react-redux';

function NewFooter() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <div className='bg-slate-200'>
        {!currentUser && !isAuthPage && (
          <div className="bg-white">
            <div className="border border-black max-w-7xl mx-auto grid grid-cols-2 max-md:grid-cols-1 ">
              <div className="flex gap-6 px-10 py-12">
                <div className="text-black">
                  <FaPaperPlane size={28}/>
                </div>
                <div className="">
                  <h2 className='text-3xl text-black font-semibold'>Đăng ký để gia nhập</h2>
                  <p className='text-md mt-3'>The best of Business news, in your inbox.</p>
                </div>
              </div>
              <div className="flex justify-center items-center px-20">
                <button className='p-3 w-full border text-black border-black hover:bg-black hover:text-white transition-all max-md:mb-12'>
                  <Link to='sign-in' className='font-semibold'>Đăng ký</Link>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={`mx-10 ${!currentUser && !isAuthPage ? '' : 'pt-10'}`}>
          <div className="border-t border-gray-500 max-w-7xl mx-auto my-14"></div>
        
          <div className="
            w-full max-w-7xl mx-auto grid grid-cols-4 grid-rows-1 gap-6
            max-md:grid-cols-2 max-md:grid-rows-2
          ">
            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Tổng quan</h2>
                <p className='mt-6'>Website viết blog của chúng tôi là nơi lý tưởng để chia sẻ ý tưởng, kiến thức và trải nghiệm cá nhân. Với giao diện thân thiện và các tính năng tiện ích như phân loại chủ đề và hỗ trợ bình luận, bạn có thể dễ dàng kết nối với độc giả và xây dựng nội dung chuyên nghiệp.</p>
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Công ty</h2>
                <div className="mt-6 flex flex-col">
                    <Link className='hover:text-sky-700'>Về chúng tôi</Link>
                    <Link className='hover:text-sky-700'>Liên hệ</Link>
                    <Link className='hover:text-sky-700'>Nhân sự</Link>
                    <Link className='hover:text-sky-700'>Quảng cáo</Link>
                </div>    
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Chính sách</h2>
                <div className="mt-6 flex flex-col">
                    <Link className='hover:text-sky-700'>Chính sách bảo mật Policy</Link>
                    <Link className='hover:text-sky-700'>Điều khoản dịch vụ</Link>
                </div>    
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Theo dõi</h2>
                <div className="mt-6 flex flex-col">
                    <Link className='hover:text-sky-700'>Facebook</Link>
                    <Link className='hover:text-sky-700'>Youtube</Link>
                    <Link className='hover:text-sky-700'>Twitter</Link>
                    <Link className='hover:text-sky-700'>Instagram</Link>
                </div>    
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex justify-between items-center min-h-[80px] py-16 text-sm">
            <p>Copyright © 2025 Business Blog</p>
            <p>Powered by Business Blog</p>
          </div>
        </div>
    </div>
  )
}

export default NewFooter

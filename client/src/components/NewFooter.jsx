import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa'

function NewFooter() {
  return (
    <div className='bg-slate-200'>
          <div className="bg-white">
            <div className="border border-black max-w-7xl mx-auto grid grid-cols-2 max-md:grid-cols-1">
              <div className="flex gap-6 px-10 py-12">
                <div className="text-black">
                  <FaPaperPlane size={28}/>
                </div>
                <div className="">
                  <h2 className='text-3xl text-black font-semibold'>Sign up for our newsletters</h2>
                  <p className='text-md mt-3'>The best of Business news, in your inbox.</p>
                </div>
              </div>
              <div className="flex justify-center items-center px-20">
                <button className='p-3 w-full border text-black border-black hover:bg-black hover:text-white transition-all max-md:mb-12'>
                  <Link to='sign-in' className='font-semibold'>Subscribe</Link>
                </button>
              </div>
            </div>
          </div>
        <div className="mx-10">
          <div className="border-t border-gray-500 max-w-7xl mx-auto my-14"></div>
        
          <div className="
            w-full max-w-7xl mx-auto grid grid-cols-4 grid-rows-1 gap-6
            max-md:grid-cols-2 max-md:grid-rows-2
          ">
            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>About</h2>
                <p className='mt-6'>Turpis erat tincidunt et viverra id nunc molestie et faucibus diam, proin lectus aliquam mattis ac nunc elementum accumsan libero.</p>
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Company</h2>
                <div className="mt-6 flex flex-col">
                    <Link className='hover:text-sky-700'>About us</Link>
                    <Link className='hover:text-sky-700'>Contact us</Link>
                    <Link className='hover:text-sky-700'>Our Staff</Link>
                    <Link className='hover:text-sky-700'>Advertise</Link>
                </div>    
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Legal</h2>
                <div className="mt-6 flex flex-col">
                    <Link className='hover:text-sky-700'>Privacy Policy</Link>
                    <Link className='hover:text-sky-700'>Terms of Service</Link>
                    <Link className='hover:text-sky-700'>Extra Crunch Terms</Link>
                    <Link className='hover:text-sky-700'>Code of Conduct</Link>
                </div>    
            </div>

            <div className="flex flex-col">
                <h2 className='text-2xl font-bold'>Follow Us</h2>
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

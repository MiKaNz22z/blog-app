import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { FaEnvelope } from "react-icons/fa6";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const nagative = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields."))
    }
    try {
      dispatch(signInStart());
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if(data.success === false) {
          dispatch(signInFailure(data.message));
        }

        if(res.ok){
          dispatch(signInSuccess(data));
          nagative('/')
        }
    } catch(error) { 
      dispatch(signInFailure(error.message))
    }
  }
  console.log(formData);
  return (
    <div className="min-h-screen py-20 bg-slate-100">
      <div className="flex p-6 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5 bg-white shadow-md">
        {/* left */}
        <div className="flex-1">
          <img src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*yBt65HhmARbqZDDJ1McFDg.png" alt="" />
          {/* <Link to="/" className="font-bold dark:text-white text-4xl">
              <span className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-lg text-white">Zakuro&apos;s</span>
              Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password or with Google
          </p> */}
        </div>
        {/* right */}
        <div className="flex-1">
          <h2 className="text-3xl text-center font-bold uppercase text-black mb-4">Đăng nhập</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* <div className="">
              <Label value="Your email"></Label>
              <TextInput type="email" placeholder="name@company.com" id='email'onChange={handleChange}/>
            </div> */}

            <div className="my-4 relative">
              <input
                type="email"
                className=" w-full px-3 py-2 border-0 border-b-2 placeholder:text-gray-600 border-gray-600 focus:outline-none focus:border-gray-600 focus:no-ring"
                placeholder="Email Address"
                id="email"
                onChange={handleChange}
              />
              <FaEnvelope className="absolute right-2 top-[40%]"/>
            </div>

            <div className="relative mb-4">
              <input 
                type={showPassword ? "text" : "password"}
                className=" w-full px-3 py-2 border-0 border-b-2 placeholder:text-gray-600 border-gray-600 focus:outline-none focus:border-gray-600 focus:no-ring"
                placeholder="*********" 
                id='password'
                onChange={handleChange}
              />
              <div className="absolute right-2 top-[40%] flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <FaLock />
              </div>
            </div>
            <button className='mt-4 px-10 py-3 border text-black border-black font-semibold hover:bg-black hover:text-white transition-all' type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Đang tải ...</span>
                  </>
                ) : "Sign In"
              }
            </button>

            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Bạn chưa có tài khoản ?</span>
            <Link to="/sign-up" className="text-blue-500 hover:text-gray-800">Đăng ký</Link>
          </div>

          { errorMessage && (
              <Alert className="mt-5" color='failure'>{errorMessage}</Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

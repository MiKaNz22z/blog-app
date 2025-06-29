import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";
import { FaEnvelope } from "react-icons/fa6";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const nagative = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return setErrorMessages("Vui lòng điền đầy đủ thông tin.");
    }
    if(formData.password !== formData.confirmPassword) {
      return setErrorMessages("Mật khẩu xác nhận không khớp.");
    }
    try {
      setLoading(true);
      setErrorMessages(null)
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if(data.success === false) {
          return setErrorMessages(data.message)
        }
        setLoading(false);

        if(res.ok){
          nagative('/sign-in')
        }
    } catch(error) { 
      setErrorMessages(error.message);
      setLoading(false);
    }
  }
  console.log(formData);
  return (
    <div className="min-h-screen pt-20 bg-slate-100">
      <div className="flex p-6 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5 bg-white shadow-md">
        {/* left */}
        <div className="flex-1">
          <img src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*yBt65HhmARbqZDDJ1McFDg.png" alt="" />
          {/* <Link to="/" className="font-bold dark:text-white text-4xl">
              <span className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-lg text-white">Zakuro&apos;s</span>
              Blog
              </Link>
              <p className="text-sm mt-5">
              Our blog takes the message from the weekend and lays out next right steps, so you can hear a message and do a message in practical ways.
              </p> */}
        </div>
        {/* right */}
        <div className="flex-1">
          <h2 className="text-3xl text-center font-bold uppercase text-black">Đăng ký</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Username" 
                id='username'
                onChange={handleChange}
                className=" w-full px-3 py-2 border-0 border-b-2 placeholder:text-gray-600 border-gray-600 focus:outline-none focus:border-gray-600 focus:no-ring"
                />
                <FaCircleUser className="absolute right-2 top-[40%]"/>
            </div>

            {/* <div className="">
              <Label value="Your email"></Label>
              <TextInput type="email" placeholder="name@company.com" id='email'onChange={handleChange}/>
            </div>

            <div className="">
              <Label value="Your password"></Label>
              <TextInput type="password" placeholder="Password" id='password'onChange={handleChange}/>
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
                placeholder="Mật khẩu" 
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

            <div className="relative mb-4">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                className=" w-full px-3 py-2 border-0 border-b-2 placeholder:text-gray-600 border-gray-600 focus:outline-none focus:border-gray-600 focus:no-ring"
                placeholder="Xác nhận mật khẩu" 
                id='confirmPassword'
                onChange={handleChange}
              />
              <div className="absolute right-2 top-[40%] flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                ) : "Đăng ký"
              }
            </button>

            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Bạn đã có tài khoản?</span>
            <Link to="/sign-in" className="text-blue-500">Đăng nhập</Link>
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

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const nagative = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessages("Please fill out all fields.");
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
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
              <span className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-lg text-white">Zakuro&apos;s</span>
              Blog
          </Link>
          <p className="text-sm mt-5">
            Our blog takes the message from the weekend and lays out next right steps, so you can hear a message and do a message in practical ways.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your username"></Label>
              <TextInput type="text" placeholder="Username" id='username'onChange={handleChange}/>
            </div>

            <div className="">
              <Label value="Your email"></Label>
              <TextInput type="email" placeholder="name@company.com" id='email'onChange={handleChange}/>
            </div>

            <div className="">
              <Label value="Your password"></Label>
              <TextInput type="password" placeholder="Password" id='password'onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='pinkToOrange'type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading ...</span>
                  </>
                ) : "Sign up"
              }
            </Button>

            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
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

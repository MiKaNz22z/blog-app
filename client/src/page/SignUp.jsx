import { Button, Label, TextInput } from "flowbite-react"
import { Link } from "react-router-dom"

export default function SignUp() {
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
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your username"></Label>
              <TextInput type="text" placeholder="Username" id='username'/>
            </div>

            <div className="">
              <Label value="Your email"></Label>
              <TextInput type="text" placeholder="name@company.com" id='email'/>
            </div>

            <div className="">
              <Label value="Your password"></Label>
              <TextInput type="text" placeholder="Password" id='password'/>
            </div>
            <Button gradientDuoTone='pinkToOrange' type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

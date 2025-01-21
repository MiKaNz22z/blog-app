import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const nagivate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch ('api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if(res.ok){
                dispatch(signInSuccess(data))
                nagivate('/')
            }

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <button className='px-10 py-3 border text-white bg-black border-black font-semibold hover:bg-white hover:text-black transition-all flex justify-center items-center' type="button" outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle  className="w-5 h-5 mr-2"/>
        <p>Continue with Google</p>
    </button>
  )
}

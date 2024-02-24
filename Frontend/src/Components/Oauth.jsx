import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../Firebas';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom'
export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function HandleGoogleClick() {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            const res = await fetch('https://backend-c29n.vercel.app/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button type='button' onClick={HandleGoogleClick} className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ">
            Continue with Google
        </button>
    )
}

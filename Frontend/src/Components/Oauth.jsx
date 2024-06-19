import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../Firebas';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    async function HandleGoogleClick() {
        try {
            setloading(true);
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
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
            setloading(false);
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    }
    return (
        <button type='button' onClick={HandleGoogleClick} disabled={loading} className="bg-red-700 text-white p-3 rounded-lg uppercase disabled:opacity-85 hover:opacity-95 ">
            {loading ? 'Loading...' : 'continue with google'}
        </button>
    )
}

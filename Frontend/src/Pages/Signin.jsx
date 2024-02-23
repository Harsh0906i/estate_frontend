import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart } from '../Redux/user/userSlice'
import { signInFaliure } from '../Redux/user/userSlice'
import { signInSuccess } from '../Redux/user/userSlice'
import Oauth from '../Components/Oauth'

export default function Signin() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) =>
    state.user
  )
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setFormData({
      ...formData, [e.target.id]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFaliure(data.message));
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')

    } catch (error) {
      dispatch(signInFaliure(error.message));
    }
  }
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='Email...' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password...' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' >
         Sign In
        </button>
        <Oauth />
      </form>

      <div className=' flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign-up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../Firebas'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  SignOutUserStart,
  SignOutUserSuccess,
  SignOutUserFaliure,
} from '../Redux/user/userSlice'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setfile] = useState(undefined)
  const [fileperc, setfileprec] = useState(0);
  const [filerr, setfilerr] = useState(null);
  const [formData, setformData] = useState({})
  const fileRef = useRef(null)
  const dispatch = useDispatch();
  const [successUpdate, setsuccessUpdate] = useState(false);
  const [showListingErr, setshowListingErr] = useState(false);
  const [userListing, setuserListing] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  function handleFileUpload(file) {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('storage_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setfileprec(Math.round(progress));
    },
      (err) => {
        setfilerr(err)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((DownloadURL) => {
            setformData({ ...formData, avatar: DownloadURL })
          })
      }
    )
  }

  function HandleUpdate(e) {
    setformData({ ...formData, [e.target.id]: e.target.value });
  }
  async function HandleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://backend-c29n.vercel.app/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(res.cookie)
      console.log(res.headers)
      if (data.success === false) {
        dispatch(updateUserFaliure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setsuccessUpdate(true)
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  }

  async function handleDelete() {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://backend-c29n.vercel.app/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }

  }

  async function HandleSignOut() {
    try {
      dispatch(SignOutUserStart());
      const res = await fetch('https://backend-c29n.vercel.app/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutUserFaliure(data.message))
        return;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFaliure(error.message))
    }
  }
  async function handleShowListing() {
    try {
      setshowListingErr(false)
      const res = await fetch(`https://backend-c29n.vercel.app/api/user/listing/${currentUser._id}`);
      const data = await res.json();
       const token = response.headers.get('Authorization');
      console.log(data,"t : ",token);
      if (data.success === false) {
        setshowListingErr(true);
        return;
      }
      setuserListing(data)
    } catch (error) {
      setshowListingErr(true);
    }
  }
  async function HandleListingDelete(listingId) {
    try {
      const res = await fetch(`https://backend-c29n.vercel.app/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        console.log(data);
        return;
      }
      setuserListing((prev) => prev.filter((listing) => listing._id !== listingId)
      )
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={HandleSubmit}>
        <input type="file" onChange={(e) => setfile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {
            filerr ?
              (<span className='text-red-700'>
                Error uploading file(Image must be less than 2 MB)
              </span>) :
              fileperc > 0 && fileperc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${fileperc} %`}
                </span>
              ) : fileperc === 100 ? (
                <span className='text-green-800'>Image uploaded successfully!</span>
              ) : (
                ''
              )}
        </p>
        <input type="text" placeholder='username' defaultValue={currentUser.username} onChange={HandleUpdate} className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' id='email' onChange={HandleUpdate} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90'>{loading ? 'Loading...' : 'Update'}</button>
        <Link to={'/create-listing'} className='bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' >Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={HandleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-600 mt-5'>{successUpdate ? 'User updated successfully!' : ''}</p>
      <button className='text-green-700 w-full' onClick={handleShowListing}>Show your listings</button>
      {showListingErr && <p className='text-red-700' >Error showing listing</p>}
      <div className='flex flex-col gap-4'>
        {userListing && userListing.length > 0 &&
          userListing.map((listing) =>
            <div key={listing._id} className='border rounded-lg gap-4 p-3 flex justify-between items-center'>
              <Link to={`/listing/${listing._id}`}>
                <img className='h-16 w-16 object-contain' src={listing.image[0]} alt="listing cover" />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button onClick={() => { HandleListingDelete(listing._id) }} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/updateListing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

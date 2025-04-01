import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from "react";

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setsearchTerm] = useState('');
    const navigate = useNavigate();

    function HandleSubmit(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlsearch = urlParams.get('searchTerm');
        if (urlsearch) {
            setsearchTerm(urlsearch)
        }
    }, [location.search])
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Elite</span>
                        <span className='text-slate-700'>EstatesOnline</span>
                    </h1>
                </Link>
                <form onSubmit={HandleSubmit} className='bg-slate-100 p-3 rounded-lg items-center'>
                    <input type="text" placeholder='Search...' value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button><FaSearch className="text-slate-600" /></button>
                </form>
                <ul className="flex gap-4">
                    <Link to='/'>
                        <li className="hidden sm:inline  text-slate-700 hover:underline ">Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className="hidden sm:inline  text-slate-700 hover:underline ">About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (<img src={currentUser.avatar} className="rounded-full h-7 w-7 object-cover" alt="Profile" />) :
                            <li className=" sm:inline  text-slate-700 hover:underline ">Sign-in</li>
                        }
                    </Link>
                </ul>
            </div>
        </header>
    )
}

import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setlandlord] = useState(null)
    const [message, setmessage] = useState(null)

    function HandleMessageChange(e) {
        setmessage(e.target.value);
    }

    useEffect(() => {
        async function fetchlord() {
            const res = await fetch(`https://backend-c29n.vercel.app/api/user/${listing.userRef}`);
            const data = await res.json();
            setlandlord(data);
        }
        try {
        } catch (error) {
            console.log(error);
        }
        fetchlord();
    }, [listing.userRef])
    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
                    <textarea name="message" id="" rows="2" onChange={HandleMessageChange} value={message} placeholder="Type a message..." className="w-full border p-3 rounded-lg"></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
                        Send message</Link>
                </div>
            )}
        </>
    )
}
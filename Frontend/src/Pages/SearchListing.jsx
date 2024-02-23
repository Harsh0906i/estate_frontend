import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

export default function SearchListing() {
    const [sidebarData, setsidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });
    const navigate = useNavigate();

    const [loading, setloading] = useState(false);
    const [showMore, setshowMore] = useState(false);
    const [listings, setlistings] = useState([]);
    console.log(sidebarData);
    console.log(listings);

    function handleChange(e) {
        e.preventDefault();
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setsidebarData({ ...sidebarData, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setsidebarData({ ...sidebarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setsidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setsidebarData({ ...sidebarData, sort, order });
        }
    }
    function handleSubmit(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    useEffect(() => {
        const newurl = new URLSearchParams(location.search);
        const searchTermUrl = newurl.get('searchTerm')
        const typeUrl = newurl.get('type')
        const parkingUrl = newurl.get('parking')
        const furnishedUrl = newurl.get('furnished')
        const offerUrl = newurl.get('offer')
        const sortUrl = newurl.get('sort')
        const orderUrl = newurl.get('order')

        if (searchTermUrl || typeUrl || parkingUrl || furnishedUrl || offerUrl || sortUrl || orderUrl) {
            setsidebarData({
                searchTerm: searchTermUrl || '',
                type: typeUrl || 'all',
                parking: parkingUrl === 'true' ? true : false
                , offer: offerUrl === 'true' ? true : false
                , furnished: furnishedUrl === 'true' ? true : false
                , sort: sortUrl || 'created_at'
                , order: orderUrl || 'desc',
            });
        }

        async function fetchList() {
            setloading(true)
            const searchQuery = newurl.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setshowMore(true);
            }
            setlistings(data);

            setloading(false);
        }
        fetchList()

    }, [location.search])

    async function showMoreButton() {
        const numberOfListing = listings.length;
        const startIndex = numberOfListing;
        const UrlParams = new URLSearchParams(location.search);
        UrlParams.set('startIndex', startIndex);
        const searchQuery = UrlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setshowMore(false)
        }
        else{
            setshowMore(false)
        }
        setlistings([ ...listings, ...data ]);

    }
    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term :</label>
                        <input type="text" value={sidebarData.searchTerm} onChange={handleChange} id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full" />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className="font-semibold">Type : </label>
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={sidebarData.type === 'all'} id="all" className="w-5" />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={sidebarData.type === 'rent'} id="rent" className="w-5" />
                            <span>Rent </span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebarData.type === 'sale'} type="checkbox" id="sale" className="w-5" />
                            <span> Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebarData.offer} type="checkbox" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className="font-semibold">Ameneties : </label>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebarData.parking} type="checkbox" id="parking" className="w-5" />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebarData.furnished} type="checkbox" id="furnished" className="w-5" />
                            <span>Furnished </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort : </label>
                        <select onChange={handleChange} defaultValue={'created_at_desc'} className="border rounded-lg p-3" id="sort_order">
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
                </form>
            </div>
            <div className=" flex-1">
                <h1 className="text-3xl font-semibold p-3 border-b text-slate-700 mt-5">Listing results : </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700">No listing found!</p>
                    )}
                    {
                        loading && (
                            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                        )
                    }
                    {
                        !loading && listings && listings.map((item) =>
                            <ListingItem key={item._id} listings={item} />
                        )
                    }
                    {showMore && (
                        <button className="text-green-700 hover:underline p-7 text-center w-full" onClick={
                            showMoreButton
                        } >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

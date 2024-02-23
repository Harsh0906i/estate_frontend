import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../Firebas";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
    const [file, setfile] = useState([]);
    const navigate = useNavigate();
    const [formData, setformData] = useState({
        image: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        discountedPrice: 0,
        regularPrice: 50,
        offer: false,
        parking: false,
        furnished: false
    });
    const { currentUser } = useSelector((state) => state.user)
    const [imageUploadError, setimageUploadError] = useState(false);
    const [upload, setupload] = useState(false);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(false)
    const params = useParams();
    useEffect(() => {
        async function fetchingListing() {
            const listingId = params.listingId
            console.log(listingId)
            const res = await fetch(`/api/listing/getListing/${listingId}`);
            const data = await res.json();
            setformData(data);
            if (data.success === false) {
                console.log(data.message);
            }
        }
        fetchingListing();
    }, [])
    function HandleFileSubmit(e) {
        if (file.length > 0 && file.length + formData.image.length < 7) {
            setupload(true);
            setimageUploadError(false)
            const promise = [];
            for (let i = 0; i < file.length; i++) {
                promise.push(storeImage(file[i]));
            }
            Promise.all(promise).then((url) => {
                setformData({
                    ...formData, image: formData.image.concat(url),
                });
                setimageUploadError(false);
                setupload(false)
            }).catch((err) => {
                setimageUploadError('Image upload failed! (2MB max per image)');
                setupload(false)
            });
        } else {
            setimageUploadError('Max upload image limit is 6');
            setupload(false)
        }
    }

    async function storeImage(file) {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    function HandleRemoveImage(index) {
        setformData({
            ...formData, image: formData.image.filter((url, i) => {
                i !== index
            })
        })
    }
    function handleChange(e) {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setformData({ ...formData, type: e.target.id })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setformData({ ...formData, [e.target.id]: e.target.checked })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setformData({ ...formData, [e.target.id]: e.target.value })
        }
    }

    async function HandleSubmit(e) {
        e.preventDefault();

        try {
            seterror(false)
            setloading(true)
            if (formData.image.length < 1) {
                seterror('You must upload at least one image');
                return;
            }
            if (formData.regularPrice < formData.discountedPrice) {
                seterror('Discounted price must be less than regular price!')
            }
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, userRef: currentUser._id }),
            });
            const data = await res.json();
            setloading(false);
            if (data.success === false) {
                seterror(data.message)
            }
            console.log(data);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            seterror(error.messsage)
            setloading(false)
        }
    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update Listing</h1>
            <form onSubmit={HandleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder="Name..." className="border p-3 rounded-lg" onChange={handleChange} value={formData.name} id="name" maxLength={'62'} minLength={'5'} required />
                    <textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description..." className="border p-3 rounded-lg" id="description" required />
                    <input type="text" onChange={handleChange} value={formData.address} placeholder="Address..." className="border p-3 rounded-lg" id="address" required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" className="w-5 cursor-pointer" onChange={handleChange} checked={formData.type === "sale"} id="sale" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'rent'} className="w-5 cursor-pointer" id="rent" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.parking} type="checkbox" className="w-5 cursor-pointer" id="parking" />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" className="w-5 cursor-pointer" id="offer" onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" className="w-5 cursor-pointer" onChange={handleChange} checked={formData.furnished} id="furnished" />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" onChange={handleChange} value={formData.bedroom} className="p-3  border-gray-300 rounded-lg" id="bedrooms" min={'1'} max={'10'} required />
                            <span>Bedroom</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" onChange={handleChange} value={formData.bathroom} className="p-3 border-gray-300 rounded-lg" id="bathrooms" min={'1'} max={'10'} required />
                            <span>Bathroom</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" min={'50'} max={'10000000000000'} onChange={handleChange} value={formData.regularPrice} className="p-3 border-gray-300 rounded-lg" id="regularPrice" required />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input type="number" onChange={handleChange} value={formData.discountedPrice} className="p-3 border-gray-300 rounded-lg" min={'0'} max={'100000000000'} id="discountedPrice" required />
                                <div className="flex flex-col items-center">
                                    <p>Discounted Price</p>
                                    <span className="text-xs">($ / month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">First image will be cover (Max-6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setfile(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                        <button disabled={upload} type="button" onClick={HandleFileSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{upload ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className="text-red-700">{imageUploadError}</p>
                    {
                        formData.image.length > 0 && formData.image.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" onClick={() => HandleRemoveImage(index)} className="p-3 text-red-700 rounded-lg hover:opacity-90">Delete</button>
                            </div>
                        ))
                    }
                    <button disabled={loading || upload} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">{loading ? 'Updating...' : 'Update Listing'}</button>
                    {error && <p className="text-red-700">{error}</p>}
                </div>
            </form>
        </main>
    );
}

import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md'
export default function ListingItem({ listings }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
            <Link to={`/listing/${listings._id}`}>
                <img src={listings.image[0]} alt="Photo" className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300" />
                <div className="p-3 flex flex-col gap-2 w-full truncate">
                    <p className="text-lg font-semibold text-slate-700 truncate ">{listings.name}</p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                        {listings.address}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {listings.description}
                    </p>
                    <p className="text-slate-500 font-semibold mt-2">
                        ${listings.offer ? listings.discountedPrice.toLocaleString('en-US') : listings.regularPrice.toLocaleString('en-US')}
                        {listings.type === 'rent' && ' / month'}
                    </p>
                    <div className="text-slate-700">
                        <div className="font-bold text-xs">
                            {listings.bedrooms > 1 ? `${listings.bedrooms} beds` : `${listings.bedrooms} bed`}
                        </div>
                        <div className="font-bold text-xs">
                            {listings.bathrooms > 1 ? `${listings.bathrooms} beds` : `${listings.bathrooms} bed`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

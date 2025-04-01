import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import ListingItem from '../Components/ListingItem';

export default function Home() {
  const [offerListing, setofferListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);
  SwiperCore.use([Navigation]);
  const [rentListing, setrentListing] = useState([]);
  console.log(saleListing);

  useEffect(() => {
    async function fetchOffer() {
      try {
        const res = await fetch(`https://backend-c29n.vercel.app/api/listing/get?offer=true&limit=4`);
        const data = await res.json()
        setofferListing(data);
        fetchRent()
      } catch (error) {
        console.log(error)
      }
    }

    async function fetchRent() {
      try {
        const res = await fetch(`https://backend-c29n.vercel.app/api/listing/get?type=rent&limit=4`);
        const data = await res.json()
        setrentListing(data);
        saleFetch();
      } catch (error) {
        console.log(error)
      }
    }

    async function saleFetch() {
      try {
        const res = await fetch(`https://backend-c29n.vercel.app/api/listing/get?type=sale&limit=4`);
        const data = await res.json()
        setsaleListing(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOffer();
  }, []);
  return (
    <div>
      {/* {} */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          EliteEstatesOnline is the best place to find your next perfect place to live.
          <br />
          we have a wide range of properties for you to choose from.
        </div>
        <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={'/search'}>
          Let's get started...
        </Link>
      </div>
      {/* {swiper} */}
      <Swiper navigation>
        {offerListing
          &&
          offerListing.length > 0
          &&
          offerListing.map((list) => (
            <SwiperSlide>
              <div style={{ background: `url(${list.image[0]}) center no-repeat`, backgroundSize: 'cover' }} className='h-[450px]' key={list._id}></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* {} */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListing.map((list) => (
                <ListingItem listings={list} key={list._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListing.map((list) => (
                <ListingItem listings={list} key={list._id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListing.map((list) => (
                <ListingItem listings={list} key={list._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

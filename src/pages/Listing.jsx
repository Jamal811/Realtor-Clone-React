import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedLinkCopied, setSharedLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId); // id from params send via app component
      // get the data
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade, Autoplay, Navigation, Pagination]} // Include all necessary modules here
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setSharedLinkCopied(true);
          setTimeout(() => {
            setSharedLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {sharedLinkCopied && (
        <p className="fixed top-[23%] right-[5%] z-10 bg-white font-semibold border-2 border-gray-400 rounded-md p-2">
          Link copied
        </p>
      )}
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg bg-white lg:space-x-5">
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" /> {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.offer && (
                <p>
                  ${+listing.regularPrice - +listing.discountedPrice} discount
                </p>
              )}
            </p>
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold"> Description - </span>{" "}
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className=" flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className=" flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bedrooms} Baths` : "1 Bath"}
            </li>
            <li className=" flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking Spot" : "No Parking"}
            </li>
            <li className=" flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;

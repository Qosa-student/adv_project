// pages/dashboard.js - COMPLETE IMPROVED VERSION
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

const SAMPLE_HOTELS = [ 
  { id: 1, name: "Red Planet Davao", location: "J.P. Laurel Avenue, Lanang, Davao City 8000, Philippines", price: 1634, stars: 4.1, amenities: ["WiFi", "Air Conditioning", "Restaurant"] },
  { id: 2, name: "Acacia Hotel Davao", location: "J.P. Laurel Ave., Lanang, Davao City 8000, Philippines", price: 4143, stars: 4.4, amenities: ["Pool", "Spa", "WiFi"] },
  { id: 3, name: "Aeon SUITES Staycation", location: "Aeon Towers, J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 3219, stars: 3.7, amenities: ["Kitchen", "Laundry", "WiFi"] },
  { id: 4, name: "Hotel Galleria", location: "Gov. Duterte St., Poblacion District, Davao City 8000, Philippines", price: 1033, stars: 3.6, amenities: ["WiFi", "Parking"] },
  { id: 5, name: "Davao Royal Suites and Residences", location: "C.M. Recto Ave., Brgy. 38-D, Poblacion, Davao City 8000, Philippines", price: 897, stars: 3.9, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 6, name: "Crown Regency Residences Davao", location: "J.P. Cabaguio Ave., Agdao, Davao City 8000, Philippines", price: 934, stars: 3.5, amenities: ["WiFi", "Air Conditioning"] },
  { id: 7, name: "Da West Inn Garden", location: "Km. 7 Lanang, Davao City 8000, Philippines", price: 1188, stars: 3.1, amenities: ["Garden", "WiFi"] },
  { id: 8, name: "Star Hotel", location: "Mabini St. cor. Voyager St., Brgy. 9-A, Poblacion, Davao City 8000, Philippines", price: 985, stars: 4.0, amenities: ["WiFi", "Restaurant"] },
  { id: 9, name: "GV Hotel Davao", location: "Magallanes St., Brgy. 2-A, Poblacion, Davao City 8000, Philippines", price: 738, stars: 3.6, amenities: ["WiFi", "Parking"] },
  { id: 10, name: "Kampotel Davao", location: "727 F. S. Sotto St., Brgy. 13-B, Poblacion, Davao City 8000, Philippines", price: 739, stars: 4.3, amenities: ["WiFi", "Breakfast"] },
  { id: 11, name: "Orchard Hotel", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 991, stars: 3.7, amenities: ["Garden", "WiFi"] },
  { id: 12, name: "Pacific Palm Suites", location: "Mamalias St., Angliongto, Lanang, Davao City 8000, Philippines", price: 1987, stars: 3.8, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 13, name: "RedDoorz near Robinsons Cybergate Davao", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 1021, stars: 3.5, amenities: ["WiFi", "Air Conditioning"] },
  { id: 14, name: "Central District Hotel", location: "Jln Palma Gil St., Poblacion District, Davao City 8000, Philippines", price: 1140, stars: 4.0, amenities: ["WiFi", "Restaurant"] },
  { id: 15, name: "Daylight Inn Davao", location: "San Pedro St., Brgy. 3-A, Poblacion, Davao City 8000, Philippines", price: 423, stars: 3.4, amenities: ["WiFi", "Parking"] },
  { id: 16, name: "RedDoorz near G Mall Bajada Davao", location: "Lupo Diaz St., Obrero, Davao City 8000, Philippines", price: 1022, stars: 3.8, amenities: ["WiFi", "Air Conditioning"] },
  { id: 17, name: "Hotel Sogo Davao", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 876, stars: 4.3, amenities: ["WiFi", "24hr Service"] },
  { id: 18, name: "Traveler's Inn Bajada", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 840, stars: 4.0, amenities: ["WiFi", "Parking"] },
  { id: 19, name: "RedDoorz @ Traveler Inn Matina", location: "Matina Aplaya Rd., Matina, Davao City 8000, Philippines", price: 1191, stars: 2.0, amenities: ["WiFi"] },
  { id: 20, name: "Seda Abreeza", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 6370, stars: 4.4, amenities: ["Pool", "Spa", "Gym", "Restaurant"] },
  { id: 21, name: "The Royal Mandaya Hotel", location: "J. Palma Gil St., Poblacion, Davao City 8000, Philippines", price: 3033, stars: 4.3, amenities: ["Pool", "Spa", "Restaurant"] },
  { id: 22, name: "Casa Maria", location: "Jacana cor. Nightingale St., Belisario Heights, Lanang, Davao City 8000, Philippines", price: 2461, stars: 4.0, amenities: ["WiFi", "Garden", "Restaurant"] },
  { id: 23, name: "RedDoorz Plus near SM Lanang Davao", location: "Ubalde, Agdao, Davao City 8000, Philippines", price: 1130, stars: 3.7, amenities: ["WiFi", "Air Conditioning"] },
  { id: 24, name: "Aikiko House", location: "Anda St., Brgy. 3-A, Poblacion, Davao City 8000, Philippines", price: 891, stars: 4.2, amenities: ["WiFi", "Kitchen"] },
  { id: 25, name: "Napsule Suites", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 879, stars: 4.0, amenities: ["WiFi", "Laundry"] },
  { id: 26, name: "Rogen Inn", location: "Mt. Apo St. cor. Lopez Jaena St., Poblacion, Davao City 8000, Philippines", price: 2034, stars: 4.4, amenities: ["Pool", "WiFi", "Restaurant"] },
  { id: 27, name: "Big Ben's Apartelle", location: "Guerrero St., Obrero, Davao City 8000, Philippines", price: 832, stars: 3.7, amenities: ["WiFi", "Kitchen"] },
  { id: 28, name: "Hop Inn Hotel Davao", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 1421, stars: 4.3, amenities: ["WiFi", "Air Conditioning"] },
  { id: 29, name: "La Anclar Hotel", location: "Bonifacio St., Brgy. 34-D, Poblacion, Davao City 8000, Philippines", price: 1777, stars: 3.8, amenities: ["WiFi", "Restaurant"] },
  { id: 30, name: "Traveller's Inn Matina Pangi", location: "Matina Pangi Rd., Davao City 8000, Philippines", price: 830, stars: 4.2, amenities: ["WiFi", "Parking"] },
  { id: 31, name: "Snooze Inn and Suites", location: "Gen. Douglas MacArthur Hwy, Matina, Davao City 8000, Philippines", price: 3210, stars: 4.5, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 32, name: "My Hotel Davao", location: "Angliongto Rd., Lanang, Davao City 8000, Philippines", price: 1252, stars: 3.9, amenities: ["WiFi", "Restaurant"] },
  { id: 33, name: "Jotel Inn", location: "E. Quirino Ave., Brgy. 4-A, Poblacion, Davao City 8000, Philippines", price: 1139, stars: 4.1, amenities: ["WiFi", "Air Conditioning"] },
  { id: 34, name: "Casa Leticia Business Inn", location: "Maya St., Ecoland, Davao City 8000, Philippines", price: 1609, stars: 4.2, amenities: ["WiFi", "Business Center"] },
  { id: 35, name: "RedDoorz Plus near Bangko Sentral ng Pilipinas Davao", location: "C.M. Recto St., Poblacion, Davao City 8000, Philippines", price: 973, stars: 4.6, amenities: ["WiFi", "Air Conditioning"] },
  { id: 36, name: "Chateau Cinco Dormitel", location: "Goshawk St. cor. Indigo St., Belisario Heights, Lanang, Davao City 8000, Philippines", price: 1570, stars: 4.3, amenities: ["WiFi", "Common Area"] },
  { id: 37, name: "Conclave Hotel", location: "J.P. Laurel Ave., Bajada, Davao City 8000, Philippines", price: 1297, stars: 4.0, amenities: ["WiFi", "Meeting Rooms"] },
  { id: 38, name: "BlueBerry Tourist Hotel", location: "Avanceña St., Jacinto Ext., Brgy. 11-B, Davao City 8000, Philippines", price: 2890, stars: 4.1, amenities: ["Pool", "Restaurant", "WiFi"] },
  { id: 39, name: "The Strand Suites and Dormitel", location: "Road 2, Doña Vicenta Village, Bajada, Davao City 8000, Philippines", price: 1085, stars: 4.3, amenities: ["WiFi", "Common Area"] },
  { id: 40, name: "Hotel Uno", location: "C.M. Recto St., Poblacion, Davao City 8000, Philippines", price: 1578, stars: 3.4, amenities: ["WiFi", "Parking"] },
  { id: 41, name: "Hampton Suites", location: "Gen. Douglas MacArthur Hwy, Matina, Davao City 8000, Philippines", price: 1981, stars: 4.5, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 42, name: "RedDoorz Plus @ Roxas Street Davao", location: "Roxas Ave., Brgy. 32-D, Poblacion, Davao City 8000, Philippines", price: 1149, stars: 3.9, amenities: ["WiFi", "Air Conditioning"] },
  { id: 43, name: "Casa Leticia Boutique Hotel", location: "J. Camus St., Poblacion, Davao City 8000, Philippines", price: 1829, stars: 4.0, amenities: ["WiFi", "Restaurant", "Spa"] },
  { id: 44, name: "Hotel Midori Davao", location: "Gov. Duterte St., Poblacion, Davao City 8000, Philippines", price: 1460, stars: 3.9, amenities: ["WiFi", "Restaurant"] },
  { id: 45, name: "Blue Lotus Hotel", location: "Quimpo Blvd., Ecoland, Davao City 8000, Philippines", price: 3184, stars: 4.5, amenities: ["Pool", "Spa", "Restaurant"] },
  { id: 46, name: "The Pinnacle Hotel and Suites", location: "Sta. Ana Ave., Poblacion, Davao City 8000, Philippines", price: 3107, stars: 4.1, amenities: ["Pool", "Gym", "Restaurant"] },
  { id: 47, name: "Dusit Thani Residence Davao", location: "Stella Hizon Reyes Drive, Lanang, Davao City 8000", price: 9500, stars: 5.0, amenities: ["Infinity Pool", "Beach Access", "Spa", "Gym", "Restaurant", "Bar", "WiFi"] },
  { id: 48, name: "dusitD2 Davao", location: "Stella Hizon Reyes Drive, Lanang, Davao City 8000", price: 7200, stars: 4.8, amenities: ["Pool", "Gym", "Restaurant", "Bar", "WiFi", "Business Center"] },
  { id: 49, name: "Waterfront Insular Hotel Davao", location: "Km 7 Lanang, Davao City 8000", price: 5500, stars: 4.3, amenities: ["Private Beach", "Pool", "Garden", "Restaurant", "WiFi", "Spa"] },
  { id: 50, name: "Park Inn by Radisson Davao", location: "J.P. Laurel Avenue, Lanang, Davao City 8000", price: 4800, stars: 4.4, amenities: ["Rooftop Bar", "Pool", "Gym", "Restaurant", "WiFi"] },
  { id: 51, name: "The Apo View Hotel", location: "150 J. Camus Street, Davao City 8000", price: 4200, stars: 4.1, amenities: ["Pool", "Casino", "Restaurant", "WiFi", "KTV"] },
  { id: 52, name: "The Bourke Hotel", location: "115 Pelayo Street, Poblacion District, Davao City 8000", price: 4500, stars: 4.7, amenities: ["Restaurant", "Bar", "Rooftop", "WiFi", "Bakery"] },
  { id: 53, name: "Crown Regency Hotel & Towers", location: "J.P. Laurel Ave., Bajada, Davao City 8000", price: 3900, stars: 4.0, amenities: ["Pool", "Gym", "Restaurant", "Sky Lounge", "Adventure Ride", "WiFi"] },
  { id: 54, name: "Grand Regal Hotel Davao", location: "Km 7 J.P. Laurel Ave., Lanang, Davao City 8000", price: 4600, stars: 4.3, amenities: ["Pool", "Casino", "Gym", "Restaurant", "WiFi", "KTV"] },
  { id: 55, name: "The Ritz Hotel at Garden Oases", location: "Porras St., Bo. Obrero, Davao City 8000", price: 3800, stars: 4.2, amenities: ["Pool", "Garden", "Restaurant", "Spa", "WiFi"] },
  { id: 56, name: "Pearl Farm Beach Resort", location: "Kaputian, Island Garden City of Samal", price: 14500, stars: 4.8, amenities: ["Private Beach", "Infinity Pool", "Spa", "Water Sports", "Restaurant", "WiFi", "Dive Center"] },
  { id: 57, name: "Go Hotels Davao City Center", location: "Near SM City Davao, Quimpo Blvd.", price: 1200, stars: 4.0, amenities: ["WiFi", "Air Conditioning", "Parking", "24-Hour Front Desk"] }
];


// NOTE: Reviews are persisted on the server in MySQL via the /api/reviews endpoint.
// The large in-file SAMPLE_REVIEWS was removed so the UI always fetches the
// canonical reviews for a hotel. During development, the app will gracefully
// show "No reviews yet" when no server records exist.

const HOTEL_IMAGES = [
  "/hotel1.jpg", "/hotel2.jpg", "/hotel3.jpg", "/hotel4.jpg", "/hotel5.jpg",
  "/hotel6.avif", "/hotel7.webp", "/hotel8.jpg", "/hotel9.avif", "/hotel10.webp",
  "/hotel11.jpg", "/hotel12.avif", "/hotel13.webp", "/hotel14.jpg", "/hotel15.jpg",
  "/hotel16.webp", "/hotel17.jpg", "/hotel18.jpg", "/hotel19.jpg", "/hotel20.avif",
  "/hotel21.jpg", "/hotel22.jpg", "/hotel23.jpg", "/hotel24.jpg", "/hotel25.jpg",
  "/hotel26.jpg", "/hotel27.avif", "/hotel28.webp", "/hotel29.jpg", "/hotel30.jpg",
  "/hotel31.jpg", "/hotel32.jpg", "/hotel33.jpg", "/hotel34.jpg", "/hotel35.jpg",
  "/hotel36.jpg", "/hotel37.jpg", "/hotel38.jpg", "/hotel39.avif", "/hotel40.jpg",
  "/hotel41.jpg", "/hotel42.jpg", "/hotel43.jpg", "/hotel44.avif", "/hotel45.webp", "/hotel46.jpg",
  "/hotel47.jpg", "/hotel48.jpg", "/hotel49.jpg", "/hotel50.jpg", "/hotel51.jpg",
  "/hotel52.jpg", "/hotel53.jpg", "/hotel54.jpg", "/hotel55.jpg", "/hotel56.jpg",
  "/hotel57.jpg", "/hotel58.jpg", "/hotel59.jpg", "/hotel60.jpg", "/hotel61.jpg",
  "/hotel62.jpg", "/hotel63.jpg"
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // store full favorite rows from server (user_id, hotel_id, created_at)
  const [favoriteRows, setFavoriteRows] = useState([]);
  // hotels list - fetched from DB via existing /api/post?type=hotels; fallback to SAMPLE_HOTELS
  const [hotels, setHotels] = useState(SAMPLE_HOTELS);
  // favorites user hotel ids
  const [search, setSearch] = useState("");
  const [modalHotel, setModalHotel] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedHotelReviews, setSelectedHotelReviews] = useState([]);
  const [selectedReviewHotelId, setSelectedReviewHotelId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptMsg, setAuthPromptMsg] = useState('You need to sign in or create an account to submit a review.');
  // default lives in public/default-avatar.avif — use a per-user key so
  // multiple accounts can have independent profile pictures.
  const [profilePic, setProfilePic] = useState("/default-avatar.avif");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 7000]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  // small inline review feedback message shown in the Reviews modal
  const [reviewMessage, setReviewMessage] = useState({ text: '', type: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  // inline UI feedback for actions (e.g., a small 'Removed' bubble next to a button)
  const [actionFlash, setActionFlash] = useState({});
  const [cancellingIds, setCancellingIds] = useState([]);
<<<<<<< HEAD
  const [deletingReviewIds, setDeletingReviewIds] = useState([]);
=======
>>>>>>> 9ddd97b889cf0275183d11ebb1abdc7b15796a33
  const fileInputRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' }); // '' | 'success' | 'error'

  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = localStorage.getItem("hotel_auth") === "true";
    const storedUser = localStorage.getItem("hotel_user");

    if (!auth || !storedUser) {
      router.replace("/login");
      return;
    }

    const userObj = JSON.parse(storedUser);
    setUser(userObj);

<<<<<<< HEAD
    // support per-user stored pictures (no global/shared key)
    const perUserKey = `user_profile_pic_${userObj.email}`;
    const savedPic = localStorage.getItem(perUserKey);
=======
    // support per-user stored pictures and fall back to the old global key
    const perUserKey = `user_profile_pic_${userObj.email}`;
    const savedPic = localStorage.getItem(perUserKey) || localStorage.getItem("user_profile_pic");
>>>>>>> 9ddd97b889cf0275183d11ebb1abdc7b15796a33

    if (savedPic) {
      setProfilePic(savedPic);
    } else {
      // ensure new accounts have a default profile saved for this user
      try { localStorage.setItem(perUserKey, '/default-avatar.avif'); } catch (e) {}
      setProfilePic('/default-avatar.avif');
    }

    const allBookings = JSON.parse(localStorage.getItem("hotel_bookings") || "[]");
    const userBookings = allBookings.filter(b => b.userEmail === userObj.email);
    setBookings(userBookings);

    // If user exists on server, prefer server-side bookings and merge local-only bookings
    (async () => {
      if (userObj && userObj.id) {
        try {
          const res = await fetch(`/api/bookings?userId=${userObj.id}`);
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.bookings)) {
              // map server bookings to the frontend shape, and mark serverId
              const serverBookings = json.bookings.map(b => ({
                id: b.id, // use server id
                serverId: b.id,
                userEmail: userObj.email,
                hotel: b.hotel,
                price: Number(b.price) || 0,
                totalPrice: Number(b.total_price) || 0,
                nights: Number(b.total_nights) || (b.check_in && b.check_out ? Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000*60*60*24)) : 1),
                stars: Number(b.stars) || 3.5,
                location: b.location || 'Davao City',
                checkIn: b.check_in,
                checkOut: b.check_out,
                date: b.booked_at ? new Date(b.booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('en-US'),
                image: b.image || HOTEL_IMAGES[(Number(b.hotel_id) - 1) % HOTEL_IMAGES.length] || '/hotel-default.jpg',
                status: b.status || 'confirmed'
              }));

              // keep any local-only bookings that don't have serverId
              const localOnly = userBookings.filter(b => !b.serverId);
              const merged = [...serverBookings, ...localOnly];
              setBookings(merged);
              // update localStorage to reflect server bookings (plus any local-only)
              try { localStorage.setItem('hotel_bookings', JSON.stringify(merged)); } catch(e) {}
            }
          }
        } catch (err) {
          console.warn('failed to fetch server bookings', err);
        }
      }
    })();

    // load favorites: prefer server-side if user has an id, otherwise localStorage
    (async () => {
      if (userObj && userObj.id) {
        try {
          const res = await fetch(`/api/favorites?userId=${userObj.id}`);
          if (res.ok) {
            const json = await res.json();
            // API may return array of hotel IDs or full rows
            if (Array.isArray(json.favorites) && json.favorites.length && typeof json.favorites[0] === 'object') {
              setFavoriteRows(json.favorites);
              setFavorites(json.favorites.map(r => Number(r.hotel_id)));
            } else {
              setFavoriteRows([]);
              setFavorites(Array.isArray(json.favorites) ? json.favorites : []);
            }
            return;
          }
        } catch (e) {
          console.warn('Failed to load favorites from server, falling back to localStorage', e);
        }
      }

      try {
        const favKey = `user_favorites_${userObj.email}`;
        const userFavorites = JSON.parse(localStorage.getItem(favKey) || "[]");
        setFavorites(userFavorites);
      } catch (e) {
        setFavorites([]);
      }
    })();

    // Set default dates (tomorrow and day after)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setCheckInDate(tomorrow.toISOString().split('T')[0]);
    setCheckOutDate(dayAfter.toISOString().split('T')[0]);

    // Fetch hotels from existing API if available (/api/post?type=hotels). Fall back to SAMPLE_HOTELS.
    (async () => {
      try {
        const res = await fetch('/api/post?type=hotels');
        if (res.ok) {
          const payload = await res.json();
          if (payload && Array.isArray(payload.hotels)) {
            const mapped = payload.hotels.map(h => ({
              id: Number(h.id),
              name: h.name,
              location: h.location || 'Davao City',
              price: Number(h.price) || 0,
              stars: Number(h.stars) || 3.5,
              image: h.image || HOTEL_IMAGES[(Number(h.id) - 1) % HOTEL_IMAGES.length] || '/hotel-default.jpg',
              amenities: [],
              created_at: h.created_at,
            }));
            setHotels(mapped);
          }
        }
      } catch (err) {
        // keep SAMPLE_HOTELS
      }
    })();
  }, [router]);

  // Filter and sort hotels
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(search.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    
    let matchesFilter = true;
    if (activeFilter === "budget") matchesFilter = hotel.price <= 1500;
    if (activeFilter === "midrange") matchesFilter = hotel.price > 1500 && hotel.price <= 3000;
    if (activeFilter === "luxury") matchesFilter = hotel.price > 3000;
    if (activeFilter === "favorites") matchesFilter = favorites.includes(hotel.id);
    
    return matchesSearch && matchesPrice && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.stars - a.stars;
    return a.name.localeCompare(b.name);
  });

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const toggleFavorite = (hotelId) => {
    const wasFavorited = favorites.includes(hotelId);
    const hotel = hotels.find(h => h.id === hotelId);
    let updatedFavorites;
    if (wasFavorited) {
      updatedFavorites = favorites.filter(id => id !== hotelId);
      // toast removed by request (keep inline actionFlash)
      // inline small bubble
      setActionFlash(prev => ({ ...prev, [`fav-${hotelId}`]: 'Removed' }));
      setTimeout(() => setActionFlash(prev => { const p = { ...prev }; delete p[`fav-${hotelId}`]; return p; }), 1400);
    } else {
      updatedFavorites = [...favorites, hotelId];
      // toast removed by request (keep inline actionFlash)
      setActionFlash(prev => ({ ...prev, [`fav-${hotelId}`]: 'Added' }));
      setTimeout(() => setActionFlash(prev => { const p = { ...prev }; delete p[`fav-${hotelId}`]; return p; }), 1400);
    }
    setFavorites(updatedFavorites);
    // If user has a server id, persist to DB, otherwise persist to localStorage per-user
    (async () => {
      try {
        if (user && user.id) {
          if (wasFavorited) {
            // it was favorited previously, now removing
            const res = await fetch(`/api/favorites?userId=${user.id}&hotelId=${hotelId}`, { method: 'DELETE' });
            if (res.ok) {
              const json = await res.json().catch(() => ({}));
              // remove deleted row from favoriteRows (if returned)
              if (json && json.deleted) {
                setFavoriteRows(prev => prev.filter(r => !(Number(r.user_id) === Number(json.deleted.user_id) && Number(r.hotel_id) === Number(json.deleted.hotel_id))));
              } else {
                // fallback: remove by hotelId
                setFavoriteRows(prev => prev.filter(r => Number(r.hotel_id) !== Number(hotelId)));
              }
              setFavorites(prev => prev.filter(id => id !== hotelId));
            }
          } else {
            const res = await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, hotelId, hotelName: hotel?.name }) });
            if (res.ok) {
              const json = await res.json().catch(() => ({}));
              if (json && json.favorite) {
                setFavoriteRows(prev => [json.favorite, ...prev]);
                setFavorites(prev => Array.from(new Set([...(prev || []), Number(json.favorite.hotel_id)])));
              } else {
                setFavorites(prev => Array.from(new Set([...(prev || []), hotelId])));
              }
            }
          }
        } else {
          const favKey = `user_favorites_${user?.email || 'anonymous'}`;
          localStorage.setItem(favKey, JSON.stringify(updatedFavorites));
        }
      } catch (e) {
        console.error('Failed to persist favorites to server, falling back to localStorage', e);
        try { const favKey = `user_favorites_${user?.email || 'anonymous'}`; localStorage.setItem(favKey, JSON.stringify(updatedFavorites)); } catch(_){}
      }
    })();
  };

  // When unfavoriting from the Favorites section we want to briefly show the
  // inline bubble next to the button before the card disappears. This wrapper
  // shows the actionFlash, waits a short moment for the animation, then calls
  // toggleFavorite to actually remove the item.
  const handleUnfavoriteInFavorites = (hotelId) => {
    // show inline tiny bubble
    setActionFlash(prev => ({ ...prev, [`fav-${hotelId}`]: 'Removed' }));
    setTimeout(() => setActionFlash(prev => { const p = { ...prev }; delete p[`fav-${hotelId}`]; return p; }), 1200);

    // call toggle after a very small delay so users see the bubble
    setTimeout(() => toggleFavorite(hotelId), 420);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfilePic(base64);
        // persist per-user so multiple accounts are independent
<<<<<<< HEAD
        try {
          const key = user?.email ? `user_profile_pic_${user.email}` : (user?.id ? `user_profile_pic_id_${user.id}` : `user_profile_pic_unknown`);
          localStorage.setItem(key, base64);
        } catch (e) {}
=======
        try { localStorage.setItem(`user_profile_pic_${user?.email || 'anonymous'}`, base64); } catch (e) {}
>>>>>>> 9ddd97b889cf0275183d11ebb1abdc7b15796a33
        // toast removed by request
      };
      reader.onerror = () => {
        showToast("Error reading image file", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (e) => {
  e.preventDefault();

  setPasswordMessage({ text: '', type: '' }); // clear previous message

  if (newPassword !== confirmNewPassword) {
    setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
    return;
  }

  if (newPassword.length < 6) {
    setPasswordMessage({ text: 'New password must be at least 6 characters', type: 'error' });
    return;
  }

  setIsChangingPassword(true);

  try {
    // Real account in MySQL
    if (user?.id) {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
        setTimeout(() => {
          setShowChangePassword(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setPasswordMessage({ text: '', type: '' });
        }, 2000);
      } else {
        setPasswordMessage({ text: data.error || 'Incorrect current password', type: 'error' });
      }
    }
    // Offline / local account
    else {
      const localUsers = JSON.parse(localStorage.getItem('hotel_users') || '[]');
      const current = localUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());

      if (!current || current.password !== oldPassword) {
        setPasswordMessage({ text: 'Incorrect current password', type: 'error' });
      } else {
        current.password = newPassword;
        localStorage.setItem('hotel_users', JSON.stringify(localUsers));
        localStorage.setItem('hotel_user', JSON.stringify({ ...user, password: newPassword }));
        setUser({ ...user, password: newPassword });

        setPasswordMessage({ text: 'Password updated!', type: 'success' });
        setTimeout(() => {
          setShowChangePassword(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setPasswordMessage({ text: '', type: '' });
        }, 2000);
      }
    }
  } catch (err) {
    setPasswordMessage({ text: 'Connection failed. Try again.', type: 'error' });
  } finally {
    setIsChangingPassword(false);
  }
};

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const calculateTotalNights = (checkIn = checkInDate, checkOut = checkOutDate) => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const bookHotel = (hotel) => {
    if (!checkInDate || !checkOutDate) {
      showToast("Please select check-in and check-out dates", "error");
      return;
    }

    const nights = calculateTotalNights();
    const totalPrice = hotel.price * nights;

    const newBooking = {
      id: Date.now(),
      userEmail: user.email,
      hotel: hotel.name,
      hotel_id: hotel.id,
      price: hotel.price,
      totalPrice: totalPrice,
      nights: nights,
      stars: hotel.stars,
      location: hotel.location,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      date: new Date().toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit'
      }),
      image: HOTEL_IMAGES[hotel.id - 1] || "/hotel1.jpg",
      status: "confirmed"
    };

    const allBookings = JSON.parse(localStorage.getItem("hotel_bookings") || "[]");
    allBookings.unshift(newBooking);
    localStorage.setItem("hotel_bookings", JSON.stringify(allBookings));
    setBookings(prev => [newBooking, ...prev]);

    // Persist booking to server (best-effort). Send userId if available, otherwise send userEmail/userName and let the server find-or-create
    (async () => {
      try {
        const payload = {
          userId: user?.id ? Number(user.id) : undefined,
          userEmail: user?.id ? undefined : (user?.email || undefined),
          userName: user?.id ? undefined : (user?.name || undefined),
          hotelId: Number(hotel.id),
          hotelName: hotel.name,
          price: hotel.price,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          total_price: totalPrice,
          status: 'confirmed'
        };

        // prefer the dedicated bookings API which will ensure user_id + hotel_id are persisted
        const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res) {
          console.error('No response from bookings endpoint');
          showToast('Booking failed: no response from server', 'error');
        }

        if (res && !res.ok) {
          // The server returned an error. It's possible the booking was
          // actually recorded despite an error during post-processing. Try
          // to confirm by fetching the current bookings for this user and
          // matching by hotel + dates. If found, treat as success.
          const errBody = await res.json().catch(() => ({}));
          console.error('Booking POST failed, attempting verification', res.status, errBody);

          try {
            if (user && user.id) {
              const verifyRes = await fetch(`/api/bookings?userId=${user.id}`);
              if (verifyRes && verifyRes.ok) {
                const payload = await verifyRes.json().catch(() => ({}));
                const rows = Array.isArray(payload.bookings) ? payload.bookings : [];
                const match = rows.find(b => {
                  // compare hotel id (or hotel name fallback) and exact dates
                  const hid = Number(b.hotel_id || b.hotel || 0);
                  const bn = Number(hotel.id);
                  const sameHotel = (Number(b.hotel_id) === Number(hotel.id)) || (String(b.hotel || '').trim() === String(hotel.name).trim());
                  const sameDates = (String(b.check_in) === String(checkInDate)) && (String(b.check_out) === String(checkOutDate));
                  return sameHotel && sameDates;
                });

                if (match) {
                  const b = match;
                  const serverBooking = {
                    id: b.id,
                    serverId: b.id,
                    userEmail: user?.email,
                    hotel: b.hotel || hotel.name,
                    hotel_id: b.hotel_id || hotel.id,
                    price: Number(b.price) || hotel.price,
                    totalPrice: Number(b.total_price) || totalPrice,
                    nights: Number(b.total_nights) || nights,
                    stars: Number(b.stars) || hotel.stars,
                    location: b.location || hotel.location,
                    checkIn: b.check_in,
                    checkOut: b.check_out,
                    date: b.booked_at ? new Date(b.booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('en-US'),
                    image: b.image || HOTEL_IMAGES[(Number(b.hotel_id || hotel.id) - 1) % HOTEL_IMAGES.length] || '/hotel1.jpg',
                    status: b.status || 'confirmed'
                  };

                  // replace placeholder and persist
                  const existing = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
                  const idx = existing.findIndex(bb => bb.id === newBooking.id);
                  if (idx !== -1) { existing[idx] = serverBooking; try { localStorage.setItem('hotel_bookings', JSON.stringify(existing)); } catch(e) {} }
                  setBookings(prev => prev.map(bb => bb.id === newBooking.id ? serverBooking : bb));
                  showToast('Booking saved (verified)', 'success');
                  return;
                }
              }
            }
          } catch (verifyErr) {
            console.warn('Error while verifying booking existence', verifyErr);
          }

          // If verification failed, show error to user unless it's the
          // known DB-insert message which we intentionally suppress to
          // avoid alarming the user when the booking may actually exist.
          console.error('Booking failed', res.status, errBody);
          const errMsg = errBody?.error || 'server error';
          if (!(typeof errMsg === 'string' && errMsg.toLowerCase().includes('failed to insert booking into database'))) {
            showToast(`Booking failed: ${errMsg}`, 'error');
          } else {
            // suppress the specific DB-insert error toast; fallback to a
            // non-blocking console message (already logged above)
            console.info('Suppressed DB-insert error toast (booking may have been recorded)');
          }
        }

        if (res && res.ok) {
              const json = await res.json().catch(() => ({}));
              if (json && json.booking) {
                const b = json.booking;
                const serverBooking = {
                  id: b.id,
                  serverId: b.id,
                  userEmail: user?.email,
                  hotel: b.hotel || hotel.name,
                  hotel_id: b.hotel_id || hotel.id,
                  price: Number(b.price) || hotel.price,
                  totalPrice: Number(b.total_price) || totalPrice,
                  nights: Number(b.total_nights) || nights,
                  stars: Number(b.stars) || hotel.stars,
                  location: b.location || hotel.location,
                  checkIn: b.check_in,
                  checkOut: b.check_out,
                  date: b.booked_at ? new Date(b.booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('en-US'),
                  image: b.image || HOTEL_IMAGES[(Number(b.hotel_id || hotel.id) - 1) % HOTEL_IMAGES.length] || '/hotel1.jpg',
                  status: b.status || 'confirmed'
                };

                // replace the local placeholder with server copy
                const existing = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
                const idx = existing.findIndex(bb => bb.id === newBooking.id);
                if (idx !== -1) { existing[idx] = serverBooking; try { localStorage.setItem('hotel_bookings', JSON.stringify(existing)); } catch(e) {} }
                setBookings(prev => prev.map(bb => bb.id === newBooking.id ? serverBooking : bb));
              }
            }
            } catch (err) {
              console.warn('failed to persist booking to server', err);
            }
    })();

    setModalHotel(null);
    // booking success toast removed by request; inline flash still shown
  };

  const cancelBooking = (id) => {
    // Mark as cancelling so UI can show an inline state on the button
    setCancellingIds(prev => Array.from(new Set([...prev, id])));

    const allBookings = JSON.parse(localStorage.getItem("hotel_bookings") || "[]");
    const bookingToCancel = allBookings.find(b => b.id === id) || {};

    // Immediately persist removal in localStorage (so it's consistent) but keep
    // the booking visible briefly while we show inline feedback.
    const updatedBookings = allBookings.filter(b => b.id !== id);
    try { localStorage.setItem("hotel_bookings", JSON.stringify(updatedBookings)); } catch(e) {}

    // Attempt server delete in background
    (async () => {
      try {
        // Delete by bookingId if it has a serverId, otherwise try by userId + hotelId
        if (bookingToCancel.serverId) {
          const res = await fetch(`/api/bookings?bookingId=${bookingToCancel.serverId}`, { method: 'DELETE' });
          if (!res.ok) {
            console.warn('failed to delete booking on server', res.status, await res.json().catch(() => ({})));
          } else {
            console.info('booking deleted from server', bookingToCancel.serverId);
          }
        } else if (user && user.id && (bookingToCancel.hotel_id || bookingToCancel.hotel)) {
          // Fallback: delete by userId + hotelId OR by userId + hotel name if no serverId
          const body = { userId: user.id };
          if (bookingToCancel.hotel_id) body.hotelId = bookingToCancel.hotel_id;
          else body.hotelName = bookingToCancel.hotel;

          const res = await fetch('/api/bookings', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (!res.ok) {
            console.warn('failed to delete booking on server (by userId+hotelId/name)', res.status, await res.json().catch(() => ({})));
          } else {
            console.info('booking deleted from server (by userId+hotelId/name)');
          }
        }
      } catch (err) {
        console.warn('failed to delete booking on server', err);
      }
    })();

    // Show an inline 'Cancelled' flash next to the button and then remove from UI
    setActionFlash(prev => ({ ...prev, [`cancel-${id}`]: 'Booking cancelled' }));
    setTimeout(() => setActionFlash(prev => { const p = { ...prev }; delete p[`cancel-${id}`]; return p; }), 1200);

    // Remove booking from UI after a short delay so user sees the inline animation
    setTimeout(() => {
      setBookings(prev => prev.filter(b => b.id !== id));
      setCancellingIds(prev => prev.filter(x => x !== id));
      // booking cancelled toast removed by request
    }, 900);
  };

  const viewReviews = async (hotelId) => {
    setSelectedReviewHotelId(hotelId);
    setSelectedHotelReviews([]);
    setShowReviews(true);

    try {
      // only mark as loading reviews — don't touch submittingReview here (that
      // flag indicates a user submitting a new review, not loading the list)
      setLoadingReviews(true);
      const res = await fetch(`/api/reviews?hotelId=${hotelId}`);
      if (!res) throw new Error('No response from server');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showToast(body?.error || 'Failed to load reviews', 'error');
        return;
      }

      const json = await res.json().catch(() => ({}));
      const rows = Array.isArray(json.reviews) ? json.reviews : [];
      // map server rows to UI-friendly shape
      const mapped = rows.map(r => ({
        id: r.id,
        userId: r.user_id || null,
        userEmail: r.user_email || null,
        user: r.user_name || r.user || r.user_email || 'Guest',
        rating: Number(r.rating) || 0,
        comment: r.comment || '',
        date: r.review_date || r.created_at || ''
      }));

      setSelectedHotelReviews(mapped);
    } catch (err) {
      console.warn('Failed to fetch reviews', err);
      showToast('Unable to load reviews (server error)', 'error');
    } finally {
      setLoadingReviews(false);
    }
  };

  const submitReview = async () => {
    // require a signed-in user here — if not signed in, show a helpful popup
    if (!user) {
      setAuthPromptMsg('You must be signed in to write a review.');
      setShowAuthPrompt(true);
      return;
    }
    if (!newReview.comment.trim()) {
      // show a small inline message inside the Reviews modal instead of a global toast
      setReviewMessage({ text: '✕ Please write a review comment', type: 'error' });
      // clear after a short duration
      setTimeout(() => setReviewMessage({ text: '', type: '' }), 3000);
      return;
    }
    if (!selectedReviewHotelId) {
      showToast("No hotel selected for review", "error");
      return;
    }

    const payload = {
      hotelId: Number(selectedReviewHotelId),
      rating: Number(newReview.rating),
      comment: newReview.comment.trim()
    };
    // pass along user identifying info — server will verify and create as needed
    if (user) {
      if (user.id) payload.userId = Number(user.id);
      if (user.email) payload.userEmail = user.email;
      if (user.name) payload.userName = user.name;
    }

    // mark that we are submitting a review so the UI shows the loading state
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res) throw new Error('No response from server');

      if (res.status === 409) {
        // When the server signals a conflict/duplicate, show a non-blocking
        // inline message inside the Reviews modal rather than a global error
        // toast. This keeps the UI friendly and allows the user to review
        // other hotels without being blocked by the message.
        const body = await res.json().catch(() => ({}));
        const text = body?.error || 'Duplicate review detected';
        setReviewMessage({ text, type: 'info' });
        // Clear after a short duration
        setTimeout(() => setReviewMessage({ text: '', type: '' }), 4000);
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error || body?.detail || 'Failed to submit review';
        // If server complains that a user id/email is required, show auth prompt
        const lowered = String(msg || '').toLowerCase();
        if (lowered.includes('userid') || lowered.includes('user id') || lowered.includes('useremail') || lowered.includes('user email') || lowered.includes('user') && lowered.includes('required')) {
          setAuthPromptMsg(body?.detail || body?.error || 'You need an account to post reviews');
          setShowAuthPrompt(true);
          return;
        }
        // If DB table missing give a helpful hint
        if ((body?.detail || '').toLowerCase().includes('reviews table') || (body?.detail || '').toLowerCase().includes('no such table')) {
          showToast('Server database looks incomplete. Import the SQL schema (sql/adv_project_schema.sql) and restart the app.', 'error');
        } else {
          showToast(msg, 'error');
        }
        return;
      }

      const body = await res.json().catch(() => ({}));
      // server returns a review object under `review` when created
      const r = body?.review;
      if (r) {
        const mapped = {
          id: r.id,
          user: r.user_name || user?.name || r.user_email || 'Guest',
          rating: Number(r.rating) || Number(newReview.rating),
          comment: r.comment || newReview.comment,
          date: r.review_date || r.created_at || new Date().toISOString().split('T')[0]
        };

        // show the just-submitted review at the top and then refresh canonical list
        setSelectedHotelReviews(prev => [mapped, ...(prev || [])]);
        setNewReview({ rating: 5, comment: '' });
        // show inline success message in the modal instead of a toast
        setReviewMessage({ text: '✓ Review submitted', type: 'success' });
        setTimeout(() => setReviewMessage({ text: '', type: '' }), 3000);

        // re-fetch canonical list in background to ensure consistency
        try { await viewReviews(selectedReviewHotelId); } catch(_) {}
      } else {
        setNewReview({ rating: 5, comment: '' });
        setReviewMessage({ text: '✓ Review saved', type: 'success' });
        setTimeout(() => setReviewMessage({ text: '', type: '' }), 3000);
        try { await viewReviews(selectedReviewHotelId); } catch(_) {}
      }
    } catch (err) {
      console.error('Failed to submit review', err);
      showToast('Unable to send review (network error)', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

    const deleteReview = async (review) => {
      if (!review) return;
      if (!user) {
        setAuthPromptMsg('You must be signed in to delete a review.');
        setShowAuthPrompt(true);
        return;
      }

      const rid = review.id;
      setDeletingReviewIds(prev => [...prev, rid]);

      try {
        const payload = { reviewId: rid };
        // Prefer reviewId; fall back to user+hotel when reviewId missing
        if (!rid && user && selectedReviewHotelId) {
          payload.userId = user.id;
          payload.hotelId = Number(selectedReviewHotelId);
        }

        const res = await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res) throw new Error('No response from server');

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg = body?.error || body?.detail || 'Failed to delete review';
          showToast(msg, 'error');
          return;
        }

        const body = await res.json().catch(() => ({}));
        // Remove from UI
        setSelectedHotelReviews(prev => (prev || []).filter(r => r.id !== rid));

        // Show a small success flash and a concise toast
        setActionFlash(prev => ({ ...prev, [`rev-${rid}`]: 'Deleted' }));
        setTimeout(() => setActionFlash(prev => { const p = { ...prev }; delete p[`rev-${rid}`]; return p; }), 1400);
      } catch (err) {
        console.error('Failed to delete review', err);
        showToast('Unable to delete review (network error)', 'error');
      } finally {
        setDeletingReviewIds(prev => prev.filter(x => x !== rid));
      }
    };

  const closeReviews = () => {
    setShowReviews(false);
    setSelectedReviewHotelId(null);
    setSelectedHotelReviews([]);
    setNewReview({ rating: 5, comment: "" });
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    try {
      const payload = { userId: user.id };
      const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res) throw new Error('No response from server');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showToast(body?.error || 'Failed to delete account', 'error');
        return;
      }

      // Clear local state and storage then redirect to register
      // Clear all local state and storage tied to this email to prevent data restoration on re-registration
      try {
        const emailKey = (user?.email || '').toLowerCase();
        
        // Remove per-user profile picture
        const perUserKey = emailKey ? `user_profile_pic_${emailKey}` : null;
        if (perUserKey) localStorage.removeItem(perUserKey);

        // Remove per-user favorites key
        if (emailKey) localStorage.removeItem(`user_favorites_${emailKey}`);

        // Remove any bookings in localStorage that belong to this email
        try {
          const allBookings = JSON.parse(localStorage.getItem('hotel_bookings') || '[]');
          const filtered = (allBookings || []).filter(b => String((b.userEmail || '').toLowerCase()) !== emailKey);
          localStorage.setItem('hotel_bookings', JSON.stringify(filtered));
        } catch (e) {}

        // Remove this user from the local users list
        try {
          const users = JSON.parse(localStorage.getItem('hotel_users') || '[]').filter(u => (u.email || '').toLowerCase() !== emailKey);
          localStorage.setItem('hotel_users', JSON.stringify(users));
        } catch (e) {}

        // Clear session/auth tokens
        localStorage.removeItem('hotel_auth');
        localStorage.removeItem('hotel_user');
      } catch (e) {}

      setShowDeleteAccountConfirm(false);
      setShowProfileModal(false);
      setUser(null);
      // redirect to register page
      router.push('/');
    } catch (err) {
      console.error('Failed to delete account', err);
      showToast('Unable to delete account (network error)', 'error');
    }
  };

  const logout = () => {
    // Clear auth and show logout modal before redirect
    localStorage.removeItem("hotel_auth");
    setShowLogoutModal(true);
    // auto-redirect after short delay
    setTimeout(() => {
      setShowLogoutModal(false);
      router.push("/login");
    }, 1000);
  };

  const getStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard — White Flower Hotels</title>
        <meta name="description" content="Manage your hotel bookings and explore new hotels" />
      </Head>

      {/* Toast Notifications */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.toastIcon}>
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.msg}
        </div>
      )}

      <div className={styles.dashboard}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Image src="/hotels.png" width={28} height={28} alt="Hotels" />
              <span>White Flower Stays</span>
            </h2>
<<<<<<< HEAD
            <p className={styles.welcomeText}>Hello, {user.name.split(" ")[0]}!</p>
=======
            <p className={styles.welcomeText}>Hello, {user.name.split(" ")[0]}! 👋</p>
>>>>>>> 9ddd97b889cf0275183d11ebb1abdc7b15796a33
          </div>
          
          <nav className={styles.sidebarNav}>
            <button 
              className={`${styles.navButton} ${styles.active}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <Image src="/bed.png" width={18} height={18} alt="Discover" />
                <span>Discover Hotels</span>
              </span>
            </button>
            <button 
              className={styles.navButton}
              onClick={() => document.getElementById("bookings")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <Image src="/book.png" width={18} height={18} alt="Bookings" />
                <span>My Bookings ({bookings.length})</span>
              </span>
            </button>
            <button 
              className={styles.navButton}
              onClick={() => document.getElementById("favorites")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <Image src="/love.png" width={18} height={18} alt="Favorites" />
                <span>Favorites ({favorites.length})</span>
              </span>
            </button>
            <button 
              className={styles.navButton}
              onClick={() => setShowProfileModal(true)}
            >
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <Image src="/user.png" width={18} height={18} alt="Profile" />
                <span>My Profile</span>
              </span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutButton} onClick={logout}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <Image src="/exit.png" width={18} height={18} alt="Logout" />
                <span>Logout</span>
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1>Find Your Perfect Stay in Davao</h1>
              <p>Discover {hotels.length} amazing hotels with the best prices</p>
            </div>
            
            <div className={styles.searchSection}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon} style={{ display:'inline-flex', alignItems:'center' }}>
                  <Image src="/search.png" width={16} height={16} alt="Search" />
                </span>
                <input
                  type="text"
                  placeholder="Search hotels or locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </header>

          {/* Filters Section - CLEAN WITHOUT DATES */}
          <section className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label>Price Range: ₱{priceRange[0]} - ₱{priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="7000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className={styles.priceSlider}
              />
            </div>
            
            <div className={styles.filterButtons}>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Hotels
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'budget' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('budget')}
              >
                Budget (₱0-1500)
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'midrange' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('midrange')}
              >
                Mid-range (₱1501-3000)
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'luxury' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('luxury')}
              >
                Luxury (₱3000+)
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'favorites' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('favorites')}
              >
                My Favorites
              </button>
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </section>

          {/* Favorites Section */}
          <section id="favorites" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Your Favorites ({favorites.length})</h2>
              {/* subtitle intentionally removed */}
              {/* DB favorite records hidden from production UI */}
            </div>

            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Image src="/love.png" width={56} height={56} alt="No favorites" />
                </div>
                <h3>No favorites yet</h3>
                <p>Click the heart icon on hotels to add them to your favorites!</p>
              </div>
            ) : (
              <div className={styles.hotelGrid}>
                {hotels
                  .filter(hotel => favorites.includes(hotel.id))
                  .map((hotel) => (
                  <div key={hotel.id} className={styles.hotelCard}>
                    <div className={styles.hotelImageContainer}>
                      <Image
                        src={HOTEL_IMAGES[hotel.id - 1] || "/hotel1.jpg"}
                        width={400}
                        height={240}
                        alt={hotel.name}
                        className={styles.hotelImage}
                      />
                      <div className={styles.hotelOverlay}>
                        <span className={styles.hotelRating}>
                          {hotel.stars} ★
                        </span>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button 
                            className={`${styles.favoriteButton} ${styles.favorited}`}
                            onClick={() => handleUnfavoriteInFavorites(hotel.id)}
                          >
                            ❤️
                          </button>
                          {actionFlash[`fav-${hotel.id}`] && (
                            <div className={styles.actionFlash} style={{ position: 'absolute', top: -28, right: -6 }}>
                              {actionFlash[`fav-${hotel.id}`]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.hotelInfo}>
                      <h3>{hotel.name}</h3>
                      <p className={styles.hotelLocation}>
                        <Image src="/location.png" width={14} height={14} alt="Location" style={{ marginRight: 6 }} /> {hotel.location}
                      </p>
                      
                      <div className={styles.hotelAmenities}>
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className={styles.amenityTag}>
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className={styles.amenityMore}>
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className={styles.reviewSection}>
                        <button 
                          className={styles.reviewButton}
                          onClick={() => viewReviews(hotel.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <Image src="/letter.png" width={18} height={18} alt="View reviews" />
                          <span>View Reviews</span>
                        </button>
                      </div>
                      
                      <div className={styles.hotelFooter}>
                        <div className={styles.priceSection}>
                          <div className={styles.price}>₱{hotel.price}</div>
                          <span className={styles.priceLabel}>per night</span>
                        </div>
                        <button 
                          className={styles.bookButton}
                          onClick={() => setModalHotel(hotel)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bookings Section */}
          <section id="bookings" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Your Bookings ({bookings.length})</h2>
              {/* subtitle intentionally removed */}
            </div>
            
            {bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Image src="/book.png" width={56} height={56} alt="No bookings" />
                </div>
                <h3>No bookings yet</h3>
                <p>Start exploring our hotels and book your first stay!</p>
              </div>
            ) : (
              <div className={styles.hotelGrid}>
                {bookings.map((booking) => (
                  <div key={booking.id} className={styles.hotelCard}>
                    <div className={styles.hotelImageContainer}>
                      <Image
                        src={booking.image}
                        width={400}
                        height={240}
                        alt={booking.hotel}
                        className={styles.hotelImage}
                      />
                      <div className={styles.hotelOverlay}>
                        <span className={styles.hotelRating}>{(booking.stars || 0).toFixed(1)} ★</span>
                      </div>
                    </div>

                    <div className={styles.hotelInfo}>
                      <h3>{booking.hotel}</h3>
                      <p className={styles.hotelLocation}><Image src="/location.png" width={14} height={14} alt="Location" style={{ marginRight: 6 }} /> {booking.location}</p>

                      <div className={styles.hotelAmenities}>
                        <span className={styles.amenityTag}>📅 {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                        <span className={styles.amenityTag}>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</span>
                      </div>

                      <div className={styles.hotelFooter}>
                        <div className={styles.priceSection}>
                          <div className={styles.price}>₱{booking.price}</div>
                          <span className={styles.priceLabel}>/night</span>
                        </div>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button 
                            className={styles.cancelButton}
                            onClick={() => cancelBooking(booking.id)}
                            disabled={cancellingIds.includes(booking.id)}
                          >
                            {cancellingIds.includes(booking.id) ? 'Cancelling...' : 'Cancel'}
                          </button>
                          {actionFlash[`cancel-${booking.id}`] && (
                            <div className={styles.actionFlash} style={{ position: 'absolute', top: -28, right: -6 }}>
                              {actionFlash[`cancel-${booking.id}`]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{marginTop:8, fontSize:13,color:'#5b6770'}}>
                        <div>Booked: {booking.date}</div>
                        <div style={{marginTop:6}} className={styles.statusConfirmed}>Confirmed</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Hotels Section - CLEAN CARDS WITHOUT DATES */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Available Hotels in Davao ({filteredHotels.length})</h2>
              {/* hotels count removed */}
            </div>
            
            <div className={styles.hotelGrid}>
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className={styles.hotelCard}>
                  <div className={styles.hotelImageContainer}>
                    <Image
                      src={HOTEL_IMAGES[hotel.id - 1] || "/hotel1.jpg"}
                      width={400}
                      height={240}
                      alt={hotel.name}
                      className={styles.hotelImage}
                    />
                    <div className={styles.hotelOverlay}>
                      <span className={styles.hotelRating}>
                        {hotel.stars} ★
                      </span>
                      <button 
                        className={`${styles.favoriteButton} ${favorites.includes(hotel.id) ? styles.favorited : ''}`}
                        onClick={() => toggleFavorite(hotel.id)}
                      >
                        {favorites.includes(hotel.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.hotelInfo}>
                    <h3>{hotel.name}</h3>
                    <p className={styles.hotelLocation}>
                      <Image src="/location.png" width={14} height={14} alt="Location" style={{ marginRight: 6 }} /> {hotel.location}
                    </p>
                    
                    <div className={styles.hotelAmenities}>
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className={styles.amenityTag}>
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className={styles.amenityMore}>
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}

                      <div className={styles.reviewSection}>
                        <button 
                          className={styles.reviewButton}
                          onClick={() => viewReviews(hotel.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <Image src="/letter.png" width={18} height={18} alt="View reviews" />
                          <span>View Reviews</span>
                        </button>
                      </div>
                      
                      <div className={styles.hotelFooter}>
                        <div className={styles.priceSection}>
                          <div className={styles.price}>₱{hotel.price}</div>
                          <span className={styles.priceLabel}>per night</span>
                        </div>
                        <button 
                          className={styles.bookButton}
                          onClick={() => setModalHotel(hotel)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Profile Modal */}
{showProfileModal && (
  <div className={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
    <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>My Profile</h2>
        <button 
          className={styles.closeButton}
          onClick={() => setShowProfileModal(false)}
        >
          ✕
        </button>
      </div>

      <div className={styles.profileContent}>
        {/* Profile Picture Section */}
        <div className={styles.profilePictureSection}>
          <div 
            className={styles.profilePictureContainer}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={profilePic}
              width={140}
              height={140}
              alt="Profile"
              className={styles.profilePicture}
            />
            <div className={styles.profilePictureEdit}>
              Edit
            </div>
          </div>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={handleProfilePicChange} 
            className={styles.fileInput}
          />
          <p className={styles.uploadHint}>Click to upload new photo (max 5MB)</p>
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <h1>{user?.name || 'User'}</h1>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>

        {/* Change Password Section */}
        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            className={styles.changePasswordButton}
          >
            Change Password
          </button>
        ) : (
          <div className={styles.passwordForm}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>

              {/* ←←← PUT IT RIGHT HERE ←←←  */}
              {passwordMessage.text && (
                <div 
                  style={{
                    padding: '12px 16px',
                    margin: '12px 0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'center',
                    backgroundColor: passwordMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: passwordMessage.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${passwordMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
              >
              {passwordMessage.text}
              </div>
              )}
              {/* ←←← END OF MESSAGE BOX ←←← */}

              <div className={styles.passwordActions}>
                <button 
                  type="submit" 
                  className={styles.confirmButton}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowChangePassword(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className={styles.cancelButton}
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
<<<<<<< HEAD

        <div style={{ marginTop: 12 }}>
          <button
            className={styles.deleteAccountButton}
            onClick={() => setShowDeleteAccountConfirm(true)}
          >
            Delete Account
          </button>
        </div>
        {showDeleteAccountConfirm && (
          <div className={styles.modalOverlay} onClick={() => setShowDeleteAccountConfirm(false)}>
            <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
              <h3>Delete account</h3>
              <p>Are you sure you want to permanently delete your account? This will remove your bookings, favorites and reviews from the server. This action cannot be undone.</p>
              <div className={styles.confirmActions}>
                <button className={`${styles.confirmSmallButton} ${styles.confirmSmallButtonSecondary}`} onClick={() => setShowDeleteAccountConfirm(false)}>Cancel</button>
                <button className={`${styles.confirmSmallButton} ${styles.confirmSmallButtonPrimary}`} onClick={confirmDeleteAccount}>Delete</button>
              </div>
            </div>
          </div>
        )}
=======
>>>>>>> 9ddd97b889cf0275183d11ebb1abdc7b15796a33
      </div>
    </div>
  </div>
)}

      {/* Reviews Modal */}
      {showReviews && (
        <div className={styles.modalOverlay} onClick={() => setShowReviews(false)}>
          <div className={styles.reviewsModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Hotel Reviews</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowReviews(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.reviewsContent}>
              <div className={styles.reviewsList} style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 8 }}>
                <h3 style={{ color: '#000' }}>Customer Reviews</h3>
                {loadingReviews ? (
                  <p className={styles.noReviews}>Loading reviews…</p>
                ) : selectedHotelReviews.length === 0 ? (
                  <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                ) : (
                  selectedHotelReviews.map(review => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewUser}>{review.user}</span>
                        <span className={styles.reviewRating}>{getStars(review.rating)}</span>
                        {user && (String(user.id) === String(review.userId) || (user.email && String(user.email) === String(review.userEmail))) && (
                          <button
                            className={styles.deleteReviewButton}
                            onClick={() => { if (!deletingReviewIds.includes(review.id)) deleteReview(review); }}
                            disabled={deletingReviewIds.includes(review.id)}
                            style={{ marginLeft: 8, background: 'transparent', color: '#c0392b', border: 'none', cursor: 'pointer' }}
                            title="Delete your review"
                          >
                            {deletingReviewIds.includes(review.id) ? 'Deleting…' : 'Delete'}
                          </button>
                        )}
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                      <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.addReview}>
                <h3 style={{ color: '#000' }}>Write a Review</h3>
                <div className={styles.ratingInput}>
                  <label style={{ color: '#000' }}>Rating:</label>
                  <select
                    style={{ color: '#fff', background: '#0f172a' }}
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  >
                    {[5,4,3,2,1].map(num => (
                      <option key={num} value={num}>{num} ★</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => { setNewReview({...newReview, comment: e.target.value}); if (reviewMessage.text) setReviewMessage({ text: '', type: '' }); }}
                  className={styles.reviewTextarea}
                  rows="4"
                />
                {reviewMessage.text && (
                  <div style={{
                    padding: '8px 12px',
                    marginTop: 10,
                    borderRadius: 8,
                    fontSize: 13,
                    textAlign: 'center',
                    backgroundColor: reviewMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: reviewMessage.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${reviewMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                  }}>
                    {reviewMessage.text}
                  </div>
                )}
                <button
                  className={styles.submitReviewButton}
                  onClick={submitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
            {/* Auth / create account prompt */}
            {showAuthPrompt && (
              <div className={styles.modalOverlay} onClick={() => setShowAuthPrompt(false)}>
                <div className={styles.authPromptModal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Sign in required</h3>
                    <button className={styles.closeButton} onClick={() => setShowAuthPrompt(false)}>✕</button>
                  </div>
                  <p style={{ marginTop: 12, color: '#222' }}>{authPromptMsg}</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
                    <button className={styles.cancelButton} onClick={() => setShowAuthPrompt(false)}>Try again</button>
                    <button className={styles.confirmButton} onClick={() => { setShowAuthPrompt(false); router.push('/register'); }}>Create account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowLogoutModal(false); router.push('/login'); }}>
          <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Logout</h2>
            </div>

            <div style={{ padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 18, color: '#111', marginBottom: 12 }}>Logout successful</p>
              <p style={{ color: '#64748b', marginBottom: 20 }}>You will be redirected to the login page.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Booking Modal - NOW WITH DATE SELECTION */}
      {modalHotel && (
        <div className={styles.modalOverlay} onClick={() => setModalHotel(null)}>
          <div className={styles.bookingModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Confirm Booking</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setModalHotel(null)}
              >
                ✕
              </button>
            </div>

            <Image
              src={HOTEL_IMAGES[modalHotel.id - 1] || "/hotel1.jpg"}
              width={600}
              height={300}
              alt={modalHotel.name}
              className={styles.modalImage}
            />
            
            <div className={styles.modalContent}>
              <h3>{modalHotel.name}</h3>
              <div className={styles.modalDetails}>
                <div className={styles.modalRating}>
                  <span className={styles.stars} style={{ color: '#000' }}>{getStars(modalHotel.stars)}</span>
                  <span style={{ color: '#000' }}>({modalHotel.stars})</span>
                </div>
                <p className={styles.modalLocation}><Image src="/location.png" width={16} height={16} alt="Location" style={{ marginRight: 8 }} /> {modalHotel.location}</p>
              </div>
              
              {/* DATE SELECTION IN MODAL */}
              <div className={styles.bookingDatesSection}>
                <h4 style={{ color: '#000' }}>Select Your Stay Dates</h4>
                <div className={styles.dateInputs}>
                  <div className={styles.dateGroup}>
                    <label style={{ color: '#000' }}>Check-in Date</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        ref={checkInRef}
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={styles.dateInput}
                        style={{ color: '#000', background: '#fff' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (checkInRef.current) {
                            if (typeof checkInRef.current.showPicker === 'function') {
                              checkInRef.current.showPicker();
                            } else {
                              checkInRef.current.focus();
                            }
                          }
                        }}
                        aria-label="Open check-in calendar"
                        style={{ marginLeft: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18 }}
                      >
                        <Image src="/calendar.png" width={18} height={18} alt="Open calendar" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.dateGroup}>
                    <label style={{ color: '#000' }}>Check-out Date</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        ref={checkOutRef}
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        className={styles.dateInput}
                        style={{ color: '#000', background: '#fff' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (checkOutRef.current) {
                            if (typeof checkOutRef.current.showPicker === 'function') {
                              checkOutRef.current.showPicker();
                            } else {
                              checkOutRef.current.focus();
                            }
                          }
                        }}
                        aria-label="Open check-out calendar"
                        style={{ marginLeft: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18 }}
                      >
                        <Image src="/calendar.png" width={18} height={18} alt="Open calendar" />
                      </button>
                    </div>
                  </div>
                  {checkInDate && checkOutDate && (
                    <div className={styles.nightsCounter}>
                      <span style={{ color: '#000' }}>{calculateTotalNights()} nights selected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.amenitiesList}>
                <h4>Amenities:</h4>
                <div className={styles.amenitiesGrid}>
                  {modalHotel.amenities.map((amenity, index) => (
                    <span key={index} className={styles.amenityItem}>
                      ✅ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>₱{modalHotel.price} × {calculateTotalNights()} nights</span>
                    <span>₱{modalHotel.price * calculateTotalNights()}</span>
                  </div>
                  <div className={styles.priceTotal}>
                    <span>Total</span>
                    <span className={styles.totalPrice}>₱{Math.round(modalHotel.price * calculateTotalNights() * 1.1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.confirmBookingButton}
                onClick={() => bookHotel(modalHotel)}
              >
                Confirm Booking
              </button>
              <button 
                className={styles.cancelModalButton}
                onClick={() => setModalHotel(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

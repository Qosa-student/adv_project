// pages/dashboard.js - COMPLETE IMPROVED VERSION
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

const SAMPLE_HOTELS = [ 
  { id: 1, name: "Red Planet Davao", location: "Davao City", price: 1634, stars: 4.1, amenities: ["WiFi", "Air Conditioning", "Restaurant"] },
  { id: 2, name: "Acacia Hotel Davao", location: "Davao City", price: 4143, stars: 4.4, amenities: ["Pool", "Spa", "WiFi"] },
  { id: 3, name: "Aeon SUITES Staycation", location: "Davao City", price: 3219, stars: 3.7, amenities: ["Kitchen", "Laundry", "WiFi"] },
  { id: 4, name: "Hotel Galleria", location: "Davao City", price: 1033, stars: 3.6, amenities: ["WiFi", "Parking"] },
  { id: 5, name: "Davao Royal Suites and Residences", location: "Davao City", price: 897, stars: 3.9, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 6, name: "Crown Regency Residences Davao", location: "Davao City", price: 934, stars: 3.5, amenities: ["WiFi", "Air Conditioning"] },
  { id: 7, name: "Da West Inn Garden", location: "Davao City", price: 1188, stars: 3.1, amenities: ["Garden", "WiFi"] },
  { id: 8, name: "Star Hotel", location: "Davao City", price: 985, stars: 4.0, amenities: ["WiFi", "Restaurant"] },
  { id: 9, name: "GV Hotel Davao", location: "Davao City", price: 738, stars: 3.6, amenities: ["WiFi", "Parking"] },
  { id: 10, name: "Kampotel Davao", location: "Davao City", price: 739, stars: 4.3, amenities: ["WiFi", "Breakfast"] },
  { id: 11, name: "Orchard Hotel", location: "Davao City", price: 991, stars: 3.7, amenities: ["Garden", "WiFi"] },
  { id: 12, name: "Pacific Palm Suites", location: "Davao City", price: 1987, stars: 3.8, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 13, name: "RedDoorz near Robinsons Cybergate Davao", location: "Davao City", price: 1021, stars: 3.5, amenities: ["WiFi", "Air Conditioning"] },
  { id: 14, name: "Central District Hotel", location: "Davao City", price: 1140, stars: 4.0, amenities: ["WiFi", "Restaurant"] },
  { id: 15, name: "Daylight Inn Davao", location: "Davao City", price: 423, stars: 3.4, amenities: ["WiFi", "Parking"] },
  { id: 16, name: "RedDoorz near G Mall Bajada Davao", location: "Davao City", price: 1022, stars: 3.8, amenities: ["WiFi", "Air Conditioning"] },
  { id: 17, name: "Hotel Sogo Davao", location: "Davao City", price: 876, stars: 4.3, amenities: ["WiFi", "24hr Service"] },
  { id: 18, name: "Traveler's Inn Bajada", location: "Davao City", price: 840, stars: 4.0, amenities: ["WiFi", "Parking"] },
  { id: 19, name: "RedDoorz @ Traveler Inn Matina", location: "Davao City", price: 1191, stars: 2.0, amenities: ["WiFi"] },
  { id: 20, name: "Seda Abreeza", location: "Davao City", price: 6370, stars: 4.4, amenities: ["Pool", "Spa", "Gym", "Restaurant"] },
  { id: 21, name: "The Royal Mandaya Hotel", location: "Davao City", price: 3033, stars: 4.3, amenities: ["Pool", "Spa", "Restaurant"] },
  { id: 22, name: "Casa Maria", location: "Davao City", price: 2461, stars: 4.0, amenities: ["WiFi", "Garden", "Restaurant"] },
  { id: 23, name: "RedDoorz Plus near SM Lanang Davao", location: "Davao City", price: 1130, stars: 3.7, amenities: ["WiFi", "Air Conditioning"] },
  { id: 24, name: "Aikiko House", location: "Davao City", price: 891, stars: 4.2, amenities: ["WiFi", "Kitchen"] },
  { id: 25, name: "Napsule Suites", location: "Davao City", price: 879, stars: 4.0, amenities: ["WiFi", "Laundry"] },
  { id: 26, name: "Rogen Inn", location: "Davao City", price: 2034, stars: 4.4, amenities: ["Pool", "WiFi", "Restaurant"] },
  { id: 27, name: "Big Ben's Apartelle", location: "Davao City", price: 832, stars: 3.7, amenities: ["WiFi", "Kitchen"] },
  { id: 28, name: "Hop Inn Hotel Davao", location: "Davao City", price: 1421, stars: 4.3, amenities: ["WiFi", "Air Conditioning"] },
  { id: 29, name: "La Anclar Hotel", location: "Davao City", price: 1777, stars: 3.8, amenities: ["WiFi", "Restaurant"] },
  { id: 30, name: "Traveller's Inn Matina Pangi", location: "Davao City", price: 830, stars: 4.2, amenities: ["WiFi", "Parking"] },
  { id: 31, name: "Snooze Inn and Suites", location: "Davao City", price: 3210, stars: 4.5, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 32, name: "My Hotel Davao", location: "Davao City", price: 1252, stars: 3.9, amenities: ["WiFi", "Restaurant"] },
  { id: 33, name: "Jotel Inn", location: "Davao City", price: 1139, stars: 4.1, amenities: ["WiFi", "Air Conditioning"] },
  { id: 34, name: "Casa Leticia Business Inn", location: "Davao City", price: 1609, stars: 4.2, amenities: ["WiFi", "Business Center"] },
  { id: 35, name: "RedDoorz Plus near Bangko Sentral ng Pilipinas Davao", location: "Davao City", price: 973, stars: 4.6, amenities: ["WiFi", "Air Conditioning"] },
  { id: 36, name: "Chateau Cinco Dormitel", location: "Davao City", price: 1570, stars: 4.3, amenities: ["WiFi", "Common Area"] },
  { id: 37, name: "Conclave Hotel", location: "Davao City", price: 1297, stars: 4.0, amenities: ["WiFi", "Meeting Rooms"] },
  { id: 38, name: "BlueBerry Tourist Hotel", location: "Davao City", price: 2890, stars: 4.1, amenities: ["Pool", "Restaurant", "WiFi"] },
  { id: 39, name: "The Strand Suites and Dormitel", location: "Davao City", price: 1085, stars: 4.3, amenities: ["WiFi", "Common Area"] },
  { id: 40, name: "Hotel Uno", location: "Davao City", price: 1578, stars: 3.4, amenities: ["WiFi", "Parking"] },
  { id: 41, name: "Hampton Suites", location: "Davao City", price: 1981, stars: 4.5, amenities: ["Pool", "Gym", "WiFi"] },
  { id: 42, name: "RedDoorz Plus @ Roxas Street Davao", location: "Davao City", price: 1149, stars: 3.9, amenities: ["WiFi", "Air Conditioning"] },
  { id: 43, name: "Casa Leticia Boutique Hotel", location: "Davao City", price: 1829, stars: 4.0, amenities: ["WiFi", "Restaurant", "Spa"] },
  { id: 44, name: "Hotel Midori Davao", location: "Davao City", price: 1460, stars: 3.9, amenities: ["WiFi", "Restaurant"] },
  { id: 45, name: "Blue Lotus Hotel", location: "Davao City", price: 3184, stars: 4.5, amenities: ["Pool", "Spa", "Restaurant"] },
  { id: 46, name: "The Pinnacle Hotel and Suites", location: "Davao City", price: 3107, stars: 4.1, amenities: ["Pool", "Gym", "Restaurant"] }
];

const SAMPLE_REVIEWS = {
  1: [
    { id: 1, user: "Maria Santos", rating: 4, comment: "Great location and comfortable beds. Staff was very helpful!", date: "2024-01-15" },
    { id: 2, user: "John Cruz", rating: 5, comment: "Excellent service and clean rooms. Will definitely stay again!", date: "2024-02-20" }
  ],
  2: [
    { id: 1, user: "Sarah Lim", rating: 5, comment: "Luxurious experience! The pool and spa were amazing.", date: "2024-01-10" },
    { id: 2, user: "Michael Tan", rating: 4, comment: "Beautiful hotel with great amenities. Highly recommended!", date: "2024-02-15" }
  ],
  3: [
    { id: 1, user: "Robert Garcia", rating: 4, comment: "Perfect for long stays with kitchen facilities.", date: "2024-01-20" },
    { id: 2, user: "Lisa Chen", rating: 3, comment: "Good value for money. Clean and functional.", date: "2024-02-25" }
  ],
  4: [
    { id: 1, user: "David Wong", rating: 3, comment: "Basic but clean. Good for budget travelers.", date: "2024-01-18" },
    { id: 2, user: "Anna Reyes", rating: 4, comment: "Surprisingly good for the price. Would stay again.", date: "2024-02-22" }
  ],
  5: [
    { id: 1, user: "James Lee", rating: 4, comment: "Great amenities and spacious rooms. Pool was nice.", date: "2024-01-12" },
    { id: 2, user: "Michelle Ong", rating: 3, comment: "Good location but rooms could be cleaner.", date: "2024-02-18" }
  ],
  6: [
    { id: 1, user: "Carlos Rivera", rating: 3, comment: "Comfortable stay with good AC. Basic but decent.", date: "2024-01-25" },
    { id: 2, user: "Elena Torres", rating: 4, comment: "Good value for money in a convenient location.", date: "2024-02-28" }
  ],
  7: [
    { id: 1, user: "Daniel Lim", rating: 3, comment: "Nice garden area. Rooms are basic but clean.", date: "2024-01-14" },
    { id: 2, user: "Grace Tan", rating: 2, comment: "Needs improvement in room maintenance.", date: "2024-02-16" }
  ],
  8: [
    { id: 1, user: "Paul Santos", rating: 4, comment: "Good restaurant and comfortable rooms.", date: "2024-01-22" },
    { id: 2, user: "Sofia Cruz", rating: 4, comment: "Friendly staff and clean facilities.", date: "2024-02-24" }
  ],
  9: [
    { id: 1, user: "Mark Chen", rating: 3, comment: "Basic accommodation with parking. Good for short stays.", date: "2024-01-16" },
    { id: 2, user: "Tina Wong", rating: 4, comment: "Surprisingly good for the low price.", date: "2024-02-19" }
  ],
  10: [
    { id: 1, user: "Kevin Lim", rating: 5, comment: "Excellent breakfast and comfortable beds!", date: "2024-01-11" },
    { id: 2, user: "Rachel Tan", rating: 4, comment: "Great value with included breakfast.", date: "2024-02-21" }
  ],
  11: [
    { id: 1, user: "Anthony Reyes", rating: 4, comment: "Beautiful garden setting. Peaceful stay.", date: "2024-01-19" },
    { id: 2, user: "Megan Ong", rating: 3, comment: "Nice atmosphere but rooms need updating.", date: "2024-02-26" }
  ],
  12: [
    { id: 1, user: "Brian Garcia", rating: 4, comment: "Great facilities including pool and gym.", date: "2024-01-13" },
    { id: 2, user: "Nicole Lee", rating: 3, comment: "Good amenities but could be cleaner.", date: "2024-02-17" }
  ],
  13: [
    { id: 1, user: "Steven Wong", rating: 3, comment: "Convenient location near Robinsons.", date: "2024-01-24" },
    { id: 2, user: "Catherine Tan", rating: 4, comment: "Good budget option with reliable AC.", date: "2024-02-27" }
  ],
  14: [
    { id: 1, user: "Eric Santos", rating: 4, comment: "Central location with good restaurant.", date: "2024-01-17" },
    { id: 2, user: "Patricia Cruz", rating: 4, comment: "Comfortable stay in the city center.", date: "2024-02-23" }
  ],
  15: [
    { id: 1, user: "Jason Lim", rating: 3, comment: "Very affordable with basic amenities.", date: "2024-01-21" },
    { id: 2, user: "Diana Chen", rating: 2, comment: "Basic accommodation, gets the job done.", date: "2024-02-14" }
  ],
  16: [
    { id: 1, user: "Ryan Tan", rating: 4, comment: "Good location near G Mall. Clean rooms.", date: "2024-01-26" },
    { id: 2, user: "Jessica Wong", rating: 3, comment: "Decent budget hotel with good AC.", date: "2024-02-29" }
  ],
  17: [
    { id: 1, user: "Andrew Lee", rating: 5, comment: "Excellent 24-hour service! Very convenient.", date: "2024-01-09" },
    { id: 2, user: "Vanessa Ong", rating: 4, comment: "Great for late check-ins. Reliable service.", date: "2024-02-13" }
  ],
  18: [
    { id: 1, user: "Christopher Reyes", rating: 4, comment: "Good parking facilities and clean rooms.", date: "2024-01-23" },
    { id: 2, user: "Angela Santos", rating: 4, comment: "Convenient location with adequate parking.", date: "2024-02-30" }
  ],
  19: [
    { id: 1, user: "Justin Cruz", rating: 2, comment: "Basic accommodation, needs improvement.", date: "2024-01-28" },
    { id: 2, user: "Marianne Tan", rating: 2, comment: "Very basic but functional for short stays.", date: "2024-02-12" }
  ],
  20: [
    { id: 1, user: "William Lim", rating: 5, comment: "Luxury experience! Exceptional service and amenities.", date: "2024-01-08" },
    { id: 2, user: "Sophia Chen", rating: 5, comment: "Worth every peso! Amazing spa and pool.", date: "2024-02-11" }
  ],
  21: [
    { id: 1, user: "Richard Wong", rating: 4, comment: "Royal treatment! Beautiful pool area.", date: "2024-01-27" },
    { id: 2, user: "Isabella Lee", rating: 5, comment: "Excellent service and comfortable rooms.", date: "2024-02-10" }
  ],
  22: [
    { id: 1, user: "Edward Tan", rating: 4, comment: "Charming hotel with beautiful garden.", date: "2024-01-29" },
    { id: 2, user: "Gabriella Santos", rating: 4, comment: "Lovely atmosphere and good restaurant.", date: "2024-02-09" }
  ],
  23: [
    { id: 1, user: "Thomas Cruz", rating: 4, comment: "Convenient near SM Lanang. Clean and comfortable.", date: "2024-01-30" },
    { id: 2, user: "Amelia Reyes", rating: 3, comment: "Good location, basic but adequate rooms.", date: "2024-02-08" }
  ],
  24: [
    { id: 1, user: "Henry Lim", rating: 5, comment: "Great with kitchen facilities! Perfect for families.", date: "2024-01-31" },
    { id: 2, user: "Chloe Chen", rating: 4, comment: "Convenient with kitchenette. Good for longer stays.", date: "2024-02-07" }
  ],
  25: [
    { id: 1, user: "George Wong", rating: 4, comment: "Clean and functional with laundry facilities.", date: "2024-02-01" },
    { id: 2, user: "Zoe Tan", rating: 4, comment: "Good for extended stays with laundry service.", date: "2024-02-06" }
  ],
  26: [
    { id: 1, user: "Samuel Lee", rating: 5, comment: "Excellent pool and restaurant quality!", date: "2024-02-02" },
    { id: 2, user: "Lily Ong", rating: 4, comment: "Great amenities and comfortable stay.", date: "2024-02-05" }
  ],
  27: [
    { id: 1, user: "Peter Santos", rating: 4, comment: "Good kitchen facilities for self-catering.", date: "2024-02-03" },
    { id: 2, user: "Hannah Cruz", rating: 3, comment: "Basic but functional with kitchen access.", date: "2024-02-04" }
  ],
  28: [
    { id: 1, user: "Victor Lim", rating: 5, comment: "Modern and clean with excellent AC.", date: "2024-01-07" },
    { id: 2, user: "Ella Tan", rating: 4, comment: "Comfortable rooms and good location.", date: "2024-01-06" }
  ],
  29: [
    { id: 1, user: "Leo Chen", rating: 4, comment: "Good restaurant and comfortable accommodations.", date: "2024-01-05" },
    { id: 2, user: "Nora Wong", rating: 3, comment: "Decent hotel with adequate facilities.", date: "2024-01-04" }
  ],
  30: [
    { id: 1, user: "Oscar Reyes", rating: 4, comment: "Convenient parking and reliable WiFi.", date: "2024-01-03" },
    { id: 2, user: "Ivy Santos", rating: 5, comment: "Excellent value with good parking space.", date: "2024-01-02" }
  ],
  31: [
    { id: 1, user: "Nathan Lee", rating: 5, comment: "Outstanding facilities! Pool and gym are top-notch.", date: "2024-01-01" },
    { id: 2, user: "Ava Tan", rating: 5, comment: "Luxurious experience without breaking the bank.", date: "2023-12-31" }
  ],
  32: [
    { id: 1, user: "Derek Wong", rating: 4, comment: "Good restaurant and comfortable rooms.", date: "2023-12-30" },
    { id: 2, user: "Mia Chen", rating: 3, comment: "Decent hotel with adequate dining options.", date: "2023-12-29" }
  ],
  33: [
    { id: 1, user: "Ethan Lim", rating: 4, comment: "Reliable AC and comfortable stay.", date: "2023-12-28" },
    { id: 2, user: "Ruby Santos", rating: 4, comment: "Good value with modern amenities.", date: "2023-12-27" }
  ],
  34: [
    { id: 1, user: "Aaron Cruz", rating: 5, comment: "Excellent for business travelers with good facilities.", date: "2023-12-26" },
    { id: 2, user: "Emma Reyes", rating: 4, comment: "Comfortable with good business center.", date: "2023-12-25" }
  ],
  35: [
    { id: 1, user: "Jacob Tan", rating: 5, comment: "Surprisingly excellent for a budget hotel!", date: "2023-12-24" },
    { id: 2, user: "Scarlett Lee", rating: 4, comment: "Great value with good AC and WiFi.", date: "2023-12-23" }
  ],
  36: [
    { id: 1, user: "Lucas Wong", rating: 4, comment: "Good common areas and social spaces.", date: "2023-12-22" },
    { id: 2, user: "Aria Chen", rating: 5, comment: "Excellent for group stays with common facilities.", date: "2023-12-21" }
  ],
  37: [
    { id: 1, user: "Isaiah Santos", rating: 4, comment: "Good for meetings and business events.", date: "2023-12-20" },
    { id: 2, user: "Penelope Lim", rating: 4, comment: "Adequate facilities for business purposes.", date: "2023-12-19" }
  ],
  38: [
    { id: 1, user: "Julian Cruz", rating: 4, comment: "Nice pool and good restaurant quality.", date: "2023-12-18" },
    { id: 2, user: "Eleanor Tan", rating: 5, comment: "Excellent amenities and comfortable stay.", date: "2023-12-17" }
  ],
  39: [
    { id: 1, user: "Jonathan Reyes", rating: 5, comment: "Great common areas and social environment.", date: "2023-12-16" },
    { id: 2, user: "Clara Wong", rating: 4, comment: "Good for social stays with common facilities.", date: "2023-12-15" }
  ],
  40: [
    { id: 1, user: "Adrian Lee", rating: 3, comment: "Basic but functional with parking.", date: "2023-12-14" },
    { id: 2, user: "Violet Chen", rating: 3, comment: "Adequate for short budget stays.", date: "2023-12-13" }
  ],
  41: [
    { id: 1, user: "Charles Santos", rating: 5, comment: "Excellent facilities including pool and gym!", date: "2023-12-12" },
    { id: 2, user: "Stella Lim", rating: 5, comment: "Luxurious amenities at reasonable prices.", date: "2023-12-11" }
  ],
  42: [
    { id: 1, user: "Maxwell Cruz", rating: 4, comment: "Good location on Roxas Street. Clean rooms.", date: "2023-12-10" },
    { id: 2, user: "Natalie Tan", rating: 3, comment: "Decent accommodation in central location.", date: "2023-12-09" }
  ],
  43: [
    { id: 1, user: "Theodore Wong", rating: 4, comment: "Beautiful boutique hotel with good spa.", date: "2023-12-08" },
    { id: 2, user: "Luna Lee", rating: 5, comment: "Charming hotel with excellent service.", date: "2023-12-07" }
  ],
  44: [
    { id: 1, user: "Arthur Chen", rating: 4, comment: "Good restaurant and comfortable stay.", date: "2023-12-06" },
    { id: 2, user: "Samantha Santos", rating: 3, comment: "Adequate hotel with dining options.", date: "2023-12-05" }
  ],
  45: [
    { id: 1, user: "Sebastian Lim", rating: 5, comment: "Luxury experience with amazing spa!", date: "2023-12-04" },
    { id: 2, user: "Aurora Cruz", rating: 5, comment: "Exceptional service and beautiful pool.", date: "2023-12-03" }
  ],
  46: [
    { id: 1, user: "Benjamin Tan", rating: 4, comment: "Great facilities including pool and gym.", date: "2023-12-02" },
    { id: 2, user: "Genesis Wong", rating: 5, comment: "Excellent hotel with top-notch amenities.", date: "2023-12-01" }
  ]
};

const HOTEL_IMAGES = [
  "/hotel1.jpg", "/hotel2.jpg", "/hotel3.jpg", "/hotel4.jpg", "/hotel5.jpg",
  "/hotel6.avif", "/hotel7.webp", "/hotel8.jpg", "/hotel9.avif", "/hotel10.webp",
  "/hotel11.jpg", "/hotel12.avif", "/hotel13.webp", "/hotel14.jpg", "/hotel15.jpg",
  "/hotel16.webp", "/hotel17.jpg", "/hotel18.jpg", "/hotel19.jpg", "/hotel20.avif",
  "/hotel21.jpg", "/hotel22.jpg", "/hotel23.jpg", "/hotel24.jpg", "/hotel25.jpg",
  "/hotel26.jpg", "/hotel27.avif", "/hotel28.webp", "/hotel29.jpg", "/hotel30.jpg",
  "/hotel31.jpg", "/hotel32.jpg", "/hotel33.jpg", "/hotel34.jpg", "/hotel35.jpg",
  "/hotel36.jpg", "/hotel37.jpg", "/hotel38.jpg", "/hotel39.avif", "/hotel40.jpg",
  "/hotel41.jpg", "/hotel42.jpg", "/hotel43.jpg", "/hotel44.avif", "/hotel45.webp", "/hotel46.jpg"
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedHotelReviews, setSelectedHotelReviews] = useState([]);
  const [selectedReviewHotelId, setSelectedReviewHotelId] = useState(null);
  const [toast, setToast] = useState(null);
  const [profilePic, setProfilePic] = useState("/default-avatar.jpg");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 7000]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const fileInputRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

    const savedPic = localStorage.getItem("user_profile_pic");
    if (savedPic) setProfilePic(savedPic);

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
    let updatedFavorites;
    if (wasFavorited) {
      updatedFavorites = favorites.filter(id => id !== hotelId);
      showToast("Removed from favorites", "success");
    } else {
      updatedFavorites = [...favorites, hotelId];
      showToast("Added to favorites!", "success");
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
            const res = await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, hotelId }) });
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
        localStorage.setItem("user_profile_pic", base64);
        showToast("Profile picture updated successfully!", "success");
      };
      reader.onerror = () => {
        showToast("Error reading image file", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (oldPassword !== user.password) {
      showToast("Old password is incorrect", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (newPassword === oldPassword) {
      showToast("New password must be different from old password", "error");
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("hotel_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowChangePassword(false);
    showToast("Password changed successfully!", "success");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
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
          const errBody = await res.json().catch(() => ({}));
          console.error('Booking failed', res.status, errBody);
          showToast(`Booking failed: ${errBody?.error || 'server error'}`, 'error');
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
    showToast(`Successfully booked ${hotel.name} for ${nights} nights! 🎉`, "success");
  };

  const cancelBooking = (id) => {
    const allBookings = JSON.parse(localStorage.getItem("hotel_bookings") || "[]");
    const bookingToCancel = allBookings.find(b => b.id === id) || {};
    const updatedBookings = allBookings.filter(b => b.id !== id);
    localStorage.setItem("hotel_bookings", JSON.stringify(updatedBookings));
    setBookings(prev => prev.filter(b => b.id !== id));

    // If this booking was stored on server, attempt to delete it there too
    (async () => {
      try {
        if (user && user.id && bookingToCancel.serverId) {
          await fetch(`/api/bookings?bookingId=${bookingToCancel.serverId}`, { method: 'DELETE' });
        }
      } catch (err) {
        console.warn('failed to delete booking on server', err);
      }
    })();

    showToast("Booking cancelled successfully", "success");
  };

  const viewReviews = (hotelId) => {
    const hotelReviews = SAMPLE_REVIEWS[hotelId] || [];
    setSelectedReviewHotelId(hotelId);
    setSelectedHotelReviews(hotelReviews);
    setShowReviews(true);
  };

  const submitReview = () => {
    if (!newReview.comment.trim()) {
      showToast("Please write a review comment", "error");
      return;
    }
    if (!selectedReviewHotelId) {
      showToast("No hotel selected for review", "error");
      return;
    }

    const review = {
      id: Date.now(),
      user: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    // Update in-memory SAMPLE_REVIEWS so it's visible during this session
    const existing = SAMPLE_REVIEWS[selectedReviewHotelId] || [];
    const updated = [review, ...existing];
    SAMPLE_REVIEWS[selectedReviewHotelId] = updated;
    setSelectedHotelReviews(updated);

    showToast("Review submitted successfully!", "success");
    setNewReview({ rating: 5, comment: "" });
    setShowReviews(false);
    setSelectedReviewHotelId(null);
  };

  const closeReviews = () => {
    setShowReviews(false);
    setSelectedReviewHotelId(null);
    setSelectedHotelReviews([]);
    setNewReview({ rating: 5, comment: "" });
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
            <h2>🏨 White Flower</h2>
            <p className={styles.welcomeText}>Hello, {user.name.split(" ")[0]}! 👋</p>
          </div>
          
          <nav className={styles.sidebarNav}>
            <button 
              className={`${styles.navButton} ${styles.active}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              🏠 Discover Hotels
            </button>
            <button 
              className={styles.navButton}
              onClick={() => document.getElementById("bookings")?.scrollIntoView({ behavior: "smooth" })}
            >
              📋 My Bookings ({bookings.length})
            </button>
            <button 
              className={styles.navButton}
              onClick={() => document.getElementById("favorites")?.scrollIntoView({ behavior: "smooth" })}
            >
              ❤️ Favorites ({favorites.length})
            </button>
            <button 
              className={styles.navButton}
              onClick={() => setShowProfileModal(true)}
            >
              👤 My Profile
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutButton} onClick={logout}>
              🚪 Logout
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
                <span className={styles.searchIcon}>🔍</span>
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
              {favorites.length > 0 && (
                  <span className={styles.sectionSubtitle}>
                    Hotels you've liked
                  </span>
                )}
              {/* If we have full favoriteRows from server, show the DB records */}
              {favoriteRows && favoriteRows.length > 0 && (
                <div className={styles.favoriteRecords} style={{ marginTop: 12, marginBottom: 12 }}>
                  <h4 style={{ margin: 0, marginBottom: 8 }}>Favorite records (DB)</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #e6e6e6' }}>user_id</th>
                          <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #e6e6e6' }}>hotel_id</th>
                          <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #e6e6e6' }}>created_at</th>
                        </tr>
                      </thead>
                      <tbody>
                        {favoriteRows.map((r, i) => (
                          <tr key={`fav-${i}`}>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f3f3' }}>{r.user_id}</td>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f3f3' }}>{r.hotel_id}</td>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f3f3' }}>{formatDate(r.created_at || r.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>❤️</div>
                <h3>No favorites yet</h3>
                <p>Click the heart icon on hotels to add them to your favorites!</p>
              </div>
            ) : (
              <div className={styles.hotelGrid}>
                {filteredHotels
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
                        <button 
                          className={`${styles.favoriteButton} ${styles.favorited}`}
                          onClick={() => toggleFavorite(hotel.id)}
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.hotelInfo}>
                      <h3>{hotel.name}</h3>
                      <p className={styles.hotelLocation}>
                        📍 {hotel.location}
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
                        >
                          📝 View Reviews
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
              {bookings.length > 0 && (
                <span className={styles.sectionSubtitle}>
                  Manage your upcoming stays
                </span>
              )}
            </div>
            
            {bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <h3>No bookings yet</h3>
                <p>Start exploring our hotels and book your first stay!</p>
              </div>
            ) : (
              <div className={styles.bookingGrid}>
                {bookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    <Image
                      src={booking.image}
                      width={120}
                      height={120}
                      alt={booking.hotel}
                      className={styles.bookingImage}
                    />
                    <div className={styles.bookingInfo}>
                      <h3>{booking.hotel}</h3>
                      <div className={styles.bookingMeta}>
                        <span className={styles.bookingStars}>
                          {getStars(booking.stars)}
                        </span>
                        <span className={styles.bookingLocation}>{booking.location}</span>
                      </div>
                      <div className={styles.bookingDates}>
                        <div className={styles.dateRange}>
                          <span>📅 {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                          <span className={styles.nightsBadge}>{booking.nights} nights</span>
                        </div>
                      </div>
                      <div className={styles.bookingDetails}>
                        <div className={styles.bookingPrice}>
                          <div>₱{booking.price}/night</div>
                          <div className={styles.totalPrice}>₱{booking.totalPrice} total</div>
                        </div>
                        <div className={styles.bookingDate}>Booked: {booking.date}</div>
                      </div>
                      <div className={styles.bookingStatus}>
                        <span className={styles.statusConfirmed}>Confirmed</span>
                      </div>
                    </div>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Hotels Section - CLEAN CARDS WITHOUT DATES */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Available Hotels in Davao ({filteredHotels.length})</h2>
              <span className={styles.sectionSubtitle}>
                {filteredHotels.length} hotels found
              </span>
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
                      📍 {hotel.location}
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
                        >
                          📝 View Reviews
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
                    ✏️
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
                <h1>{user.name}</h1>
                <p className={styles.userEmail}>{user.email}</p>
              </div>

              {/* Change Password */}
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
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.passwordActions}>
                      <button type="submit" className={styles.confirmButton}>
                        Confirm Change
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowChangePassword(false)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
              <div className={styles.reviewsList}>
                <h3 style={{ color: '#000' }}>Customer Reviews</h3>
                {selectedHotelReviews.length === 0 ? (
                  <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                ) : (
                  selectedHotelReviews.map(review => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewUser}>{review.user}</span>
                        <span className={styles.reviewRating}>{getStars(review.rating)}</span>
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
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className={styles.reviewTextarea}
                  rows="4"
                />
                <button 
                  className={styles.submitReviewButton}
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
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
                <p className={styles.modalLocation}>📍 {modalHotel.location}</p>
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
                        📅
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
                        📅
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
                🏨 Confirm Booking
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
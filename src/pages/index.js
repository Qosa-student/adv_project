// pages/index.js - IMPROVED
"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/hello');
      const response = await data.json();
      setPosts(response.posts);
      console.log(response.posts);
      }catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [])

  return (
    <>
      <Head>
        <title>White Flower Stays — Best Hotels in Davao City</title>
        <meta name="description" content="Book luxury and budget hotels in Davao City" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brand}>White Flower Stays</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover and book the finest hotels in Davao City — luxury stays, affordable prices.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button
              onClick={() => handleNavigation("/login")}
              className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <button
              onClick={() => handleNavigation("/register")}
              className={styles.secondaryButton}
              disabled={isLoading}
            >
              Register Now
            </button>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⭐</span>
              <span>Best Prices Guaranteed</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔒</span>
              <span>Secure Booking</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏨</span>
              <span>40+ Hotels Available</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// pages/login.js - IMPROVED
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalType, setModalType] = useState(null); // 'success' | 'error'

  useEffect(() => {
    if (localStorage.getItem("hotel_auth") === "true") {
      router.replace("/dashboard");
    }
  }, [router]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("hotel_auth", "true");
      localStorage.setItem("hotel_user", JSON.stringify(data));
      // show welcome modal then redirect
      setModalType("success");
      setModalMessage("Welcome back! Redirecting to dashboard...");
      setTimeout(() => {
        setModalMessage(null);
        router.push("/dashboard");
      }, 1200);
    } else {
      // fallback to local user store (hotel_users) if server auth fails or offline
      const localUsers = JSON.parse(localStorage.getItem('hotel_users') || '[]');
      const emailLower = formData.email.toLowerCase();
      const found = localUsers.find(u => u.email === emailLower);
      if (found) {
        if (found.password === formData.password) {
          localStorage.setItem('hotel_auth', 'true');
          localStorage.setItem('hotel_user', JSON.stringify(found));
          setModalType('success');
          setModalMessage('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            setModalMessage(null);
            router.push('/dashboard');
          }, 1200);
        } else {
          showToast('Incorrect password. Please try again.', 'error');
        }
      } else {
        showToast(data.error || 'No account found with this email. Please register.', 'error');
      }
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <Head>
        <title>Login — White Flower Stays</title>
        <meta name="description" content="Login to your White Flower account" />
      </Head>

      <div className={styles.authContainer}>
        <div className={styles.authBackground} />
        
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to manage your hotel bookings</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="you@example.com"
                className={errors.email ? styles.inputError : ""}
                disabled={isLoading}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={errors.password ? styles.inputError : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.authActions}>
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className={styles.secondaryButton}
                disabled={isLoading}
              >
                Create Account
              </button>
            </div>

            <div className={styles.authFooter}>
              <p>
                Don&apos;t have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => router.push("/register")}
                  className={styles.linkButton}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            <span className={styles.toastIcon}>
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            {toast.message}
          </div>
        )}

        {/* Centered Modal (error shows actions; success shows welcome and auto-redirects) */}
        {modalMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">{modalType === 'success' ? 'Welcome' : 'Error'}</h2>
              <p className="modal-body">{modalMessage}</p>

              {modalType === 'error' && (
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalMessage(null);
                      router.push("/register");
                    }}
                  >
                    Create Account
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setModalMessage(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
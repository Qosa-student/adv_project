// pages/register.js - IMPROVED
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirm: "" 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalType, setModalType] = useState(null); // 'success' | 'error'
  useEffect(() => {
    // Only redirect if user is actually signed in and user object exists
    const auth = localStorage.getItem("hotel_auth") === "true";
    const storedUser = localStorage.getItem("hotel_user");
    if (auth && storedUser) {
      router.replace("/dashboard");
    }

    if (auth && !storedUser) {
      // stale auth flag -> clear it so user may register/login again
      localStorage.removeItem('hotel_auth');
    }
  }, [router]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "#f44336";
    if (strength <= 3) return "#ff9800";
    if (strength <= 4) return "#8bc34a";
    return "#4caf50";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Good";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  const validate = () => {
    const err = {};
    
    if (!formData.name.trim()) {
      err.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      err.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      err.password = "Password is required";
    } else if (formData.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!formData.confirm) {
      err.confirm = "Please confirm your password";
    } else if (formData.password !== formData.confirm) {
      err.confirm = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const emailLower = formData.email.toLowerCase();

    // First try server-side registration — if server responds, trust it.
    try {
      const resp = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: emailLower,
          password: formData.password,
        }),
      });

      const payload = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        // Server rejects (duplicate, validation, etc.) — show error
        const msg = payload.error || `Registration failed (${resp.status})`;
        setModalType('error');
        setModalMessage(msg);
        setIsLoading(false);
        return;
      }

      // Successful server creation — normalize and store locally for offline behavior.
      // prefer server returned object (may include id and timestamps)
      const newUser = payload && (payload.id || payload.email) ? payload : {
        id: null,
        name: formData.name.trim(),
        email: emailLower,
        password: formData.password,
      };

      const existingUsers = JSON.parse(localStorage.getItem('hotel_users') || '[]');
      // Replace any local user with same email (so register after server-delete works clientside)
      const filtered = existingUsers.filter(u => (u.email || '').toLowerCase() !== emailLower);
      filtered.push(newUser);
      localStorage.setItem('hotel_users', JSON.stringify(filtered));
      localStorage.setItem('hotel_user', JSON.stringify(newUser));
      localStorage.setItem('hotel_auth', 'true');

      // Show centered modal for success, then redirect after a short delay
      setModalType('success');
      setModalMessage('Signup successful! 🎉 Redirecting to dashboard...');
      setIsLoading(false);
      setTimeout(() => {
        setModalMessage(null);
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      // Network/server unavailable — fall back to localStorage registration
      try {
        const existingUsers = JSON.parse(localStorage.getItem('hotel_users') || '[]');
        const duplicate = existingUsers.find(u => u.email === emailLower);
        if (duplicate) {
          setModalType('error');
          setModalMessage('An account with this email already exists (local copy).');
          setIsLoading(false);
          return;
        }

        const newUser = {
          name: formData.name.trim(),
          email: emailLower,
          password: formData.password,
        };
        existingUsers.push(newUser);
        localStorage.setItem('hotel_users', JSON.stringify(existingUsers));
        localStorage.setItem('hotel_user', JSON.stringify(newUser));
        localStorage.setItem('hotel_auth', 'true');

        setModalType('success');
        setModalMessage('Signup saved locally (offline). Redirecting to dashboard...');
        setIsLoading(false);
        setTimeout(() => {
          setModalMessage(null);
          router.push('/dashboard');
        }, 1500);
      } catch (lerr) {
        setModalType('error');
        setModalMessage(lerr.message || 'Network error while creating account');
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (field === "password") {
      calculateStrength(value);
    }
  };

  

  return (
    <>
      <Head>
        <title>Register — White Flower Stays</title>
        <meta name="description" content="Create a White Flower Stays account" />
      </Head>

      <div className={styles.authContainer}>
        <div className={styles.authBackground} />
        
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Create an account</h1>
            <p>Register to manage your hotel bookings and submit reviews</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Your full name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Jane Doe"
                className={errors.name ? styles.inputError : ''}
                disabled={isLoading}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}

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
                  placeholder="Create a password (min 6 characters)"
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

              {formData.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div 
                      className={styles.strengthFill} 
                      style={{ 
                        width: `${(strength / 5) * 100}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    />
                  </div>
                  <span className={styles.strengthText} style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm">Confirm Password</label>
              <div className={styles.passwordInput}>
                <input
                  id="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm}
                  onChange={(e) => handleInputChange('confirm', e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.confirm ? styles.inputError : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirm && <span className={styles.errorText}>{errors.confirm}</span>}
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className={styles.secondaryButton}
                disabled={isLoading}
              >
                Already have an account? Login
              </button>
            </div>

            <div className={styles.authFooter}>
              <p>
                Already created an account? {" "}
                <button 
                  type="button" 
                  onClick={() => router.push("/login")}
                  className={styles.linkButton}
                >
                  Sign in here
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
            {toast.msg}
          </div>
        )}

        {/* Centered Modal (success shows no buttons and auto-redirects; error shows actions) */}
        {modalMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">{modalType === 'success' ? 'Success' : 'Error'}</h2>
              <p className="modal-body">{modalMessage}</p>

              {modalType === 'error' && (
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalMessage(null);
                      router.push('/login');
                    }}
                  >
                    Go to Login
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
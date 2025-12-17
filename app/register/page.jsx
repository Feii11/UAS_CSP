// Register.jsx
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import styles from './Register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  // Perbaikan Krusial: Buat klien HANYA SEKALI
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/login");
      }
    } catch (e) {
      setError(e.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form onSubmit={handleRegister}>
          <h1 className={styles.title}>Register</h1>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
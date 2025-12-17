"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import styles from './Login.module.css';

export default function LoginPage() {
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

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.refresh();
        router.push("/dashboard");
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
        <form onSubmit={handleLogin}>
          <h1 className={styles.title}>Login</h1>
          {error && <p className={styles.error}>{error}</p>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input}
              placeholder="Email Anda" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="password" 
              className={styles.input}
              placeholder="Password Anda" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <div>
            <p className={styles.registerLink}>
              Belum punya akun? <a href="/register" className={styles.registerAnchor}>Daftar di sini</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

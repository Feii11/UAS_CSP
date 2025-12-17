// Dashboard tampilkan announcement: navbar, card announcement, logout
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  const [error, setError] = useState(null);
  
  const router = useRouter();

    // Perbaikan Krusial: Buat klien HANYA SEKALI
    const [supabase] = useState(() =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    );

    useEffect(() => {
    async function fetchData() {
      try {
        // Gunakan getUser() untuk validasi sesi
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData) {
          router.push('/login');
          return;
        }
        setUser(userData);

        // Ambil Data Announcement
        const { data: announcementData, error: announcementError } = await supabase
          .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (announcementError) throw announcementError;
        setAnnouncement(announcementData || []);

      } catch (e) {
        console.error('Error fetching data:', e.message);
        setError(e.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  if (loading) {
    return <div className={styles.container}><p className={styles.loadingText}>Memuat sesi dan data...</p></div>;
  }

  if (user) {
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <h1 className={styles.logo}>Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </nav>

            <main className={styles.mainContent}>
                <h2 className={styles.welcomeMessage}>Selamat datang, {user.email}!</h2>    
                {error && <p className={styles.error}>{error}</p>}
                <section className={styles.announcementSection}>
                    <h3 className={styles.sectionTitle}>Pengumuman Terbaru</h3>
                    {announcement.length === 0 ? (
                        <p className={styles.noAnnouncement}>Belum ada pengumuman.</p>
                    ) : (
                        <div className={styles.announcementList}>
                            {announcement.map((item) => (
                                <div key={item.id} className={styles.announcementCard}>
                                    <h4 className={styles.announcementTitle}>{item.title}</h4>
                                    <p className={styles.announcementContent}>{item.content}</p>
                                    <p className={styles.announcementDate}>
                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
  }

  return null;

}


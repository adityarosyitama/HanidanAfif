"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const INVITATION_URL = "http://localhost:3000/index.html";

// ─── Constants ───────────────────────────────────────────
const TARGET_DATE = "2026-06-06T17:00:00+07:00";

const PETALS = [
  { left: "8%",  delay: "0s",   duration: "7s",  opacity: 0.6 },
  { left: "17%", delay: "1.2s", duration: "9s",  opacity: 0.5 },
  { left: "26%", delay: "2.5s", duration: "6.5s",opacity: 0.7 },
  { left: "35%", delay: "0.4s", duration: "8s",  opacity: 0.4 },
  { left: "44%", delay: "3.1s", duration: "7.5s",opacity: 0.6 },
  { left: "53%", delay: "1.8s", duration: "10s", opacity: 0.5 },
  { left: "62%", delay: "0.9s", duration: "6s",  opacity: 0.8 },
  { left: "71%", delay: "4.0s", duration: "8.5s",opacity: 0.4 },
  { left: "80%", delay: "2.2s", duration: "7s",  opacity: 0.7 },
  { left: "89%", delay: "1.5s", duration: "9.5s",opacity: 0.5 },
  { left: "12%", delay: "5.0s", duration: "11s", opacity: 0.4 },
  { left: "57%", delay: "3.7s", duration: "8s",  opacity: 0.6 },
];

const STORY = [
  { num: "01", caption: "Pertama kali saling kenal" },
  { num: "02", caption: "Satu kantor, satu divisi" },
  { num: "03", caption: "Cerita cinta dimulai" },
  { num: "04", caption: "Pertemuan dua keluarga" },
  { num: "05", caption: "Lamaran" },
  { num: "06", caption: "Menikah" },
];

const NAV_LINKS = [
  { href: "#waktu",            label: "Waktu" },
  { href: "#lokasi",           label: "Lokasi" },
  { href: "#tentang-pasangan", label: "Tentang Kami" },
  { href: "#rsvp",             label: "RSVP" },
];

// ─── Hooks ───────────────────────────────────────────────
function useCountdown(target: string): TimeLeft {
  const [t, setT] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
}

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Small Components ─────────────────────────────────────
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Ornament() {
  return (
    <div className="ornament-line">
      <span className="ornament-dot">❀</span>
    </div>
  );
}

function CdBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="cd-box">
      <span className="cd-num">{pad(value)}</span>
      <span className="cd-lbl">{label}</span>
    </div>
  );
}

// ─── Section with fade-in ─────────────────────────────────
function Section({
  id,
  bg,
  children,
}: {
  id?: string;
  bg: "light" | "warm" | "dark";
  children: React.ReactNode;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      id={id}
      ref={ref}
      className={`section section-${bg} ${visible ? "visible" : ""}`}
    >
      <div className="section-inner">{children}</div>
    </section>
  );
}

// ─── Envelope Screen ──────────────────────────────────────
function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  
  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      window.location.href = INVITATION_URL;
    }, 1200);
    setTimeout(onOpen, 5200);
  };

  return (
    <div className={`env-scene ${opening ? "closing" : ""}`}>
      <div className="petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="petal"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }}
          />
        ))}
      </div>

      <div className="env-card">
        <div className="env-top-bar" />
        <div className="env-body">
          <div className="env-seal">❀</div>
          <p className="env-label">Undangan Pernikahan</p>
          <h2 className="env-name">Nurul Hani Hadira</h2>
          <div className="env-amp">&amp;</div>
          <h2 className="env-name">Muhammad Afif Nurul Huda</h2>
          <p className="env-date">Sabtu, 21 April 2021</p>
        </div>
      </div>

      <button className="env-btn" onClick={handleOpen} disabled={opening}>
        {opening ? "Membuka..." : "✉ Buka Undangan"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function Home() {
  const [opened, setOpened] = useState(false);
  const cd = useCountdown(TARGET_DATE);

  return (
    <>

      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      {opened && (
        <main>
          {/* Hero */}
          <div className="hero" id="home">
            <p className="hero-label">Undangan Pernikahan</p>
            <div className="divider-line" />
            <h1 className="hero-names">
              Nurul Hani Hadira
              <span className="hero-amp">&amp;</span>
              Muhammad Afif Nurul Huda
            </h1>
            <div className="divider-line" />
            <p className="hero-date">Sabtu, 21 April 2021 · Bekasi, Jawa Barat</p>

            <div className="cd-row">
              <CdBox value={cd.days}    label="Hari"  />
              <span className="cd-sep">:</span>
              <CdBox value={cd.hours}   label="Jam"   />
              <span className="cd-sep">:</span>
              <CdBox value={cd.minutes} label="Menit" />
              <span className="cd-sep">:</span>
              <CdBox value={cd.seconds} label="Detik" />
            </div>
          </div>

          {/* Navbar */}
          <nav className="navbar">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          {/* Pembuka */}
          <Section bg="light">
            <div className="arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
            <Ornament />
            <p className="body-text">
              Assalamu&apos;alaikum Warahmatullahi Wabarakatuh.
              <br /><br />
              Dengan memohon rahmat dan ridha Allah swt, kami bermaksud mengundang
              Bapak/Ibu/Saudara/Saudari pada acara pernikahan kami.
            </p>
            <div className="couple-names">
              Nurul Hani Hadira
              <span className="couple-amp">&amp;</span>
              Muhammad Afif Nurul Huda
            </div>
            <Ornament />
          </Section>

          {/* Waktu */}
          <Section bg="warm" id="waktu">
            <h2 className="section-title">Waktu</h2>
            <Ornament />
            <div className="waktu-grid">
              <div className="waktu-card">
                <p className="wk-top">Sabtu</p>
                <p className="wk-num">21</p>
                <p className="wk-month">April 2021</p>
              </div>
              <div className="waktu-card">
                <p className="wk-top">Akad Nikah</p>
                <p className="wk-time">17.00</p>
                <p className="wk-wib">WIB</p>
              </div>
              <div className="waktu-card">
                <p className="wk-top">Resepsi</p>
                <p className="wk-time">19.00</p>
                <p className="wk-wib">– 21.00 WIB</p>
              </div>
            </div>
            <a href="https://calendar.google.com/event?action=TEMPLATE" target="_blank" rel="noreferrer" className="btn-gold">
              📅 Simpan ke Kalender
            </a>
          </Section>

          {/* Lokasi */}
          <Section bg="light" id="lokasi">
            <h2 className="section-title">Lokasi</h2>
            <Ornament />
            <p className="address">
              <strong>Nama Tempat</strong><br />
              Jl. Kenanga Raya No.9, RT.001/RW.006A<br />
              Jakasampurna, Bekasi Barat, Jawa Barat
            </p>
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1280267408406!2d106.9691569150978!3d-6.246854895478259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d5988a190d9%3A0x22b6a052b0a6a5f3!2sRM.%20Pondok%20Kenanga!5e0!3m2!1sen!2sid"
                width="100%" height="360"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                title="Lokasi Pernikahan"
              />
            </div>
            <a href="https://maps.google.com/maps?q=RM.+Pondok+Kenanga+Bekasi" target="_blank" rel="noreferrer" className="btn-gold">
              🗺 Buka Google Maps
            </a>
          </Section>

          {/* Tentang Pasangan */}
          <Section bg="warm" id="tentang-pasangan">
            <h2 className="section-title">Tentang Hani &amp; Afif</h2>
            <Ornament />
            <div className="story-grid">
              {STORY.map(({ num, caption }) => (
                <div key={num} className="story-card">
                  <span className="story-num">{num}</span>
                  <span className="story-cap">{caption}</span>
                </div>
              ))}
            </div>
            <Ornament />
          </Section>

          {/* RSVP */}
          <Section bg="dark" id="rsvp">
            <h2 className="section-title">Konfirmasi Kehadiran</h2>
            <Ornament />
            <div className="rsvp-box">
              <p className="body-text">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/Saudari berkenan hadir memberikan doa restu.
              </p>
              <p className="body-text small">
                Di meja penerima tamu kami sediakan hand sanitizer dan pemeriksaan suhu tubuh.
                Stay safe &amp; jaga kesehatan ya 🙏
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=628xxxxxxxxxx&text=Halo%2C%20saya%20akan%20hadir%20di%20acara%20pernikahan"
                target="_blank" rel="noreferrer" className="btn-wa"
              >
                💬 Konfirmasi via WhatsApp
              </a>
            </div>
            <Ornament />
            <p className="body-text small">Kami yang berbahagia,</p>
            <div className="insta-row">
              <a href="https://instagram.com/instagramaccount" target="_blank" rel="noreferrer" className="insta-link">📷 @instagramaccount</a>
              <a href="https://instagram.com/instagramaccount" target="_blank" rel="noreferrer" className="insta-link">📷 @instagramaccount</a>
            </div>
          </Section>

          <footer className="footer">
            Dibuat dengan <span style={{ color: "#c4806e" }}>♥</span> · 2021 Hani &amp; Afif
          </footer>
        </main>
      )}
    </>
  );
}
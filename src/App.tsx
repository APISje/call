import { useEffect, useState, useRef } from "react";

const BASE = import.meta.env.BASE_URL;

function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <span className="modal-avatar">👋</span>
        <h2>Hallo, saya Apip / Apis</h2>
        <p>
          Saya membuat website <strong>Emergency Call</strong> ini untuk diri
          saya sendiri. Kenapa? Karena saya ingin mempermudah kalian menghubungi
          aku jika aku tidak ada data atau di luar jangkauan.
        </p>
        <p>
          Laporan kalian akan masuk ke <strong>Discord</strong> saya untuk aku
          lihat langsung.
        </p>
        <p>
          <strong style={{ color: "#e8e8ec" }}>Terima kasih telah join!</strong>
        </p>
        <button className="btn-primary" onClick={onClose}>
          Oke, Mengerti!
        </button>
      </div>
    </div>
  );
}

function SuccessToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast">
      ✅ Terima kasih telah lapor! Laporan kamu akan kami selesaikan dengan cepat.
    </div>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;
    setLoading(true);
    try {
      await fetch(`${BASE}api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama || "Anonim",
          pesan,
          fileNames: files.map((f) => f.name),
        }),
      });
    } catch { }
    setNama(""); setPesan(""); setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
    setLoading(false);
    setShowToast(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="page">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      {showToast && <SuccessToast onClose={() => setShowToast(false)} />}

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/banner1.png" alt="" className="hero-bg-img hero-bg-1" />
          <img src="/banner2.png" alt="" className="hero-bg-img hero-bg-2" />
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">🚨 EMERGENCY CALL</div>
          <h1 className="hero-title">Emergency Call</h1>
          <p className="hero-sub">by Apip / Apis</p>

          {/* frosted glass banner cards */}
          <div className="hero-cards">
            <div className="glass-card">
              <img
                src="/banner1.png"
                alt="Banner 1"
                className="glass-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <p className="glass-label">banner1.png</p>
            </div>
            <div className="glass-card">
              <img
                src="/banner2.png"
                alt="Banner 2"
                className="glass-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <p className="glass-label">banner2.png</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section className="video-section">
        <div className="video-wrapper">
          <video className="main-video" controls autoPlay muted loop>
            <source src="/video.mp4" type="video/mp4" />
            Browser kamu tidak mendukung video.
          </video>
        </div>
        <p className="banner-label">video.mp4</p>
      </section>

      {/* ── FORM ── */}
      <section className="form-section">
        <div className="form-card">
          <h2 className="form-title">
            <span />
            Masukan Laporan Anda ke Sini
          </h2>
          <form onSubmit={handleSubmit} className="report-form">
            <div>
              <label className="form-label">Nama (opsional)</label>
              <input
                className="form-input"
                type="text"
                placeholder="Nama kamu..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Pesan Laporan *</label>
              <textarea
                className="form-textarea"
                placeholder="Tulis laporanmu di sini..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                required
                rows={5}
              />
            </div>
            <div>
              <label className="form-label">Berikan Foto atau File</label>
              <div className="file-drop" onClick={() => fileRef.current?.click()}>
                <span>📎 Klik untuk pilih file / foto</span>
                {files.length > 0 && (
                  <ul className="file-list">
                    {files.map((f, i) => <li key={i}>{f.name}</li>)}
                  </ul>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
              {loading ? "Mengirim..." : "Submit Laporan"}
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        Emergency Call &copy; {new Date().getFullYear()} &mdash; Apip / Apis
      </footer>
    </div>
  );
}

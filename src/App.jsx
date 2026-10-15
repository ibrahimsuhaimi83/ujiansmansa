import { Database, GraduationCap, ShieldCheck } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db/db.js";

export default function App() {
  const counts = useLiveQuery(async () => ({
    students: await db.siswa.count(),
    questions: await db.soal.count(),
    exams: await db.ujian.count(),
  }));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12 text-slate-900">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/5">
        <header className="bg-navy-900 px-8 py-8 text-white sm:px-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <GraduationCap aria-hidden="true" size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">CBT Sekolah</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Computer Based Test SMA</h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl leading-7 text-blue-100">
            Platform ujian lokal yang menyimpan data di browser dan dirancang untuk penggunaan offline di laboratorium sekolah.
          </p>
        </header>

        <div className="grid gap-5 p-8 sm:grid-cols-2 sm:p-10">
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Database aria-hidden="true" size={18} /> Database lokal
            </div>
            <p className="mt-3 text-2xl font-bold text-navy-900">IndexedDB siap</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Data tetap berada di perangkat ini dan tersedia saat browser dibuka kembali.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <ShieldCheck aria-hidden="true" size={18} /> Data contoh
            </div>
            <p className="mt-3 text-2xl font-bold text-navy-900">
              {counts ? `${counts.students} siswa · ${counts.questions} soal` : "Memuat data…"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {counts ? `${counts.exams} jadwal ujian tersedia untuk pengembangan tahap berikutnya.` : "Seed database sedang diperiksa."}
            </p>
          </div>
        </div>

        <footer className="border-t border-slate-100 px-8 py-5 text-sm text-slate-500 sm:px-10">
          Tahap 1 selesai — skema database dan data seed telah disiapkan.
        </footer>
      </section>
    </main>
  );
}

import { db } from "./db.js";

const seededIds = {
  academicYear: 1,
  classes: [1, 2, 3],
  subjects: [1, 2],
  teachers: [1, 2],
  exam: 1,
};

async function sha256(value) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API diperlukan untuk membuat password seed.");
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createQuestions() {
  const definitions = [
    {
      jenis: "pilihan-ganda",
      pertanyaan: "Berapakah hasil dari 2 + 3 × 4?",
      opsi: [{ teks: "20" }, { teks: "14" }, { teks: "24" }, { teks: "9" }],
      kunci: [1],
      pembahasan: "Operasi perkalian dikerjakan lebih dahulu: 2 + (3 × 4) = 14.",
      mapelId: 1,
    },
    {
      jenis: "pilihan-ganda-kompleks",
      pertanyaan: "Pilih semua bilangan prima berikut.",
      opsi: [{ teks: "2" }, { teks: "9" }, { teks: "11" }, { teks: "15" }],
      kunci: [0, 2],
      mapelId: 1,
    },
    {
      jenis: "benar-salah",
      pertanyaan: "Akar kuadrat dari 81 adalah 9.",
      pernyataan: [{ teks: "Pernyataan di atas benar." }],
      kunci: [true],
      mapelId: 1,
    },
    {
      jenis: "menjodohkan",
      pertanyaan: "Jodohkan fungsi dengan turunannya.",
      pasangan: [
        { kiri: "x²", kanan: "2x" },
        { kiri: "sin x", kanan: "cos x" },
        { kiri: "eˣ", kanan: "eˣ" },
      ],
      kunci: [0, 1, 2],
      mapelId: 1,
    },
    {
      jenis: "isian-singkat",
      pertanyaan: "Sebutkan hasil dari 7 × 8.",
      kunciTeks: ["56"],
      mapelId: 1,
    },
    {
      jenis: "uraian",
      pertanyaan: "Jelaskan langkah-langkah menyelesaikan persamaan 2x + 6 = 14.",
      kunci: [],
      mapelId: 1,
    },
    {
      jenis: "pilihan-ganda",
      pertanyaan: "Manakah yang merupakan sinonim kata 'cermat'?",
      opsi: [{ teks: "Teliti" }, { teks: "Lalai" }, { teks: "Cepat" }, { teks: "Ragu" }],
      kunci: [0],
      mapelId: 2,
    },
    {
      jenis: "pilihan-ganda-kompleks",
      pertanyaan: "Pilih kalimat yang menggunakan tanda baca dengan tepat.",
      opsi: [
        { teks: "Ibu berkata, \"Belajarlah dengan tekun.\"" },
        { teks: "Di mana rumahmu." },
        { teks: "Wah, indah sekali!" },
        { teks: "Saya membeli buku, pensil dan." },
      ],
      kunci: [0, 2],
      mapelId: 2,
    },
    {
      jenis: "benar-salah",
      pertanyaan: "Kalimat efektif menghindari penggunaan kata yang berlebihan.",
      pernyataan: [{ teks: "Pernyataan di atas benar." }],
      kunci: [true],
      mapelId: 2,
    },
    {
      jenis: "menjodohkan",
      pertanyaan: "Jodohkan jenis kata dengan contohnya.",
      pasangan: [
        { kiri: "Kata benda", kanan: "Perpustakaan" },
        { kiri: "Kata kerja", kanan: "Membaca" },
        { kiri: "Kata sifat", kanan: "Indah" },
      ],
      kunci: [0, 1, 2],
      mapelId: 2,
    },
  ];

  const questions = [];
  for (let index = 0; index < 30; index += 1) {
    const base = definitions[index % definitions.length];
    questions.push({
      ...structuredClone(base),
      id: index + 1,
      mapelId: base.mapelId,
      kelasId: (index % 3) + 1,
      kesulitan: ["mudah", "sedang", "sulit"][index % 3],
      bobot: base.jenis === "uraian" ? 5 : 2,
      gambar: null,
      dibuatOleh: base.mapelId === 1 ? 1 : 2,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    });
  }
  return questions;
}

export async function seedDatabase() {
  const existingAdmin = await db.users.where("username").equals("admin").first();
  if (existingAdmin) return;

  const passwordHash = await sha256("admin123");
  const teacherPasswordHash = await sha256("guru123");
  const studentPasswordHash = await sha256("siswa123");
  const today = new Date().toISOString().slice(0, 10);

  await db.transaction(
    "rw",
    db.users,
    db.siswa,
    db.guru,
    db.kelas,
    db.mapel,
    db.tahunAjaran,
    db.soal,
    db.ujian,
    db.ujianSoal,
    db.pesertaUjian,
    db.pengaturan,
    async () => {
      await db.tahunAjaran.add({
        id: seededIds.academicYear,
        nama: "2025/2026",
        semester: "Ganjil",
        aktif: true,
      });

      await db.kelas.bulkAdd([
        { id: 1, nama: "X", tingkat: 10, rombel: "X-1", tahunAjaranId: 1 },
        { id: 2, nama: "XI", tingkat: 11, rombel: "XI IPA 1", tahunAjaranId: 1 },
        { id: 3, nama: "XII", tingkat: 12, rombel: "XII IPA 1", tahunAjaranId: 1 },
      ]);

      await db.mapel.bulkAdd([
        { id: 1, kode: "MAT", nama: "Matematika", tingkat: 10, guruId: 1 },
        { id: 2, kode: "BIN", nama: "Bahasa Indonesia", tingkat: 10, guruId: 2 },
      ]);

      await db.guru.bulkAdd([
        { id: 1, nip: "198501012010011001", nama: "Dina Permata, S.Pd.", mapelId: 1, aktif: true },
        { id: 2, nip: "198703152012021002", nama: "Budi Santoso, S.Pd.", mapelId: 2, aktif: true },
      ]);

      await db.siswa.bulkAdd(
        Array.from({ length: 20 }, (_, index) => {
          const number = String(index + 1).padStart(3, "0");
          const kelasId = (index % 3) + 1;
          return {
            id: index + 1,
            nisn: `0098765${String(index + 1).padStart(4, "0")}`,
            nomorPeserta: `CBT-2026-${number}`,
            nama: `Siswa Contoh ${String(index + 1).padStart(2, "0")}`,
            kelasId,
            rombel: ["X-1", "XI IPA 1", "XII IPA 1"][kelasId - 1],
            jenisKelamin: index % 2 === 0 ? "L" : "P",
            aktif: true,
          };
        }),
      );

      await db.users.bulkAdd([
        {
          username: "admin",
          passwordHash,
          role: "admin",
          nama: "Administrator",
          aktif: true,
          createdAt: new Date().toISOString(),
        },
        {
          username: "guru1",
          passwordHash: teacherPasswordHash,
          role: "guru",
          guruId: 1,
          nama: "Dina Permata, S.Pd.",
          aktif: true,
        },
        {
          username: "guru2",
          passwordHash: teacherPasswordHash,
          role: "guru",
          guruId: 2,
          nama: "Budi Santoso, S.Pd.",
          aktif: true,
        },
        ...Array.from({ length: 20 }, (_, index) => ({
          username: `0098765${String(index + 1).padStart(4, "0")}`,
          passwordHash: studentPasswordHash,
          role: "siswa",
          siswaId: index + 1,
          nama: `Siswa Contoh ${String(index + 1).padStart(2, "0")}`,
          aktif: true,
        })),
      ]);

      await db.soal.bulkAdd(createQuestions());

      await db.ujian.add({
        id: seededIds.exam,
        nama: "Simulasi Ujian Matematika",
        jenis: "Try Out",
        mapelId: 1,
        kelasId: 1,
        rombel: "X-1",
        tanggal: today,
        jamMulai: "00:00",
        durasiMenit: 120,
        jumlahSoal: 15,
        acakSoal: true,
        acakOpsi: true,
        tampilkanNilai: true,
        batasMinimalMenit: 0,
        token: "CBT202",
        status: "aktif",
        createdAt: new Date().toISOString(),
      });

      await db.ujianSoal.bulkAdd(
        Array.from({ length: 15 }, (_, index) => ({
          ujianId: 1,
          soalId: index + 1,
          urutan: index + 1,
          bobot: 2,
        })),
      );

      await db.pesertaUjian.bulkAdd(
        Array.from({ length: 7 }, (_, index) => ({
          ujianId: 1,
          siswaId: index + 1,
          status: "belum-login",
          waktuMulai: null,
          pelanggaranCount: 0,
        })),
      );

      await db.pengaturan.bulkAdd([
        { kunci: "sekolah", nilai: { nama: "SMA Negeri Contoh", alamat: "", kepalaSekolah: "", logo: null } },
        { kunci: "tahunAjaranAktifId", nilai: seededIds.academicYear },
      ]);
    },
  );
}

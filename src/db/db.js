import Dexie from "dexie";

export const db = new Dexie("cbtSma");

db.version(1).stores({
  users: "++id, &username, role, guruId, siswaId, aktif",
  siswa: "++id, &nisn, nomorPeserta, nama, kelasId, rombel, aktif",
  guru: "++id, &nip, nama, mapelId, aktif",
  kelas: "++id, nama, tingkat, rombel, tahunAjaranId",
  mapel: "++id, &kode, nama, tingkat, guruId",
  tahunAjaran: "++id, nama, semester, aktif",
  soal: "++id, mapelId, kelasId, jenis, kesulitan, dibuatOleh, updatedAt",
  ujian: "++id, nama, mapelId, kelasId, rombel, tanggal, jamMulai, status, token",
  ujianSoal: "++id, ujianId, soalId, urutan, &[ujianId+soalId]",
  pesertaUjian: "++id, ujianId, siswaId, status, waktuMulai, &[ujianId+siswaId]",
  jawaban: "++id, ujianId, siswaId, soalId, pesertaUjianId, status, &[ujianId+siswaId+soalId]",
  hasil: "++id, ujianId, siswaId, pesertaUjianId, statusNilai, &[ujianId+siswaId]",
  pelanggaran: "++id, ujianId, siswaId, pesertaUjianId, waktu, jenis",
  pengaturan: "++id, &kunci, updatedAt",
});

export async function getPengaturan(kunci, nilaiDefault = null) {
  const item = await db.pengaturan.where("kunci").equals(kunci).first();
  return item ? item.nilai : nilaiDefault;
}

export async function setPengaturan(kunci, nilai) {
  const existing = await db.pengaturan.where("kunci").equals(kunci).first();
  const record = { kunci, nilai, updatedAt: new Date().toISOString() };

  if (existing) {
    await db.pengaturan.update(existing.id, record);
    return existing.id;
  }

  return db.pengaturan.add(record);
}

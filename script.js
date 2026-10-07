// data awal mahasiswa
let dataMahasiswa = [
  { nim: "5025251055", nama: "Andi Pratama", jurusan: "Teknik Informatika" },
  { nim: "5026251098", nama: "Siti Aisyah", jurusan: "Sistem Informasi" },
  { nim: "5024251141", nama: "Budi Santoso", jurusan: "Teknik Komputer" },
  { nim: "5022251062", nama: "Nina Marlina", jurusan: "Teknik Elektro" },
  { nim: "5025251134", nama: "Rizky Pratama", jurusan: "Teknik Informatika" },
  { nim: "5026251021", nama: "Dewi Lestari", jurusan: "Sistem Informasi" },
  { nim: "5024251077", nama: "Fajar Nugroho", jurusan: "Teknik Komputer" },
  { nim: "5022251105", nama: "Maya Anggraini", jurusan: "Teknik Elektro" },
  { nim: "5025251088", nama: "Galih Saputra", jurusan: "Teknik Informatika" },
  { nim: "5026251130", nama: "Putri Handayani", jurusan: "Sistem Informasi" },
  { nim: "5024251019", nama: "Hendra Wijaya", jurusan: "Teknik Komputer" },
  { nim: "5022251047", nama: "Lina Kartika", jurusan: "Teknik Elektro" },
  { nim: "5025251150", nama: "Bagas Prakoso", jurusan: "Teknik Informatika" },
  { nim: "5026251066", nama: "Citra Dewanti", jurusan: "Sistem Informasi" },
  { nim: "5024251093", nama: "Yoga Permana", jurusan: "Teknik Komputer" }
];

// tiap data dikasih email sesuai NIM
dataMahasiswa.forEach(function (m) { m.email = m.nim + "@student.its.ac.id"; });

const dataPerHalaman = 5;
let halamanSekarang = 1;
let indexEdit = -1; // -1 artinya lagi mode tambah, bukan edit

// ambil elemen
const inputNim = document.getElementById("nim");
const inputNama = document.getElementById("nama");
const inputJurusan = document.getElementById("jurusan");
const inputEmail = document.getElementById("email");

// ambil data sesuai kata pencarian
function ambilDataFilter() {
  const kataCari = document.getElementById("cari").value.toLowerCase();
  return dataMahasiswa.filter(function (m) {
    return m.nim.toLowerCase().includes(kataCari) ||
           m.nama.toLowerCase().includes(kataCari) ||
           m.jurusan.toLowerCase().includes(kataCari) ||
           m.email.toLowerCase().includes(kataCari);
  });
}

// tampilkan tabel
function tampilkanData() {
  const hasil = ambilDataFilter();
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / dataPerHalaman));
  if (halamanSekarang > totalHalaman) halamanSekarang = totalHalaman;

  const mulai = (halamanSekarang - 1) * dataPerHalaman;
  const dataHalaman = hasil.slice(mulai, mulai + dataPerHalaman);
  const tbody = document.getElementById("isiTabel");
  tbody.innerHTML = "";

  if (dataHalaman.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="kosong">Data tidak ditemukan</td></tr>';
  }

  dataHalaman.forEach(function (m, i) {
    const indexAsli = dataMahasiswa.indexOf(m);
    tbody.innerHTML += `
      <tr>
        <td>${mulai + i + 1}</td>
        <td>${m.nim}</td>
        <td>${m.nama}</td>
        <td>${m.jurusan}</td>
        <td>${m.email}</td>
        <td><div class="aksi">
          <button class="btn-edit" title="Edit" onclick="editData(${indexAsli})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-hapus" title="Hapus" onclick="hapusData(${indexAsli})"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`;
  });

  tampilkanPaginasi(totalHalaman);
}

// tombol halaman
function tampilkanPaginasi(totalHalaman) {
  const box = document.getElementById("paginasi");
  let html = `<button ${halamanSekarang === 1 ? "disabled" : ""} onclick="pindahHalaman(${halamanSekarang - 1})">&laquo;</button>`;
  for (let i = 1; i <= totalHalaman; i++) {
    html += `<button class="${i === halamanSekarang ? "aktif" : ""}" onclick="pindahHalaman(${i})">${i}</button>`;
  }
  html += `<button ${halamanSekarang === totalHalaman ? "disabled" : ""} onclick="pindahHalaman(${halamanSekarang + 1})">&raquo;</button>`;
  box.innerHTML = html;
}

function pindahHalaman(h) {
  halamanSekarang = h;
  tampilkanData();
}

// simpan (tambah / update)
function simpanData() {
  const nim = inputNim.value.trim();
  const nama = inputNama.value.trim();
  const jurusan = inputJurusan.value;
  const email = inputEmail.value.trim();

  if (nim === "" || nama === "" || jurusan === "" || email === "") {
    alert("Semua data harus diisi!");
    return;
  }
  if (!/^\d+$/.test(nim)) {
    alert("NIM harus berupa angka!");
    return;
  }
  if (!email.includes("@")) {
    alert("Format email tidak valid!");
    return;
  }
  // cek NIM kembar
  for (let i = 0; i < dataMahasiswa.length; i++) {
    if (dataMahasiswa[i].nim === nim && i !== indexEdit) {
      alert("NIM sudah terdaftar!");
      return;
    }
  }

  if (indexEdit === -1) {
    dataMahasiswa.push({ nim: nim, nama: nama, jurusan: jurusan, email: email });
    alert("Data berhasil ditambahkan!");
  } else {
    dataMahasiswa[indexEdit] = { nim: nim, nama: nama, jurusan: jurusan, email: email };
    alert("Data berhasil diubah!");
  }
  resetForm();
  tampilkanData();
}

// isi form dengan data yang mau diedit
function editData(index) {
  const m = dataMahasiswa[index];
  inputNim.value = m.nim;
  inputNama.value = m.nama;
  inputJurusan.value = m.jurusan;
  inputEmail.value = m.email;
  indexEdit = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// hapus data pakai konfirmasi
function hapusData(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
    dataMahasiswa.splice(index, 1);
    resetForm();
    tampilkanData();
  }
}

function batalEdit() {
  resetForm();
}

function resetForm() {
  inputNim.value = "";
  inputNama.value = "";
  inputJurusan.value = "";
  inputEmail.value = "";
  indexEdit = -1;
}

tampilkanData();
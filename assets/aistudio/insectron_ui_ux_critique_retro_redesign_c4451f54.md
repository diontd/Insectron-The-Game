# INSECTRON — Kritik UI/UX dan Rencana Redesign Retro Arcade

**Jenis dokumen:** UX audit berbasis screenshot + design brief implementasi  
**Cakupan:** Main menu, squad selection/formasi, dan battle arena  
**Arah visual yang direkomendasikan:** *Retro Arcade / Neo-16* — estetika game 16-bit dan kabinet arcade, dipadukan dengan model serangga 3D yang sudah menjadi daya tarik game.  
**Target pemain:** Anak muda; game harus cepat dipahami, seru dimainkan, punya karakter visual kuat, dan mudah diingat.

> **Batas evaluasi:** Kritik ini dibuat dari tiga screenshot, bukan dari sesi bermain langsung, source code, atau pengujian pemain. Hal yang terlihat jelas dibedakan dari hipotesis yang perlu divalidasi saat game dimainkan.

---

## 1. Ringkasan Eksekutif

Insectron sudah mempunyai bahan dasar yang menarik: dunia bio-dome, 12 spesies insect, squad lima unit, formasi taktis, karakter “King”, dan kemampuan khas. Kombinasi makhluk yang eksentrik dengan pertarungan berbasis grid berpotensi menjadi identitas yang kuat dan mudah diingat.

Namun, pengalaman saat ini terasa lebih seperti **dashboard sci-fi yang ditempelkan ke arena 3D** daripada sebuah game dengan bahasa visual dan alur bermain yang utuh. Hampir setiap elemen memakai warna terang, glow, badge, outline, atau label kecil. Akibatnya, elemen penting tidak memiliki hierarki yang cukup jelas. Pemain perlu membaca banyak hal sebelum bisa menjawab tiga pertanyaan dasar:

1. **Apa yang harus saya lakukan sekarang?**
2. **Apa akibat dari pilihan saya?**
3. **Bagaimana saya tahu pilihan itu berhasil?**

Masalah ini paling terasa pada layar pemilihan squad yang padat, tombol dan label battle yang kecil, serta arena yang sebagian tertutup unit dan panel informasi. Layar awal juga menawarkan pilihan rank dan dua jenis tombol aksi, tetapi hubungan antara pilihan tersebut dan alur berikutnya belum cukup eksplisit.

### Arah solusi

- **Sederhanakan hierarki, bukan mengurangi karakter game.** Pertahankan spesies, kemampuan, rank, dan formasi; tampilkan informasi bertahap sesuai kebutuhan.
- **Gunakan satu bahasa visual.** Ganti neon cyan–magenta–lime yang mendominasi dengan palet retro terbatas, border tegas, panel berlapis, dan aksen pixel yang konsisten.
- **Jadikan tindakan berikutnya jelas.** Setiap layar perlu satu aksi utama dan status yang dapat dipahami tanpa menebak.
- **Buat keputusan taktis terlihat.** Pemain harus dapat melihat unit terpilih, target yang bisa diserang, jarak, biaya aksi, serta perkiraan hasil sebelum melakukan aksi.
- **Biarkan arena dan serangga menjadi bintang.** UI harus membantu membaca permainan, bukan bersaing dengan model 3D.

**Prinsip kunci:** *Readable first, playful second, decorative third.* Visual ikonik tidak berasal dari jumlah efek, tetapi dari bentuk, warna, tipografi, gerakan, dan pola interaksi yang konsisten.

---

## 2. Apa yang Sudah Bekerja

### 2.1 Konsep game memiliki hook yang mudah diingat

“Squad serangga neo-beast dengan King dan signature move” cukup berbeda untuk membangun daya tarik. Nama seperti Rock ’N’ Roller, Big Ass Bug, dan Agamel memiliki karakter serta potensi menjadi identitas yang khas.

**Pertahankan:** nama, siluet spesies, crown/King mechanic, gerakan khas, dan arena grid 3D. Semua ini dapat menjadi fondasi brand yang jauh lebih kuat daripada sekadar efek neon.

### 2.2 Pemisahan pemain dan lawan sudah mulai terbentuk

Layar battle menempatkan Jaster di satu sisi dan Jin Red di sisi lain. Warna tim, indikator unit, health bar, serta status giliran telah berusaha memberikan orientasi.

**Yang perlu ditingkatkan:** konsistensi dan penghematan warna. Identitas tim harus terbaca dengan cepat, tanpa setiap elemen UI memiliki warna aksennya sendiri.

### 2.3 Layar squad sudah menyediakan informasi penting

Pemain bisa melihat lima slot squad, formasi, daftar spesies, statistik, dan skill. Ini adalah informasi yang benar untuk sebuah permainan taktis.

**Yang perlu ditingkatkan:** urutan membaca dan jumlah informasi pada satu waktu. Informasi benar yang disajikan sekaligus tetap dapat menjadi UX yang buruk jika pemain tidak tahu mana yang paling penting.

### 2.4 Arena 3D memberi kesan permainan yang nyata

Sudut kamera dan model serangga memberi kesan arena yang memiliki kedalaman, bukan sekadar board game datar. Karena itu, redesign tidak perlu mengubah seluruh game menjadi pixel art.

**Rekomendasi:** pertahankan model 3D; pindahkan karakter retro terutama ke UI, frame, ikon, typography, transisi, sound cue, dan beberapa detail lingkungan. Dengan begitu, game memiliki kontras khas: *retro arcade interface + 3D bio-dome creatures*.

---

## 3. Diagnosis Utama Berbasis First Principles

### 3.1 Terlalu banyak hal meminta perhatian pada saat yang sama

Di ketiga layar, warna neon, glow, outline, badge rank, angka kecil, frame, dan panel tampil dalam intensitas tinggi. Mata tidak memiliki satu jalur perhatian yang konsisten. Pada layar selection, nama spesies, rank, HP, ATK, KB, skill, slot assignment, tier, dan status King bersaing di dalam kartu yang sama.

**Mengapa ini menjadi masalah:** perhatian pemain adalah sumber daya terbatas. Jika semua hal terlihat penting, pemain harus menghabiskan energi untuk menentukan prioritas sebelum dapat menikmati permainan.

**Solusi:**

- Batasi **satu warna aksi utama**, satu warna tim pemain, dan satu warna lawan dalam satu layar.
- Gunakan ukuran, posisi, ruang kosong, kontras, dan bentuk untuk membedakan prioritas — bukan warna terang pada semua elemen.
- Jadikan angka atau status yang diperlukan untuk keputusan saat ini paling menonjol. Statistik sekunder dipindahkan ke detail panel atau tooltip.
- Kurangi glow dekoratif. Simpan efek terang untuk status yang benar-benar penting: unit terpilih, tile yang bisa ditarget, damage besar, King, atau perubahan giliran.

### 3.2 Alur tindakan belum cukup eksplisit

Layar awal menampilkan pemilihan rank, tombol “Select Insects & Formation”, dan “Quick Battle (Turn 1)”. Layar selection kembali menampilkan pilihan rank. Dari screenshot saja, belum jelas apakah rank dipilih sekali, dapat berubah, atau memengaruhi setup dengan cara tertentu.

Di layar battle, terdapat “ATTACK (0)”, “CRUSHING HORN (3)”, “END TURN”, dan “CHANGE INSECTS”. Pemain harus menginterpretasikan angka dalam tanda kurung serta alasan tombol Attack terlihat tidak aktif.

**Solusi:**

- Buat satu *source of truth* untuk rank. Jika rank dipilih di menu awal, layar squad hanya menampilkan ringkasan dan opsi **Change** yang jelas. Jangan menampilkan dua kontrol yang tampak independen untuk pilihan yang sama.
- Beri nama yang menjelaskan konsekuensi, bukan hanya gaya. Contoh: **Build Squad** dan **Quick Battle — Use Recommended Squad**.
- Tampilkan urutan giliran: **Select Unit → Choose Action → Select Target/Tile → Resolve**. Sesuaikan urutannya dengan mekanik yang benar-benar dipakai game.
- Jangan hanya menonaktifkan tombol. Tampilkan alasan seperti **“0 AP — no action points left”** jika Attack memang memakai AP, atau label biaya yang relevan dengan sistem game.
- Bedakan *disabled*, *available*, *selected*, dan *ready to confirm* dengan bentuk serta label, bukan warna saja.

### 3.3 Keterbacaan harus menang atas kepadatan informasi

Teks metadata, label tier, tombol, dan angka pada screenshot relatif kecil. Beberapa kartu di bagian bawah layar selection terpotong oleh footer tetap. Pada battle, panel HP bawah menutupi sebagian area arena dan teks pesan awal tampak terpotong.

**Solusi:**

- Jangan biarkan konten bergulir di belakang footer tanpa ruang aman. Tambahkan *bottom padding* setinggi footer atau pindahkan footer ke layout yang tidak menutupi konten.
- Gunakan ukuran teks yang nyaman: isi dan kontrol utama sekitar **14–16 px atau lebih** pada tampilan desktop 1280 × 800; label sekunder idealnya tetap terbaca dan tidak bergantung pada font sangat tipis. Angka ini adalah target awal untuk diuji, bukan aturan mutlak.
- Hindari font display pixel untuk paragraf, deskripsi, atau instruksi panjang. Font retro boleh menjadi aksen; font isi harus terbaca pada ukuran kecil.
- Sediakan kontras yang memadai untuk teks biasa, teks nonaktif, dan indikator status.
- Pastikan pesan battle tidak berhenti di tengah kalimat. Tampilkan ringkasan satu baris dengan opsi membuka combat log penuh.

### 3.4 UI belum memiliki satu identitas retro yang khas

Neon cyan, magenta, lime, glow lembut, panel sci-fi, dan typography futuristik saat ini mengarah ke cyberpunk modern. Itu bukan salah secara estetika, tetapi bertentangan dengan arah baru yang diinginkan dan membuat layar terasa generik karena banyak produk sci-fi memakai bahasa serupa.

**Solusi:** bangun identitas **Neo-16 Arcade**: panel solid, outline tegas, sudut bertingkat/pixel, bayangan keras pendek, angka skor yang ekspresif, ikon sederhana, animasi pendek yang responsif, dan palet terbatas. Jangan menambahkan scanline atau noise secara berlebihan sampai mengganggu teks.

---

## 4. Kritik dan Solusi per Layar

## 4.1 Main Menu / layar awal

### Masalah yang terlihat

1. **Hero dan logo kuat, tetapi teks berada di atas visual arena yang sibuk.** Objek 3D dan detail grid di belakang copy meningkatkan noise. Lapisan gelap membantu, tetapi belum membuat semua informasi terasa tenang.
2. **Pilihan rank muncul sebelum pemain diberi konteks yang cukup.** Nama rank seperti Rank B, Rank A, Rank S dan nama lawan terlihat penting, tetapi konsekuensi praktis pilihannya tidak langsung jelas.
3. **Dua tombol sama-sama menonjol.** Tombol utama berwarna kuning dan tombol Quick Battle berwarna cyan. Pemain baru harus menafsirkan apakah Quick Battle melewati squad selection, memakai squad default, atau memulai dari giliran tertentu.
4. **Tombol rank pada menu awal muncul lagi di layar selection.** Duplikasi ini berpotensi membuat pemain bertanya apakah pilihannya tersimpan.
5. **Identitas visual memakai neon yang sangat kuat, sementara deskripsi menggunakan gaya yang lebih biasa.** Hubungan antara logo, font, tombol, dan dunia game belum menjadi satu sistem.

### Solusi yang disarankan

- Buat area hero kiri lebih tenang dengan panel opaque atau lapisan warna solid. Biarkan 3D arena tetap terlihat di sisi kanan sebagai *key art*, bukan di belakang seluruh paragraf.
- Tampilkan judul, satu kalimat hook, lalu satu aksi utama.
- Ubah CTA utama menjadi **BUILD YOUR SQUAD** atau **PLAY**. Jika memilih **PLAY**, tampilkan pilihan Build Squad / Quick Battle sebagai langkah berikutnya.
- Jadikan Quick Battle aksi sekunder yang menjelaskan perilakunya: **Quick Battle — Use Recommended Squad** jika benar menggunakan squad rekomendasi.
- Pindahkan pilihan rank ke satu tempat saja, atau tampilkan ringkasan pilihan di layar berikutnya dengan tombol **Change Rank** yang membuka kontrol yang sama.
- Tambahkan satu baris bantuan di bawah rank, misalnya menjelaskan bahwa rank mengubah lawan/tantangan — hanya jika itulah mekanik sebenarnya. Jika perbedaannya belum dirancang, desain penjelasan setelah aturan rank ditetapkan.
- Sisakan ikon pengaturan, audio, dan panduan sebagai elemen sekunder, bukan pesaing CTA utama.

### Hierarki yang disarankan

1. Logo INSECTRON.
2. Hook singkat yang menjelaskan fantasi bermain.
3. Tombol utama: **BUILD YOUR SQUAD**.
4. Aksi sekunder: **QUICK BATTLE**.
5. Pilihan rank, panduan, audio, pengaturan.

**Contoh copy yang lebih langsung:**

> **BUILD A BUG SQUAD. OWN THE DOME.**  
> Pick five Neo-Beasts, set your formation, and outsmart the rival King.

Copy ini hanya contoh arah; gunakan Bahasa Indonesia jika seluruh pengalaman ditujukan untuk pemain Indonesia. Yang terpenting, pakai satu bahasa secara konsisten atau tetapkan pilihan bilingual dengan jelas.

---

## 4.2 Squad Selection dan Bio-Dome Formation

Layar ini adalah area yang paling perlu disederhanakan. Fungsinya penting, tetapi banyak keputusan dan informasi muncul sekaligus sebelum pemain memahami struktur layarnya.

### Masalah yang terlihat

1. **Dua area besar sama-sama padat.** Panel squad/formasi di kiri, serta rank dan katalog spesies di kanan, ditambah panel detail dan footer di bawah.
2. **Katalog berpotensi terpotong.** Baris kartu terakhir berada di belakang atau terlalu dekat dengan footer. Ini memberi kesan layout belum selesai dan membuat informasi sulit diakses.
3. **Kartu spesies menampilkan terlalu banyak metadata.** HP, ATK, KB, rank, ability, slot, dan label tier bersaing dengan nama karakter.
4. **Istilah dan kode membutuhkan interpretasi.** Contoh: C1, B2, Row 4/5, KB, A-RANK, S-RANK, “Holographic Foil”. Untuk pemain baru, kode tersebut menjadi beban tambahan jika tidak diperkenalkan.
5. **Aturan King belum sepenuhnya terbaca secara visual.** Label “1 Crowned King Required” tampak penting, tetapi hubungan antara syarat itu, ikon crown, slot #1, dan spesies yang dapat mengisi slot perlu dibuat eksplisit.
6. **Keterangan baris depan/belakang terlalu kecil dan berupa teks tambahan.** Pemain perlu mencocokkan “Row 4 = Front · Row 5 = Back” dengan koordinat grid, tetapi pemetaan tersebut tidak terlihat secara intuitif.
7. **Status kartu dan slot dapat membingungkan.** Instruksi meminta klik kartu untuk mengisi slot #1, sementara sejumlah kartu sudah menampilkan “SLOT #2”, “SLOT #5”, dan seterusnya. Jelaskan apakah kartu sudah ditempatkan, apakah klik akan memindahkannya, dan apa yang terjadi jika slot diisi ulang.
8. **Panel detail spesies memakai ruang besar, tetapi tidak semua informasinya sama pentingnya pada setiap pilihan.** Deskripsi, max HP, attack, defense, signature move, dan charges terlihat bersamaan.
9. **Tindakan utama baru muncul di footer.** Pemain perlu memahami banyak hal sebelum melihat langkah akhir; footer menutupi ruang yang dibutuhkan katalog.

### Solusi: ubah layar menjadi tiga langkah yang terbaca

**Langkah 1 — Pilih slot.**  
Slot squad menjadi kontrol awal yang paling jelas. Slot terpilih harus terlihat dengan outline tegas, nomor besar, dan label status. Jika aturan mewajibkan King, tandai slot khusus dengan ikon crown serta tooltip/pesan “Slot ini harus diisi King”.

**Langkah 2 — Pilih atau ganti spesies.**  
Klik kartu spesies untuk memasukkannya ke slot terpilih. Gunakan tiga status yang berbeda:

- **Available:** bisa dipilih.
- **Assigned:** sudah berada di slot lain; klik akan memindahkan atau membuka konfirmasi sesuai aturan game.
- **Selected:** kandidat yang sedang dipilih untuk slot aktif.

Tampilkan status dengan kombinasi teks, ikon, dan border. Jangan mengandalkan warna saja.

**Langkah 3 — Atur formasi lalu Battle.**  
Grid menggunakan label yang lebih manusiawi: **FRONT** dan **BACK** di sisi baris, lalu kolom A–E jika koordinat memang penting. Jika kode koordinat hanya dipakai internal, jangan menjadikannya informasi utama bagi pemain.

### Susunan layout yang disarankan

- **Header:** judul “Build Your Squad”, indikator progress `SQUAD 3/5`, ringkasan rank, dan tombol Back.
- **Kolom kiri (~38–42%):** lima slot squad di bagian atas; grid formasi tepat di bawahnya; panel detail unit terpilih di area bawah yang dapat diperkecil.
- **Kolom kanan (~58–62%):** katalog spesies dengan filter ringkas, kemudian grid kartu. Kartu katalog menjadi area scroll tersendiri.
- **Footer tetap:** ringkasan kelengkapan squad dan tombol utama **BATTLE**. Pastikan konten katalog memiliki jarak bawah yang cukup sehingga tidak pernah tertutup footer.

Proporsi ini adalah titik awal untuk desktop 1280 px, bukan angka sakral. Uji ulang pada resolusi yang digunakan pemain sebenarnya.

### Hierarki kartu spesies

**Informasi yang terlihat langsung:**

1. Siluet/ilustrasi spesies.
2. Nama.
3. HP.
4. Peran atau satu atribut yang paling membantu keputusan.
5. Signature move singkat.
6. Status slot/tier sebagai metadata kecil.

**Informasi yang dipindah ke panel detail atau tooltip:**

- Statistik sekunder yang tidak dibutuhkan untuk keputusan cepat.
- Deskripsi lore yang panjang.
- Penjelasan istilah seperti KB jika artinya tidak universal.
- Rincian efek skill dan jumlah charge, kecuali saat skill itulah yang sedang dievaluasi.

Jika “KB” berarti knockback, tulis “Knockback” pada panel detail dan gunakan ikon konsisten setelah pemain mempelajari artinya. Jangan berharap pemain baru mengerti singkatan tersebut secara otomatis.

### Detail King dan syarat squad

- Buat slot King berbeda bentuk, bukan hanya warna kuning.
- Ketika slot King kosong, tampilkan instruksi eksplisit: **“Choose 1 King to unlock Battle.”**
- Bila unit King sudah dipilih, tampilkan ikon crown pada slot dan kartu yang bersangkutan.
- Tombol Battle harus memiliki state yang jelas: **Not Ready** dengan alasan spesifik, atau **Ready to Battle**.
- Saat squad lengkap, beri feedback pendek dan menyenangkan — misalnya animasi slot terkunci menjadi aktif atau bunyi konfirmasi singkat. Hindari ledakan partikel yang memperlambat interaksi.

### Filter: cukup ringan

Dengan 12 spesies, katalog tidak selalu memerlukan search bar besar. Coba filter sederhana seperti **All**, **Assigned**, dan **Available**, atau filter per role jika role memang membantu. Jangan menambahkan filter hanya agar UI terlihat lengkap.

---

## 4.3 Battle Arena

Battle adalah layar yang paling menentukan apakah game terasa menyenangkan. Pemain perlu mengerti keadaan arena dan konsekuensi tindakan secara cepat, lalu mendapatkan feedback yang memuaskan.

### Masalah yang terlihat

1. **Unit 3D bertumpuk secara visual.** Beberapa model, ring, partikel, label, dan indikator berada dekat satu sama lain. Pada sudut kamera ini, siluet serta tile yang ditempati beberapa unit sulit dipisahkan.
2. **Grid belum menjadi alat taktis yang cukup kuat.** Tile terlihat, tetapi status tile aktif, tile yang bisa dijangkau, tile target, dan tile yang tidak valid belum memiliki perbedaan yang sangat tegas.
3. **Indikator di atas unit berpotensi menumpuk.** Titik/status kecil, health bar, ikon, serta ring tim berada di area yang sama.
4. **Area bawah layar terlalu berat.** Dua panel HP besar mengambil ruang besar, sementara tombol aksi dan pesan awal juga diletakkan dekat bagian bawah. Akibatnya arena yang seharusnya menjadi pusat permainan ikut tertutup.
5. **Alur aksi tidak eksplisit.** “ATTACK (0)” dan “CRUSHING HORN (3)” tidak menjelaskan dengan sendirinya apakah angka berarti AP, charge, jumlah target, atau hal lain. Tombol Attack yang tampak nonaktif berisiko membuat pemain mengira game rusak.
6. **Identitas unit terpilih kurang dominan dibanding semua indikator lain.** Pemain harus segera tahu unit mana yang sedang dikendalikan, bukan menebak dari panel bawah saja.
7. **Turn indicator dan lima titik di dekat nama pemain tidak memiliki penjelasan yang cukup.** Pemain baru mungkin belum tahu apakah titik adalah jumlah unit, nyawa, action slots, atau urutan unit.
8. **Pesan “Match Start” berada di atas arena dan terlihat terpotong.** Pesan awal penting, tetapi tidak seharusnya mengganggu kontrol atau menutup konteks.
9. **Kontrol audio, pause, mode tactical, End Turn, dan Change Insects tidak berada dalam sistem prioritas yang sepenuhnya jelas.** Kontrol berbeda kepentingan tampak berdekatan dan sebagian labelnya kecil.

### Solusi: susun battle berdasarkan keputusan pemain

Setiap interaksi harus menjawab pertanyaan ini secara berurutan:

1. **Unit mana yang aktif?**
2. **Tindakan apa yang bisa dilakukan sekarang?**
3. **Target atau tile mana yang valid?**
4. **Apa yang akan terjadi jika tindakan dilakukan?**
5. **Bagaimana game mengonfirmasi hasilnya?**

Implementasi yang disarankan:

- Unit terpilih mendapat outline/ring yang paling tegas, penanda pilihan yang jelas, dan panel status ringkas.
- Saat pemain memilih action, sorot tile atau target yang valid. Redupkan tile yang tidak relevan, tetapi jangan menghilangkan informasi posisi sepenuhnya.
- Saat hover/fokus pada target, tampilkan preview yang berguna: efek, estimasi damage atau knockback jika dapat dihitung, biaya resource, dan kemungkinan hasil. Jangan menjanjikan angka yang belum pasti jika sistem pertarungan memiliki variasi/randomness.
- Setelah aksi, berikan feedback cepat: animasi serangan yang terbaca, reaksi target, perubahan HP, dan teks singkat seperti “KNOCKBACK!” bila sesuai. Feedback harus jelas sebelum dekoratif.
- Ketika giliran berganti, gunakan transisi singkat dan konsisten: indikator giliran berpindah, warna tim berpindah, dan satu cue audio yang bisa dimatikan.

### Layout battle yang direkomendasikan

**Atas:**
- Ringkasan pemain dan lawan, identitas tim, status turn, serta urutan unit jika urutan inisiatif adalah bagian dari gameplay.
- Gunakan ikon/portrait unit yang cukup besar. Jika lima titik memang mewakili lima unit, beri state yang jelas: alive, selected, exhausted, knocked out, atau status relevan lainnya.

**Tengah:**
- Arena mengambil ruang terbesar.
- Kurangi ukuran HUD yang menutupi arena; sesuaikan kamera agar unit tidak terlalu menumpuk.
- Pertimbangkan sedikit zoom-out atau sudut kamera lebih tinggi jika itu meningkatkan keterbacaan grid.
- Ring unit, bayangan kontak, dan batas tile harus membantu memisahkan unit, bukan menjadi tiga lapisan visual yang saling bertabrakan.

**Bawah kiri:**
- Panel unit pemain yang dipilih: nama, HP, dan resource/status yang relevan.
- Jangan tampilkan semua statistik permanen jika tidak membantu keputusan saat itu.

**Bawah kanan atau dock aksi:**
- Action yang tersedia untuk unit aktif, dengan label dan biaya yang jelas.
- **End Turn** tetap mudah dijangkau tetapi bukan tombol paling mencolok ketika pemain masih punya aksi masuk akal.
- **Change Insects** diletakkan sebagai kontrol sekunder dan diberi keterangan tentang kapan perubahan itu legal.

**Combat log:**
- Ubah pesan awal menjadi toast singkat yang hilang otomatis, atau panel log yang dapat dibuka. Pesan panjang tidak boleh terpotong di atas arena.

### Contoh urutan panel aksi

Jangan memaksakan istilah berikut jika tidak sesuai mekanik yang ada, tetapi gunakan prinsip hierarki yang sama:

1. **ATTACK** — aksi dasar, status biaya jelas.
2. **SIGNATURE MOVE — Crushing Horn · 3 Charges** — kemampuan khusus beserta resource-nya.
3. **END TURN** — aksi akhir giliran dengan visual berbeda dan, bila perlu, konfirmasi jika masih ada aksi penting yang belum digunakan.

Jika unit memang tidak dapat menyerang karena tidak memiliki AP, tuliskan alasannya. Jika “0” berarti jumlah serangan yang tersedia, ganti label agar tidak ambigu. **Angka tanpa unit atau konteks bukan informasi yang lengkap.**

### Kurangi tumpukan indikator di atas unit

Gunakan aturan tampilan bertingkat:

- **Default:** siluet, ring tim, dan health bar yang mudah dibaca.
- **Saat unit dipilih:** tampilkan nama, detail, resource, dan indikator tambahan.
- **Saat memilih target:** tampilkan hanya indikator yang membantu membandingkan target.
- **Saat ada status khusus:** tampilkan ikon status dengan tooltip/penjelasan.

Hindari menaruh semua indikator di atas semua unit sepanjang waktu. Pilihan yang lebih selektif akan membuat momen penting lebih menonjol.

---

## 5. Sistem Visual Baru: Retro Arcade / Neo-16

Tujuannya bukan membuat semua elemen tampak tua, melainkan meminjam **ketegasan bentuk, batas warna, dan kejelasan feedback** dari game arcade klasik. UI menjadi retro; 3D creature tetap modern dan ekspresif.

## 5.1 Palet warna yang direkomendasikan

Gunakan warna secara semantik. Warna tidak boleh dipilih hanya karena terlihat keren; setiap warna perlu memiliki fungsi yang stabil.

| Token | Hex | Fungsi |
|---|---|---|
| Ink / Background | `#171923` | Latar utama gelap, mengganti hitam kebiruan yang terlalu cyberpunk |
| Panel | `#252A38` | Panel utama dan navigasi |
| Panel Raised | `#34394A` | Kartu aktif, hover, dan permukaan yang terangkat |
| Cream Text | `#F4E8C8` | Teks utama dengan nuansa retro yang hangat |
| Muted Text | `#B7B7AD` | Metadata dan teks sekunder |
| Arcade Amber | `#FFB547` | CTA utama, highlight pilihan, crown/King |
| Player Mint | `#83D6B0` | Identitas pemain dan state ramah/tersedia |
| Rival Coral | `#EF7168` | Identitas lawan, bahaya, atau damage — sesuai semantik yang ditetapkan |
| Disabled | `#626879` | Kontrol nonaktif dan informasi yang tidak tersedia |

### Aturan pemakaian

- Dalam satu layar, **Amber** menjadi aksen aksi/selection utama; **Mint** membedakan pemain; **Coral** membedakan lawan. Tidak semua aksen harus digunakan di setiap panel.
- Jangan gunakan warna aksen untuk setiap label, badge, stat, dan border secara bersamaan.
- State terpilih memakai dua sinyal: misalnya amber border **dan** ikon/label `SELECTED`.
- Status bahaya tidak sama dengan warna tim lawan secara otomatis. Tetapkan aturan semantik agar warna tidak memiliki dua arti yang berpotensi bentrok.
- Teks penting harus tetap terbaca jika warna dilihat dalam kondisi kurang ideal. Tambahkan ikon, teks, bentuk border, atau pola untuk memperjelas status.
- Hindari glow cyan dan magenta sebagai efek default. Gunakan glow sangat tipis hanya untuk feedback singkat bila diperlukan.

## 5.2 Bentuk, border, dan komponen

**Gunakan:**

- Border tegas 1–2 px, panel solid, dan bayangan keras pendek.
- Sudut kotak atau sudut bertingkat ala pixel-art pada kartu, tombol, panel, dan badge.
- Ikon sederhana dengan siluet kuat dan ukuran konsisten.
- Pola pixel/grid hanya pada tepi panel, transisi, badge, atau latar yang tidak menampung teks penting.
- Animasi singkat dengan akselerasi yang jelas: tombol menekan, slot snap masuk, kartu berpindah, dan perubahan giliran.

**Hindari:**

- Glow besar pada setiap elemen.
- Gradient neon yang berbeda untuk tiap panel.
- Border cyan, magenta, lime, dan kuning bersamaan tanpa sistem fungsi.
- Scanline, noise, atau efek CRT yang membuat teks dan angka sulit dibaca.
- Pixel font untuk semua teks. Hasilnya dapat terasa melelahkan dan menurunkan keterbacaan.

## 5.3 Tipografi

- Pakai satu **display font** bergaya arcade untuk logo, judul layar, skor, dan angka tertentu.
- Pakai satu sans-serif yang sangat terbaca untuk deskripsi, aturan, kontrol, dan statistik.
- Pertahankan maksimal dua keluarga font utama, di luar kebutuhan logo.
- Batasi penggunaan huruf kapital penuh. Gunakan untuk label pendek seperti `PLAYER TURN`, bukan paragraf.
- Gunakan angka yang mudah dibedakan: HP, damage, charges, dan koordinat harus terbaca pada pandangan singkat.
- Jangan gunakan tracking/lebar huruf berlebihan pada label panjang karena membuat teks lebih sulit dipindai.

## 5.4 Motion dan sound sebagai tanda tangan

Game ikonik memiliki respons yang khas, bukan sekadar UI statis yang cantik.

- **Select:** kartu naik beberapa piksel atau snap, disertai bunyi pendek.
- **Assign slot:** unit masuk ke posisi dengan animasi cepat dan tegas.
- **King selected:** crown/icon menyala singkat, bukan terus-menerus ber-glow.
- **Hit:** jeda impact kecil, recoil yang jelas, damage number dengan animasi sederhana.
- **Turn switch:** panel giliran bergeser dengan bunyi khas yang konsisten.
- **Button press:** perubahan bentuk/offset yang membuat tombol terasa seperti tombol arcade fisik.

Jaga animasi antarmuka cepat dan dapat dilewati. Jangan mengorbankan kelancaran atau respons input demi efek visual. Sound harus memiliki kontrol volume/mute yang jelas.

---

## 6. Bangun Rasa “Iconic”, Bukan Sekadar “Retro”

Retro adalah bahasa visual; iconic adalah konsistensi yang membuat pemain mengenali game dari satu potongan layar.

### 6.1 Pilih satu motif visual milik Insectron

Motif yang berpotensi: **crown + tile grid + siluet insect**. Terapkan pada logo, selector King, bentuk frame kartu, ikon signature move, transisi giliran, dan layar kemenangan. Jangan menambahkan motif dekoratif lain sebelum tiga unsur ini konsisten.

### 6.2 Buat tiap spesies mudah dikenali tanpa membaca namanya

- Pertahankan siluet dan warna karakter 3D sebagai identitas utama.
- Gunakan thumbnail/portrait dengan sudut dan ukuran konsisten pada menu, squad, dan battle.
- Berikan satu ciri visual utama per spesies: bentuk tanduk, sayap, crown, antena, atau pose.
- Signature move sebaiknya memiliki ikon dan animasi khas yang konsisten antara kartu, preview, dan saat digunakan.

### 6.3 Gunakan microcopy yang punya suara konsisten

Nama dan istilah game boleh nakal atau lucu jika memang bagian dari brand. Namun, instruksi sistem harus jelas. Pisahkan **flavor text** dari **functional text**: nama skill boleh kreatif; aturan biaya dan konsekuensi harus lugas.

Contoh:
- Flavor: `ROLLING THUNDER`.
- Fungsi: `Knocks enemies back along a straight line`.
- Biaya: `3 Charges`.

Pemain seharusnya tidak perlu menebak fungsi skill dari nama yang keren.

### 6.4 Buat hasil aksi terasa memuaskan

Untuk game taktis, rasa seru sering datang dari hubungan sebab-akibat yang jelas: pemain membuat pilihan, melihat hasil, lalu belajar untuk giliran berikutnya. Pastikan animasi serangan tidak terlalu lama; tampilkan hasil damage/knockback secara jelas; dan buat kemenangan/kegagalan menyampaikan alasan hasilnya.

---

## 7. Sederhanakan Gameplay yang Terasa Rumit Melalui UX

Dokumen ini tidak mengusulkan mengganti seluruh combat rules tanpa playtest. Namun, UI perlu mendukung loop yang sederhana dan bisa dipahami pemain baru.

### Loop dasar yang disarankan

1. **Read:** lihat unit aktif, posisi, HP, dan ancaman utama.
2. **Choose:** pilih satu aksi yang bermakna.
3. **Preview:** lihat target/tile yang valid serta biaya dan dampak yang diperkirakan.
4. **Commit:** lakukan aksi dengan satu konfirmasi yang jelas bila aksinya sulit dibatalkan.
5. **Feel:** dapatkan feedback animasi, damage, dan perubahan posisi yang langsung terbaca.
6. **Plan:** pahami situasi baru dan lanjutkan giliran.

### Tutorial yang tidak membebani

- Pada battle pertama, berikan satu petunjuk pada satu waktu.
- Sorot unit yang perlu dipilih; jangan menampilkan seluruh tutorial sekaligus.
- Setelah satu tindakan berhasil, jelaskan langkah berikutnya.
- Sediakan **How to Play** yang dapat dibuka lagi, bukan tutorial panjang yang memaksa pemain membaca sebelum bermain.
- Tampilkan istilah dan singkatan saat pertama kali relevan. Setelah dipahami, pemain dapat memilih tampilan yang lebih ringkas.

### Jangan menambah kompleksitas UI untuk menutupi aturan yang belum jelas

Jika pemain tidak paham fungsi `ATTACK (0)`, masalahnya mungkin label, tetapi mungkin pula sistem biaya aksinya belum mudah dijelaskan. Validasi dulu apakah pemain dapat menjawab: *apa yang saya punya, apa yang bisa saya gunakan, dan kenapa saya tidak bisa melakukan aksi ini?* Jika jawabannya sulit, aturan atau presentasinya perlu diperbaiki sebelum menambah visual.

---

## 8. Aksesibilitas dan Responsivitas

Walaupun target utama anak muda, jangan mengasumsikan semua pemain memiliki penglihatan warna sempurna, layar besar, atau pengalaman genre taktis.

### Aksesibilitas

- Jangan bedakan pemain dan lawan dengan warna saja; gunakan posisi, simbol, outline, dan label.
- Buat state fokus keyboard terlihat jelas jika game mendukung keyboard.
- Pastikan tombol penting memiliki area klik yang nyaman.
- Teks disabled harus tetap terbaca untuk menjelaskan status, bukan menjadi hampir tak terlihat.
- Beri opsi mematikan screen shake, efek partikel berat, serta audio.
- Jangan mengandalkan efek berkedip cepat sebagai satu-satunya feedback.

### Responsivitas

- Uji layout pada resolusi target nyata, bukan hanya satu screenshot 1280 × 800.
- Pastikan katalog kartu dapat discroll tanpa disembunyikan footer.
- Pada layar lebih sempit, prioritaskan slot/formasi dan kartu spesies; pindahkan detail ke panel/modal yang dapat ditutup.
- Pada battle, pertahankan arena sebagai ruang terbesar dan pindahkan detail sekunder ke panel collapsible.
- Ukuran font, jarak, dan area klik perlu disesuaikan dengan perangkat input. Jika game hanya ditargetkan untuk desktop, nyatakan target tersebut dan jangan menyebut desain sebagai responsif sebelum diuji.

---

## 9. Prioritas Implementasi

Tidak semua masalah perlu diperbaiki sekaligus. Urutkan berdasarkan dampaknya terhadap pemahaman dan kemampuan pemain menyelesaikan tugas.

### P0 — Perbaiki sebelum polishing visual

| Masalah | Solusi | Kriteria selesai |
|---|---|---|
| Pemain tidak tahu langkah utama di menu | Satu CTA primer; jelaskan Quick Battle | Pemain baru dapat menjelaskan perbedaan Build Squad dan Quick Battle tanpa bantuan |
| Rank muncul pada dua layar dengan status tidak jelas | Satukan state rank; layar berikutnya hanya menampilkan ringkasan/edit | Pilihan rank selalu konsisten di semua layar |
| Katalog tertutup footer | Perbaiki batas scroll dan padding | Semua kartu bisa dibuka dan dibaca pada resolusi target |
| Aturan slot King kurang eksplisit | Slot King khusus + instruksi + status ready | Pemain mengerti syarat King dan alasan tombol Battle aktif/nonaktif |
| Tombol battle tidak jelas atau disabled tanpa alasan | Label biaya/resource + alasan disabled | Pemain bisa menjelaskan kenapa action tidak tersedia |
| Target/tile valid sulit dibedakan | Highlight target dan tile yang valid secara tegas | Pemain baru dapat memilih target valid tanpa trial-and-error berulang |
| Pesan/status terpotong | Toast satu baris + combat log | Tidak ada pesan penting yang terpotong di viewport target |

### P1 — Redesign struktur dan identitas

| Masalah | Solusi | Kriteria selesai |
|---|---|---|
| Semua aksen visual bersaing | Terapkan sistem palet Neo-16 dan token warna | Tiap warna memiliki fungsi; tidak ada neon dekoratif acak |
| Kartu spesies terlalu padat | Pisahkan informasi utama dan detail | Nama, HP, role/atribut utama, dan status assignment dapat dipindai cepat |
| Formasi sulit dimengerti | Label FRONT/BACK, kolom A–E, feedback penempatan | Pemain paham posisi unit tanpa membaca penjelasan panjang |
| Unit saling menutupi | Uji ulang kamera, skala model, ring, label, dan tile | Unit terpilih dan tile yang ditempati mudah dibedakan pada gameplay normal |
| Panel HP menutupi arena | Ringkas HUD dan buat detail selektif | Arena tetap menjadi fokus utama; aksi penting tidak terhalang |
| Gaya komponen tidak konsisten | Bangun design system | Tombol, kartu, badge, modal, dan status memakai aturan visual yang sama |

### P2 — Polish dan memorable moments

- Animasi transisi yang pendek dan khas.
- Ikon signature move yang konsisten.
- Victory/defeat screen yang memberi feedback dan CTA jelas.
- Microcopy yang lucu tetapi tetap informatif.
- Sound cue untuk selection, hit, turn change, dan victory.
- Opsi efek visual, mute, dan tutorial ulang.

---

## 10. Rencana Validasi dengan Pemain

Jangan menganggap redesign berhasil hanya karena terlihat lebih menarik. Uji apakah pemain mengerti game dengan lebih cepat dan lebih menikmati keputusan yang dibuat.

### Tes 1 — Menu awal

Minta pemain yang belum pernah melihat game untuk mulai bermain tanpa instruksi lisan.

Amati:
- Apakah mereka memilih tindakan yang benar?
- Apakah mereka memahami efek pilihan Quick Battle?
- Apakah mereka tahu rank yang dipilih dan apa pengaruhnya?

### Tes 2 — Squad setup

Berikan tugas: isi lima slot, pilih King yang diwajibkan, lalu atur formasi depan/belakang.

Amati:
- Berapa kali pemain mengganti pilihan karena tidak mengerti status assigned?
- Apakah mereka mengerti slot mana yang sedang dipilih?
- Apakah mereka menemukan semua spesies tanpa kesulitan scroll?
- Apakah mereka bisa menjelaskan perbedaan stat/skill yang digunakan untuk memilih?

### Tes 3 — Turn pertama

Jangan menjelaskan kontrol terlebih dahulu. Amati apakah pemain bisa memilih unit, memilih aksi, menargetkan musuh, membaca hasil, dan melanjutkan giliran.

Amati:
- Berapa lama sampai aksi pertama berhasil dilakukan?
- Berapa kali pemain menekan tombol yang disabled atau salah memilih target?
- Apakah mereka memahami angka biaya dan charge?
- Setelah aksi, apakah mereka mengerti apa yang berubah di arena?

### Tes 4 — Daya ingat visual

Setelah sesi singkat, minta pemain menyebutkan atau menggambar kembali ciri visual yang paling mereka ingat. Jika yang diingat hanya “warna neon”, identitas belum khas. Jika mereka mengingat crown, bentuk tile, siluet insect, tombol arcade, atau efek signature move, sistem visual mulai punya aset khas.

### Indikator keberhasilan awal

Gunakan target awal berikut sebagai hipotesis pengujian, bukan standar industri universal:

- Mayoritas pemain baru menyelesaikan tugas utama tanpa bantuan verbal.
- Pemain memahami status slot, target valid, dan biaya aksi tanpa menebak berulang kali.
- Tidak ada kartu atau teks penting yang tersembunyi pada resolusi target.
- Pemain dapat menjelaskan kembali urutan aksi dasar setelah satu atau dua giliran.
- Waktu menuju tindakan bermakna berkurang tanpa membuat keputusan terasa otomatis atau membosankan.
- Setelah bermain, pemain dapat mengingat sedikitnya satu elemen visual atau feedback khas Insectron.

---

## 11. Contoh Arah UI yang Lebih Bersih

### Main menu

```text
┌──────────────────────────────────────────────────────────────┐
│  INSECTRON                         HOW TO PLAY   SETTINGS     │
│                                                              │
│  BUILD A BUG SQUAD.            [ 3D BIO-DOME ARENA ]          │
│  OWN THE DOME.                 [ siluet creature sebagai     │
│                                key art, bukan latar teks ]   │
│  Pick five Neo-Beasts and                                     │
│  outsmart the rival King.                                     │
│                                                              │
│  [ BUILD YOUR SQUAD  ▶ ]     QUICK BATTLE                    │
│                                                              │
│  CHALLENGE: RANK A  ·  JIN RED  ·  CHANGE                    │
└──────────────────────────────────────────────────────────────┘
```

### Squad selection

```text
┌──────────────────────────────────────────────────────────────┐
│ BUILD YOUR SQUAD      3 / 5 READY       RANK A: JIN RED       │
├─────────────────────┬────────────────────────────────────────┤
│ YOUR SQUAD          │ CHOOSE A NEO-BEAST                     │
│ [1 KING] [2] [3]    │ [ALL] [AVAILABLE] [ASSIGNED]           │
│ [4]      [5]        │                                        │
│                     │ [BUG CARD] [BUG CARD] [BUG CARD]        │
│ FORMATION           │ [BUG CARD] [BUG CARD] [BUG CARD]        │
│ BACK   A B C D E    │ [BUG CARD] [BUG CARD] [BUG CARD]        │
│ FRONT  A B C D E    │                                        │
│                     │ Selected details appear in a compact   │
│ Selected unit       │ panel or expandable area.              │
├─────────────────────┴────────────────────────────────────────┤
│ Squad status: King selected · 4/5 slots filled  [ BATTLE ▶ ] │
└──────────────────────────────────────────────────────────────┘
```

### Battle

```text
┌──────────────────────────────────────────────────────────────┐
│ JASTER · 5 UNITS           TURN 1           JIN RED · 5 UNITS │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    3D BIO-DOME GRID                          │
│      Selected unit / valid tiles / target preview            │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ BIG ASS BUG · 511 HP       [ ATTACK ] [ CRUSHING HORN · 3 ]  │
│                           [ END TURN ]                       │
└──────────────────────────────────────────────────────────────┘
```

Wireframe ini hanya menunjukkan hierarki, bukan desain final dan bukan spesifikasi mekanik. Layout akhir tetap perlu mengikuti kontrol, kamera, dan aturan combat yang sebenarnya.

---

## 12. Keputusan Desain yang Saya Rekomendasikan

Jika hanya ada waktu untuk beberapa perubahan, saya akan mengambil keputusan berikut secara berurutan:

1. **Tetapkan visual direction Neo-16.** Gunakan ink, cream, amber, mint, dan coral; hilangkan glow neon sebagai dekorasi default.
2. **Selesaikan UX flow menu → squad → battle.** Satu CTA primer, rank punya satu sumber state, Quick Battle menjelaskan apa yang dilewati.
3. **Rombak layar squad agar tidak menutupi konten.** Slot King, status assigned, grid Front/Back, katalog yang bisa discroll, dan footer yang tidak overlap.
4. **Perjelas loop battle.** Unit aktif → aksi tersedia → target/tile valid → preview → feedback hasil.
5. **Kurangi HUD yang permanen.** Tampilkan detail ketika relevan; biarkan arena tetap menjadi pusat perhatian.
6. **Tambahkan signature motion dan sound sesudah struktur terbukti jelas.** Efek khas harus memperkuat aksi, bukan menutupi informasi.
7. **Uji dengan pemain baru sebelum menambah fitur.** Prioritaskan pemahaman, respons, dan rasa puas setelah aksi.

## Kesimpulan

Insectron tidak memerlukan lebih banyak elemen UI; game ini memerlukan **lebih sedikit kompetisi visual dan lebih banyak kejelasan tindakan**. Kekuatan utamanya adalah spesies yang unik, King, formasi, arena 3D, dan kemampuan yang memberi konsekuensi taktis. Semua itu perlu lebih menonjol daripada badge, glow, kode kecil, dan panel status.

Arah retro yang paling masuk akal adalah **Neo-16 Arcade**: bentuk UI tegas, warna hangat dan terbatas, typography display yang dipakai secara hemat, feedback yang terasa seperti tombol arcade, serta model 3D insect yang tetap modern. Dengan struktur yang konsisten dan aksi yang mudah dipahami, game bisa terasa sederhana tanpa menjadi dangkal — serta memiliki peluang lebih besar untuk membangun identitas yang ikonik.

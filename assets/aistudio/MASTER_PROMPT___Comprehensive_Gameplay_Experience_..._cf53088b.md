# **Dokumen Audit Komprehensif Pengalaman Bermain, UX, Animasi & Game Feel: INSECTRON — 3D Bio-Dome Tactics**

## **Bagian 1 — Executive Summary**

### **Gambaran Umum Kualitas Pengalaman Game**

**INSECTRON — 3D Bio-Dome Tactics** (*Insect Tactics Arena*) adalah game strategi taktis berbasis giliran (*turn-based tactical board game*) 3D berbasis web yang mempertemukan dua skuad berisi masing-masing lima serangga mekanis/bio-mekanis (*Neo-Beasts*) di atas papan arena berukuran 5x5 petak. Secara keseluruhan, fondasi produk ini telah memiliki kematangan visual, kejelasan arsitektur informasi pada fase persiapan (*Squad Builder*), dan daya tarik tematik yang kuat. Namun, pada fase pertarungan (*Battle*), pengalaman bermain mengalami **friksi kritis pada pemahaman alur giliran, manajemen multi-unit, keterbacaan aksi lawan, serta pengenalan bahaya terhadap unit *King***.

### **Karakter dan Identitas yang Berhasil Dibangun**

> * **Fantasi Taktis "Gulat Serangga Bio-Dome":** Penggabungan mekanik catur/taktis grid dengan mekanik *sumo/ring-out* (mendorong lawan keluar batas arena) memberikan identitas mekanik yang segar dan mudah dipahami secara konseptual.  
> * **Estetika *Sleek Tactical Sci-Fi UI*:** Penggunaan palet warna gelap (*dark slate/charcoal*) dengan aksen warna fungsional yang tegas—Kuning/Amber untuk status aktif dan *King*, Mint untuk pergerakan, serta Koral untuk serangan—membangun atmosfer arena bio-teknologi modern yang rapi.  
> * **Karakterisasi Spesies yang Berbeda:** Penamaan unit yang ekspresif (seperti *Big Ass Bug*, *Agamel*, *Mick Stagger*, *Bee Bee King*) beserta pembagian peran dan *Signature Move* menciptakan kepribadian unik pada tiap unit.

### **Kekuatan Paling Menonjol**

> 1. **Daya Tarik Layar Utama (*Title Screen*):** Latar belakang 3D interaktif yang langsung memperlihatkan arena dan unit di belakang panel menu utama segera mengomunikasikan skala dan genre permainan tanpa memerlukan layar pemuatan tambahan.  
> 2. **Fleksibilitas Sistem Pertukaran Unit (*Swap System*) di *Squad Builder*:** Memilih unit yang sudah terpasang di slot lain secara otomatis menukar posisi slot tanpa mengharuskan pemain mengosongkan slot terlebih dahulu.  
> 3. **Opsi Kamera Taktis Ganda (3D TAC vs 2D):** Kemampuan mengubah sudut pandang kamera secara instan dari perspektif 3D miring ke tampilan atas (*top-down*) sangat membantu orientasi spasial di atas papan 5x5.

### **Risiko dan Masalah Utama**

> 1. **Tunnel Vision pada Satu Unit & Risiko *Solo-King Suicide* (Kritis \- P0):** Karena unit \#1 (*King*) langsung terpilih secara otomatis di awal laga dan tetap terpilih di setiap awal giliran berikutnya, pemain dalam rekaman hanya menggerakkan unit *King* (*Agamel*) sendirian maju ke tengah pertahanan lawan selama 6 giliran berturut-turut sementara 4 unit lainnya diam di baris belakang hingga kalah.  
> 2. **Transisi Giliran & Aksi Lawan yang Terlalu Cepat/Tumpang Tindih (Tinggi \- P1):** Begitu pemain menekan tombol aksi serangan atau *Signature Move*, giliran pemain langsung berakhir dan kamera seketika memotong (*hard cut/fast zoom*) ke aksi balasan lawan dalam rentang waktu sekitar 1–1,5 detik, sehingga dampak serangan pemain sendiri tidak sempat dicerna sebelum layar ditimpa oleh animasi serangan lawan.  
> 3. **Ambiguitas Identitas Unit Kembar (*Mirror Match Confusion*) (Tinggi \- P1):** Ketika pemain dan AI lawan menggunakan spesies yang sama (keduanya memiliki *Agamel* dan *Noble Faerie*), baik teks *Combat Log* (AGAMEL struck AGAMEL for 82 DMG\!) maupun banner *Signature Move* (AGAMEL SIGNATURE MOVE • FORTRESS QUAKE\!) tidak mencantumkan identitas pemilik unit, memicu kebingungan siapa yang sedang menyerang siapa.  
> 4. **Penggunaan *Signature Move* Tanpa Target Valid (Tinggi \- P1):** Pada Giliran 1 (00:26), tombol *Signature Move* FORTRESS QUAKE tetap menyala dan dapat ditekan meskipun tidak ada musuh di petak sekitar untuk diserang/didorong, sehingga pemain membuang 1 *Charge* secara kurang optimal di langkah pembuka.  
> 5. **Urutan Penomoran Langkah (*Step 1–2–3*) yang Melompat Secara Spasial pada *Squad Builder* (Sedang \- P2):** STEP 1 dan STEP 3 berada di kolom kiri, sedangkan STEP 2 berada di kolom kanan, serta panel detail unit di kiri bawah terpotong dan memerlukan *scroll* internal.

### **Lima Rekomendasi dengan Dampak Terbesar**

> 1. **Terapkan Sistem *Action Point / Exhaustion* Per Unit atau *Auto-Cycle Selection*:** Beri indikator aksi per giliran atau pindahkan sorotan ke unit anggota skuad lain setelah satu unit beraksi, disertai peringatan bahaya (*Threat Warning*) saat pemain memajukan *King* sendirian ke jangkauan banyak musuh.  
> 2. **Beri Jeda Fase (*Phase Pacing Buffer*) 600–800ms Antara Aksi Pemain dan Giliran Lawan:** Pisahkan secara jelas fase *Impact/Recovery* serangan pemain sebelum menampilkan banner RIVAL'S TURN dan animasi kamera lawan.  
> 3. **Bedakan Visual & Penamaan Unit Kembar (*Faction Prefix & Color Coding*):** Tambahkan label kepemilikan pada banner dan log (misal: \[ALLY\] AGAMEL vs \[RIVAL\] AGAMEL) serta aksen warna tim yang kontras pada bilah HP di atas kepala unit 3D.  
> 4. **Tambahkan Pratinjau Area Efek (*AoE Tile Preview*) & Peringatan Target Kosong pada *Signature Move*:** Tampilkan sorotan petak terdampak saat kursor diarahkan (*hover*) ke tombol FORTRESS QUAKE, dan tampilkan indikator 0 Targets in AoE (Shield Only) jika tidak ada musuh di sekitar.  
> 5. **Restrukturisasi Tata Letak *Squad Builder* agar Bebas *Scroll* Internal:** Susun ulang hierarki Step 1 → Step 2 → Step 3 secara linear dan padatkan kartu inspektor unit di kolom kiri agar seluruh informasi *Signature Move* terlihat utuh tanpa perlu menggulir (*scrolling*).

### **Kesimpulan Prioritas Pengembangan**

Fokus pengembangan saat ini **bukan** pada penambahan spesies baru atau perombakan grafis, melainkan pada **kejelasan ritme pertarungan (*combat pacing*), keterbacaan umpan balik aksi (*action-feedback separation*), dan pembimbingan keputusan taktis (*tactical affordance*)** agar pemain memahami cara menggerakkan kelima anggota skuad secara sinergis dan tidak kehilangan *King* akibat kurangnya kejelasan informasi di medan tempur.

## **Bagian 2 — Scope, Methodology & Evidence**

### **Sumber yang Diperiksa**

> * **Sumber Tunggal (\`\`):** Rekaman video layar laptop (*camera-recorded screen capture*) berdurasi **59 detik** (00:00 – \`00:59\`) yang mendokumentasikan satu siklus utuh permainan: *Title Screen* (\`00:00–00:03\`), *Build Your Squad* (\`00:04–00:18\`), *Battle Match* dari Giliran 1 hingga Giliran 6 (\`00:19–00:53\`), *Defeat Modal* (\`00:54–00:57\`), dan kembali ke *Title Screen* (\`00:58–00:59\`).

### **Platform dan Kondisi Pengujian yang Diketahui**

> * **Lingkungan Eksekusi:** Aplikasi web yang berjalan di dalam tampilan pratinjau desktop/laptop dengan bilah atas bertuliskan Insect Tactics Arena serta kontrol Remix dan Device.  
> * **Metode Input:** Mouse kursor desktop (terlihat dari pergerakan penunjuk kursor dan *hover state* di sepanjang video).

### **Ruang Lingkup Audit & Area yang Tidak Dapat Dinilai**

> * **Area yang Dinilai Secara Penuh:** Alur layar utama, *Squad Builder* (pemilihan unit, pertukaran slot, pengaturan formasi), antarmuka pertarungan (*Battle HUD*), pergerakan di papan, serangan dasar, penggunaan *Signature Move*, transisi kamera 3D/2D, alur giliran pemain vs AI, dan layar kekalahan.  
> * **Area yang Belum Dapat Dinilai (Tidak Terobservasi dalam Video):**  
  * Isi modal HOW TO PLAY, SETTINGS, CHANGE RANK, dan History log.  
  * Alur tombol QUICK BATTLE dan tombol SQUAD \[Q\] saat di dalam pertarungan.  
  * Kondisi kemenangan (*Victory State*) dan mekanik *Ring-Out* (mendorong lawan hingga jatuh keluar arena, karena di akhir pertandingan tercatat RING-OUTS: 0).  
  * Kode sumber internal (HTML/CSS/JS/Three.js), log konsol, serta metrik *framerate* presisi.  
  * Kualitas desain audio internal secara jernih karena rekaman diambil menggunakan mikrofon kamera eksternal yang menangkap suara klik mouse fisik dan kebisingan ruangan.

### **Pemisahan Observasi dari Interpretasi & Definisi Matriks Evaluasi**

> * **Observasi:** Fakta visual/kejadian yang terekam pada *timestamp* tertentu di video.  
> * **Interpretasi & Hipotesis:** Analisis berbasis *first-principles* mengenai dampak kognitif/taktis terhadap pemain yang perlu diverifikasi melalui *playtest*.  
> * **Prioritas:** P0 (Kritis/Merusak pengalaman inti), P1 (Tinggi/Masalah besar usability & game feel), P2 (Sedang/Peluang perbaikan bermakna), P3 (Rendah/Penyempurnaan minor).  
> * **Confidence:** Tinggi (Didukung bukti visual langsung yang jelas dari video), Sedang (Indikasi kuat dari pola interaksi video), Rendah (Hipotesis yang membutuhkan pengujian tambahan).

## **Bagian 3 — Experience Reconstruction**

### **3.1 Inventarisasi Alur Pengalaman Pemain**

> 1. **Orientasi Awal (00:00–00:03):** Pemain melihat layar pembuka INSECTRON, membaca proposisi nilai singkat, dan memilih BUILD YOUR SQUAD.  
> 2. **Kustomisasi Skuad (00:04–00:11):** Pemain mengevaluasi 5 unit bawaan di Slot \#1–\#5, menukar unit di Slot \#1 dengan TORNADO MANTIS (Slot \#4), lalu menggantinya dengan AGAMEL (Tier S Tank) dari daftar spesies tersedia, dan menggulir panel kiri untuk membaca detail *Signature Move*.  
> 3. **Penataan Formasi (00:12–00:18):** Pemain menguji penempatan AGAMEL (Slot \#1 sekaligus *King*) pada beberapa petak formasi FRONT dan BACK, lalu menetapkannya di BACK \- COL C dan menekan tombol BATTLE.  
> 4. **Orientasi Arena & Kamera (00:19–00:21):** Pertandingan dimulai; pemain langsung mengubah sudut kamera dari 3D TAC menjadi 2D untuk melihat petak arena secara jelas.  
> 5. **Pertarungan Solo-King (00:22–00:53):** Selama 6 giliran, pemain hanya menggerakkan dan menyerang menggunakan AGAMEL (unit *King*), sementara 4 unit skuad lainnya tidak pernah disentuh.  
> 6. **Kekalahan & Evaluasi (00:54–00:59):** AGAMEL milik pemain kehabisan HP di Giliran 6 akibat serangan beruntun musuh; modal DEFEAT muncul, dan pemain kembali ke MAIN MENU.

### **3.2 Tabel Rekonstruksi State dan Transisi**

| State Awal | Tindakan Pemain | Respons Sistem | State Akhir | Catatan Evaluasi |
| :---- | :---- | :---- | :---- | :---- |
| **Title Screen** (00:00) | Klik BUILD YOUR SQUAD (00:03) | Transisi instan membuka layar *Squad Builder* penuh | **Squad Builder** (Editing Slot \#1) | Sangat cepat dan responsif; tidak ada *loading* yang menghambat. |
| **Squad Builder**: Slot \#1 berisi ROCK 'N' ROLLER (00:05) | Klik kartu TORNADO MANTIS (SLOT \#4) di panel kanan (00:06) | Sistem menukar isi Slot \#1 dan Slot \#4; status *King* berpindah ke TORNADO MANTIS (00:07) | Slot \#1: TORNADO MANTIS (*King*), Slot \#4: ROCK 'N' ROLLER | Perilaku *swap* cerdas dan mencegah error duplikasi unit. |
| **Squad Builder**: Slot \#1 berisi TORNADO MANTIS (00:08) | Klik kartu AGAMEL (AVAILABLE) di panel kanan (00:09) | Slot \#1 digantikan oleh AGAMEL; TORNADO MANTIS kembali berstatus AVAILABLE (00:10) | Slot \#1: AGAMEL (*King*) | Respons jelas; bilah bawah langsung memperbarui teks King: AGAMEL. |
| **Squad Builder**: AGAMEL di BACK COL C (00:11) | Klik petak BACK COL D, BACK COL E, FRONT COL D, lalu kembali ke BACK COL C (00:12–00:15) | Posisi \#1 AGAMEL berpindah/bertukar secara instan mengikuti petak yang diklik | \#1 AGAMEL berada di BACK COL C (00:16) | Interaksi penempatan formasi satu klik sangat efisien. |
| **Squad Builder Ready** (00:18) | Klik tombol BATTLE (00:18) | Menutup *Squad Builder*, menampilkan arena 3D dan HUD pertarungan | **Battle State: Turn 1 (Player's Turn)** (00:19) | Unit AGAMEL langsung terpilih secara *default* sebagai ACTIVE UNIT. |
| **Battle Turn 1**: Kamera 3D TAC (00:19) | Klik tombol 3D TAC di kanan atas (00:20) | Kamera melakukan interpolasi mulus ke sudut pandang atas; label tombol berubah menjadi 2D (00:21) | **Battle Turn 1** (Kamera Top-Down 2D) | Transisi kamera sangat mulus dan membantu keterbacaan petak. |
| **Battle Turn 1**: AGAMEL di C5 (00:22) | Klik petak hijau mint D3 (00:23) | AGAMEL bergeser ke D3; petak mint menghilang; tombol FORTRESS ... tetap aktif (00:24) | **Battle Turn 1 (Moved)**: AGAMEL di D3 | Header berubah menjadi Moved\! Attack / Signature or End Turn. |
| **Battle Turn 1 (Moved)**: AGAMEL di D3 (00:25) | Klik tombol kuning FORTRESS ... (00:26) | Kamera *zoom-in* menampilkan banner FORTRESS QUAKE\!, lalu langsung berpindah ke RIVAL'S TURN di mana NOBLE FAERIE lawan menembakkan CHARM BEAM\! (00:27–00:28) | **Battle Turn 2 (Player's Turn)**: HP AGAMEL turun menjadi 814/900 | **Masalah Kritis:** Aksi pemain dan balasan lawan terjadi terlalu cepat tanpa jeda yang memadai. |
| **Battle Turn 2–5**: AGAMEL bertarung sendirian di lini depan (00:28–00:49) | Klik FORTRESS ... (Turn 2), pindah ke C3 & klik ATTACK (Turn 3–5) | Pertukaran serangan terus terjadi antara AGAMEL pemain dan 3 unit musuh (NOBLE FAERIE, AGAMEL lawan, BEE BEE KING) | **Battle Turn 6 (Player's Turn)**: HP AGAMEL tersisa 40/900 (00:50) | 4 unit pemain lainnya sama sekali tidak pernah digerakkan. |
| **Battle Turn 6**: HP AGAMEL 40/900 (00:50) | Klik ATTACK ke BEE BEE KING (00:51) | BEE BEE KING terdorong ke A4 (299/410 HP); pada RIVAL'S TURN (00:53), BEE BEE KING menyerang balik \-82 DMG (KILL\!) | **Defeat Modal** (00:54) | Modal DEFEAT muncul seketika setelah pukulan terakhir lawan. |

### **3.3 Experience Timeline & Momen Kritis**

> * **00:00–00:03 \[Momen Positif\]:** Visual pembuka 3D memberikan kesan pertama yang solid dan meyakinkan.  
> * **00:06–00:10 \[Momen Lancar\]:** Pertukaran unit di *Squad Builder* berjalan instan tanpa hambatan.  
> * **00:11 \[Friction Point\]:** Pemain harus melakukan *scroll* di dalam kolom kiri yang sempit untuk membaca deskripsi penuh *Signature Move* milik AGAMEL.  
> * **00:20–00:21 \[Momen Kepuasan\]:** Transisi kamera dari 3D TAC ke 2D sangat halus dan memperjelas tata letak grid.  
> * **00:26–00:28 \[Momen Membingungkan / Perubahan Visual Mendadak\]:** Penekanan tombol FORTRESS ... tanpa musuh di sebelah unit langsung memicu *zoom* kamera, membuang 1 *Charge*, dan langsung disambung oleh serangan CHARM BEAM\! lawan dalam waktu kurang dari 2 detik.  
> * **00:36–00:42 \[Momen Membingungkan\]:** Pemain memindahkan AGAMEL ke C3 (dikelilingi 3 musuh), menekan ATTACK, namun animasi yang mendominasi layar pada 00:41–00:42 justru banner *Signature Move* beruntun dari fase giliran lawan (FORTRESS QUAKE\! dan POISON NEEDLE\!).  
> * **00:53–00:54 \[Momen Kritis\]:** AGAMEL (King) tumbang sementara 4 unit rekan setim masih memiliki 100% HP di posisi awal.

## **Bagian 4 — Gameplay & Mechanics Audit**

### **4.1 Core Gameplay Loop**

Siklus permainan terdiri atas **Loop Makro** (Persiapan Skuad → Pertarungan Arena → Evaluasi Hasil → Modifikasi Skuad/Rematch) dan **Loop Mikro Pertarungan**:  
\[1. Evaluasi Posisi Papan & Giliran\]  
       ↓  
\[2. Pilih 1 Unit Aktif dari 5 Unit Skuad\]  \<-- (Titik Kegagalan Utama di Video: Pemain terpaku pada 1 unit)  
       ↓  
\[3. Gerakkan Unit ke Petak Mint (Opsional)\]  
       ↓  
\[4. Eksekusi Aksi: Attack / Signature Move / End Turn\]  
       ↓  
\[5. Resolusi Dampak & Giliran Lawan (AI)\]

### **4.2 Clarity of Goals & Rules**

> * **Tujuan Utama Jelas Secara Tekstual:** Sejak layar awal hingga *Combat Log* pembuka, game menyatakan dengan jelas: *"Defeat the Enemy King or knock them Out of Bounds\!"*.  
> * **Aturan "1 Aksi Unit Per Giliran" vs "Semua Unit Per Giliran" Kurang Eksplisit:** Dalam rekaman, begitu satu unit (AGAMEL) selesai melakukan Move \+ Attack/Signature, giliran pemain langsung berakhir secara otomatis dan berpindah ke RIVAL'S TURN. Artinya, sistem menggunakan aturan *Chess-like / 1-Unit Activation per Turn* (hanya 1 unit yang dapat diaktifkan per giliran), namun karena AGAMEL selalu menjadi unit yang otomatis terpilih (*auto-selected*) di setiap awal giliran pemain, pemain berpotensi tidak menyadari bahwa mereka seharusnya bergantian memilih unit lain di gilirannya.

### **4.3 Agency, Decision-Making & Strategi**

> * **Premis Taktis Kuat, Eksekusi Terdistorsi oleh Default Selection:** Keberadaan *knockback*, persentase *Defense*, *Counter-attack* (00:48), status *Confusion* (00:28), dan *Poison* (00:42) menunjukkan kedalaman sistem pertarungan yang kaya.  
> * **Biaya Kesalahan (*Cost of Error*) Sangat Tinggi Tanpa Jaring Pengaman:**  
  1. Setelah pemain mengklik petak D3 (00:23) atau C3 (00:36), unit langsung berpindah tanpa opsi *Undo Move* sebelum menyerang.  
  2. Ketika 3 musuh berada dalam jangkauan serangan di 00:38–00:40, menekan tombol ATTACK di panel bawah langsung menyerang target yang sedang disorot (RIVAL TARGET: AGAMEL) tanpa meminta konfirmasi pemilihan target di papan.

### **4.4 Difficulty, Friction & Replayability**

> * **Friksi Mekanik vs Tantangan Strategis:** Kekalahan pemain dalam 6 giliran di rekaman bukan semata-mata karena AI RANK A • JIN RED terlalu pintar, melainkan karena **friksi antarmuka** yang membuat pemain terus-menerus menggerakkan *King* sendirian ke tengah kepungan musuh dan membuang *Signature Charge* pertama tanpa mengenai lawan.  
> * **Potensi Replayability:** Dengan 12 spesies berbeda yang terbagi dalam *Tier S, A, B* dan formasi *Front/Back* di atas 5 kolom, potensi eksperimen komposisi tim sangat tinggi apabila pemain telah memahami cara mengoperasikan seluruh unit di arena.

## **Bagian 5 — UX & Interaction Audit**

### **5.1 Discoverability & Affordance**

> * **Masalah Keterjangkauan Pemilihan Multi-Unit (P0):** Di kiri atas HUD pertarungan terdapat teks kecil 5/5 Active • Click to select di bawah nama PLAYER JASTER beserta 5 ikon kecil. Namun, di awal Giliran 1, AGAMEL sudah memiliki badge kuning menyala ACTIVE dan seluruh petak pergerakan mint untuk AGAMEL langsung terhampar di papan. Karena sistem sudah menyajikan opsi jalan yang siap diklik, mata dan kursor pemain langsung tertuju ke petak mint dan tombol aksi di bawah, mengabaikan 4 unit lainnya.  
> * **Tombol SQUAD \[Q\] yang Membingungkan di Dalam Pertarungan (P2):** Di pojok kanan bawah terdapat tombol besar SQUAD \[Q\] dengan subteks Edit 5 bugs (Turn 1). Namun, pada Giliran 2, 3, 4, 5, dan 6 (00:28–00:51), tombol tersebut masih menampilkan teks Edit 5 bugs (Turn 1\) dan tampak memiliki *visual weight* yang setara dengan tombol END TURN \[E\].

### **5.2 Learnability & Cognitive Load**

> * **Beban Kognitif di *Squad Builder* (P2):** Layar *Squad Builder* menampilkan 4 kelompok informasi sekaligus: daftar 5 slot skuad (STEP 1), matriks formasi 2x5 (STEP 3), kartu detail statistik & pola grid 3x3 di kiri bawah, serta katalog 12 kartu spesies (STEP 2\) di sebelah kanan. Urutan penomoran langkah yang melompat dari kiri atas (STEP 1\) ke kanan (STEP 2\) lalu kembali ke kiri tengah (STEP 3\) memaksa mata melakukan pemindaian zig-zag.  
> * **Keterbacaan Pola Serangan 3x3 di *Squad Builder* (P2):** Pada panel detail unit di kiri bawah (00:04–00:17), terdapat diagram grid 3x3 kecil tanpa legenda warna di sebelahnya, sehingga pemain harus menebak arti petak putih, kuning, dan oranye.

### **5.3 Feedback & System Status**

> * **Feedback Status Giliran Tidak Proporsional:** Ketika pemain menyelesaikan aksinya, perubahan dari PLAYER'S TURN ke RIVAL'S TURN langsung diikuti oleh eksekusi aksi AI secara instan.  
> * **Ambiguitas Nama Unit di Log dan Banner (P1):** Ketika kedua belah pihak memiliki unit AGAMEL dan NOBLE FAERIE, pesan log seperti LOG AGAMEL struck AGAMEL for 82 DMG\! (00:44) menuntut beban mental ekstra untuk menerjemahkan siapa pelaku dan siapa korbannya.

### **5.4 Error Prevention & Recovery**

> * **Tidak Ada Pencegahan Pemborosan *Signature Move* (P1):** Pada 00:26, AGAMEL berada di D3 tanpa ada musuh di petak sebelahnya. Tombol FORTRESS ... (2 Charges • \~154 DMG) menyala kuning terang seolah-olah akan menghasilkan \~154 DMG. Saat diklik, serangan area tersebut meledak di ruang kosong (hanya mengaktifkan efek perisai) dan langsung menghabiskan giliran.  
> * **Tidak Ada *Move Undo* Sebelum Aksi (P2):** Dalam game taktis berbasis giliran (*Into the Breach*, *Fire Emblem*), menggerakkan unit adalah fase pratinjau yang dapat dibatalkan (Undo Move / Reset Position) selama unit belum mengeksekusi serangan. Di sini, klik petak mint bersifat final.

## **Bagian 6 — Game Feel Audit**

### **6.1 Input Responsiveness & Perceived Responsiveness**

> * **Responsivitas Klik UI Sangat Cepat:** Pada *Title Screen* dan *Squad Builder*, setiap klik pada kartu spesies atau petak formasi memberikan perubahan state instan tanpa *input lag* yang terlihat.  
> * **Paradoks Responsivitas di Pertarungan (*Too Fast to Read*):** Dalam pertarungan, begitu pemain mengklik ATTACK (00:40, 00:43, 00:47), sistem merespons terlalu cepat dengan langsung menggabungkan resolusi serangan pemain dan serangan balasan giliran lawan dalam satu rangkaian kilat. Secara teknis sistem sangat cepat, tetapi secara **Perceived Responsiveness**, pemain kehilangan rasa kendali (*agency*) karena hasil dari klik mereka sendiri tertelan oleh animasi giliran musuh.

### **6.2 Perceived Weight, Impact & Juiciness**

> * **Momen *Signature Move* Memiliki Bobot Visual yang Baik:** Ketika FORTRESS QUAKE\! (00:27, 00:30, 00:41), CHARM BEAM\! (00:28, 00:31), atau POISON NEEDLE\! (00:42, 00:45, 00:49) dieksekusi, sistem memunculkan:  
  1. Perubahan sudut kamera dinamis (*dramatic 3D camera zoom/tilt*).  
  2. Efek cincin gelombang kejut (*shockwave ring*) atau sorotan warna di petak target.  
  3. Angka kerusakan melayang (*floating damage numbers* seperti \-149, \-86, \-97 POISON).  
  4. Banner tajuk aksi di bagian atas arena.  
> * **Ketimpangan antara *Basic Attack* dan *Signature Move*:** Berbeda dengan *Signature Move* yang sangat mencolok, *Basic Attack* pemain pada 00:40, 00:43, dan 00:47 hampir tidak terlihat fase *anticipation* dan *impact*\-nya karena langsung tertutup oleh kamera *zoom-in* dari *Signature Move* milik AI lawan.

### **6.3 Rhythm & Pacing**

> * **Ritme Pertarungan Terasa Terburu-buru pada Transisi Giliran:** Tidak ada "napas" (*breathing room*) antara akhir aksi pemain dan awal aksi AI. Ritme yang sehat untuk game taktis memerlukan tiga ketukan yang terpisah jelas: **(1) Eksekusi & Dampak Aksi Pemain → (2) Jeda Transisi Giliran (0,6–0,8 detik) → (3) Pergerakan & Aksi Lawan**.

## **Bagian 7 — Animation & Motion Design Audit**

### **7.1 Motion Inventory**

Berdasarkan observasi video \`\`, sistem animasi mencakup:

> 1. **Idle Loops (3D Units):** Gerakan bernapas/mengayun lembut pada model serangga 3D di layar utama dan arena pertarungan.  
> 2. **Camera Interpolation (3D TAC ↔ 2D & Action Cam):** Pergerakan kamera orbital yang mulus saat berpindah mode pandang (00:20–00:21) dan saat menyorot *Signature Move* (00:27–00:31).  
> 3. **Grid Translation (Unit Movement):** Pergeseran posisi horizontal unit di atas petak papan (00:23, 00:36) serta dorongan *knockback* (00:30, 00:52).  
> 4. **VFX & Floating Combat Text:** Cincin gelombang kejut di lantai arena dan teks angka kerusakan/status yang muncul di atas unit.  
> 5. **Screen/Modal Transitions:** Kemunculan instan (*instant cut/fade*) antara *Title Screen*, *Squad Builder*, *Battle HUD*, dan modal *Defeat*.

### **7.2 Timing, Easing & Continuity**

> * **Kamera 3D TAC ↔ 2D (00:20–00:21):** Menggunakan *smooth easing* (perkiraan durasi \~400–600ms) yang mempertahankan kontinuitas spasial dengan sangat baik sehingga pemain tidak kehilangan orientasi arah depan/belakang papan.  
> * **Kamera *Signature Action* (00:27–00:31, 00:41–00:45):** Ketika *Signature Move* pemain dan lawan terjadi berurutan, kamera melakukan *zoom-in* ke sudut miring 3D, kembali sebentar, lalu *zoom-in* lagi dalam waktu singkat, menciptakan guncangan visual (*camera whiplash*).

### **7.3 Spesifikasi Animasi yang Direkomendasikan (Starting Point untuk Diuji)**

#### **Spesifikasi 1: Sekuens Resolusi Aksi & Transisi Giliran (*Turn Handover Sequence*)**

> * **Trigger:** Pemain mengeksekusi ATTACK atau SIGNATURE MOVE yang mengakhiri gilirannya.  
> * **State Awal:** Unit pemain berada di petak aktif; kamera berada pada mode pilihan pemain (2D atau 3D TAC).  
> * **Tahap 1 — Player Action Impact (0ms – 450ms):**  
  * **Elemen & Properti:** Model 3D unit pemain melakukan *lunge* ke arah target (translasi maju 0.25 tile selama 120ms dengan cubic-bezier(0.2, 0.9, 0.3, 1), tahan 80ms saat *hit-stop*, kembali ke posisi asal selama 250ms dengan ease-out).  
  * **Feedback Target:** Model target berkedip putih/merah selama 150ms \+ *floating damage text* naik sejauh 24px selama 600ms (opacity: 1 → 0 pada 450ms–600ms).  
> * **Tahap 2 — Post-Action Hold / Digest Buffer (450ms – 1050ms):**  
  * **Aturan Krusial:** Kamera dan sistem **dilarang** memulai giliran AI selama 600ms setelah *impact* pemain selesai agar pemain dapat membaca berkurangnya HP musuh dan efek *knockback*.  
> * **Tahap 3 — Rival Turn Banner & AI Execution (1050ms+):**  
  * Banner tengah atas berdenyut (scale: 0.95 → 1.05 → 1.0 selama 250ms) mengubah warna menjadi Koral (RIVAL'S TURN), diikuti jeda 300ms sebelum unit AI mulai bergerak.  
> * **Reduced-Motion Behavior:** Matikan *camera zoom/tilt* otomatis saat *Signature Move* (tetap gunakan sudut kamera aktif pemain) dan ganti *camera shake* dengan kilatan *border* tipis pada kartu unit.  
> * **Kriteria Keberhasilan:** Pemain dapat menyebutkan berapa kerusakan yang baru saja mereka berikan kepada lawan sebelum giliran lawan dimulai.

## **Bagian 8 — Visual Design & Art Direction Audit**

### **8.1 Visual Hierarchy & Komposisi**

> * **Keseimbangan Layar Utama (00:00–00:03):** Komposisi asimetris (panel kaca gelap di sisi kiri, panggung 3D Bio-Dome di sisi kanan) sangat efektif dan modern. Tombol CTA utama BUILD YOUR SQUAD berwarna kuning solid memiliki kontras paling tinggi di layar.  
> * **Kepadatan HUD Pertarungan (00:19–00:53):** HUD pertarungan membingkai tepi atas dan bawah layar dengan rapi tanpa menutupi papan 5x5 di tengah. Namun, di panel kontrol bawah, keempat tombol aksi (ATTACK, FORTRESS ..., END TURN \[E\], SQUAD \[Q\]) memiliki ukuran kotak yang hampir identik, sehingga tombol administratif (SQUAD \[Q\]) tampak sejajar secara hierarki dengan tombol taktis (ATTACK).

### **8.2 Tipografi, Warna & Keterbacaan**

> * **Sistem Warna Semantik yang Konsisten:**  
  * **Amber/Kuning (\#F5A623 / sejenis):** Unit aktif, mahkota *King*, *Signature Move*, dan CTA utama.  
  * **Mint/Hijau Muda:** Petak pergerakan valid dan status pemain (*Player Jaster*).  
  * **Koral/Merah-Oranye:** Serangan, target musuh, dan identitas lawan (*Jin Red*).  
> * **Masalah Pemotongan Teks (*Text Truncation*) pada Tombol *Signature Move* (P2):** Di panel bawah pertarungan, nama *Signature Move* terpotong menjadi FORTRESS ... (00:19–00:52) dan CRUSHING ... (00:54), padahal lebar tombol masih dapat dioptimalkan atau ukuran *font* judul tombol dapat dikecilkan sedikit agar nama jurus terbaca utuh.  
> * **Pembedaan Visual Tim pada Model 3D (P1):** Semua serangga 3D memiliki cangkang dasar berwarna hitam mengilap dengan pola bintik/garis neon. Meskipun terdapat cincin tipis di dasar kaki unit (kuning/putih untuk pemain, merah/koral untuk lawan), ketika banyak unit berkumpul rapat di tengah papan disertai label TARGET dan ACTIVE (00:38–00:49), siluet model 3D antara kawan dan lawan menjadi sangat mirip.

## **Bagian 9 — Progression, Reward & Motivation Audit**

### **9.1 Sistem Tantangan & Rank**

> * **Struktur *Challenge Rank* (00:00–00:18):** Terlihat adanya sistem tingkat kesulitan dan formasi lawan melalui indikator CHALLENGE: RANK A • JIN RED dan tombol CHANGE RANK. Hal ini memberikan kerangka progresi berbasis penguasaan taktis (*tactical mastery challenge*).  
> * **Klasifikasi Tier Spesies (Tier S, Tier A, Tier B):** Di *Squad Builder* (00:04–00:17), ke-12 spesies memiliki label Tier (Tier S: *Big Ass Bug*, *Agamel*, *Dark Emperor*; Tier A: *Noble Faerie*, *Tornado Mantis*, *Mick Stagger*, *Drillerpillar*, *Bazoo Beetle*; Tier B: *Rock 'N' Roller*, *Bee Bee King*) tanpa adanya sistem biaya poin (*squad point cap/deployment cost*) yang terlihat.  
  * **Potensi Masalah Balance & Motivasi (P2):** Jika semua 12 unit langsung terbuka dan tidak ada batasan poin skuad (misalnya batas maksimal 2 unit *Tier S*), pemain secara rasional akan selalu memasukkan ketiga unit *Tier S* ke dalam skuad mereka, sehingga unit *Tier B* kehilangan relevansi strategis kecuali memiliki sinergi khusus yang sangat kuat.

### **9.2 Umpan Balik Akhir Pertandingan (*End-of-Match Feedback*)**

> * **Layar DEFEAT (00:54–00:57):** Menampilkan penyebab kekalahan secara spesifik (Your King (AGAMEL) was defeated\!) beserta 3 metrik: TURNS: 6, RING-OUTS: 0, dan DAMAGE DEALT: 611\.  
> * **Peluang Peningkatan Pembelajaran (*Learning Feedback*):** Ketika pemain kalah cepat karena *King* mereka maju sendirian sementara 4 unit lain belum bergerak, layar DEFEAT belum memberikan *Tactical Tip* kontekstual (misalnya: *"Tip: Keep your King protected behind your Front line\! Activate your other 4 squad members to control the board."*).

## **Bagian 10 — Technical & Platform Audit**

Berdasarkan pemeriksaan visual atas rekaman \`\`:

> 1. **Bug/Inkonsistensi Label State pada Tombol SQUAD \[Q\] (00:19–00:53):**  
   * **Gejala:** Subteks pada tombol SQUAD \[Q\] di kanan bawah terus menampilkan Edit 5 bugs (Turn 1\) bahkan ketika pertandingan sudah berada di TURN 2 hingga TURN 6\.  
   * **Kemungkinan Penyebab:** Jika fitur *in-battle squad edit* hanya diizinkan pada Giliran 1, state disabled dan pembaruan teks label (misalnya menjadi Locked after Turn 1\) belum diikat (*bound*) ke variabel perubahan nomor giliran (turnNumber \> 1).  
> 2. **Overflow & Scrollbar Ganda pada Kolom Kiri *Squad Builder* (00:04–00:17):**  
   * **Gejala:** Pada resolusi layar laptop yang digunakan, kolom kiri *Squad Builder* memunculkan *scrollbar* vertikal tersendiri karena tinggi gabungan STEP 1, STEP 3, dan kartu inspektor melebihi tinggi *viewport* sekitar 60–80 piksel.  
   * **Kemungkinan Penyebab:** Penggunaan ukuran *padding* dan tinggi baris yang tetap (*fixed height*) tanpa penyesuaian responsif (max-height / flex-shrink / clamp()) untuk layar laptop standar (tinggi *viewport* \~700–800px).  
> 3. **Stabilitas *Framerate* & Rendering 3D:**  
   * **Observasi:** Selama 59 detik rekaman, rendering kanvas 3D (transisi kamera, pergerakan unit, efek gelombang kejut) berjalan lancar tanpa indikasi *frame drop* parah, *screen tearing*, atau *layout shift*.

## **Bagian 11 — Detailed Findings Register**

### **11.1 Tabel Ringkasan Temuan**

| ID | Temuan | Kategori | Prioritas | Confidence | Dampak | Estimasi Usaha |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **F-01** | **Solo-King Tunnel Vision:** Pemilihan otomatis *King* di setiap giliran memicu pemain hanya menggerakkan 1 unit hingga mati | Gameplay / UX | **P0** | Tinggi | Kritis (Merusak loop taktis 5v5 & memicu kekalahan dini) | Sedang |
| **F-02** | **Turn Handover Whiplash:** Tidak ada jeda antara aksi pemain dan eksekusi giliran lawan (AI) | Game Feel / Animation | **P1** | Tinggi | Tinggi (Hilangnya keterbacaan dampak serangan pemain) | Rendah |
| **F-03** | **Mirror-Match Identity Ambiguity:** Unit kembar kawan vs lawan menggunakan nama identik tanpa penanda tim di log & banner | UX / Visual | **P1** | Tinggi | Tinggi (Kebingungan pelaku vs target saat spesies sama) | Rendah |
| **F-04** | **Wasted Signature Charge:** *Signature Move* (FORTRESS QUAKE) aktif & tampak menampilkan estimasi damage meski 0 musuh dalam jangkauan | Interaction / Gameplay | **P1** | Tinggi | Tinggi (Pemborosan *resource* krusial di awal laga) | Rendah–Sedang |
| **F-05** | **No Move Undo & Instant Multi-Target Attack:** Klik petak langsung mengunci langkah & klik tombol ATTACK langsung memukul tanpa konfirmasi target di papan | Interaction / UX | **P2** | Tinggi | Sedang (Meningkatkan risiko salah langkah/salah sasaran) | Sedang |
| **F-06** | **Squad Builder Spatial Flow & Scroll Overflow:** Urutan Step 1-3-2 melompat secara visual dan kolom kiri memicu *scrollbar* internal untuk membaca deskripsi | UX / Visual | **P2** | Tinggi | Sedang (Friksi navigasi & tersembunyinya info *Signature Move*) | Rendah |
| **F-07** | **Stale SQUAD \[Q\] Label & Button Hierarchy:** Tombol SQUAD \[Q\] tetap bertuliskan (Turn 1\) di semua giliran dan bersaing secara visual dengan tombol aksi tempur | Technical / UI | **P2** | Tinggi | Sedang (Kebingungan aturan & distraksi di panel aksi) | Rendah |
| **F-08** | **Unconstrained Tier System in Squad Builder:** Spesies Tier S, A, B tersedia bebas tanpa kejelasan batasan komposisi atau *trade-off* biaya skuad | Gameplay / Progression | **P2** | Sedang | Sedang (Risiko dominasi unit *Tier S* & hilangnya variasi skuad) | Sedang |
| **F-09** | **Button Text Truncation & Unlabeled 3x3 Pattern Grid:** Teks FORTRESS ... terpotong di HUD dan diagram grid 3x3 di *Squad Builder* tidak memiliki legenda warna | Visual / Accessibility | **P3** | Tinggi | Rendah–Sedang (Mengurangi keterbacaan informasi mikro) | Rendah |
| **S-01** | **Kekuatan Desain:** *Dual-Mode Tactical Camera* (3D TAC ↔ 2D) dan *One-Click Slot Swap* di *Squad Builder* | UX / Game Feel | **Pertahankan** | Tinggi | Positif (Kenyamanan orientasi spasial & efisiensi kustomisasi) | — |

### **11.2 Detail Temuan Utama**

#### **\[F-01\] Solo-King Tunnel Vision: Pemilihan Otomatis *King* di Setiap Giliran Memicu Pemain Hanya Menggerakkan Satu Unit**

> * **Kategori:** Gameplay / UX / Interaction  
> * **Lokasi:** Battle Screen (00:19–00:53, Giliran 1 s.d. Giliran 6).  
> * **Jenis Temuan:** Usability Issue & Gameplay Flow Defect  
> * **Prioritas:** **P0 (Critical)** \| **Confidence:** Tinggi  
> * **Observasi:** Sejak Giliran 1 (00:19), unit \#1 (AGAMEL, yang berstatus *King*) langsung terpilih secara otomatis dengan petak pergerakan mint yang langsung menyala di papan. Setelah pemain menggerakkan AGAMEL dan menyerang, giliran berpindah ke lawan, dan saat kembali ke PLAYER'S TURN pada Giliran 2 (00:28), Giliran 3 (00:32), Giliran 4 (00:43), Giliran 5 (00:46), dan Giliran 6 (00:50), sistem selalu mempertahankan AGAMEL sebagai unit aktif. Akibatnya, selama keseluruhan pertandingan (6 giliran), pemain hanya menggerakkan AGAMEL maju sendirian ke area lawan hingga dikeroyok dan kalah, sementara 4 unit lainnya (BIG ASS BUG, MICK STAGGER, ROCK 'N' ROLLER, NOBLE FAERIE) tidak pernah diklik atau digerakkan satu petak pun.  
> * **Kebutuhan Pemain:** Pemain perlu menyadari bahwa mereka memimpin **skuad berisi 5 unit**, memahami cara memilih unit lain, dan menyadari bahaya fatal jika memajukan *King* sendirian ke garis depan.  
> * **Analisis & Dampak:** Ketika sebuah sistem selalu memilihkan satu unit secara *default* dan langsung menampilkan tombol aksi yang aktif, pemain baru cenderung mengikuti jalur resistensi terendah (*path of least resistance*) dengan terus menekan petak jalan dan tombol serang milik unit tersebut. Karena unit \#1 kebetulan adalah *King* (yang jika mati menyebabkan DEFEAT seketika), perilaku *default* ini secara tidak sengaja menjebak pemain untuk melakukan tindakan bunuh diri taktis (*King suicide rush*).  
> * **Kemungkinan Akar Masalah:** State selectedUnitId diinisialisasi ke slot\[0\] (*King*) saat pertandingan dimulai dan tidak pernah di-reset atau dirotasi pada pergantian giliran.  
> * **Rekomendasi & Detail Implementasi:**  
  1. **Jangan Pilih *King* Secara Otomatis dari Baris Belakang di Giliran 1:** Pilih unit barisan depan (FRONT row) sebagai unit *default* di Giliran 1, atau mulai setiap giliran pemain dalam state *"Select a Unit to Act"* di mana kelima unit pemain berkedip halus dengan cincin kesiapan sebelum salah satu diklik.  
  2. **Mekanik *Fatigue / Cooldown* atau *Auto-Cycle Suggestion*:** Jika aturan permainan mengizinkan unit yang sama bergerak terus-menerus, setidaknya di awal giliran baru pindahkan sorotan kamera/seleksi awal ke unit barisan depan yang belum bergerak, atau tambahkan indikator ACTED LAST TURN agar pemain terdorong menggerakkan anggota skuad lainnya.  
  3. **Indikator Bahaya *King* (*King Danger Warning*):** Saat HP *King* berada di bawah 50% atau berada dalam ancaman 2+ musuh, tampilkan peringatan visual yang jelas di sekitar kartu *King* (KING IN DANGER\! Consider retreating or supporting with other units).  
> * **Trade-off:** Memulai giliran tanpa unit yang terpilih otomatis menambah 1 klik per giliran, namun investasi 1 klik ini sangat krusial untuk membangun kesadaran komando skuad (*squad command agency*).  
> * **Validation Plan & Acceptance Criteria:** Dalam uji bermain (*playtest*) terhadap 5 pemain baru tanpa instruksi lisan, minimal 4 dari 5 pemain menggerakkan setidaknya 3 unit berbeda dalam 5 giliran pertama.

#### **\[F-02\] Turn Handover Whiplash: Transisi Instan Tanpa Jeda Antara Aksi Pemain dan Eksekusi Giliran Lawan**

> * **Kategori:** Game Feel / Animation / UX  
> * **Lokasi:** Battle Screen (00:26–00:28, 00:29–00:31, 00:40–00:42, 00:43–00:45, 00:47–00:49, 00:51–00:53).  
> * **Jenis Temuan:** Usability & Game Feel Issue  
> * **Prioritas:** **P1 (High)** \| **Confidence:** Tinggi  
> * **Observasi:** Setiap kali pemain mengklik tombol ATTACK atau FORTRESS ..., giliran pemain langsung berakhir pada milidetik yang sama dan AI lawan langsung mengeksekusi gilirannya termasuk memicu *zoom* kamera *Signature Move* lawan. Contoh paling ekstrem terjadi pada 00:40–00:42: pemain menekan ATTACK pada 00:40, namun pada 00:41 layar sudah dipenuhi oleh banner AGAMEL SIGNATURE MOVE • FORTRESS QUAKE\! milik lawan yang disusul BEE BEE KING SIGNATURE MOVE • POISON NEEDLE\! pada 00:42.  
> * **Kebutuhan Pemain:** Pemain membutuhkan waktu sekitar 0,5 hingga 1 detik setelah menekan tombol serang untuk melihat animasi serangan unitnya sendiri, membaca angka kerusakan yang dihasilkan, dan memahami posisi baru di papan sebelum perhatiannya dialihkan ke giliran musuh.  
> * **Analisis & Dampak:** Menggabungkan resolusi aksi pemain dan aksi balasan AI tanpa jeda (*buffer*) merusak rantai sebab-akibat (*action → feedback*). Pemain sulit membedakan mana kerusakan yang baru saja mereka berikan dan mana kerusakan yang baru saja mereka terima dari lawan.  
> * **Rekomendasi & Detail Implementasi:**  
  1. Terapkan **Sequential Turn State Machine** dengan jeda eksplisit: PLAYER\_ACTION\_ANIMATING (450ms) → POST\_ACTION\_HOLD (600ms) → TURN\_BANNER\_TRANSITION (400ms) → AI\_THINK\_AND\_MOVE (500ms) → AI\_ACTION\_ANIMATING.  
  2. Selama POST\_ACTION\_HOLD, pastikan kamera tetap tenang di posisi saat ini agar pemain melihat jelas dampak serangannya sebelum banner RIVAL'S TURN muncul.  
> * **Trade-off:** Menambah durasi total per giliran sekitar \~1,2 detik, namun meningkatkan keterbacaan pertarungan secara drastis.  
> * **Acceptance Criteria:** Terdapat jeda visual minimal 600ms setelah angka kerusakan serangan pemain muncul sebelum banner berubah menjadi RIVAL'S TURN.

#### **\[F-03\] Mirror-Match Identity Ambiguity: Unit Kembar Kawan vs Lawan Tidak Dibedakan di Log dan Banner**

> * **Kategori:** UX / Visual  
> * **Lokasi:** Battle Screen (00:22–00:48).  
> * **Jenis Temuan:** Usability Issue  
> * **Prioritas:** **P1 (High)** \| **Confidence:** Tinggi  
> * **Observasi:** Baik pemain (*Jaster*) maupun lawan (*Jin Red*) sama-sama membawa unit AGAMEL (sebagai *King*) dan NOBLE FAERIE.  
  * Pada 00:22, kotak kiri bawah menampilkan ACTIVE UNIT: AGAMEL dan kotak di sebelahnya menampilkan RIVAL TARGET: AGAMEL.  
  * Pada 00:41, banner atas menampilkan AGAMEL SIGNATURE MOVE • FORTRESS QUAKE\! tanpa menyebutkan apakah itu AGAMEL milik Jaster atau milik Jin Red.  
  * Pada 00:44, *Combat Log* menulis: LOG AGAMEL struck AGAMEL for 82 DMG\!.  
> * **Kebutuhan Pemain:** Pemain harus dapat membedakan dalam sekejap mata apakah sebuah aksi, banner, atau baris log dilakukan oleh unit kawan atau unit lawan.  
> * **Rekomendasi & Detail Implementasi:**  
  1. **Format Penamaan Berwarna di Log & Banner:** Tambahkan awalan kepemilikan dan warna teks pada setiap penyebutan nama unit: misalnya ALLY AGAMEL (Mint) struck RIVAL AGAMEL (Coral) for 82 DMG\!.  
  2. **Warna Banner *Signature Move* Berdasarkan Tim:** Gunakan bingkai dan aksen warna **Mint/Amber** untuk banner *Signature Move* milik pemain, dan warna **Merah Koral/Gelap** dengan label \[RIVAL\] AGAMEL SIGNATURE MOVE untuk aksi lawan.  
  3. **Bilah HP 3D yang Kontras:** Pastikan bilah HP melayang di atas unit pemain selalu berwarna **Hijau Mint** dan bilah HP di atas unit musuh selalu berwarna **Merah Koral** (saat ini keduanya terlihat serupa dengan latar gelap).  
> * **Acceptance Criteria:** Tidak ada satu pun kalimat di *Combat Log* atau banner *Signature Move* yang menyebut nama unit tanpa identitas tim/warna pembeda.

#### **\[F-04\] Wasted Signature Charge: Tombol *Signature Move* Menampilkan Estimasi Damage & Dapat Ditekan Saat 0 Target di Sekitar**

> * **Kategori:** Interaction / Gameplay  
> * **Lokasi:** Battle Screen, Giliran 1 (00:24–00:27).  
> * **Jenis Temuan:** Usability Issue / Error Prevention  
> * **Prioritas:** **P1 (High)** \| **Confidence:** Tinggi  
> * **Observasi:** Pada 00:24, setelah AGAMEL bergerak ke D3, tombol X ATTACK dinonaktifkan dengan keterangan jelas No enemy in range. Namun, tepat di sebelahnya, tombol FORTRESS ... menyala kuning terang dengan teks 2 Charges • \~154 DMG. Pemain mengkliknya pada 00:26, yang langsung menghabiskan 1 *Charge* dan mengakhiri giliran pemain hanya untuk memasang *Iron Shield* tanpa melukai atau mendorong satu pun musuh (LOG AGAMEL unleashed Fortress Quake and raised an Iron Shield\!).  
> * **Kebutuhan Pemain:** Sebelum menekan tombol berbiaya terbatas (*2 Charges*), pemain perlu mengetahui petak mana saja yang akan terkena efek dan apakah ada musuh yang benar-benar akan terkena \~154 DMG tersebut.  
> * **Analisis:** Karena FORTRESS QUAKE memiliki efek ganda (menyerang/mendorong musuh di sekitar \+ memasang perisai diri), secara teknis jurus tersebut memang boleh diaktifkan kapan saja demi perisainya. Namun, menampilkan teks \~154 DMG saat tidak ada musuh dalam jangkauan memberikan sinyal palsu (*false affordance*) bahwa jurus tersebut akan melukai musuh.  
> * **Rekomendasi & Detail Implementasi:**  
  1. **Dynamic Subtext Berdasarkan Target:** Jika enemiesInAoE \=== 0, ubah subteks tombol dari 2 Charges • \~154 DMG menjadi 2 Charges • Shield Only (0 in range) dengan tampilan warna kuning redup/outline.  
  2. **Hover AoE Preview di Papan:** Saat kursor diarahkan (*hover*) ke tombol FORTRESS QUAKE, sorot ke-8 petak di sekeliling AGAMEL dengan bingkai kuning berdenyut agar pemain melihat jangkauan jurus tersebut di papan.  
> * **Acceptance Criteria:** Saat tidak ada musuh di area efek, tombol *Signature Move* secara eksplisit menulis 0 in range (Shield Only) dan menampilkan sorotan petak area efek saat di-*hover*.

#### **\[F-05\] No Move Undo & Eksekusi Serangan Multi-Target Tanpa Konfirmasi Target di Papan**

> * **Kategori:** Interaction / UX  
> * **Lokasi:** Battle Screen (00:23–00:24, 00:36–00:40).  
> * **Jenis Temuan:** Design Opportunity / Error Prevention  
> * **Prioritas:** **P2 (Medium)** \| **Confidence:** Tinggi  
> * **Observasi:**  
  1. Saat pemain mengklik petak mint D3 (00:23) atau C3 (00:36), pergerakan langsung dikunci tanpa tombol UNDO MOVE.  
  2. Pada 00:38–00:40, ketika AGAMEL berada di C3, terdapat **3 musuh** yang berada dalam jangkauan serang (ketiganya memiliki badge TARGET di papan, dan tombol ATTACK menampilkan 3 in range • \~117 DMG). Saat pemain mengklik tombol ATTACK di panel bawah, sistem langsung mengeksekusi serangan ke target *default* tanpa meminta pemain memilih mana dari 3 target tersebut yang ingin dipukul.  
> * **Rekomendasi & Detail Implementasi:**  
  1. **Fitur Undo Move \[Z / Right-Click\]:** Selama pemain baru melakukan *Move* dan belum melakukan *Attack / Signature / End Turn*, sediakan tombol kecil UNDO MOVE (atau klik petak asal) untuk mengembalikan unit ke posisi awal dan membandingkan jangkauan serang dari petak lain.  
  2. **Konfirmasi Target Saat inRange \> 1:** Jika hanya ada 1 musuh dalam jangkauan, klik tombol ATTACK dapat langsung mengeksekusi serangan (cepat & efisien). Namun jika ada 2+ musuh dalam jangkauan, ubah perilaku tombol ATTACK menjadi mode pemilihan target, atau tampilkan garis bidik (*targeting reticle/arrow*) yang jelas menghubungkan unit aktif ke musuh yang sedang menjadi RIVAL TARGET saat ini.  
> * **Acceptance Criteria:** Pemain dapat membatalkan pergerakan sebelum menyerang, dan terdapat garis/sorotan visual yang membedakan 1 target aktif(SELECTED TARGET) dari target potensial lainnya (IN RANGE).

#### **\[F-06\] Squad Builder Spatial Flow & Vertical Scroll Overflow pada Kolom Kiri**

> * **Kategori:** UX / Visual  
> * **Lokasi:** Build Your Squad Screen (00:04–00:18).  
> * **Jenis Temuan:** Usability Issue  
> * **Prioritas:** **P2 (Medium)** \| **Confidence:** Tinggi  
> * **Observasi:**  
  1. Penomoran langkah melompat secara spasial: STEP 1 (YOUR 5-UNIT SQUAD) di kiri atas → STEP 2 (CHOOSE A NEO-BEAST) di kolom kanan → STEP 3 (FORMATION FRONT/BACK) di kiri tengah.  
  2. Pada 00:04–00:10, deskripsi *Signature Move* di kartu inspektor kiri bawah terpotong oleh batas layar bawah, sehingga pada 00:11 pemain harus menggulir (*scroll*) kolom kiri ke bawah untuk membacanya.  
> * **Rekomendasi & Detail Implementasi:**  
  1. **Hilangkan *Scrollbar* di Kolom Kiri:** Kurangi tinggi vertikal petak STEP 3 — FORMATION dan *padding* kartu di kolom kiri sekitar 15–20% agar seluruh konten kolom kiri (Step 1 \+ Step 3 \+ *Unit Inspector*) muat 100% di dalam satu layar (*zero vertical scroll* pada 1080p/768p).  
  2. **Selaraskan Penomoran Langkah:** Ubah label menjadi:  
     * Kiri Atas: STEP 1 — SELECT SQUAD SLOT (1–5)  
     * Kanan: STEP 2 — ASSIGN NEO-BEAST TO SLOT  
     * Kiri Tengah: STEP 3 — SET ARENA FORMATION (FRONT / BACK) Atau letakkan *Unit Inspector* di bagian bawah kolom kanan sehingga kolom kiri murni berisi Konfigurasi Skuad & Formasi (Step 1 & Step 2 selesai di atas, Step 3 di bawahnya).  
> * **Acceptance Criteria:** Pada resolusi layar laptop standar (1366x768 dan 1920x1080), seluruh teks deskripsi *Signature Move* di *Squad Builder* terlihat utuh tanpa memunculkan *scrollbar* vertikal di kolom kiri.

#### **\[F-07\] Stale Label pada Tombol SQUAD \[Q\] & Kompetisi Hierarki di Panel Bawah**

> * **Kategori:** Technical / UI  
> * **Lokasi:** Battle Screen (00:19–00:53, pojok kanan bawah).  
> * **Jenis Temuan:** Defect & UI Hierarchy Issue  
> * **Prioritas:** **P2 (Medium)** \| **Confidence:** Tinggi  
> * **Observasi:** Tombol SQUAD \[Q\] menampilkan subteks Edit 5 bugs (Turn 1\) secara terus-menerus dari Giliran 1 hingga Giliran 6\. Selain itu, ukuran tombol ini sama besarnya dengan tombol ATTACK, FORTRESS ..., dan END TURN \[E\].  
> * **Rekomendasi & Detail Implementasi:**  
  1. Jika fitur *Edit Squad* hanya berlaku di Giliran 1 sebelum unit bergerak, sembunyikan atau kecilkan tombol tersebut menjadi tombol ikon sekunder di bilah atas setelah Giliran 1 berakhir, atau perbarui teksnya menjadi Locked (Turn 1 Only) dengan opasitas 40%.  
  2. Gunakan ruang yang dihemat di panel bawah untuk memperlebar tombol SIGNATURE MOVE sehingga teks FORTRESS QUAKE tidak terpotong menjadi FORTRESS ....  
> * **Acceptance Criteria:** Label tombol SQUAD \[Q\] berubah sesuai state giliran, dan nama *Signature Move* pada tombol aksi utama tampil penuh tanpa elipsis (...).

## **Bagian 12 — Root-Cause & Dependency Analysis**

### **Peta Keterkaitan Masalah (Root-Cause Chain)**

\[Akar Masalah 1: State Seleksi Unit Statis di Awal Giliran (selectedUnit \= King)\]  
       ├──\> Menyebabkan \[F-01\] Pemain hanya menggerakkan King selama 6 giliran  
       └──\> Diperparah oleh \[F-05\] Tidak adanya fitur Undo Move saat King terlanjur maju ke kepungan musuh

\[Akar Masalah 2: Eksekusi Sinkron/Instan antara Akhir Aksi Pemain & Awal Loop AI\]  
       ├──\> Menyebabkan \[F-02\] Turn Handover Whiplash (dampak serangan pemain tertimpa animasi AI)  
       └──\> Diperparah oleh \[F-03\] Unit kembar (Agamel vs Agamel) tanpa label tim di banner & log,  
            sehingga pemain makin bingung membaca siapa yang baru saja beraksi saat transisi cepat.

### **Urutan Prasyarat Perbaikan (*Dependency Order*)**

> 1. **Perbaiki State Machine Giliran & Seleksi Unit terlebih dahulu (F-01 & F-02):** Menambahkan jeda transisi giliran (F-02) dan memperbaiki logika pemilihan unit di awal giliran (F-01) adalah fondasi utama. Tanpa kedua hal ini, perbaikan visual atau animasi lainnya tetap akan terasa kacau karena ritme pertarungan terlalu cepat dan pemain hanya memakai 1 unit.  
> 2. **Perbaiki Identitas Tim & Validasi Target (F-03, F-04, F-05):** Setelah ritme giliran stabil, perjelas informasi sebelum dan sesudah klik (pratinjau area *Signature Move*, pembedaan nama \[ALLY\] vs \[RIVAL\], dan *Undo Move*).  
> 3. **Rapikan Tata Letak UI & Polish (F-06, F-07, F-09):** Penyempurnaan tata letak *Squad Builder* dan pemotongan teks tombol dapat dikerjakan secara paralel tanpa memengaruhi logika inti pertarungan.

## **Bagian 13 — Recommended Design Solutions**

### **Masalah Utama 1: Mengatasi *Solo-King Tunnel Vision* (F-01)**

> * **Solusi Utama (Direkomendasikan): *Action Point / Stamina Feedback* \+ *Front-Line Default / Unselected Turn Start***  
  * Di awal setiap PLAYER'S TURN, jangan langsung mengunci seleksi pada *King* jika *King* baru saja bergerak di giliran sebelumnya. Sorot kelima unit pemain di papan dengan cincin hijau mint (READY), atau otomatis pilih unit barisan depan (FRONT row) yang belum bergerak. Tambahkan lencana peringatan merah (EXPOSED KING\!) apabila *King* berada di barisan terdepan sendirian.  
> * **Alternatif Lebih Sederhana:** Tetap pilih unit otomatis, tetapi terapkan **Auto-Cycle Selection**—setiap awal giliran baru, seleksi otomatis berpindah ke slot unit berikutnya (Slot \#2 → Slot \#3 → Slot \#4 → Slot \#5) sehingga pemain secara alami diperkenalkan pada seluruh anggota skuadnya.  
> * **Alternatif Lebih Ambisius (Perubahan Aturan Mekanik):** Terapkan aturan **1 Turn \= Seluruh Unit Boleh Bergerak 1 Kali** (atau maksimal 2–3 aktivasi unit per giliran) sebelum berganti ke giliran lawan, atau berikan *cooldown* 1 giliran (*Exhausted state*) pada unit yang baru saja beraksi sehingga pemain **wajib** memilih unit lain di giliran berikutnya.  
> * **Alasan Memilih Solusi Utama / Auto-Cycle:** Mempertahankan aturan inti *1-activation per turn* (seperti catur/Onitama) tanpa merombak keseimbangan AI, namun langsung menghentikan kebiasaan pemain menggerakkan *King* terus-menerus.

### **Masalah Utama 2: Memperbaiki *Turn Handover Whiplash* (F-02) & Ambiguitas Unit Kembar (F-03)**

> * **Solusi Utama (Direkomendasikan): *Two-Beat Turn Transition* \+ *Faction-Coded Banners & Logs***  
  * Tambahkan jeda 650ms setelah animasi serangan pemain selesai sebelum memicu banner RIVAL'S TURN.  
  * Ubah seluruh banner *Signature Move* dan baris *Combat Log* agar mencantumkan tag tim berwarna: \[JASTER\] AGAMEL (Mint/Amber) vs \[JIN RED\] AGAMEL (Koral).  
> * **Trade-off:** Pertandingan 6 giliran akan bertambah durasinya sekitar 7–8 detik secara total, namun waktu tambahan ini mengubah pengalaman dari "membingungkan dan tergesa-gesa" menjadi "taktis dan terbaca".

## **Bagian 14 — Implementation Backlog**

### **Quick Wins (Dampak Tinggi, Usaha Relatif Rendah)**

| ID Terkait | Task Implementasi | Alasan | Dependensi | Estimasi Usaha | Risiko Regresi | Kriteria Selesai (DoD) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **F-02** | Tambahkan *delay/buffer* 600–700ms antara akhir resolusi aksi pemain dan pemanggilan fungsi startRivalTurn() | Memberi waktu pemain membaca hasil serangannya sebelum kamera diambil alih AI | Tidak ada | Rendah | Rendah | Jeda terukur minimal 600ms setelah *floating damage* pemain muncul sebelum giliran lawan dimulai. |
| **F-03** | Tambahkan prefix nama tim/warna (\[ALLY\] / \[RIVAL\]) pada *Combat Log*, kotak RIVAL TARGET, dan banner *Signature Move* | Menghilangkan kebingungan saat pemain dan AI menggunakan spesies yang sama (AGAMEL, NOBLE FAERIE) | Tidak ada | Rendah | Rendah | Log tidak lagi menulis AGAMEL struck AGAMEL, melainkan membedakan pemilik unit dengan warna. |
| **F-04** | Ubah subteks tombol *Signature Move* menjadi 0 in range (Shield Only) saat tidak ada musuh di area efek | Mencegah pemain mengira jurus tersebut akan menghasilkan \~154 DMG saat area kosong | Tidak ada | Rendah | Rendah | Pada posisi D3 tanpa musuh di sebelah, tombol menampilkan 0 in range (Shield Only). |
| **F-07, F-09** | Sembunyikan/kecilkan tombol SQUAD \[Q\] setelah Turn 1 dan perlebar tombol SIGNATURE MOVE agar teks tidak terpotong (...) | Memperbaiki bug label (Turn 1\) di giliran lanjut dan menampilkan nama jurus secara utuh | Tidak ada | Rendah | Rendah | Nama jurus FORTRESS QUAKE dan CRUSHING HORN tampil utuh di panel bawah. |
| **F-06** | Kurangi *padding* vertikal dan tinggi sel tabel STEP 3 — FORMATION di *Squad Builder* agar kolom kiri bebas *scrollbar* | Memastikan deskripsi *Signature Move* selalu terlihat tanpa perlu di-*scroll* | Tidak ada | Rendah | Rendah | Kolom kiri *Squad Builder* muat 100% di *viewport* laptop tanpa *scrollbar* vertikal. |

### **Core Fixes (Perbaikan Masalah Inti)**

| ID Terkait | Task Implementasi | Alasan | Dependensi | Estimasi Usaha | Risiko Regresi | Kriteria Selesai (DoD) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **F-01** | Ubah logika seleksi awal giliran: rotasikan seleksi *default* ke unit barisan depan (FRONT row) atau tampilkan *prompt* pemilihan unit di papan \+ peringatan KING EXPOSED | Menghentikan pola pemain baru yang hanya menggerakkan *King* sendirian sampai kalah | Tidak ada | Sedang | Sedang | Di awal giliran baru, *King* tidak lagi otomatis menjadi satu-satunya unit yang disorot jika unit lain belum bergerak. |
| **F-04, F-05** | Tambahkan *Hover AoE Preview* di petak papan saat kursor di atas tombol ATTACK / SIGNATURE MOVE serta fitur Undo Move sebelum menyerang | Memberikan kepastian spasial atas petak yang terdampak dan mengizinkan koreksi langkah | State pergerakan giliran | Sedang | Sedang | Pemain dapat membatalkan langkah (Undo Move) sebelum menyerang dan melihat petak terdampak saat *hover* tombol aksi. |

### **Experience Enhancements & Exploratory Improvements**

| ID Terkait | Task Implementasi | Alasan | Dependensi | Estimasi Usaha | Risiko Regresi | Kriteria Selesai (DoD) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **F-08** | Eksplorasi sistem **Squad Deployment Point Cap** (misal: Maks 12 Poin; Tier S \= 4 pt, Tier A \= 2 pt, Tier B \= 1 pt) | Memberikan nilai strategis pada unit *Tier B* dan *Tier A* dalam *Squad Builder* | Desain Balance | Sedang | Sedang | Pemain memiliki keputusan *trade-off* yang bermakna saat menyusun 5 unit dari Tier berbeda. |
| **F-01** | Tambahkan *Contextual Tactical Tip* pada layar DEFEAT (misal: mendeteksi jika pemain kalah tanpa menggerakkan \>2 unit atau terkena 0 *Ring-Out*) | Membantu pemain belajar dari kekalahan secara organik tanpa tutorial panjang | Analitik state akhir laga | Rendah | Rendah | Layar DEFEAT menampilkan 1 kalimat saran taktis yang sesuai dengan penyebab kekalahan. |

## **Bagian 15 — Validation & Playtest Plan**

### **Skenario Pengujian 1: *Multi-Unit Command & King Survival* (Menguji Perbaikan F-01)**

> * **Tujuan Pengujian:** Memastikan pemain baru secara alami menggerakkan berbagai unit dalam skuadnya dan tidak memajukan *King* sendirian ke tengah kepungan lawan.  
> * **Kondisi Awal:** Pemain baru yang belum pernah memainkan *INSECTRON* diberikan akses ke layar awal dan diminta menyelesaikan 1 pertandingan melawan RANK A • JIN RED.  
> * **Perilaku yang Diamati (Tanpa Intervensi Moderator):**  
  1. Unit mana yang dipilih dan digerakkan pemain pada Giliran 1, 2, dan 3?  
  2. Berapa total unit berbeda dari 5 unit skuad yang digerakkan pemain selama pertandingan?  
  3. Apakah pemain menyadari unit mana yang merupakan *King*?  
> * **Indikator Keberhasilan (Acceptance Criteria):**  
  * Minimal **80% partisipan** menggerakkan **\\ge 3 unit berbeda** dalam 6 giliran pertama.  
  * Kematian *King* di bawah 6 giliran akibat maju sendirian sementara 4 unit lain tidak bergerak turun menjadi **0%**.

### **Skenario Pengujian 2: *Combat Readability & Turn Pacing* (Menguji Perbaikan F-02, F-03, F-04)**

> * **Tujuan Pengujian:** Menguji apakah pemain dapat membedakan aksi unitnya sendiri dari aksi balasan AI (terutama saat ada unit kembar) serta memahami dampak *Signature Move* sebelum menekannya.  
> * **Metode (*Think-Aloud Protocol*):** Minta pemain menyebutkan secara lisan apa yang akan terjadi sebelum mereka menekan tombol FORTRESS QUAKE, dan apa yang baru saja terjadi tepat setelah giliran lawan selesai.  
> * **Indikator Keberhasilan:**  
  * Pemain tidak menekan FORTRESS QUAKE dengan ekspektasi memberikan kerusakan ketika musuh berada di luar area efek.  
  * Pemain dapat membedakan dengan tepat kapan AGAMEL miliknya menyerang dan kapan AGAMEL lawan menyerang.

## **Bagian 16 — Final Roadmap & Decision Log**

### **Urutan Implementasi yang Direkomendasikan**

> 1. **Fase 1 — Pacing & Keterbacaan Informasi Tempur (Hari 1–2):**  
   * Implementasikan jeda transisi giliran 600–700ms (F-02).  
   * Tambahkan penanda tim \[ALLY\] vs \[RIVAL\] beserta kode warna pada *Combat Log* dan banner *Signature Move* (F-03).  
   * Perbaiki subteks dinamis pada tombol *Signature Move* saat 0 musuh dalam jangkauan (F-04) serta rapikan tombol SQUAD \[Q\] dan teks tombol yang terpotong (F-07, F-09).  
> 2. **Fase 2 — Kendali Skuad & Pencegahan Kesalahan Taktis (Hari 3–5):**  
   * Ubah perilaku seleksi unit di awal giliran agar tidak terus-menerus mengunci pada *King* (F-01).  
   * Tambahkan *Hover AoE Preview* di petak arena dan fitur Undo Move sebelum menyerang (F-04, F-05).  
   * Rapikan tata letak kolom kiri *Squad Builder* agar bebas *vertical scroll* (F-06).  
> 3. **Fase 3 — Kedalaman Metagame & Umpan Balik Pembelajaran (Selanjutnya):**  
   * Tambahkan *Contextual Tactical Tip* pada modal DEFEAT dan uji sistem keseimbangan Tier di *Squad Builder* (F-08).

### **Hal yang Sengaja Tidak Perlu Diubah (Kekuatan yang Wajib Dipertahankan)**

> * **Jangan ubah estetika papan 3D Bio-Dome dan desain karakter serangga:** Kontras cangkang gelap mengilap dengan aksen neon di atas papan 5x5 sudah sangat khas dan menarik.  
> * **Jangan ubah mekanik kamera 3D TAC ↔ 2D:** Transisi kamera ini sudah bekerja dengan sangat mulus dan fungsional.  
> * **Jangan ubah logika pertukaran slot (*auto-swap*) satu klik di *Squad Builder*:** Interaksi ini sudah sangat intuitif dan efisien.

### **Pertanyaan Terbuka & Checklist untuk Review Berikutnya**

> 1. Apakah aturan dasar permainan memang membatasi pemain untuk **hanya mengaktifkan 1 unit per giliran** (seperti catur), dan apakah ada batas berapa kali unit yang sama boleh diaktifkan berturut-turut?  
> 2. Apa fungsi sebenarnya dari tombol SQUAD \[Q\] — Edit 5 bugs (Turn 1\) saat berada di dalam pertandingan, dan apakah pemain diizinkan menukar posisi formasi di Giliran 1 setelah melihat formasi musuh?  
> 3. Pada review berikutnya setelah perbaikan Fase 1 & 2 diimplementasikan, rekam satu sesi pertarungan yang memperlihatkan: **(a)** pergantian seleksi antar-unit yang berbeda, **(b)** fitur *Undo Move* dan *AoE Preview*, serta **(c)** skenario *Ring-Out* untuk mengevaluasi animasi jatuhnya unit ke luar batas arena.

*Apakah Anda ingin kita langsung membedah implementasi kode (misalnya logika state machine pergantian giliran dan seleksi unit di JavaScript/TypeScript atau perbaikan CSS layout Squad Builder) untuk menyelesaikan temuan P0 dan P1 di atas?*
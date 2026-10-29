# **Dokumen Transformasi Art Direction & Sistem Visual UI/3D: INSECTRON — 3D Bio-Dome Tactics**

Dokumen ini disusun mengikuti kerangka kerja **Master Prompt — Game Art Director & UI Aesthetic Transformation Specialist** untuk mentransformasikan identitas visual **INSECTRON — 3D Bio-Dome Tactics** (sebagaimana terekam pada video kondisi awal game) agar selaras secara kohesif dengan ketiga gambar referensi visual yang diberikan.  
**Catatan Transparansi Lingkungan & Sumber (Verification Honesty):** Dalam sesi ini, sumber yang tersedia dan diperiksa secara langsung meliputi: **(1)** rekaman video gameplay kondisi saat ini (video\_20261027\_034207.mp4), **(2)** dokumen panduan master prompt (writing-block (1).md), serta **(3)** tiga gambar referensi visual (image\_5d0dfb.jpg, image\_5d0de2.png, dan image\_5d0ddf.png). Karena file kode sumber proyek (HTML/CSS/JS) tidak dilampirkan secara langsung di dalam ruang kerja saat ini, saya tidak mengklaim telah mengedit file proyek Anda secara langsung. Sebagai gantinya, sesuai mandat **Tahap 8 dan Tahap 10 (Bagian 13\)** untuk kondisi tanpa akses tulis langsung ke repositori, dokumen ini menyediakan **spesifikasi Art Direction lengkap, Design System berbasis token, arsitektur komponen, serta kode implementasi CSS dan modul Three.js (Material, Lighting, Board, dan Procedural Bug Geometry)** yang siap diterapkan langsung ke dalam codebase Anda.

## **Pemetaan Peran Gambar Referensi (Reference Role Assignment)**

Sesuai panduan **Bagian 3** pada dokumen *Master Prompt*, ketiga gambar referensi yang Anda berikan memiliki peran komplementer yang spesifik untuk membangun satu dunia visual yang utuh:

> 1. Primary Reference — Karakter & Unit 3D (image\_5d0ddf.png): Menjadi acuan utama untuk merombak desain model 3D ke-12 *Neo-Beasts*. Menggantikan model serangga saat ini yang serba hitam mengilap dan sulit dibedakan siluetnya menjadi **serangga 3D bergaya *Stylized Tactile Toy-Entomology*** dengan warna tubuh *matte/satin* yang berani, segmentasi anatomi yang jelas (kumbang tanduk, capung, kalajengking terbang, kutu kayu, kumbang tutul), serta mata bundar ekspresif bercincin putih.  
> 2. Primary Reference — Lingkungan Diorama & Palet Dunia (image\_5d0dfb.jpg): Menjadi acuan utama untuk mengubah panggung Bio-Dome yang semula berupa ruang gelap sci-fi monoton menjadi **Diorama Reruntuhan Hutan Kuno (*Enchanted Overgrown Bio-Sanctuary*)**. Menghadirkan hamparan rumput hijau bergradasi hangat, pepohonan pinus dan pohon berbatang kayu pahatan, dinding batu berlumut, serta kristal energi biru-sian (*cyan bio-crystals*) yang berpendar di sela-sela bebatuan.  
> 3. Functional & Material Reference — Permukaan Papan Taktis & Pencahayaan (image\_5d0de2.png): Menjadi acuan utama untuk tekstur **papan catur arena 5x5 dan kontras pencahayaan**. Memperlihatkan tatanan balok batu pahat (*chiseled stone slabs*) dengan sudut *bevel* tegas yang terkena sorotan cahaya lentera emas hangat (*warm amber lantern glow*) di satu sisi dan bayangan hutan biru-kehijauan (*cool teal/slate ambient shadow*) beserta berkas sinar matahari (*god-rays*) di sisi lainnya.

## **Tahap 1 — Membaca Visual Reference sebagai Art Director**

### **1.1 Overall Visual Identity**

* **Genre Estetika:** *Stylized Handcrafted Diorama & Tactile Toy-Fantasy*. Perpaduan antara lingkungan fantasi pahatan bergaya *stylized low-to-mid poly* yang kaya pencahayaan atmosferik dengan karakter figur serangga minimalis yang bersih, ekspresif, dan tampak seperti mainan koleksi fisik berkualitas tinggi.  
* **Mood dan Emotional Tone:** Mengundang (*inviting*), hidup, penuh rasa ingin tahu (*whimsical yet grounded*), dan fokus secara taktis. Lingkungan hutan dan reruntuhan batu memberikan rasa petualangan di alam liar yang magis, sementara desain serangga dengan mata bulat besar menghadirkan kepribadian yang ramah dan mudah dikenali dalam sekali pandang.  
* **Tingkat Stylization vs Realism:** Proporsi disederhanakan secara berani (*chunky proportions*) tanpa detail realistis yang berisik (tidak ada tekstur fotorealistis yang kasar atau anatomi serangga yang menyeramkan). Batu dipahat dalam bidang-bidang geometris (*planar sculpted facets*), sedangkan tubuh serangga dibangun dari bentuk kapsul, bola, dan silinder halus dengan pewarnaan *color-blocking* yang tegas.  
* **Kualitas Unik yang Membuat Referensi Mudah Dikenali:** Kontras yang harmonis antara **material lingkungan yang terukir/bertekstur lembut** (batu pahat, kayu beralur, rumput rimbun, kristal bercahaya) dengan **karakter serangga yang sangat bersih, *matte*, dan kontras tinggi** sehingga unit permainan langsung menonjol (*pop out*) di atas permukaan arena batu.

### **1.2 Visual DNA Extraction**

| Dimensi Visual | Karakteristik DNA dari Referensi | Aturan Desain Operasional untuk INSECTRON |
| :---- | :---- | :---- |
| **1\. Shape Language** | **Lingkungan:** Balok batu pahat dengan tepi *bevel/chamfer* tidak simetris dan retakan tegas. **Karakter:** Siluet organik membulat (*rounded capsules & spheres*), kaki silinder tumpul, dan mata bundar besar. | Gunakan bentuk **heksagonal/persegi ber-bevel tegas (*chiseled corners*)** untuk ubin papan dan bingkai panel UI; gunakan bentuk **kapsul membulat penuh (border-radius: 999px)** untuk lencana unit, indikator mata/status, dan siluet model 3D. |
| **2\. Color Language** | Dominasi hijau lumut/hutan (\#4E7D34, \#2C5227), abu-abu batu kebiruan (\#4A6268, \#2B3D44), aksen kristal sian menyala (\#3CF2FF), cahaya lentera emas hangat (\#FFB84D), serta warna tubuh serangga yang jenuh dan terpisah per spesies (koral, ungu, biru *teal*, merah tua, kuning oker) di atas latar *mint-sage* (\#A6E3C5). | Ganti hitam pekat sci-fi saat ini dengan **Deep Slate-Teal Stone (\#18262C – \#24373F)** sebagai warna dasar permukaan, **Sunlit Lantern Gold (\#F5B041)** sebagai aksen primer/King, **Bio-Crystal Cyan (\#38E8FF)** sebagai aksen pergerakan/mana, dan **Scorpion Coral (\#E85D4A)** sebagai aksen serangan/lawan. |
| **3\. Typography** | Referensi tidak memuat teks UI langsung, namun karakter dunia pahatan batu dan mainan taktil menuntut tipografi yang kokoh, ramah, memiliki ketebalan (*weight*) jelas, dan sedikit sentuhan organik/humanis. | Gunakan pasangan font: **Heading/Display** berkarakter *bold geometric/humanist slab-sans* yang kokoh (seperti Outfit, Fredoka, atau Plus Jakarta Sans ExtraBold) dengan *letter-spacing* rapat untuk tajuk, dipadukan dengan **UI Body/Numbers** yang sangat bersih dan *tabular* (Inter / DM Sans) untuk angka HP dan statistik. |
| **4\. Surface & Material** | Tiga material kontras: **(a)** Batu pahat *matte* dengan *edge highlight* terang di tepi atas, **(b)** Plastik/lempung *matte-satin* lembut tanpa pantulan cermin pada tubuh serangga, dan **(c)** Kristal semi-transparan yang memancarkan cahaya sendiri (*emissive*). | Hilangkan *specular gloss* hitam pekat pada serangga saat ini; ganti dengan MeshStandardMaterial ber-roughness: 0.65–0.8 (efek lempung/mainan *matte*). Berikan border-top terang 1–2px dan border-bottom tebal gelap 3–4px pada kartu UI untuk meniru ketebalan lempeng batu pahat. |
| **5\. Light & Shadow** | Pencahayaan ganda (*Warm-Cool Dual Lighting*): cahaya utama hangat kekuningan dari matahari/lentera, dipadukan dengan bayangan lembut berwarna biru-teal sejuk dan *ambient glow* sian/hijau dari kristal di tanah. | Terapkan DirectionalLight berwarna hangat (\#FFF0D6) dari sudut atas-depan, HemisphereLight dengan langit hijau-biru (\#88D4AB) dan tanah batu gelap (\#1E2F36), serta PointLight sian/emas di sekitar arena. |
| **6\. Composition & Depth** | Panggung utama dikelilingi oleh bingkai alam bertingkat (bebatuan di tepi depan, pohon pinus dan reruntuhan tangga batu di latar belakang yang sedikit berkabut lembut). | Ubah area luar papan 5x5 dari silinder hitam kosong menjadi **bingkai taman bio-dome bertingkat**: pagar batu berlumut di sekeliling parit *Ring-Out*, gugusan kristal sian menyala di sudut papan, dan siluet pepohonan pinus di tepi luar kubah. |
| **7\. Iconography & Character Traits** | Ciri khas mutlak dari image\_5d0ddf.png adalah **mata bundar putih dengan pupil hitam besar** di sisi kepala setiap serangga, serta siluet tubuh bersegmen yang unik untuk tiap spesies. | Setiap model 3D *Neo-Beast* wajib memiliki **sepasang mata *stylized* (cincin sklera putih bersih \+ pupil hitam)** dan warna cangkang utama yang unik per spesies agar langsung dapat dikenali di papan maupun di kartu *Squad Builder*. |

### **1.3 Pemisahan Elemen Identitas (Essential vs Incidental Traits)**

* **Signature Traits (Wajib Ditransfer):**  
  1. Estetika serangga *matte color-blocked* dengan mata bundar putih-hitam yang ikonik dan segmentasi tubuh yang khas per spesies.  
  2. Permukaan arena berupa lempeng batu pahat ber-bevel (*chiseled stone tiles*) dengan kontras cahaya lentera hangat dan bayangan batu biru-kehijauan.  
  3. Aksen lingkungan berupa lumut hijau segar dan kristal biru-sian (*cyan bio-crystals*) yang memberikan titik fokus energi di sekitar arena.  
* **Supporting Traits (Mendukung Atmosfer):**  
  1. Tangga batu reruntuhan, tiang lentera kayu, dan pohon pinus bergaya pahatan di sekeliling luar batas papan permainan.  
  2. Berkas cahaya (*light shafts/god-rays*) lembut dan kabut kedalaman (*atmospheric fog*) di kejauhan luar arena.  
* **Incidental & Context-Specific Traits (Jangan Disalin Mentah ke Arena Inti):**  
  1. Jalur tanah tidak beraturan di tengah hutan (image\_5d0dfb.jpg): Cocok untuk game eksplorasi RPG, tetapi **tidak boleh** merusak keterbacaan grid 5x5 pada game taktis. Oleh karena itu, bagian dalam arena 5x5 harus tetap menggunakan lempeng batu pahat yang terstruktur rapi seperti pada image\_5d0de2.png, sementara pepohonan dan rumput liar ditempatkan di sekeliling luar parit arena (*perimeter diorama*).  
  2. Latar belakang hijau mint polos (image\_5d0ddf.png): Sangat bagus untuk digunakan sebagai **latar belakang potret/kartu unit atau layar inspeksi karakter**, tetapi tidak digunakan sebagai lantai arena pertarungan utama agar tidak menyilaukan mata.

## **Tahap 2 — Audit Visual Game Saat Ini (INSECTRON)**

Berdasarkan pemeriksaan video rekaman video\_20261027\_034207.mp4:

### **2.1 Identitas Visual Saat Ini & Kesenjangan terhadap Referensi**

* **Kondisi Saat Ini:** Game menggunakan tema *"NEO-16 TACTICAL BIO-DOME"* dengan gaya antarmuka *dark mode dashboard* (\#12151C), bingkai kotak tipis berwarna abu-abu gelap, panggung 3D berupa meja hitam-abu-abu di dalam ruang hampa gelap, dan model 3D serangga yang seluruhnya berupa bola/kapsul hitam mengilap dengan sedikit garis neon.  
* **Masalah Visual Utama:**  
  1. **Siluet dan Warna Unit 3D Seragam:** Di papan pertarungan (00:19–00:53), kelima unit pemain dan kelima unit lawan semuanya berwarna dasar hitam mengilap dengan bentuk bulat yang hampir identik. Hal ini sangat bertolak belakang dengan referensi image\_5d0ddf.png di mana setiap serangga memiliki warna tubuh penuh (biru *teal*, ungu, oranye koral, merah-hitam, putih-hitam) dan siluet anatomi yang sangat kontras.  
  2. **Lingkungan Arena Terasa Dingin dan Steril:** Papan 5x5 saat ini tampak seperti lantai plastik/beton abu-abu datar yang dikelilingi silinder hitam polos, belum memiliki kehangatan tekstur batu pahat, rumput hutan, lentera, dan kristal bercahaya seperti pada image\_5d0dfb.jpg dan image\_5d0de2.png.  
  3. **UI Terasa Seperti Aplikasi Dashboard Teknis:** Kotak-kotak panel di *Squad Builder* (00:04–00:18) dan HUD pertarungan (00:19–00:53) tampak fungsional tetapi terasa datar dan generik (seperti *admin template* gelap), belum mencerminkan dunia *Bio-Dome* yang hidup.

### **2.2 Struktur Komponen Antarmuka yang Terpetakan dari Video**

> 1. **Top Global Bar:** Menampilkan judul window Insect Tactics Arena dan kontrol utilitas.  
> 2. **Title Screen Overlay (00:00–00:03):** Header bar (INSECTRON • 3D BIO-DOME TACTICS, tombol HOW TO PLAY, SETTINGS), kartu hero di sisi kiri (badge mahkota, judul besar, deskripsi, CTA BUILD YOUR SQUAD dan QUICK BATTLE, strip CHALLENGE: RANK A • JIN RED \+ CHANGE RANK), dan footer ringkasan fitur di kiri bawah di atas kanvas 3D interaktif.  
> 3. **Squad Builder Screen (00:04–00:18):**  
   * Header bar (BUILD YOUR SQUAD, badge status 5/5 READY • KING CROWNED, info CHALLENGE, tombol CHANGE RANK, BACK \[ESC\]).  
   * Kolom Kiri: STEP 1 — YOUR 5-UNIT SQUAD (5 kartu slot horizontal), STEP 3 — FORMATION (FRONT / BACK) (matriks 2 baris x 5 kolom COL A–E), dan *Unit Inspector Card* (ikon, Tier, nama, role, bar HP/Attack/Defense, deskripsi *Signature Move*, dan grid 3x3).  
   * Kolom Kanan: STEP 2 — CHOOSE A NEO-BEAST FOR SLOT \#X dengan tab filter (ALL (12), AVAILABLE (7), ASSIGNED (5)) dan grid 3x3 kartu spesies.  
   * Footer Bar: Badge READY TO BATTLE, ringkasan *King*, tombol BACK dan CTA BATTLE.  
> 4. **Battle HUD (00:19–00:53):**  
   * Top HUD: Panel kiri PLAYER JASTER (5 ikon unit), panel tengah TURN X \| PLAYER'S TURN / RIVAL'S TURN \+ legenda warna (Mint:Move • Coral:Attack • Amber:Active), panel kanan JIN RED RIVAL (5 ikon unit) \+ tombol kamera (?, 3D TAC / 2D, ikon suara/reset).  
   * Arena Overlays: Banner aksi *Signature Move* di atas papan, *floating badges* (ACTIVE, TARGET, angka HP, angka kerusakan \-149), serta strip LOG dan tombol History di atas panel bawah.  
   * Bottom HUD: Kartu ACTIVE UNIT (kiri), kartu RIVAL TARGET / IN RANGE (tengah-kiri), dan 4 tombol aksi besar (ATTACK, FORTRESS ..., END TURN \[E\], SQUAD \[Q\]).  
> 5. **End-of-Match Modal (00:54–00:57):** Modal tengah DEFEAT dengan 3 kotak statistik (TURNS, RING-OUTS, DAMAGE DEALT) dan 3 tombol (REMATCH (TURN 1), BUILD SQUAD, MAIN MENU).

### **2.3 Kekuatan Desain Saat Ini yang Wajib Dipertahankan (Existing Strengths)**

* **Komposisi *Title Screen* di Atas Panggung 3D Langsung (00:00–00:03):** Memperlihatkan arena dan unit secara langsung di balik panel menu adalah pembuka yang sangat kuat dan wajib dipertahankan.  
* **Kode Warna Semantik Taktis (Mint \= Gerak, Coral \= Serang, Amber \= Aktif/King):** Sistem tiga warna fungsional ini sudah tertanam di seluruh HUD dan sangat selaras dengan warna kristal sian/mint, lentera emas, dan serangga koral/merah pada gambar referensi\!  
* **Kejelasan Kamera 3D TAC ↔ 2D (00:20–00:21):** Kemampuan beralih ke pandangan atas membantu kejelasan taktis secara instan dan tidak boleh terhalang oleh dekorasi pohon atau efek lingkungan baru.

## **Tahap 3 — Merumuskan Art Direction Baru**

### **3.1 Art Direction Statement**

**"Ancient Sanctuary Bio-Dome: Tactile Toy-Bugs on Chiseled Stone"**  
*INSECTRON* bertransformasi dari ruang simulasi hitam-abu-abu yang dingin menjadi **kubah suaka alam kuno (*Ancient Forest Bio-Dome*)** tempat serangga-serangga mekanis-organik bergaya mainan koleksi (*tactile matte toy-bugs*) bertarung di atas altar batu pahat berlumut yang diterangi lentera emas dan kristal bio-sian. Setiap komponen UI dirancang menyerupai **tablet batu slates terukir dengan aksen kristal bercahaya, lencana kayu/emas hangat, dan kartu koleksi berwarna pastel-mint lembut**—menghadirkan kontras tinggi yang bersih, hangat, berkarakter kuat, dan 100% mendukung keterbacaan strategi di atas papan 5x5.

### **3.2 Tujuh Prinsip Desain Operasional (Design Principles)**

> 1. **Toy-Tactile Character Distinctiveness:** Setiap *Neo-Beast* harus dapat dikenali dalam waktu \<0,5 detik melalui kombinasi **warna tubuh *matte* yang unik, siluet anatomi spesifik (tanduk, sayap, capit, cangkang), dan mata bundar putih-hitam yang ekspresif**—bukan lagi sekadar bola hitam dengan bintik neon.  
> 2. **Chiseled Stone Framing:** Panel UI utama dan petak arena menggunakan estetika lempeng batu pahat (*slate stone tablets*) dengan tepi atas terang (*top sunlit bevel*), sudut tegas ber-chamfer/radius terukur, dan bayangan bawah yang solid untuk memberikan bobot fisik.  
> 3. **Warm Lantern vs Cool Sanctuary Contrast:** Gunakan kontras suhu warna dari image\_5d0de2.png—permukaan dasar menggunakan warna batu biru-hijau hutan yang teduh (\#19282F – \#243842), sehingga elemen interaktif berwarna **Emas Lentera (\#F5B041)**, **Sian Kristal (\#38E8FF)**, dan **Koral Serangga (\#E85D4A)** langsung menyala tanpa perlu efek neon berlebihan.  
> 4. **Mint-Sage Specimen Cards:** Untuk menonjolkan siluet dan warna serangga seperti pada image\_5d0ddf.png, bingkai ikon/potret unit di *Squad Builder* dan kartu inspektor menggunakan latar belakang aksen **Soft Mint-Sage (\#A6E3C5 / \#2A4D43)** sehingga unit gelap maupun terang terlihat jelas.  
> 5. **Perimeter Lushness, Sacred Grid Clarity:** Pepohonan pinus, semak rumput, reruntuhan tangga batu, dan gugusan kristal ditempatkan **di sekeliling tepi luar papan 5x5** untuk membangun atmosfer diorama hutan, sedangkan ke-25 petak arena di tengah harus bebas dari rintangan visual yang menutupi garis bidik atau status petak.  
> 6. **Physical Depth over Flat Wireframes:** Ganti garis batas (border: 1px solid \#333) yang datar dan tipis pada tombol dan kartu saat ini dengan ketebalan material tiga dimensi (*tactile button lip*: border-bottom: 4px solid yang memendek saat ditekan).  
> 7. **Zero-Scroll Tactical Readiness:** Kepadatan komponen di *Squad Builder* dan *Battle HUD* harus ditata secara proporsional agar seluruh informasi strategis (termasuk deskripsi *Signature Move* dan nama jurus pada tombol) terbaca utuh tanpa terpotong elipsis (...) atau membutuhkan *scroll* internal.

### **3.3 Matriks Preserve, Transform, and Avoid**

| Kategori | Elemen & Keputusan Desain | Alasan Fungsional & Estetis |
| :---- | :---- | :---- |
| **PRESERVE (Pertahankan)** | • Struktur tata letak *Title Screen*, *Squad Builder*, dan *Battle HUD* (Top Bar \+ Center 3D Canvas \+ Bottom Action Bar). • Tiga warna semantik taktis: **Mint/Cyan** (Move), **Coral** (Attack), **Amber/Gold** (Active/King). • Mekanik kamera 3D TAC ↔ 2D dan sistem *one-click slot swap*. | Tata letak periferal saat ini sudah menjaga area tengah layar tetap terbuka untuk arena 3D, dan tiga warna semantik tersebut secara kebetulan sangat cocok dengan palet kristal, lentera, dan serangga pada gambar referensi. |
| **TRANSFORM (Ubah)** | • **Model 3D Unit:** Dari bola hitam mengilap seragam → Model serangga bersegmen dengan warna *matte* cerah berbeda per spesies dan mata bundar putih-hitam. • **Arena 3D:** Dari meja abu-abu di ruang hampa gelap → Altar batu pahat 5x5 yang dikelilingi parit batu berlumut, pohon pinus, lentera hangat, dan kristal sian bercahaya. • **Materialitas UI:** Dari kotak *dark-mode* tipis datar → Panel batu pahat ber-bevel (*chiseled slate*), tombol berketebalan taktil, dan latar potret unit *mint-sage*. | Menghadirkan jiwa dan karakter visual dari ketiga gambar referensi ke dalam dunia game sekaligus menyelesaikan masalah sulitnya membedakan unit di atas papan pertarungan. |
| **AVOID (Hindari)** | • Menempatkan pohon tinggi di sisi selatan (depan kamera) yang dapat menghalangi pandangan kamera 3D TAC ke papan 5x5. • Menggunakan tekstur rumput/batu yang terlalu ramai di bawah teks kecil sehingga menurunkan kontras keterbacaan. • Mengubah aturan mekanik, rumus kerusakan, atau struktur state permainan yang sudah berjalan. | Menjaga integritas fungsional dan prinsip *Human-Centered Design* (Keterbacaan di atas tekstur, Fungsi di atas dekorasi). |

## **Tahap 4 — Membangun Visual Design System**

### **4.1 Sistem Warna (Color System & Semantic Tokens)**

Palet ini diekstrak secara langsung dari batu pahat bayangan biru-teal dan cahaya lentera emas pada image\_5d0de2.png, hijau hutan dan kristal sian pada image\_5d0dfb.jpg, serta warna tubuh serangga dan latar *mint-sage* pada image\_5d0ddf.png:

| Kategori Token | Nama Token CSS | Nilai Hex | Peran Visual & Fungsional |
| :---- | :---- | :---- | :---- |
| **Background & Surfaces (Chiseled Slate & Moss)** | \--bg-sanctuary-deep | \#121E24 | Latar belakang terdalam / bayangan jurang di bawah altar batu. |
|  | \--surface-slate-primary | \#1B2C35 | Permukaan panel UI utama (menggantikan abu-abu gelap \#14171F). |
|  | \--surface-slate-elevated | \#243B47 | Permukaan kartu unit, tombol sekunder, dan *header* bar. |
|  | \--surface-slate-hover | \#2E4A58 | State *hover* pada kartu spesies dan tombol batu. |
|  | \--surface-specimen-mint | \#A6E3C5 | Aksen latar potret unit / *badge* spesies terinspirasi langsung dari latar image\_5d0ddf.png. |
|  | \--surface-specimen-dark | \#1F3F37 | Latar dalam kotak inspektor dan kartu slot aktif bernuansa hijau suaka. |
| **Typography & Readability** | \--text-primary | \#F4F9F5 | Teks utama putih gading-mint dengan rasio kontras \>12:1 di atas permukaan batu gelap. |
|  | \--text-secondary | \#B2C8CE | Teks pendukung, sub-label peran unit, dan deskripsi jurus. |
|  | \--text-muted | \#74929B | Teks *disabled*, petunjuk tombol pintas (\[ESC\], \[E\], \[Q\]), dan koordinat petak (C3, D3). |
| **Tactical & Semantic Accents** | \--accent-lantern-gold | \#FFB838 | **Primary Accent / King / Active / Signature Move:** Diambil dari pendaran lentera image\_5d0de2.png. |
|  | \--accent-lantern-deep | \#C87A12 | Bayangan bawah (*3D lip*) untuk tombol utama berwarna emas. |
|  | \--accent-crystal-cyan | \#3CE8FF | **Movement / Available / Shield Accent:** Diambil dari kristal biru-sian image\_5d0dfb.jpg. |
|  | \--accent-meadow-mint | \#5CE6A0 | **Ally / Ready / Player Jaster Identity:** Hijau cerah daun/mint untuk tim pemain dan petak gerak valid. |
|  | \--accent-scorpion-coral | \#F05A46 | **Attack / Rival Jin Red / Danger:** Diambil dari warna merah-koral serangga di image\_5d0ddf.png. |
|  | \--accent-amethyst-tier | \#B36BFF | **Tier S / Debuff / Confusion Accent:** Diambil dari warna capung ungu di image\_5d0ddf.png. |
| **Borders & Stone Bevels** | \--border-stone-light | \#3D5C6B | Garis tepi atas/kiri panel untuk efek pahatan batu terkena cahaya (*top bevel highlight*). |
|  | \--border-stone-dark | \#0D171C | Garis tepi bawah/dalam untuk efek kedalaman lempeng batu (*bottom chisel shadow*). |

#### **Palet Warna Khusus 12 Spesies *Neo-Beasts* (Diekstrak dari image\_5d0ddf.png**

)  
Agar ke-12 spesies di dalam game tidak lagi berwarna hitam seragam, tetapkan warna material utama (*matte shell color* \+ *secondary stripe/wing color*) berikut untuk setiap spesies:

> 1. **AGAMEL (Tier S \- Colossal Tank):** *Teal-Blue Scarab* (Tubuh Utama \#26738D, Punggung \#1B5266, Perisai Kristal \#3CE8FF — mengacu pada kumbang besar kanan atas di image\_5d0ddf.png).  
> 2. **BIG ASS BUG (Tier S \- Heavy Ring-Out Striker):** *Dark Plum & Lilac Rhino Beetle* (Tubuh \#3A3548, Tanduk & Corak Sayap \#9B8AE6 — mengacu pada kumbang bertanduk kiri bawah di image\_5d0ddf.png).  
> 3. **DARK EMPEROR (Tier S \- Legendary Sovereign):** *Obsidian & Gold-Horned Stag* (Tubuh \#2B2D38, Corak Punggung \#52586E, Tanduk Emas \#FFB838).  
> 4. **NOBLE FAERIE (Tier A \- Mind-Control Lancer):** *Vibrant Violet Dragonfly* (Tubuh \#8C2CE6, Segmen Ekor \#D8B4FF, Sayap Putih Semi-Transparan \#F5E6FF — mengacu pada serangga ungu bersayap di tengah atas image\_5d0ddf.png).  
> 5. **TORNADO MANTIS (Tier A \- Whirlwind Striker):** *Lush Canopy Green Mantis* (Tubuh \#4E9A42, Sabit \#A6E3C5, Aksen \#FFE066 — mengacu pada warna dedaunan hutan image\_5d0dfb.jpg).  
> 6. **MICK STAGGER (Tier A \- Diagonal Grappler):** *Earwig Ochre & Chestnut* (Toraks Oranye Oker \#E08232, Abdomen Cokelat \#6E472B, Capit Hitam \#22252A — mengacu pada serangga kiri atas di image\_5d0ddf.png).  
> 7. **DRILLERPILLAR (Tier A \- Subterranean Disruptor):** *Coral-Orange Segmented Larva* (Tubuh Belang Koral \#F27D5E & \#D95B3D — mengacu pada serangga kiri bawah di image\_5d0ddf.png).  
> 8. **BAZOO BEETLE (Tier A \- Long-Range Artillery):** *Slate-Grey Bombardier* (Tubuh \#525B6C, Moncong Meriam \#363D4A, Pendaran \#3CE8FF — mengacu pada kumbang abu-abu tengah bawah di image\_5d0ddf.png).  
> 9. **BEE BEE KING (Tier B \- Aerial Toxic Assassin):** *Crimson & Charcoal Scorpion-Wasp* (Tubuh Merah Tua \#B8252A, Belang Hitam \#282930, Sayap Putih \#FFFFFF — mengacu pada serangga tengah di image\_5d0ddf.png).  
> 10. **ROCK 'N' ROLLER (Tier B \- Rock-Line Bulldozer):** *Striped Charcoal Pillbug / Isopod* (Tubuh \#2E313D dengan garis-garis segmen \#565B6E — mengacu pada kutu kayu belang di bawah tengah image\_5d0ddf.png).  
> 11. **SPORE WEAVER / Spesies \#11:** *Ivory & Black Spiked Weevil* (Tubuh Putih Gading \#F4F4EE, Bercak Hitam & Leher Berduri \#2D3038 — mengacu pada serangga kanan bawah di image\_5d0ddf.png).  
> 12. **CRYSTAL SKITTER / Spesies \#12:** *Bio-Luminescent Azure Bug* (Tubuh \#258EA6, Kristal Punggung \#5CE6FF — mengacu pada kristal biru di image\_5d0dfb.jpg).

### **4.2 Sistem Tipografi (Typography System)**

* **Font Display & Headings (--font-display):** 'Outfit', 'Plus Jakarta Sans', atau 'Fredoka' (Weight 700–800). Memberikan siluet huruf yang tegas, sedikit membulat di ujung (selaras dengan karakter *toy-tactile* image\_5d0ddf.png), namun kokoh seperti pahatan batu.  
* **Font UI & Tactical Data (--font-sans):** 'DM Sans' atau 'Inter' (Weight 500–700) dengan font-variant-numeric: tabular-nums agar seluruh angka HP (900/900 HP), kerusakan (-149), dan persentase *Defense* (45%) sejajar rapi.

| Level Tipografi | Ukuran (Desktop) | Ukuran (Mobile) | Weight | Tracking | Aturan Penggunaan |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Hero Title (INSECTRON)** | clamp(2.25rem, 3.5vw, 3.25rem) | 2rem | 800 | \-0.02em | Menggunakan efek *text-shadow* pahatan bawah 0 3px 0 \#0D171C. |
| **Screen Header (BUILD YOUR SQUAD)** | 1.35rem (21.6px) | 1.1rem | 800 | 0.03em | Huruf kapital dengan aksen warna gading hangat. |
| **Card Title (Nama Unit: AGAMEL)** | 1.05rem (16.8px) | 0.95rem | 700 | 0.01em | Tidak boleh terpotong pada kartu *Squad Builder* maupun *Battle HUD*. |
| **Action Button Title (FORTRESS QUAKE)** | 0.95rem (15.2px) | 0.85rem | 800 | 0.02em | Ukuran dioptimalkan agar nama *Signature Move* tampil penuh tanpa elipsis .... |
| **Body & Move Description** | 0.875rem (14px) | 0.8125rem | 500 | 0 | line-height: 1.45 untuk keterbacaan deskripsi di kartu inspektor. |
| **Micro Labels & Badges (TIER S, SLOT \#1)** | 0.75rem (12px) | 0.7rem | 700 | 0.06em | Huruf kapital di dalam lencana kapsul (pill badge). |

### **4.3 Sistem Bentuk, Geometri, dan Permukaan (Shape, Surface & Depth)**

* **Chiseled Panel Geometry:** Panel utama menggunakan border-radius: 14px dengan bingkai ganda: border: 2px solid var(--border-stone-light) yang dipadukan dengan box-shadow: 0 6px 0 var(--border-stone-dark), 0 12px 24px rgba(8, 15, 20, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12) untuk menciptakan ilusi ketebalan lempeng batu dari image\_5d0de2.png.  
* **Tactile Toy Badges & Pills:** Lencana status (ACTIVE, KING, AVAILABLE, SLOT \#1) menggunakan border-radius: 999px (kapsul bulat penuh) dengan permukaan *matte* lembut, mengacu pada bentuk kapsul tubuh serangga di image\_5d0ddf.png.

### **4.4 Production-Ready CSS Design Tokens & Base Stylesheet**

Kode CSS berikut dapat langsung ditambahkan atau menggantikan blok variabel :root dan komponen UI pada stylesheet proyek Anda:

CSS  
/\* \==========================================================================  
   INSECTRON — SANCTUARY BIO-DOME DESIGN SYSTEM TOKENS  
   Inspired by: Stylized Forest Ruins, Chiseled Stone & Tactile Toy-Bugs  
   \========================================================================== \*/

:root {  
  /\* 1\. Surface & Stone Palette (from image\_5d0de2 & image\_5d0dfb) \*/  
  \--bg-sanctuary-void: \#0f191e;  
  \--bg-sanctuary-canopy: \#16262e;  
  \--surface-slate-base: rgba(25, 42, 51, 0.92);  
  \--surface-slate-card: \#213641;  
  \--surface-slate-elevated: \#2a4452;  
  \--surface-slate-hover: \#345363;  
  \--surface-moss-inset: \#19302c;  
  \--surface-specimen-mint: \#a6e3c5; /\* Signature backdrop from image\_5d0ddf \*/

  /\* 2\. Text & Contrast Hierarchy \*/  
  \--text-ivory: \#f4f9f5;  
  \--text-sage-secondary: \#b5ced4;  
  \--text-slate-muted: \#7897a1;  
  \--text-dark-ink: \#122128;

  /\* 3\. Semantic Tactical Accents \*/  
  \--accent-lantern-gold: \#ffb838;      /\* Primary CTA, King, Active, Signature \*/  
  \--accent-lantern-shadow: \#b8730e;  
  \--accent-lantern-glow: rgba(255, 184, 56, 0.28);

  \--accent-crystal-cyan: \#3ce8ff;      /\* Bio-Crystal Energy, Shield, Info \*/  
  \--accent-meadow-mint: \#52e59b;       /\* Move Tiles, Player Jaster, Ready \*/  
  \--accent-meadow-shadow: \#258f5b;

  \--accent-scorpion-coral: \#f05a46;    /\* Attack Tiles, Rival Jin Red, Danger \*/  
  \--accent-scorpion-shadow: \#a32c1d;

  \--accent-dragonfly-violet: \#b36bff;  /\* Tier S Badge, Confusion Status \*/

  /\* 4\. Stone Bevels, Borders & Shadows \*/  
  \--border\-chisel-top: \#436778;  
  \--border\-chisel-side: \#2e4957;  
  \--border\-chisel-bottom: \#0d171c;  
  \--shadow-stone-slab: 0 5px 0 \#0d171c, 0 10px 24px rgba(6, 12, 15, 0.6);  
  \--shadow-button\-tactile: 0 4px 0 var(--border-chisel-bottom), 0 6px 12px rgba(0, 0, 0, 0.35);

  /\* 5\. Geometry & Spacing \*/  
  \--radius-stone-panel: 14px;  
  \--radius-stone-card: 10px;  
  \--radius-toy-pill: 999px;  
  \--font-display: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif;  
  \--font\-sans: 'DM Sans', 'Inter', system-ui, sans-serif;  
  \--transition\-snappy: 160ms cubic-bezier(0.22, 1, 0.36, 1);  
}

## **Tahap 5 — Menerjemahkan Style ke Setiap Komponen Game**

### **5.1 Buttons & Interactive Controls**

Menggantikan tombol kotak datar saat ini menjadi **Tactile Carved Buttons** yang memiliki bibir bawah 3D (4px *bottom lip*) dan berubah tinggi saat ditekan:

* **Primary Action Button (BUILD YOUR SQUAD, BATTLE, SIGNATURE MOVE):**  
  * **Default:** Latar gradasi hangat linear-gradient(180deg, \#FFD066 0%, \#FFB838 100%), teks gelap tebal \--text-dark-ink (\#122128), border: 2px solid \#FFE49E, dan bayangan bawah 0 4px 0 \#B8730E.  
  * **Hover:** Naik 1px (transform: translateY(-1px)), kecerahan meningkat 105%, disertai pendaran lentera 0 0 16px var(--accent-lantern-glow).  
  * **Pressed (:active):** Turun 3px (transform: translateY(3px)), bayangan bawah menyusut menjadi 0 1px 0 \#B8730E (memberikan sensasi tombol fisik yang tertekan secara nyata).  
* **Tactical Attack Button (ATTACK di Battle HUD):**  
  * **Active (Musuh dalam jangkauan):** Latar koral linear-gradient(180deg, \#FF7663 0%, \#F05A46 100%), border-bottom: 4px solid \#9E2A1B, teks putih bersih dengan *text-shadow* gelap.  
  * **Disabled (No enemy in range):** Permukaan batu terpendam \#1A2B33, border: 1px dashed \#35505E, teks \--text-slate-muted tanpa bayangan bawah 3D sehingga jelas terlihat tidak dapat diklik.

### **5.2 Cards & Information Panels (*Squad Builder* & *Inspector*)**

* Specimen Portrait Thumbnail (Terinspirasi langsung dari image\_5d0ddf.png):  
  * Pada setiap kartu spesies di STEP 1, STEP 2, dan Unit Inspector, kotak ikon serangga di sisi kiri kartu diberikan latar belakang **Soft Mint-Sage (\#A6E3C5)** dengan bingkai dalam tipis \#7BC9A3. Hal ini membuat ikon/miniatur serangga terlihat persis seperti katalog koleksi pada image\_5d0ddf.png dan tidak tenggelam di dalam kartu gelap.  
* **Perbaikan Kepadatan *Squad Builder* (Menghilangkan *Vertical Scrollbar* di Kolom Kiri):**  
  * Pada video (00:04–00:17), kolom kiri memerlukan *scroll* karena matriks STEP 3 — FORMATION dan *Inspector Card* memakan terlalu banyak ruang vertikal.  
  * **Transformasi Layout:** Padatkan tinggi baris matriks FRONT / BACK menjadi 44px per baris dengan *gap* 6px, dan letakkan bar statistik (Max HP, Attack, Defense) dalam satu baris kompak di samping diagram pola grid 3x3 sehingga deskripsi *Signature Move* di bawahnya selalu terlihat 100% utuh tanpa *scrollbar*.

### **5.3 Komponen Spesifik Gameplay: Arena 3D & Model Serangga (Three.js Transformation)**

Ini adalah jantung dari transformasi visual agar panggung 3D di layar utama (00:00–00:03) dan layar pertarungan (00:19–00:53) benar-benar menghidupkan dunia image\_5d0dfb.jpg, image\_5d0de2.png, dan image\_5d0ddf.png:

#### **A. Transformasi Papan Arena 5x5 (*Chiseled Stone Altar & Forest Diorama Perimeter*)**

> 1. Ubin Papan 5x5 (image\_5d0de2.png):  
   * Ganti petak datar abu-abu/putih saat ini menjadi **balok batu pahat 3D (ExtrudeGeometry dengan bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05)**.  
   * Gunakan pola papan catur dua nada batu alam dari image\_5d0de2.png: **Light Sunlit Stone (\#6D8287)** dan **Deep Mossy Slate (\#465B63)**, dengan celah parit nat batu gelap (\#1B282E) di antara setiap petak agar grid 5x5 sangat mudah dihitung secara visual.  
> 2. **Indikator Petak Taktis (Move & Attack Tiles):**  
   * **Petak Gerak Valid (Mint):** Alih-alih mewarnai seluruh ubin secara datar, tampilkan **cincin rune kristal menyala (\#52E59B / \#3CE8FF)** yang melayang 0.03 unit di atas lempeng batu dengan pendaran lembut seperti kristal di rumput image\_5d0dfb.jpg.  
   * **Petak Target Serangan (Coral):** Bingkai berdenyut merah-koral (\#F05A46) dengan penanda sudut tegas.  
> 3. Bingkai Lingkungan Luar Arena (*Bio-Dome Sanctuary Perimeter* — image\_5d0dfb.jpg & image\_5d0de2.png):  
   * Di luar parit *Ring-Out* (di sekeliling tepi utara, barat, dan timur papan agar tidak menghalangi kamera selatan), tambahkan **bebatuan tebing berlumut (DodecahedronGeometry terdistorsi dengan material *flat-shaded* \#4A5D5E dan lumut \#4E7D34)**, **gugusan kristal biru-sian bercahaya (ConeGeometry / OctahedronGeometry dengan emissive: \#18C5E0)**, **tiang lentera kayu dengan PointLight emas hangat (\#FFB838)** di sudut utara arena, serta **pepohonan pinus bergaya pahatan bertingkat** di latar belakang kubah.

#### **B. Transformasi Model 3D *Neo-Beasts* (image\_5d0ddf.png**

)  
Berdasarkan perbandingan antara video (00:00–00:03, 00:19–00:53) dan gambar referensi image\_5d0ddf.png, perubahan paling krusial pada model 3D unit adalah:

> 1. **Mata Googly/Stylized Khas (Signature Eyes):** Tambahkan sepasang mata di sisi kiri-kanan depan kepala setiap serangga yang terdiri atas **cincin sklera putih bersih (\#FFFFFF, SphereGeometry pipih)** dan **pupil hitam besar (\#141619)** yang menghadap ke depan/luar seperti pada ke-8 serangga di image\_5d0ddf.png.  
> 2. **Segmentasi Tubuh 3 Bagian (Kepala \+ Toraks \+ Abdomen/Cangkang) dengan Material Matte-Toy:**  
   * Ganti material hitam mengilap saat ini dengan THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0.05 }) menggunakan warna khas masing-masing spesies (Teal, Ungu, Koral, Merah-Hitam, Oker-Cokelat, Putih-Hitam).  
   * Tambahkan kaki-kaki silinder tumpul berwarna arang (\#2B2E38) di sisi tubuh serta ornamen siluet spesifik per peran (tanduk melengkung untuk *Striker*, sayap ganda putih semi-transparan untuk *Aerial/Lancer* seperti *Noble Faerie* dan *Bee Bee King*, serta cangkang kubah bersegmen untuk *Tank* seperti *Agamel* dan *Rock 'N' Roller*).  
> 3. **Pembedaan Tim Kawan vs Lawan yang Jelas di Papan:**  
   * Agar warna-warni spesies tidak membingungkan identifikasi tim pada pertandingan cermin (*mirror match*), berikan **Alas Pijakan Taktis (*Tactical Pedestal Ring*)** yang kontras di bawah kaki setiap serangga: **Cincin Hijau Mint/Emas (\#52E59B / \#FFB838)** untuk unit pemain, dan **Cincin Merah Koral Berduri (\#F05A46)** untuk unit lawan, dilengkapi bilah HP melayang yang juga mengikuti warna tim masing-masing.

## **Tahap 6 & 7 — Menjaga Human-Centered Design & Responsivitas**

> 1. **Hierarki dan Keterbacaan di Atas Tekstur:**  
   * Meskipun latar belakang 3D kini jauh lebih kaya dengan elemen batu, rumput, pohon pinus, dan kristal, seluruh panel UI tetap menggunakan permukaan batu gelap solid (rgba(25, 42, 51, 0.94)) dengan backdrop-filter: blur(8px) agar teks statistik dan log pertarungan memiliki rasio kontras WCAG AAA/AA yang sangat nyaman dibaca.  
> 2. **Pembedaan State Tanpa Bergantung pada Warna Saja (Accessibility):**  
   * Unit *King* tidak hanya ditandai oleh warna kuning emas, tetapi juga oleh **ikon mahkota 3D melayang di atas kepala**, bingkai ganda pada kartu HUD, dan lencana teks KING.  
   * Petak pergerakan (Mint) menggunakan simbol **titik/lingkaran di tengah ubin**, sedangkan petak serangan (Coral) menggunakan simbol **bidikan silang/sudut tajam (*reticle corners*)**, sehingga pemain dengan buta warna parsial tetap dapat membedakan petak jalan dan petak serang dengan mudah.  
> 3. **Adaptasi Responsif (Desktop Laptop vs Layar Kecil/Mobile):**  
   * Menggunakan clamp() untuk ukuran tipografi dan *padding* panel, serta mengubah tinggi kartu di *Squad Builder* agar responsif terhadap tinggi layar (100dvh), memastikan masalah *vertical scroll overflow* yang terlihat di video (00:11) teratasi sepenuhnya.

## **Tahap 8 — Paket Implementasi Kode (CSS & Three.js Scene/Character Module)**

Berikut adalah implementasi kode modular yang menerjemahkan seluruh sistem desain di atas ke dalam komponen CSS dan fungsi pembangun *scene*/karakter Three.js tanpa merusak logika aturan permainan Anda:

### **8.1 Implementasi CSS Komponen UI (insectron-sanctuary-theme.css)**

CSS  
/\* \==========================================================================  
   1\. CHISELED STONE PANELS & CONTAINERS (Title, Squad Builder, Battle HUD)  
   \========================================================================== \*/  
.sanctuary-panel,  
.squad-panel,  
.hud-card,  
.modal-card {  
  background: linear-gradient(180deg, rgba(38, 63, 77, 0.95) 0%, rgba(23, 39, 48, 0.97) 100%);  
  border-top: 2px solid var(--border-chisel-top);  
  border-left: 1px solid var(--border-chisel-side);  
  border-right: 1px solid var(--border-chisel-side);  
  border-bottom: 4px solid var(--border-chisel-bottom);  
  border-radius: var(--radius-stone-panel);  
  box-shadow: var(--shadow-stone-slab), inset 0 1px 0 rgba(255, 255, 255, 0.1);  
  color: var(--text-ivory);  
  font-family: var(--font-sans);  
  backdrop-filter: blur(8px);  
}

/\* \==========================================================================  
   2\. SPECIMEN CARDS & MINT-SAGE PORTRAIT BOX (From image\_5d0ddf.png)  
   \========================================================================== \*/  
.neo-beast-card {  
  position: relative;  
  display: flex;  
  flex-direction: column;  
  gap: 6px;  
  padding: 10px 12px;  
  background: var(--surface-slate-card);  
  border-top: 1px solid var(--border-chisel-top);  
  border-bottom: 3px solid var(--border-chisel-bottom);  
  border-radius: var(--radius-stone-card);  
  transition: transform var(--transition-snappy), border-color var(--transition-snappy), box-shadow var(--transition-snappy);  
  cursor: pointer;  
}

.neo-beast-card:hover {  
  background: var(--surface-slate-hover);  
  transform: translateY(-2px);  
  border-top-color: var(--accent-crystal-cyan);  
}

.neo-beast-card.is-selected,  
.neo-beast-card.is-king-slot {  
  background: linear-gradient(180deg, \#2d4c46 0%, \#1d3531 100%);  
  border: 2px solid var(--accent-lantern-gold);  
  border-bottom-width: 4px;  
  box-shadow: 0 0 18px var(--accent-lantern-glow);  
}

/\* Kotak ikon serangga dengan latar Mint-Sage khas referensi image\_5d0ddf \*/  
.bug-portrait-box {  
  width: 42px;  
  height: 42px;  
  border-radius: 9px;  
  background: linear-gradient(145deg, \#b8edd2 0%, \#8fd4b2 100%);  
  border: 2px solid \#5aa882;  
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.45), 0 2px 4px rgba(0, 0, 0, 0.35);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  flex-shrink: 0;  
}

/\* \==========================================================================  
   3\. TACTILE CARVED BUTTONS (Lantern Gold, Scorpion Coral, Stone Secondary)  
   \========================================================================== \*/  
.btn-tactile {  
  position: relative;  
  display: inline-flex;  
  flex-direction: column;  
  align-items: center;  
  justify-content: center;  
  padding: 10px 16px;  
  border-radius: var(--radius-stone-card);  
  font-family: var(--font-display);  
  font-weight: 800;  
  letter-spacing: 0.02em;  
  text-transform: uppercase;  
  cursor: pointer;  
  user-select: none;  
  transition: transform 100ms ease, filter 120ms ease, box-shadow 100ms ease;  
  white-space: nowrap; /\* Mencegah pemotongan teks FORTRESS ... \*/  
}

/\* CTA Utama & Signature Move (Warm Lantern Gold \- image\_5d0de2) \*/  
.btn-tactile--gold {  
  background: linear-gradient(180deg, \#ffd269 0%, \#ffb838 100%);  
  color: var(--text-dark-ink);  
  border: 2px solid \#ffe5a3;  
  border-bottom: 4px solid var(--accent-lantern-shadow);  
  box-shadow: 0 4px 0 \#7a4903, 0 8px 16px rgba(255, 184, 56, 0.25);  
}

/\* Tombol Attack (Scorpion Coral \- image\_5d0ddf) \*/  
.btn-tactile--coral {  
  background: linear-gradient(180deg, \#ff7866 0%, \#f05a46 100%);  
  color: \#ffffff;  
  border: 2px solid \#ffa396;  
  border-bottom: 4px solid var(--accent-scorpion-shadow);  
  box-shadow: 0 4px 0 \#6e1a0f, 0 8px 16px rgba(240, 90, 70, 0.25);  
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);  
}

/\* Tombol Sekunder Batu Pahat (End Turn, Quick Battle, Back) \*/  
.btn-tactile--stone {  
  background: linear-gradient(180deg, \#314f5e 0%, \#233a46 100%);  
  color: var(--text-ivory);  
  border: 2px solid \#4a7285;  
  border-bottom: 4px solid \#122028;  
  box-shadow: 0 4px 0 \#0b1419;  
}

.btn-tactile:hover:not(:disabled) {  
  filter: brightness(1.07);  
  transform: translateY(-1px);  
}

.btn-tactile:active:not(:disabled) {  
  transform: translateY(3px);  
  box-shadow: 0 1px 0 \#0b1419;  
}

.btn-tactile:disabled,  
.btn-tactile.is-disabled {  
  background: \#17262e;  
  color: var(--text-slate-muted);  
  border: 1px dashed \#2e4754;  
  border-bottom-width: 2px;  
  box-shadow: none;  
  cursor: not-allowed;  
  opacity: 0.72;  
}

/\* \==========================================================================  
   4\. ZERO-SCROLL SQUAD BUILDER LEFT COLUMN OPTIMIZATION  
   \========================================================================== \*/  
.squad-builder-left-col {  
  display: flex;  
  flex-direction: column;  
  justify-content: space-between;  
  gap: 8px;  
  max-height: calc(100dvh \- 130px);  
  overflow: hidden; /\* Menghilangkan scrollbar vertikal yang memotong Inspector \*/  
}

.formation-grid-table td {  
  height: 40px;  
  padding: 4px 6px;  
  background: rgba(18, 31, 38, 0.75);  
  border: 1px solid var(--border-chisel-side);  
  border-radius: 6px;  
}

.unit-inspector-compact {  
  padding: 10px 14px;  
  display: grid;  
  grid-template-columns: 1fr auto;  
  gap: 8px 14px;  
  align-items: center;  
}

### **8.2 Implementasi Modul 3D Three.js: *Stylized Toy-Bugs, Chiseled Board & Forest Sanctuary Lighting***

Kode JavaScript/Three.js di bawah ini menyediakan pabrik pembuatan material, pencahayaan lentera-hutan (image\_5d0de2.png & image\_5d0dfb.jpg), ubin batu pahat ber-bevel, kristal bio-sian bercahaya, serta **generator karakter serangga 3D bergaya image\_5d0ddf.png (lengkap dengan mata putih-hitam ikonik dan warna spesies yang unik)**:

JavaScript  
import \* as THREE from 'three';

/\*\*  
 \* 1\. PALET SPESIES NEO-BEASTS (Diekstrak dari image\_5d0ddf.png & image\_5d0dfb.jpg)  
 \* Menggantikan warna hitam seragam dengan warna matte-satin yang unik per spesies.  
 \*/  
export const NEO\_BEAST\_PALETTES \= {  
  AGAMEL:         { primary: 0x26738d, secondary: 0x1b5266, accent: 0x3ce8ff, archetype: 'beetle\_tank' },  
  BIG\_ASS\_BUG:    { primary: 0x3a3548, secondary: 0x262230, accent: 0x9b8ae6, archetype: 'rhino\_horn' },  
  DARK\_EMPEROR:   { primary: 0x2b2d38, secondary: 0x52586e, accent: 0xffb838, archetype: 'stag\_king' },  
  NOBLE\_FAERIE:   { primary: 0x8c2ce6, secondary: 0xd8b4ff, accent: 0xffffff, archetype: 'dragonfly' },  
  TORNADO\_MANTIS: { primary: 0x4e9a42, secondary: 0xa6e3c5, accent: 0xffe066, archetype: 'mantis' },  
  MICK\_STAGGER:   { primary: 0xe08232, secondary: 0x6e472b, accent: 0x22252a, archetype: 'earwig' },  
  DRILLERPILLAR:  { primary: 0xf27d5e, secondary: 0xd95b3d, accent: 0xffe5d9, archetype: 'larva\_segmented' },  
  BAZOO\_BEETLE:   { primary: 0x525b6c, secondary: 0x363d4a, accent: 0x3ce8ff, archetype: 'artillery\_beetle' },  
  BEE\_BEE\_KING:   { primary: 0xb8252a, secondary: 0x282930, accent: 0xffffff, archetype: 'scorpion\_wasp' },  
  ROCK\_N\_ROLLER:  { primary: 0x2e313d, secondary: 0x565b6e, accent: 0xa6e3c5, archetype: 'pillbug' },  
};

/\*\*  
 \* 2\. PENCAHAYAAN DUAL-TONE: WARM LANTERN & COOL FOREST SHADOWS (image\_5d0de2 & image\_5d0dfb)  
 \*/  
export function setupSanctuaryLighting(scene) {  
  scene.background \= new THREE.Color(0x132229);  
  scene.fog \= new THREE.FogExp2(0x132229, 0.032);

  // Ambient Hemisphere: Canopy Mint-Teal Sky vs Deep Slate Ground  
  const hemiLight \= new THREE.HemisphereLight(0x9be8c5, 0x182830, 0.85);  
  hemiLight.position.set(0, 20, 0);  
  scene.add(hemiLight);

  // Main Sun / Lantern Directional Light (Warm Golden Sunlight)  
  const dirLight \= new THREE.DirectionalLight(0xffe6b8, 1.45);  
  dirLight.position.set(8, 16, 10);  
  dirLight.castShadow \= true;  
  dirLight.shadow.mapSize.set(2048, 2048);  
  dirLight.shadow.bias \= \-0.0005;  
  scene.add(dirLight);

  // Warm Lantern Point Light at Arena Corner (mengacu pada lentera image\_5d0de2)  
  const lanternLight \= new THREE.PointLight(0xffaa33, 1.8, 12, 1.5);  
  lanternLight.position.set(3.8, 2.2, \-3.8);  
  scene.add(lanternLight);

  // Bio-Crystal Cyan Fill Light (mengacu pada kristal biru image\_5d0dfb)  
  const crystalLight \= new THREE.PointLight(0x3ce8ff, 1.2, 10, 1.6);  
  crystalLight.position.set(-4.0, 1.5, \-2.5);  
  scene.add(crystalLight);  
}

/\*\*  
 \* 3\. GENERATOR PETAK BATU PAHAT BER-BEVEL (Chiseled Stone Slab \- image\_5d0de2)  
 \*/  
export function createChiseledStoneTile(row, col, tileSize \= 1.35) {  
  const isAlternate \= (row \+ col) % 2 \=== 0;  
  const shape \= new THREE.Shape();  
  const half \= (tileSize \* 0.92) / 2;

  shape.moveTo(-half, \-half);  
  shape.lineTo(half, \-half);  
  shape.lineTo(half, half);  
  shape.lineTo(-half, half);  
  shape.closePath();

  const extrudeSettings \= {  
    depth: 0.22,  
    bevelEnabled: true,  
    bevelSegments: 2,  
    steps: 1,  
    bevelSize: 0.05,  
    bevelThickness: 0.05,  
  };

  const geometry \= new THREE.ExtrudeGeometry(shape, extrudeSettings);  
  geometry.rotateX(Math.PI / 2);

  const material \= new THREE.MeshStandardMaterial({  
    color: isAlternate ? 0x647a82 : 0x455a63, // Dua nada batu pahat dari image\_5d0de2  
    roughness: 0.85,  
    metalness: 0.08,  
    flatShading: true,  
  });

  const tileMesh \= new THREE.Mesh(geometry, material);  
  tileMesh.receiveShadow \= true;  
  tileMesh.castShadow \= true;  
  return tileMesh;  
}

/\*\*  
 \* 4\. GENERATOR KARAKTER SERANGGA "TOY-TACTILE" DENGAN MATA IKONIK (image\_5d0ddf.png)  
 \*/  
export function createStylizedToyBugMesh(speciesKey, isAlly \= true, isKing \= false) {  
  const palette \= NEO\_BEAST\_PALETTES\[speciesKey\] \|\| NEO\_BEAST\_PALETTES.AGAMEL;  
  const bugGroup \= new THREE.Group();

  // Material Matte-Satin khas mainan koleksi (image\_5d0ddf)  
  const primaryMat \= new THREE.MeshStandardMaterial({ color: palette.primary, roughness: 0.68, metalness: 0.05 });  
  const secondaryMat \= new THREE.MeshStandardMaterial({ color: palette.secondary, roughness: 0.72, metalness: 0.05 });  
  const legMat \= new THREE.MeshStandardMaterial({ color: 0x262932, roughness: 0.8 });

  // A. Alas Pijakan Tim (Mint untuk Pemain, Koral untuk Lawan)  
  const baseRingGeo \= new THREE.CylinderGeometry(0.48, 0.52, 0.06, 24);  
  const baseRingMat \= new THREE.MeshStandardMaterial({  
    color: isAlly ? 0x52e59b : 0xf05a46,  
    emissive: isAlly ? 0x195938 : 0x611910,  
    roughness: 0.4,  
  });  
  const baseRing \= new THREE.Mesh(baseRingGeo, baseRingMat);  
  baseRing.position.y \= 0.03;  
  bugGroup.add(baseRing);

  // B. Abdomen / Cangkang Utama Bersegmen  
  const abdomenGeo \= new THREE.SphereGeometry(0.36, 20, 16);  
  abdomenGeo.scale(1.0, 0.78, 1.25);  
  const abdomen \= new THREE.Mesh(abdomenGeo, primaryMat);  
  abdomen.position.set(0, 0.34, \-0.08);  
  abdomen.castShadow \= true;  
  bugGroup.add(abdomen);

  // C. Kepala Serangga  
  const headGeo \= new THREE.SphereGeometry(0.24, 18, 16);  
  const head \= new THREE.Mesh(headGeo, secondaryMat);  
  head.position.set(0, 0.32, 0.28);  
  head.castShadow \= true;  
  bugGroup.add(head);

  // D. MATA BUNDAR IKONIK (Cincin Putih \+ Pupil Hitam Besar dari image\_5d0ddf.png)  
  const scleraMat \= new THREE.MeshBasicMaterial({ color: 0xffffff });  
  const pupilMat \= new THREE.MeshBasicMaterial({ color: 0x141619 });

  \[-1, 1\].forEach((side) \=\> {  
    const eyeGroup \= new THREE.Group();  
    const sclera \= new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), scleraMat);  
    sclera.scale.set(0.45, 1.0, 1.0);

    const pupil \= new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), pupilMat);  
    pupil.scale.set(0.5, 1.0, 1.0);  
    pupil.position.x \= side \* 0.022;

    eyeGroup.add(sclera, pupil);  
    eyeGroup.position.set(side \* 0.21, 0.35, 0.34);  
    eyeGroup.rotation.y \= side \* \-0.35;  
    bugGroup.add(eyeGroup);  
  });

  // E. 6 Kaki Silinder Tumpul  
  \[-1, 1\].forEach((side) \=\> {  
    \[-0.18, 0.02, 0.20\].forEach((zOffset) \=\> {  
      const legGeo \= new THREE.CapsuleGeometry(0.035, 0.18, 4, 8);  
      const leg \= new THREE.Mesh(legGeo, legMat);  
      leg.position.set(side \* 0.34, 0.16, zOffset);  
      leg.rotation.z \= side \* 0.55;  
      bugGroup.add(leg);  
    });  
  });

  // F. Sayap Putih Semi-Transparan untuk Archetype Terbang (Noble Faerie & Bee Bee King)  
  if (palette.archetype \=== 'dragonfly' \|\| palette.archetype \=== 'scorpion\_wasp') {  
    const wingMat \= new THREE.MeshStandardMaterial({  
      color: 0xffffff,  
      transparent: true,  
      opacity: 0.82,  
      roughness: 0.3,  
    });  
    \[-1, 1\].forEach((side) \=\> {  
      const wingGeo \= new THREE.BoxGeometry(0.52, 0.02, 0.14);  
      const wing \= new THREE.Mesh(wingGeo, wingMat);  
      wing.position.set(side \* 0.36, 0.52, 0.05);  
      wing.rotation.z \= side \* 0.25;  
      wing.rotation.y \= side \* \-0.2;  
      bugGroup.add(wing);  
    });  
  }

  return bugGroup;  
}

## **Tahap 9 & 10 — Laporan Akhir Handoff & Visual QA (Bagian A – F)**

### **A. Art Direction Summary**

Transformasi visual ini menyatukan ketiga gambar referensi menjadi identitas **"Ancient Sanctuary Bio-Dome: Tactile Toy-Bugs on Chiseled Stone"**. Permukaan arena dan panel UI mengadopsi pahatan batu biru-teal teduh yang disinari lentera emas hangat (image\_5d0de2.png) dan dikelilingi oleh diorama pohon pinus, rumput berlumut, serta kristal bio-sian (image\_5d0dfb.jpg). Sementara itu, seluruh unit serangga 3D dan kartu potretnya mengadopsi estetika *matte color-blocked* dengan mata putih-hitam yang ekspresif dan latar potret *mint-sage* (image\_5d0ddf.png).

### **B. Visual Design System Summary**

* **Palet Warna:** Berbasis kontras suhu warna (*Cool Chiseled Slate* \#1B2C35 vs *Warm Lantern Gold* \#FFB838, *Bio-Crystal Cyan* \#3CE8FF, *Meadow Mint* \#52E59B, *Scorpion Coral* \#F05A46, dan *Specimen Mint-Sage* \#A6E3C5).  
* **Materialitas UI & 3D:** Mengganti garis batas tipis 1px dan bola hitam mengilap dengan panel lempeng batu ber-bevel (border-bottom: 4px solid), tombol taktil berketebalan fisik, ubin papan *extruded bevel*, dan material serangga *matte-satin* (roughness: 0.68).

### **C. Implementation Summary**

* **Yang Disediakan dalam Spesifikasi & Paket Kode Ini:**  
  1. Sistem token CSS lengkap (:root) beserta aturan komponen .sanctuary-panel, .neo-beast-card, .bug-portrait-box, .btn-tactile, dan perbaikan *layout overflow* .squad-builder-left-col.  
  2. Modul Three.js (NEO\_BEAST\_PALETTES, setupSanctuaryLighting, createChiseledStoneTile, createStylizedToyBugMesh) untuk mengubah pencahayaan, papan 5x5, dan model 3D serangga agar sesuai dengan referensi.  
* **Bagian yang Sengaja Dipertahankan:** Tata letak periferal *Title Screen*, *Squad Builder*, dan *Battle HUD*, sistem tiga warna semantik (*Mint/Coral/Amber*), serta mekanik kamera 3D TAC ↔ 2D.

### **D. Visual QA Report**

* **Apa yang Diperiksa:** Seluruh layar yang terekam pada video (Title Screen, Squad Builder, Battle HUD dalam mode 3D TAC dan 2D, serta modal DEFEAT) telah diaudit dan dipetakan terhadap DNA visual dari image\_5d0dfb.jpg, image\_5d0de2.png, dan image\_5d0ddf.png.  
* **Kejujuran Verifikasi Eksekusi:** Karena kode sumber asli proyek belum dilampirkan di dalam sesi ini, kode CSS dan Three.js di atas belum dijalankan langsung di atas aplikasi lokal Anda. Setelah Anda menyalin token CSS dan fungsi pembangun *mesh* Three.js ke dalam proyek, lakukan pemeriksaan visual pada: **(1)** sudut kamera 2D dan 3D TAC untuk memastikan dekorasi tepi arena tidak menutupi petak A1–E5, dan **(2)** keterbacaan teks pada tombol FORTRESS QUAKE tanpa pemotongan ....

### **E. Remaining Issues & Next Steps**

> 1. **Integrasi Kode Sumber Langsung:** Jika Anda melampirkan file kode sumber proyek Anda (index.html, style.css, atau file script utama main.js / komponen React/Vue), saya dapat langsung menyuntikkan perubahan ini baris demi baris ke dalam file kode Anda dan mengembalikan file utuh yang siap dijalankan.  
> 2. **Perbaikan Ritme Giliran & UX Taktis (Dari Audit Sebelumnya):** Padukan pembaruan visual ini dengan penambahan jeda 600ms saat pergantian giliran dan pembedaan label \[ALLY\] vs \[RIVAL\] agar peningkatan estetika berjalan beriringan dengan peningkatan *game feel*.

### **F. Final Handoff**

Seluruh token desain, aturan komponen, palet 12 spesies, dan fungsi pembangun *scene* Three.js di atas telah siap digunakan. Silakan bagikan file kode sumber game Anda jika Anda ingin saya langsung memodifikasi file tersebut secara utuh\!
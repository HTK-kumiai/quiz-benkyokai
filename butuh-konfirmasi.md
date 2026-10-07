# Butuh Konfirmasi - Kunsei

Aku sudah mengekstrak soal Kunsei senmonkyu dari `soal-asli/kunsei_2025_senmonkyu.docx` dan mengisi `reading`, `terjemahan`, dan `answer` sebagai draf awal. Tolong cek lagi transkripsi, reading, terjemahan, dan benar/salah sebelum dimasukkan ke aplikasi.

## Ringkasan Sumber

- `kunsei_2025_senmonkyu.docx`: 35 soal total.
- Bagian `共通問題`: 20 soal.
- Bagian `専門問題`: 15 soal.
- Tahun sumber: 2025.
- Level sumber dari nama file: `senmonkyu`.

## Hal yang Perlu Dikonfirmasi

- Semua soal id 1-35: cek ulang `reading` romaji, `terjemahan`, dan `answer`.
- Semua soal memiliki catatan `inferred`: kunci jawaban tidak tertulis eksplisit di sumber, jadi aku isi sebagai draf berdasarkan isi pernyataan.
- DOCX memakai furigana/ruby. Kolom `soal` aku ambil dari teks dasar Jepang, sedangkan `reading` aku susun dari furigana/kana sumber.
- Id 3: terjemahan sumber menulis “Vitamin”, sementara teks Jepang menyebut `たんぱく質` (protein). Aku pertahankan makna teks Jepang dalam catatan review ini? Mohon cek apakah terjemahan perlu diganti menjadi protein.
- Id 15: furigana sumber untuk `良い魚` terbaca kurang lengkap; reading aku isi `Sendo no yoi sakana...` berdasarkan teks Jepang.
- Id 22: sumber hanya menyebut `冷くん方` dan `温くん方`; mohon cek apakah pernyataan/metode sudah lengkap menurut materi Kunsei.
- Id 24: terjemahan sumber berbunyi “akan membeku”, tetapi teks Jepang bermakna “dibekukan” saat penyimpanan lama; mohon cek terjemahan.
- Id 28: furigana sumber pada `使う` tampak janggal saat diekstrak; reading aku isi `tsukau` berdasarkan teks Jepang.

## Draf Reading, Terjemahan, dan Jawaban

| id  | tahun | soal                                | terjemahan                                                                                                          | reading                                                                                              | answer | catatan  |
| --- | ----- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------ | -------- |
| 1   | 2025  | 水産加工食品の原料になる魚介藻類は、種類が多い。            | Ikan dan lumut yang menjadi bahan pangan pengolahan hasil laut jenisnya ada banyak.                                 | Suisan kakou shokuhin no genryou ni naru gyokai sourui wa, shurui ga ooi.                            | ○      | inferred |
| 2   | 2025  | 魚介類の脂肪には、EPAが含まれていない。               | Lemak pada jenis ikan tidak mengandung EPA.                                                                         | Gyokairui no shibou ni wa, EPA ga fukumarete inai.                                                   | ×      | inferred |
| 3   | 2025  | 魚肉に含まれるたんぱく質は、酵素作用によって分解されやすい。      | Protein yang terkandung dalam daging ikan mudah dipecah oleh kerja enzim.                                           | Gyoniku ni fukumareru tanpakushitsu wa, kouso sayou ni yotte bunkai sareyasui.                       | ○      | inferred |
| 4   | 2025  | 魚が死んでも、魚の筋肉は変化しない。                  | Otot dalam ikan tidak akan berubah meski sudah mati.                                                                | Sakana ga shindemo, sakana no kinniku wa henka shinai.                                               | ×      | inferred |
| 5   | 2025  | 魚介類は、季節や場所によって獲れる量が変わる。             | Jumlah hewan laut yang bisa diambil berubah tergantung musim dan tempat.                                            | Gyokairui wa, kisetsu ya basho ni yotte toreru ryou ga kawaru.                                       | ○      | inferred |
| 6   | 2025  | 魚肉の成分は、貯蔵中に変化する。                    | Komponen daging ikan berubah dalam masa penyimpanan.                                                                | Gyoniku no seibun wa, chozou chuu ni henka suru.                                                     | ○      | inferred |
| 7   | 2025  | 魚体の選別は、機械でできないので、必ず人の手と目で行う。        | Penyortiran daging ikan yang tidak bisa dengan mesin, harus dilakukan dengan tangan dan mata.                       | Gyotai no senbetsu wa, kikai de dekinai node, kanarazu hito no te to me de okonau.                   | ×      | inferred |
| 8   | 2025  | 大出刃包丁は、小さい魚を捌く時だけ使う。                | Pisau Odeba hanya digunakan ketika memotong ikan kecil.                                                             | Oodeba bouchou wa, chiisai sakana wo sabaku toki dake tsukau.                                        | ×      | inferred |
| 9   | 2025  | 魚介藻類を加工すると、保存性を向上させることができる。         | Lama penyimpanan hewan laut dapat ditingkatkan dengan mengolahnya.                                                  | Gyokai sourui wo kakou suru to, hozonsei wo koujou saseru koto ga dekiru.                            | ○      | inferred |
| 10  | 2025  | 水分の多い魚肉は、冷凍してもすぐに腐る。                | Daging ikan dengan banyak kandungan air segera membusuk bahkan setelah dibekukan.                                   | Suibun no ooi gyoniku wa, reitou shite mo sugu ni kusaru.                                            | ×      | inferred |
| 11  | 2025  | 水産加工食品は、水分活性を下げることで、保存性が高くなる。       | Masa penyimpanan pangan olahan hasil laut dapat meningkat hanya dengan mengurangi kadar air.                        | Suisan kakou shokuhin wa, suibun kassei wo sageru koto de, hozonsei ga takaku naru.                  | ○      | inferred |
| 12  | 2025  | 水産加工食品は、脂質が酸化すると、品質が良くなる。           | Apabila kadar lemak pangan olahan hasil laut mengalami oksidasi, kualitas akan meningkat.                           | Suisan kakou shokuhin wa, shishitsu ga sanka suru to, hinshitsu ga yoku naru.                        | ×      | inferred |
| 13  | 2025  | 冷凍された原料の、冷凍の方法は、製品の品質に影響する。         | Metode pembekuan untuk bahan yang dibekukan berpengaruh pada kualitas produk.                                       | Reitou sareta genryou no, reitou no houhou wa, seihin no hinshitsu ni eikyou suru.                   | ○      | inferred |
| 14  | 2025  | 冷凍温度が高い魚肉は、解凍した時に、ドリップが出にくくなる。      | Daging ikan dengan suhu pembekuan tinggi setelah dicairkan tidak mudah mengeluarkan tetesan.                        | Reitou ondo ga takai gyoniku wa, kaitou shita toki ni, dorippu ga denikuku naru.                     | ×      | inferred |
| 15  | 2025  | 鮮度の良い魚の表皮は、光沢がある。                   | Kulit permukaan ikan dengan kesegaran yang bagus itu mengkilap.                                                     | Sendo no yoi sakana no hyouhi wa, koutaku ga aru.                                                    | ○      | inferred |
| 16  | 2025  | 水産加工場では、おいしい製品が作れば、安全でなくても良い。       | Di dalam pabrik pengolahan hasil ikan, tidak harus aman apabila bisa membuat produk yang lezat.                     | Suisan kakouba de wa, oishii seihin ga tsukureba, anzen de nakutemo yoi.                             | ×      | inferred |
| 17  | 2025  | 従業員が、外から食中毒細菌や異物を持ち込むことがある。         | Ada kalanya karyawan membawa bakteri keracunan makanan atau benda asing dari luar.                                  | Juugyouin ga, soto kara shokuchuudoku saikin ya ibutsu wo mochikomu koto ga aru.                     | ○      | inferred |
| 18  | 2025  | 手袋をつける前には手洗いはしなくても良い。               | Tidak perlu mencuci tangan sebelum mengenakan sarung tangan.                                                        | Tebukuro wo tsukeru mae ni wa, tearai wa shinakutemo yoi.                                            | ×      | inferred |
| 19  | 2025  | 毎日使う機械や器具は、洗わなくて良い。                 | Tidak perlu mencuci mesin atau alat yang digunakan setiap hari.                                                     | Mainichi tsukau kikai ya kigu wa, arawanakute yoi.                                                   | ×      | inferred |
| 20  | 2025  | 水産加工場を衛生的に管理して、製品への二次汚染を防ぐことが大切である。 | Penting untuk mencegah polusi kedua terhadap produk dengan pengelolaan kebersihan pabrik pengolahan hasil laut.     | Suisan kakouba wo eiseiteki ni kanri shite, seihin e no niji osen wo fusegu koto ga taisetsu de aru. | ○      | inferred |
| 21  | 2025  | くん煙を食品にかけると、食品の風味や保存性がよくなる。         | Rasa dan daya simpan makanan akan menjadi lebih baik jika diasapkan.                                                | Kunen wo shokuhin ni kakeru to, shokuhin no fuumi ya hozonsei ga yoku naru.                          | ○      | inferred |
| 22  | 2025  | くん製の方法には、冷くん方や温くん方がある。              | Terdapat dua metode dalam pengasapan, yaitu metode reikun dan onkun.                                                | Kunsei no houhou ni wa, reikunhou ya onkunhou ga aru.                                                | ○      | inferred |
| 23  | 2025  | 温くん方で製造した製品は、水分が少ないので、常温で長い期間貯蔵できる。 | Produk pangan yang diproduksi dengan metode onkun dapat disimpan lama karena kadar airnya sedikit.                  | Onkunhou de seizou shita seihin wa, suibun ga sukunai node, jouon de nagai kikan chozou dekiru.      | ×      | inferred |
| 24  | 2025  | 水分の多いくん製品を、長い期間貯蔵する時は、凍結する。         | Produk asapan yang punya kadar air banyak akan membeku jika disimpan dalam waktu lama.                              | Suibun no ooi kunseihin wo, nagai kikan chozou suru toki wa, touketsu suru.                          | ○      | inferred |
| 25  | 2025  | くん製品は、真空包装することができない。                | Produk asapan tidak dapat dimasukkan wadah vakum.                                                                   | Kunseihin wa, shinkuu housou suru koto ga dekinai.                                                   | ×      | inferred |
| 26  | 2025  | くん煙室の中の温度を、調整できるくん煙装置はない。           | Tidak ada peralatan yang bisa mengatur suhu di dalam ruangan pengasapan.                                            | Kunenshitsu no naka no ondo wo, chousei dekiru kunen souchi wa nai.                                  | ×      | inferred |
| 27  | 2025  | 脂肪が少ない原料は、脂肪が多い原料に比べて、乾燥に時間がかかる。    | Bahan baku yang lemaknya sedikit lebih lama kering dibandingkan bahan yang lemaknya banyak.                         | Shibou ga sukunai genryou wa, shibou ga ooi genryou ni kurabete, kansou ni jikan ga kakaru.          | ×      | inferred |
| 28  | 2025  | くん製に使うくん材は、樹脂が少ない広葉樹が適している。         | Bahan pengasapan untuk produk asapan biasanya menggunakan pohon daun lebar yang lemak pohonnya sedikit.             | Kunsei ni tsukau kunzai wa, jushi ga sukunai kouyouju ga tekishite iru.                              | ○      | inferred |
| 29  | 2025  | くん製品の保存性が良くなるのは、くん煙の殺菌作用や酸化防止作用による。 | Membaiknya daya simpan produk asap tergantung fungsi disinfeksi atau pencegahan oksidasi.                           | Kunseihin no hozonsei ga yoku naru no wa, kunen no sakkin sayou ya sanka boushi sayou ni yoru.       | ○      | inferred |
| 30  | 2025  | スモークサーモンは、サケをくん製した水産加工食品である。        | Smoke salmon adalah produk hasil laut yang berupa ikan sake asap.                                                   | Sumooku saamon wa, sake wo kunsei shita suisan kakou shokuhin de aru.                                | ○      | inferred |
| 31  | 2025  | 水産加工場では、安全でなくても良い。                  | Di pabrik pengolahan hasil laut, asalkan bisa membuat produk yang lezat, tidak harus aman.                          | Suisan kakouba de wa, anzen de nakutemo yoi.                                                         | ×      | inferred |
| 32  | 2025  | 従業員が、外から食中毒細菌や異物を持ち込むことがある。         | Karyawan dapat membawa bakteri penyebab keracunan makanan atau benda asing dari luar.                               | Juugyouin ga, soto kara shokuchuudoku saikin ya ibutsu wo mochikomu koto ga aru.                     | ○      | inferred |
| 33  | 2025  | 手袋をつける前には、手洗いはしなくても良い。              | Sebelum memakai sarung tangan, tidak perlu mencuci tangan.                                                          | Tebukuro wo tsukeru mae ni wa, tearai wa shinakutemo yoi.                                            | ×      | inferred |
| 34  | 2025  | 毎日使う機械や器具は、洗わなくて良い。                 | Mesin dan peralatan yang digunakan setiap hari tidak perlu dicuci.                                                  | Mainichi tsukau kikai ya kigu wa, arawanakute yoi.                                                   | ×      | inferred |
| 35  | 2025  | 水産加工場を衛生的に管理して、製品への二次汚染を防ぐことが大切である。 | Penting untuk mengelola pabrik pengolahan hasil laut secara higienis dan mencegah kontaminasi sekunder pada produk. | Suisan kakouba wo eiseiteki ni kanri shite, seihin e no niji osen wo fusegu koto ga taisetsu de aru. | ○      | inferred |


---

# Tambahan Kensetsu 2017-2020 (diproses langsung atas persetujuan user)

Sumber: `soal-asli/kensetsu 2017 shokyu.pdf`,  `kensetsu 2018 shokyu.pdf`,  `kensetsu 2019 shokyu.pdf`,  dan `kensetsu 2020 shokyu.pdf`. Total 80 soal baru,  level `shokyu`. Soal sudah dimasukkan ke bank aplikasi sebagai ID 596-675; tabel ini menjadi catatan review sambil jalan.

| id | tahun | soal | terjemahan | reading | answer | catatan |
| --- | --- | --- | --- | --- | --- | --- |
| 596 | 2017 | 車両系建設機械等を運転する場合、ヘルメットや安全用具をつけ、服装をととのえて、機械を運転します。 | Ketika akan mengoperasikan mesin konstruksi dan lain-lain,  kenakan helm,  perlengkapan keselamatan,  dan pakaian yang sesuai. | sharyoukeikensetsukikainadowountensurubaai, herumettoyaanzenyouguwotsuke, fukusouwototonoete, kikaiwountenshimasu. | ○ | source/inferred |
| 597 | 2017 | ヘルメットや安全用具をつけて、運転します。 | Mengoperasikan mesin dengan mengenakan helm dan perlengkapan keselamatan. | herumettoyaanzenyouguwotsukete, untenshimasu. | ○ | source/inferred |
| 598 | 2017 | ヘルメットをつけるときは、あごひものしめつけをします。 | Kencangkan tali dagu ketika mengenakan helm. | herumettowotsukerutokiha, agohimonoshimetsukewoshimasu. | ○ | source/inferred |
| 599 | 2017 | 作業開始（乗車）前に周囲の安全確認をします。 | Pastikan keamanan sekitar sebelum memulai pekerjaan (naik mesin). | sagyoukaishi(jousha)maenishuuinoanzenkakuninwoshimasu. | ○ | source/inferred |
| 600 | 2017 | 機械の乗り降りは必ず３点支持（両手と片足、または片手と両足）で行います。 | Naik dan turun dari mesin harus selalu menggunakan tiga titik tumpuan (kedua tangan dan satu kaki,  atau satu tangan dan kedua kaki). | kikainonoriorihakanarazusantenshiji(ryoutetokataashi, matahakatatetoryouashi)deokonaimasu. | ○ | source/inferred |
| 601 | 2017 | 作業をするとき、運転席でないところに、人を乗せてもいいです。 | Saat bekerja,  boleh membawa orang di tempat yang bukan kursi pengemudi. | sagyouwosurutoki, untensekidenaitokoroni, ninwonosetemoiidesu. | × | source/inferred |
| 602 | 2017 | 建設機械の運転者は、エンジンをかけたまま、運転席を離れてはいけません。 | Pengemudi mesin konstruksi tidak boleh meninggalkan kursi pengemudi ketika mesin masih menyala. | kensetsukikainountenshaha, enjinwokaketamama, untensekiwohanaretehaikemasen. | ○ | source/inferred |
| 603 | 2017 | ブレーキやバケットなどは、地面に下げておかなくてもよいです。 | Rem,  bucket,  dan bagian lainnya tidak perlu diturunkan ke tanah. | bureekiyabakettonadoha, jimennisageteokanakutemoyoidesu. | × | source/inferred |
| 604 | 2017 | 作業レバーはすべて中立にして、ロックをします。 | Semua tuas kerja dinetralkan lalu dikunci. | sagyourebaahasubetechuuritsunishite, rokkuwoshimasu. | ○ | source/inferred |
| 605 | 2017 | エンジン停止中は、作業レバーを操作してもよいです。 | Tuas kerja boleh dioperasikan ketika mesin sedang berhenti. | enjinteishichuuha, sagyourebaawosousashitemoyoidesu. | × | source/inferred |
| 606 | 2017 | ブルドーザーはトラクタにブレードを取り付けた機械で、大きいブルドーザーは掘削作業に、小さいブルドーザーは押土や整地作業などに使われます。 | Buldozer adalah mesin berupa traktor yang dipasangi blade. Buldozer besar digunakan untuk penggalian,  sedangkan buldozer kecil untuk mendorong dan meratakan tanah. | burudoozaahatorakutanibureedowotoritsuketakikaide, ookiiburudoozaahakussakusagyouni, chiisaiburudoozaahaoudoyaseichisagyounadonitsukawaremasu. | ○ | source/inferred |
| 607 | 2017 | バックホウは主に地面よりも下の掘削に使われて、油圧ショベルの中でもっともよくみかける機械です。 | Backhoe terutama digunakan untuk menggali di bawah permukaan tanah dan merupakan mesin yang paling sering dijumpai di antara shovel hidrolik. | bakkuhouhaomonijimenyorimoshitanokussakunitsukawarete, yuatsushoberunonakademottomoyokumikakerukikaidesu. | ○ | source/inferred |
| 608 | 2017 | ローディングショベルは主に地面にある土砂や岩石の積み込み作業に使われます。 | Loading shovel terutama digunakan untuk memuat tanah dan batu yang berada di permukaan tanah. | roodingushoberuhaomonijimenniarudoshayagansekinotsumikomisagyounitsukawaremasu. | ○ | source/inferred |
| 609 | 2017 | ローラは、土砂やアスファルトなどを掘削する作業に使われる機械です。 | Roller adalah mesin yang digunakan untuk menggali tanah,  aspal,  dan sebagainya. | rooraha, doshayaasufarutonadowokussakusurusagyounitsukawarerukikaidesu. | × | source/inferred |
| 610 | 2017 | ローラのエンジンは４サイクルです。 | Mesin roller adalah mesin empat tak. | rooranoenjinhayon saikurudesu. | ○ | source/inferred |
| 611 | 2017 | ローラのエンジンの燃料はディーゼルエンジンだけです。 | Bahan bakar mesin roller hanya diesel. | rooranoenjinnonenryouhadiizeruenjindakedesu. | × | source/inferred |
| 612 | 2017 | 建設機械には主に４サイクル式で水冷式のディーゼルエンジンが使われています。 | Mesin konstruksi terutama menggunakan mesin diesel empat tak dengan pendingin air. | kensetsukikainihaomoniyon saikurushikidesuireishikinodiizeruenjingatsukawareteimasu. | ○ | source/inferred |
| 613 | 2017 | ディーゼルエンジンの燃料はガソリンです。 | Bahan bakar mesin diesel adalah bensin. | diizeruenjinnonenryouhagasorindesu. | × | source/inferred |
| 614 | 2017 | 燃料に水が混じる（水が入る）と、エンジンの調子が悪くなるので、水が混じらないように注意する必要があります。 | Jika air tercampur ke dalam bahan bakar,  kondisi mesin memburuk sehingga harus berhati-hati agar air tidak tercampur. | nenryounimizugamajiru(mizugairu)to, enjinnochoushigawarukunarunode, mizugamajiranaiyounichuuisuruhitsuyougaarimasu. | ○ | source/inferred |
| 615 | 2017 | 現場での点検、整備はどこでやってもかまいません。 | Pemeriksaan dan perawatan di lapangan boleh dilakukan di mana saja. | genbadenotenken, seibihadokodeyattemokamaimasen. | × | source/inferred |
| 616 | 2018 | ときどきですが、ヘルメットをつけないで機械を運転します。 | Kadang-kadang mengoperasikan mesin tanpa memakai helm. | tokidokidesuga, herumettowotsukenaidekikaiwountenshimasu. | × | source/inferred |
| 617 | 2018 | 破れた作業服は、けがの原因になります。 | Pakaian kerja yang robek dapat menyebabkan cedera. | yaburetasagyoufukuha, keganogen'inninarimasu. | ○ | source/inferred |
| 618 | 2018 | 「運転技能講習」または「特別教育」の修了証が仕事で機械を運転するときの資格になります。 | Sertifikat pelatihan keterampilan pengoperasian atau pendidikan khusus menjadi kualifikasi untuk mengoperasikan mesin dalam pekerjaan. | (untenginoukoushuu)mataha(tokubetsukyouiku)noshuuryoushougashigotodekikaiwountensurutokinoshikakuninarimasu. | ○ | source/inferred |
| 619 | 2018 | エンジンを停止する前には、アイドリングを行います。 | Lakukan idling sebelum mematikan mesin. | enjinwoteishisurumaeniha, aidoringuwookonaimasu. | ○ | source/inferred |
| 620 | 2018 | 機械には、主に４サイクル式のディーゼルエンジンが使われています。 | Mesin konstruksi terutama menggunakan mesin diesel empat tak. | kikainiha, omoniyon saikurushikinodiizeruenjingatsukawareteimasu. | ○ | source/inferred |
| 621 | 2018 | エンジンオイルには、ピストンの動きをなめらかにする役目があります。 | Oli mesin berfungsi melancarkan gerakan piston. | enjin'oiruniha, pisutonnougokiwonamerakanisuruyakumegaarimasu. | ○ | source/inferred |
| 622 | 2018 | オルタネーターは電気を起こす装置です。 | Alternator adalah alat untuk menghasilkan listrik. | orutaneetaahadenkiwookosusouchidesu. | ○ | source/inferred |
| 623 | 2018 | 機械は整備しなくても安全に効率よく動かすことができます。 | Mesin dapat dioperasikan dengan aman dan efisien tanpa perawatan. | kikaihaseibishinakutemoanzennikouritsuyokuugokasukotogadekimasu. | × | source/inferred |
| 624 | 2018 | バケットの下で点検をするときは安全支柱を使います。 | Gunakan tiang pengaman saat memeriksa bagian bawah bucket. | bakettonoshitadetenkenwosurutokihaanzenshichuuwotsukaimasu. | ○ | source/inferred |
| 625 | 2018 | 傾斜地で点検をしなければならない場合、必ず歯止めや輪止めをします。 | Jika harus memeriksa mesin di medan miring,  selalu pasang ganjal roda. | keishachidetenkenwoshinakerebanaranaibaai, kanarazuhadomeyawatomewoshimasu. | ○ | source/inferred |
| 626 | 2018 | 作業装置の動きをエンジン始動前に点検しました。 | Saya memeriksa gerakan peralatan kerja sebelum menyalakan mesin. | sagyousouchinougokiwoenjinshidoumaenitenkenshimashita. | ○ | source/inferred |
| 627 | 2018 | はじめての機械を運転するとき、取扱説明書をよく読み、運転指導を受けます。 | Saat mengoperasikan mesin untuk pertama kali,  baca manual dengan baik dan terima pengarahan pengoperasian. | hajimetenokikaiwountensurutoki, toriatsukaisetsumeishowoyokuyomi, untenshidouwoukemasu. | ○ | source/inferred |
| 628 | 2018 | 機械は点検しなくても故障しません。 | Mesin tidak akan rusak meskipun tidak diperiksa. | kikaihatenkenshinakutemokoshoushimasen. | × | source/inferred |
| 629 | 2018 | 機械の作業開始前点検は必要ありません。 | Pemeriksaan sebelum memulai pekerjaan mesin tidak diperlukan. | kikainosagyoukaishimaetenkenhahitsuyouarimasen. | × | source/inferred |
| 630 | 2018 | 機械の計器が作動しないときは、作業終了後に点検します。 | Jika meteran mesin tidak berfungsi,  periksa setelah pekerjaan selesai. | kikainokeikigasadoushinaitokiha, sagyoushuuryounochinitenkenshimasu. | × | source/inferred |
| 631 | 2018 | 作業終了後、次に運転する人のためにエンジンをかけたままにします。 | Setelah pekerjaan selesai,  mesin dibiarkan menyala untuk orang yang akan mengoperasikannya berikutnya. | sagyoushuuryounochi, tsuginiuntensuruninnotamenienjinwokaketamamanishimasu. | × | source/inferred |
| 632 | 2018 | すべての機械が軟らかな地面で効率よく作業ができます。 | Semua mesin dapat bekerja dengan efisien di tanah yang lunak. | subetenokikaigayaharakanajimendekouritsuyokusagyougadekimasu. | × | source/inferred |
| 633 | 2018 | 油圧ショベルは主に押土作業に使われます。 | Shovel hidrolik terutama digunakan untuk pekerjaan mendorong tanah. | yuatsushoberuhaomonioudosagyounitsukawaremasu. | × | source/inferred |
| 634 | 2018 | 油圧ショベルのバケットツースに、ワイヤをかけて荷物をつることは法律で禁止されています。 | Menggantung barang dengan kawat pada gigi bucket shovel hidrolik dilarang oleh hukum. | yuatsushoberunobakettotsuusuni, waiyawokaketenimotsuwotsurukotohahouritsudekinshisareteimasu. | ○ | source/inferred |
| 635 | 2018 | 油圧ショベルのバケットがトラックの運転席の上を通過するやりかたで土砂を積み込みます。 | Memuat tanah dengan cara bucket shovel hidrolik melewati atas kursi pengemudi truk. | yuatsushoberunobakettogatorakkunountensekinouewotsuukasuruyarikatadedoshawotsumikomimasu. | × | source/inferred |
| 636 | 2019 | 作業中は必ずヘルメットをかぶります。 | Selama bekerja,  selalu kenakan helm. | sagyouchuuhakanarazuherumettowokaburimasu. | ○ | source/inferred |
| 637 | 2019 | 作業の種類が変わっても、同じ種類の手袋を使います。 | Tetap menggunakan jenis sarung tangan yang sama meskipun jenis pekerjaan berubah. | sagyounoshuruigakawattemo, onajishuruinotebukurowotsukaimasu. | × | source/inferred |
| 638 | 2019 | 機械を止めるとき、バケットは地面に下ろします。 | Turunkan bucket ke tanah saat menghentikan mesin. | kikaiwoyamerutoki, bakettohajimennikudaroshimasu. | ○ | source/inferred |
| 639 | 2019 | 運転席から降りるとき、とびおりしてもよいです。 | Boleh melompat turun dari kursi pengemudi. | untensekikaraorirutoki, tobiorishitemoyoidesu. | × | source/inferred |
| 640 | 2019 | エンジンには、ディーゼルエンジンとガソリンエンジンがあります。 | Ada mesin diesel dan mesin bensin. | enjinniha, diizeruenjintogasorin'enjingaarimasu. | ○ | source/inferred |
| 641 | 2019 | エンジンオイルには、ピストンの動きをなめらかにする役目があります。 | Oli mesin berfungsi melancarkan gerakan piston. | enjin'oiruniha, pisutonnougokiwonamerakanisuruyakumegaarimasu. | ○ | source/inferred |
| 642 | 2019 | 機械は整備をしなくても、安全に動かすことができます。 | Mesin dapat dioperasikan dengan aman tanpa perawatan. | kikaihaseibiwoshinakutemo, anzenniugokasukotogadekimasu. | × | source/inferred |
| 643 | 2019 | エンジンを動かす前に冷却水の量は点検しません。 | Jumlah air pendingin tidak perlu diperiksa sebelum menyalakan mesin. | enjinwougokasumaenireikyakusuinoryouhatenkenshimasen. | × | source/inferred |
| 644 | 2019 | 機械をひとまわりしながら、各部分をよく点検します。 | Periksa setiap bagian dengan mengelilingi mesin. | kikaiwohitomawarishinagara, kakububunwoyokutenkenshimasu. | ○ | source/inferred |
| 645 | 2019 | グリースガンを使って、グリースを補給します。 | Gunakan grease gun untuk menambahkan grease. | guriisuganwotsukatte, guriisuwohokyuushimasu. | ○ | source/inferred |
| 646 | 2019 | 燃料を補給するとき、エンジンは止めます。 | Matikan mesin saat mengisi bahan bakar. | nenryouwohokyuusurutoki, enjinhatomemasu. | ○ | source/inferred |
| 647 | 2019 | 機械を動かすとき、動かす方向だけの安全を確認すれば十分です。 | Saat menggerakkan mesin,  cukup memastikan keamanan hanya pada arah gerak. | kikaiwougokasutoki, ugokasuhoukoudakenoanzenwokakuninsurebajuubundesu. | × | source/inferred |
| 648 | 2019 | 機械の能力をこえる作業をしてはいけません。 | Dilarang melakukan pekerjaan yang melampaui kemampuan mesin. | kikainonouryokuwokoerusagyouwoshitehaikemasen. | ○ | source/inferred |
| 649 | 2019 | はじめての機械でも、取扱説明書を読まないで運転します。 | Mengoperasikan mesin untuk pertama kali tanpa membaca manual. | hajimetenokikaidemo, toriatsukaisetsumeishowoyomanaideuntenshimasu. | × | source/inferred |
| 650 | 2019 | 機械のメーターが動かないときも、そのまま作業します。 | Tetap bekerja meskipun meteran mesin tidak bergerak. | kikainomeetaagaugokanaitokimo, sonomamasagyoushimasu. | × | source/inferred |
| 651 | 2019 | 作業場所に、仕事に関係ない人が入ってきても作業を続けます。 | Tetap bekerja meskipun orang yang tidak berkaitan masuk ke area kerja. | sagyoubatokoroni, shigotonikankeinainingaitsutsutekitemosagyouwotsuzukemasu. | × | source/inferred |
| 652 | 2019 | 機械は使い方が決まっているので、それ以外の作業に使ってはいけません。 | Karena cara penggunaan mesin sudah ditentukan,  mesin tidak boleh digunakan untuk pekerjaan lain. | kikaihatsukaikatagakimatteirunode, soreigainosagyounitsukattehaikemasen. | ○ | source/inferred |
| 653 | 2019 | 機械は急発進、急ブレーキなどの乱暴な運転をしてもよいです。 | Mesin boleh dioperasikan secara kasar,  seperti start dan pengereman mendadak. | kikaihakyuuhasshin, kyuubureekinadonoranbounauntenwoshitemoyoidesu. | × | source/inferred |
| 654 | 2019 | バックホウのバケットがダンプトラックの運転席の上を通るやりかたで土砂を積み込みます。 | Memuat tanah dengan cara bucket backhoe melewati atas kursi pengemudi dump truck. | bakkuhounobakettogadanputorakkunountensekinouewotouruyarikatadedoshawotsumikomimasu. | × | source/inferred |
| 655 | 2019 | バックホウのバケットのつめにワイヤをかけて荷物をつってはいけません。 | Dilarang mengaitkan kawat pada ujung bucket backhoe untuk mengangkat barang. | bakkuhounobakettonotsumeniwaiyawokaketenimotsuwotsuttehaikemasen. | ○ | source/inferred |
| 656 | 2020 | 建設機械の運転席の中はヘルメットをかぶらなくてもよいです。 | Di dalam kursi pengemudi mesin konstruksi boleh tidak memakai helm. | kensetsukikainountensekinonakahaherumettowokaburanakutemoyoidesu. | × | source/inferred |
| 657 | 2020 | 仕事がしやすく事故から体をまもる服を着ます。 | Kenakan pakaian yang memudahkan pekerjaan dan melindungi tubuh dari kecelakaan. | shigotogashiyasukujikokarakaradawomamorufukuwochakumasu. | ○ | source/inferred |
| 658 | 2020 | 機械の使い方をまちがえると事故やけがをすることがあります。 | Kesalahan penggunaan mesin dapat menyebabkan kecelakaan atau cedera. | kikainotsukaikatawomachigaerutojikoyakegawosurukotogaarimasu. | ○ | source/inferred |
| 659 | 2020 | 足場がよければ３点支持で機械に乗り降りしなくてもよいです。 | Jika pijakannya baik,  tidak perlu menggunakan tiga titik tumpuan saat naik dan turun dari mesin. | ashibagayokerebasantenshijidekikaininoriorishinakutemoyoidesu. | × | source/inferred |
| 660 | 2020 | エンジンオイルはピストンの動きをなめらかにします。 | Oli mesin melancarkan gerakan piston. | enjin'oiruhapisutonnougokiwonamerakanishimasu. | ○ | source/inferred |
| 661 | 2020 | 建設機械のエンジンには２サイクル式のガソリンエンジンが多いです。 | Mesin konstruksi banyak menggunakan mesin bensin dua tak. | kensetsukikainoenjinnihani saikurushikinogasorin'enjingaooidesu. | × | source/inferred |
| 662 | 2020 | 機械のメータが動かなくなったときはすぐに機械を点検します。 | Jika meteran mesin berhenti bergerak,  segera periksa mesin. | kikainomeetagaugokanakunattatokihasugunikikaiwotenkenshimasu. | ○ | source/inferred |
| 663 | 2020 | 「作業終了後点検」は法律で決められています。 | “Pemeriksaan setelah pekerjaan selesai” ditetapkan oleh undang-undang. | (sagyoushuuryounochitenken)hahouritsudekimerareteimasu. | ○ | source/inferred |
| 664 | 2020 | バケットの下で点検するとき、安全支柱でバケットを支えます。 | Saat memeriksa bagian bawah bucket,  topang bucket dengan tiang pengaman. | bakettonoshitadetenkensurutoki, anzenshichuudebakettowosasaemasu. | ○ | source/inferred |
| 665 | 2020 | 点検や自主検査の記録は保存する必要がありません。 | Catatan pemeriksaan dan inspeksi mandiri tidak perlu disimpan. | tenkenyajishukensanokirokuhahozonsuruhitsuyougaarimasen. | × | source/inferred |
| 666 | 2020 | 油圧作動油にごみが入ると機械が故障するときがあります。 | Jika kotoran masuk ke oli hidrolik,  mesin dapat mengalami kerusakan. | yuatsusadouaburanigomigairutokikaigakoshousurutokigaarimasu. | ○ | source/inferred |
| 667 | 2020 | たばこを吸いながら機械に燃料を入れます。 | Mengisi bahan bakar mesin sambil merokok. | tabakowosuinagarakikaininenryouwoiremasu. | × | source/inferred |
| 668 | 2020 | 機械の能力をこえる作業をしてはいけません。 | Mesin tidak boleh digunakan untuk pekerjaan yang melampaui kemampuannya. | kikainonouryokuwokoerusagyouwoshitehaikemasen. | ○ | source/inferred |
| 669 | 2020 | 機械を点検して異常があったとき責任者に報告し、何をするか指示を受けます。 | Jika ditemukan kelainan saat memeriksa mesin,  laporkan kepada penanggung jawab dan ikuti instruksi. | kikaiwotenkenshiteijougaattatokisekininshanihoukokushi, naniwosurukashijiwoukemasu. | ○ | source/inferred |
| 670 | 2020 | バケットなどの動きはエンジンを動かす前に確認します。 | Periksa gerakan bucket dan bagian lain sebelum menyalakan mesin. | bakettonadonougokihaenjinwougokasumaenikakuninshimasu. | ○ | source/inferred |
| 671 | 2020 | 作業が終わったら、機械を決められた場所まで移動させて駐車します。 | Setelah pekerjaan selesai,  pindahkan dan parkirkan mesin di tempat yang ditentukan. | sagyougaowattara, kikaiwokimeraretabashomadeidousasetechuushashimasu. | ○ | source/inferred |
| 672 | 2020 | すべての建設機械が軟らかな地面でも作業ができます。 | Semua mesin konstruksi dapat bekerja di tanah yang lunak. | subetenokensetsukikaigayaharakanajimendemosagyougadekimasu. | × | source/inferred |
| 673 | 2020 | 作業場所が町の中でもバケットなどで作業場所を囲いません。 | Meskipun tempat kerja berada di kota,  area kerja tidak perlu dikelilingi dengan bucket atau lainnya. | sagyoubatokorogamachinonakademobakettonadodesagyoubatokorowokakoimasen. | × | source/inferred |
| 674 | 2020 | バケットは、バケットを取りかえていろいろな作業に使えます。 | Bucket dapat diganti sehingga digunakan untuk berbagai pekerjaan. | bakettoha, bakettowotorikaeteiroironasagyounitsukaemasu. | ○ | source/inferred |
| 675 | 2020 | 安全確認は目で見ることだけで行います。 | Pemeriksaan keselamatan dilakukan hanya dengan melihat. | anzenkakuninhamedemirukotodakedeokonaimasu. | × | source/inferred |
| 676 | 2020 | ときどきですがヘルメットをかぶらないで機械を運転します。 | Kadang-kadang mengoperasikan mesin tanpa memakai helm. | tokidokidesugaherumettowokaburanaidekikaiwountenshimasu. | × | source/inferred |
| 677 | 2020 | 作業終了後、次に運転する人のためにエンジンキーをつけたままにします。 | Setelah pekerjaan selesai,  kunci mesin dibiarkan terpasang untuk pengemudi berikutnya. | sagyoushuuryounochi, tsuginiuntensuruninnotamenienjinkiiwotsuketamamanishimasu. | × | source/inferred |
| 678 | 2020 | 破れた作業服を着ているとけがをすることがあります。 | Mengenakan pakaian kerja yang robek dapat menyebabkan cedera. | yaburetasagyoufukuwokiteirutokegawosurukotogaarimasu. | ○ | source/inferred |
| 679 | 2020 | ディーゼルエンジンの燃料はガソリンです。 | Bahan bakar mesin diesel adalah bensin. | diizeruenjinnonenryouhagasorindesu. | × | source/inferred |
| 680 | 2020 | 建設機械の運転者は、エンジンを止めないで運転席を離れてはいけません。 | Pengemudi mesin konstruksi tidak boleh meninggalkan kursi pengemudi tanpa mematikan mesin. | kensetsukikainountenshaha, enjinwotomenaideuntensekiwohanaretehaikemasen. | ○ | source/inferred |
| 681 | 2020 | 現場で点検をするとき、ブレーキや安全ロックはかけません。 | Saat memeriksa mesin di lapangan,  rem dan kunci keselamatan tidak perlu dipasang. | genbadetenkenwosurutoki, bureekiyaanzenrokkuhakakemasen. | × | source/inferred |
| 682 | 2020 | 機械は整備をしなくてもよいです。 | Mesin tidak perlu dirawat. | kikaihaseibiwoshinakutemoyoidesu. | × | source/inferred |
| 683 | 2020 | 多くの建設機械が４サイクル式のディーゼルエンジンを使っています。 | Banyak mesin konstruksi menggunakan mesin diesel empat tak. | ookunokensetsukikaigayon saikurushikinodiizeruenjinwotsukatteimasu. | ○ | source/inferred |
| 684 | 2020 | 傾斜地で機械を止めて点検するとき、輪止めを使います。 | Gunakan ganjal roda saat menghentikan dan memeriksa mesin di medan miring. | keishachidekikaiwotometetenkensurutoki, watomewotsukaimasu. | ○ | source/inferred |
| 685 | 2020 | はじめての機械ですが、取扱説明書を読まないで運転しました。 | Mengoperasikan mesin untuk pertama kali tanpa membaca manual. | hajimetenokikaidesuga, toriatsukaisetsumeishowoyomanaideuntenshimashita. | × | source/inferred |
| 686 | 2020 | 機械を停止したとき、バケットなどは上げたままにします。 | Saat menghentikan mesin,  bucket dan bagian lainnya dibiarkan terangkat. | kikaiwoteishishitatoki, bakettonadohaagetamamanishimasu. | × | source/inferred |
| 687 | 2020 | 機械の調子が悪かったので、すぐに責任者に報告し、別の機械に乗りかえて運転しました。 | Karena kondisi mesin buruk,  segera laporkan kepada penanggung jawab dan gunakan mesin lain. | kikainochoushigawarukattanode, sugunisekininshanihoukokushi, betsunokikaininorikaeteuntenshimashita. | ○ | source/inferred |
| 688 | 2020 | 機械の運転中にメータが動かなくなったときすぐに安全な場所で機械を止めます。 | Jika meteran berhenti saat mesin berjalan,  segera hentikan mesin di tempat yang aman. | kikainountenchuunimeetagaugokanakunattatokisugunianzennabashodekikaiwotomemasu. | ○ | source/inferred |
| 689 | 2020 | 掘削作業に機械は使いません。 | Mesin tidak digunakan untuk pekerjaan penggalian. | kussakusagyounikikaihatsukaimasen. | × | source/inferred |
| 690 | 2020 | 機械は能力をこえる作業をしてはいけません。 | Mesin tidak boleh digunakan untuk pekerjaan yang melampaui kemampuannya. | kikaihanouryokuwokoerusagyouwoshitehaikemasen. | ○ | source/inferred |
| 691 | 2020 | 機械は使い方が決まっているので、それ以外の作業に使ってはいけません。 | Karena cara penggunaan mesin sudah ditentukan,  mesin tidak boleh digunakan untuk pekerjaan lain. | kikaihatsukaikatagakimatteirunode, soreigainosagyounitsukattehaikemasen. | ○ | source/inferred |
| 692 | 2020 | 安全確認は目で見ることだけで行います。 | Pemeriksaan keselamatan dilakukan hanya dengan melihat. | anzenkakuninhamedemirukotodakedeokonaimasu. | × | source/inferred |
| 693 | 2020 | 山の斜面を機械で登るときは、まっすぐに登ります。 | Saat menaiki lereng gunung dengan mesin,  naiklah lurus. | yamanoshamenwokikaidenoborutokiha, massuguninoborimasu. | ○ | source/inferred |
| 694 | 2020 | バケットはブームを高く上げて走行します。 | Mesin dijalankan dengan boom dan bucket diangkat tinggi. | bakettohabuumuwotakakuagetesoukoushimasu. | × | source/inferred |
| 695 | 2020 | ダンプトラックを低い場所に置くと、バックホウによる積み込み作業がしやすくなります。 | Jika dump truck ditempatkan di tempat rendah,  pekerjaan pemuatan dengan backhoe menjadi lebih mudah. | danputorakkuwohikuibashoniokuto, bakkuhouniyorutsumikomisagyougashiyasukunarimasu. | ○ | source/inferred |

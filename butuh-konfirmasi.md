# Butuh Konfirmasi - Kunsei dan 調味加工品製造

## Review Baru: 養豚

### Ringkasan Sumber

- `soal-asli/soal 学科　2015　養豚　初級.docx`: 20 soal, level `shokyu`, tahun 2015.
- `soal-asli/soal 学科　2018　養豚　初級.docx`: 20 soal, level `shokyu`, tahun 2018.
- `soal-asli/soal 学科　2019　養豚　初級.docx`: 20 soal, level `shokyu`, tahun 2019.
- `soal-asli/soal 学科　2020　養豚　初級.docx`: 20 soal, level `shokyu`, tahun 2020.
- Total draf: 80 soal.
- Kategori tujuan: `youton` / 養豚.
- Sumber tidak mencantumkan kunci `○`/`×`; jawaban draf diinferensikan dari isi pernyataan dan perlu dikonfirmasi.

### Hal yang Perlu Dikonfirmasi

- Periksa seluruh jawaban, terutama fakta angka dan definisi teknis.
- Soal 2019 nomor 19 (`けんこう な ぶた は、おっこって さがります。`) memiliki terjemahan sumber `?` dan kalimat Jepang tampak tidak lengkap/salah ekstraksi.
- Periksa reading, terjemahan, serta normalisasi teks Jepang sebelum dimasukkan ke JSON.

### Draf Soal

Teks hasil ekstraksi lengkap tersimpan pada sumber asli; belum dimasukkan ke `questions-youton.json` sampai review selesai.

## Review Tambahan: 調味加工品製造

### Ringkasan Sumber

- `soal-asli/soal-chomi-kako_shokyu_2020.docx`: 20 soal, level `shokyu`, tahun 2020.
- `soal-asli/soal-chomi-kako_shokyu_2025.docx`: 44 soal terdeteksi, level `shokyu`, tahun 2025.
- `soal-asli/soal-chomi-kako_shokyu_2026.docx`: 20 soal, level `shokyu`, tahun 2026.
- Total draf: 84 soal.
- Kategori aplikasi: `kunsei` / くん製, sesuai pemetaan yang telah disepakati untuk `調味加工品製造`.
- Semua sumber tidak mencantumkan kunci `○`/`×` eksplisit. Jawaban berikut adalah inferensi awal dan harus dikonfirmasi.

### Hal yang Perlu Dikonfirmasi

- Pastikan pemetaan sumber `soal-chomi-kako_*` ke kategori `kunsei` benar.
- Pastikan setiap jawaban `○`/`×`; seluruh kunci di bawah berstatus `inferred`.
- File 2025 berisi 44 paragraf soal, tetapi hanya 43 yang memiliki nomor eksplisit; nomor draf terakhir dibuat berurutan.
- Periksa kembali reading, terjemahan, dan istilah teknis sebelum soal dimasukkan ke JSON.

### Draf Review Soal 調味加工品製造

| id | tahun | soal | terjemahan | reading | answer | catatan |
|---:|---:|---|---|---|:---:|---|
| 1 | 2020 | すいさんかこうしょくひんは、えいせいに、ちゅういしてつくる。 | Produk olahan hasil laut dibuat dengan memperhatikan kebersihan. | Suisan kakou shokuhin wa, eisei ni, chuui shite tsukuru. | ○ | inferred |
| 2 | 2020 | あんぜんなしょくひんは、しょくひんえいせいに、ちゅういしてつくる。 | Produksi makanan yang aman harus memperhatikan higiene makanan. | Anzen na shokuhin wa, shokuhin eisei ni, chuui shite tsukuru. | ○ | inferred |
| 3 | 2020 | しょくひんえいせいは、しょくひんをちょぞうするための、ほうほうである。 | Higiene makanan adalah metode untuk menyimpan makanan. | Shokuhin eisei wa, shokuhin o chozou suru tame no, houhou de aru. | × | inferred |
| 4 | 2020 | すいさんかこうしょくひんを、つくるまえには、かならず、てをあらう。 | Sebelum membuat produk olahan hasil laut, wajib mencuci tangan. | Suisan kakou shokuhin o, tsukuru mae ni wa, kanarazu, te o arau. | ○ | inferred |
| 5 | 2020 | てあらいのとき、せっけんのあわは、たおるでふきとる。 | Saat mencuci tangan, busa sabun dilap dengan handuk. | Tearai no toki, sekken no awa wa, taoru de fukitoru. | × | inferred |
| 6 | 2020 | てのつめには、よごれやさいきんがおおい。 | Pada kuku tangan banyak kotoran dan bakteri. | Te no tsume ni wa, yogore ya saikin ga ooi. | ○ | inferred |
| 7 | 2020 | まないたは、せんざいをつかって、よくあらうことがたいせつである。 | Penting mencuci talenan dengan deterjen secara menyeluruh. | Manaita wa, senzai o tsukatte, yoku arau koto ga taisetsu de aru. | ○ | inferred |
| 8 | 2020 | ほうちょうは、さぎょうのあと、あらわない。 | Pisau tidak dicuci setelah bekerja. | Houchou wa, sagyou no ato, arawanai. | × | inferred |
| 9 | 2020 | まいにちつかう、きぐは、さぎょうのあと、あらわなくてもよい。 | Peralatan yang dipakai setiap hari tidak perlu dicuci setelah bekerja. | Mainichi tsukau, kigu wa, sagyou no ato, arawanakute mo yoi. | × | inferred |
| 10 | 2020 | しょくひんこうじょうの、ゆかは、そうじしない。 | Lantai pabrik makanan tidak dibersihkan. | Shokuhin koujou no, yuka wa, souji shinai. | × | inferred |
| 11 | 2020 | しょくひんかこうでは、さぎょうい、ながぐつ、ぼうし、ますくをちゃくようする。 | Dalam pengolahan makanan, memakai baju kerja, sepatu bot, topi, dan masker. | Shokuhin kakou de wa, sagyoui, nagagutsu, boushi, masuku o chakuyou suru. | ○ | inferred |
| 12 | 2020 | しょくひんこうじょうに、はいるとき、ながぐつは、さっきんえきに、つける。 | Saat masuk pabrik makanan, sepatu bot dicelupkan ke cairan pembunuh bakteri. | Shokuhin koujou ni, hairu toki, nagagutsu wa, sakkin-eki ni, tsukeru. | ○ | inferred |
| 13 | 2020 | すいさんかこうしょくひんを、つくるとき、ぼうしは、かぶらない。 | Saat membuat produk olahan hasil laut, tidak memakai topi. | Suisan kakou shokuhin o, tsukuru toki, boushi wa, kaburanai. | × | inferred |
| 14 | 2020 | しょくひんこうじょうでは、じぶんのすきなふくそうで、さぎょうする。 | Di pabrik makanan, bekerja dengan pakaian yang disukai sendiri. | Shokuhin koujou de wa, jibun no sukina fukusou de, sagyou suru. | × | inferred |
| 15 | 2020 | すいさんかこうしょくひんでは、しょくちゅうどくが、おきることはない。 | Dalam produksi olahan hasil laut, keracunan makanan tidak akan terjadi. | Suisan kakou shokuhin de wa, shokuchuudoku ga, okiru koto wa nai. | × | inferred |
| 16 | 2020 | かねつする、しょくひんは、えいせいに、ちゅういして、つくらなくてもよい。 | Makanan yang dipanaskan tidak perlu dibuat dengan memperhatikan higiene. | Kanetsu suru, shokuhin wa, eisei ni, chuui shite, tsukuranakute mo yoi. | × | inferred |
| 17 | 2020 | さいきんは、ぶんれつをくりかえして、ふえる。 | Bakteri berkembang biak dengan berulang kali membelah diri. | Saikin wa, bunretsu o kurikaeshite, fueru. | ○ | inferred |
| 18 | 2020 | さいきんのかたちは、しゅるいによって、ちがう。 | Bentuk bakteri berbeda menurut jenisnya. | Saikin no katachi wa, shurui ni yotte, chigau. | ○ | inferred |
| 19 | 2020 | さいきんが、いきるためには、すいぶんがひつようである。 | Bakteri membutuhkan air untuk hidup. | Saikin ga, ikiru tame ni wa, suibun ga hitsuyou de aru. | ○ | inferred |
| 20 | 2020 | しょくひんのなかにはいった、かみのけは、いぶつという。 | Rambut yang masuk ke makanan disebut benda asing. | Shokuhin no naka ni haitta, kami no ke wa, ibutsu to iu. | ○ | inferred |

| 1 | 2025 | かつお、まぐろは、あかみのさかなである。 | Cakalang dan tuna adalah ikan berdaging merah. | Katsuo, maguro wa, akami no sakana de aru. | ○ | inferred |
| 2 | 2025 | たい、かれいは、しろみのさかなである。 | Tai dan karei adalah ikan berdaging putih. | Tai, karei wa, shiromi no sakana de aru. | ○ | inferred |
| 3 | 2025 | たいは、かわがあかいので、あかみのさかなである。 | Tai adalah ikan berdaging merah karena kulitnya merah. | Tai wa, kawa ga akai node, akami no sakana de aru. | × | inferred |
| 4 | 2025 | かつお、いわしには、ちあいにくが、おおい。 | Katsuo dan iwashi memiliki banyak daging gelap/berdarah. | Katsuo, iwashi ni wa, chiainiku ga ooi. | ○ | inferred |
| 5 | 2025 | さかなの、ちあいにくは、たべることが、できない。 | Daging gelap pada ikan tidak dapat dimakan. | Sakana no, chiainiku wa, taberu koto ga dekinai. | × | inferred |
| 6 | 2025 | こざかなの、ほねやかわは、たべることが、できる。 | Tulang dan kulit ikan kecil dapat dimakan. | Kozakana no, hone ya kawa wa, taberu koto ga dekiru. | ○ | inferred |
| 7 | 2025 | さかなの、はらのにくは、せなかのにくに、くらべて、あぶらが、おおい。 | Daging perut ikan lebih berlemak daripada daging punggung. | Sakana no, hara no niku wa, senaka no niku ni kurabete, abura ga ooi. | ○ | inferred |
| 8 | 2025 | さかなは、しゅるいにより、あじが、ちがう。 | Rasa ikan berbeda menurut jenisnya. | Sakana wa, shurui ni yori, aji ga chigau. | ○ | inferred |
| 9 | 2025 | さかなや、かいは、きせつによって、あじが、かわる。 | Rasa ikan dan kerang berubah menurut musim. | Sakana ya, kai wa, kisetsu ni yotte, aji ga kawaru. | ○ | inferred |
| 10 | 2025 | さかなのにくは、ぶたのにくにくらべて、えいようが、おとる。 | Daging ikan lebih rendah gizinya daripada daging babi. | Sakana no niku wa, buta no niku ni kurabete, eiyou ga otoru. | × | inferred |
| 11 | 2025 | こんぶは、かこうしょくひんの、げんりょうとして、つかう。 | Konbu digunakan sebagai bahan baku produk olahan. | Konbu wa, kakou shokuhin no, genryou to shite, tsukau. | ○ | inferred |
| 12 | 2025 | こんぶは、たべても、えいように、ならない。 | Konbu tidak memberikan nutrisi walaupun dimakan. | Konbu wa, tabete mo, eiyou ni naranai. | × | inferred |
| 13 | 2025 | わかめ(こんぶ)は、かこうしょくひんの、げんりょうに、ならない。 | Wakame (konbu) bukan bahan baku produk olahan. | Wakame (konbu) wa, kakou shokuhin no, genryou ni naranai. | × | inferred |
| 14 | 2025 | えびは、かねつすると、からが、あかくなる。 | Cangkang udang menjadi merah saat dipanaskan. | Ebi wa, kanetsu suru to, kara ga aka ni naru. | ○ | inferred |
| 15 | 2025 | えびは、かねつすると、からが、あおくなる。 | Cangkang udang menjadi biru saat dipanaskan. | Ebi wa, kanetsu suru to, kara ga ao ni naru. | × | inferred |
| 16 | 2025 | さかなは、おんどが、たかいと、はやくくさる。 | Ikan cepat membusuk jika suhunya tinggi. | Sakana wa, ondo ga takai to, hayaku kusaru. | ○ | inferred |
| 17 | 2025 | さかなのにくは、ぶたのにくより、はやくくさる。 | Daging ikan lebih cepat membusuk daripada daging babi. | Sakana no niku wa, buta no niku yori, hayaku kusaru. | ○ | inferred |
| 18 | 2025 | さかなのないぞうは、さかなのにくより、はやくくさる。 | Jeroan ikan lebih cepat membusuk daripada daging ikan. | Sakana no naizou wa, sakana no niku yori, hayaku kusaru. | ○ | inferred |
| 19 | 2025 | しょくひんが、くさるのは、おもに、さいきん(ばくてりあ)による。 | Makanan terutama membusuk karena bakteri. | Shokuhin ga kusaru no wa, omoni, saikin (bakuteria) ni yoru. | ○ | inferred |
| 20 | 2025 | さかなは、ひくいおんどで、ほぞんする。 | Ikan disimpan pada suhu rendah. | Sakana wa, hikui ondo de, hozon suru. | ○ | inferred |
| 21 | 2025 | さかなは、きおん(おんど)が、たかいと、くさらない。 | Ikan tidak membusuk jika suhu udara tinggi. | Sakana wa, kion (ondo) ga takai to, kusaranai. | × | inferred |
| 22 | 2025 | くさったさかなも、かこうすれば、たべることが、できる。 | Ikan busuk masih dapat dimakan jika diolah. | Kusatta sakana mo, kakou sureba, taberu koto ga dekiru. | × | inferred |
| 23 | 2025 | しんせんな、さかなや、かいは、わるいにおいが、すくない。 | Ikan dan kerang segar hanya sedikit berbau tidak sedap. | Shinsen na, sakana ya, kai wa, warui nioi ga sukunai. | ○ | inferred |
| 24 | 2025 | さかなや、かいは、せんどによって、においが、かわる。 | Bau ikan dan kerang berubah menurut kesegarannya. | Sakana ya, kai wa, sendo ni yotte, nioi ga kawaru. | ○ | inferred |
| 25 | 2025 | さかなや、かいは、くさると、においが、わるくなる。 | Bau ikan dan kerang memburuk ketika membusuk. | Sakana ya, kai wa, kusaru to, nioi ga waruku naru. | ○ | inferred |
| 26 | 2025 | さかなは、においによって、せんどが、かわる。 | Kesegaran ikan berubah berdasarkan baunya. | Sakana wa, nioi ni yotte, sendo ga kawaru. | × | inferred |
| 27 | 2025 | さかなは、くさっても、においは、かわらない。 | Bau ikan tidak berubah walaupun ikan membusuk. | Sakana wa, kusatte mo, nioi wa kawaranai. | × | inferred |
| 28 | 2025 | れいとうは、さかなを、ほぞんする、よいほうほうである。 | Pembekuan adalah cara yang baik untuk menyimpan ikan. | Reitou wa, sakana o hozon suru, yoi houhou de aru. | ○ | inferred |
| 29 | 2025 | れいぞうは、さかなを、ほぞんする、よいほうほうである。 | Pendinginan adalah cara yang baik untuk menyimpan ikan. | Reizou wa, sakana o hozon suru, yoi houhou de aru. | ○ | inferred |
| 30 | 2025 | いか、たこは、れいとうして、ほぞんすることが、できない。 | Cumi dan gurita tidak dapat disimpan dengan dibekukan. | Ika, tako wa, reitou shite, hozon suru koto ga dekinai. | × | inferred |
| 31 | 2025 | れいとうした、さかなは、かこうしょくひんの、げんりょうに、ならない。 | Ikan beku bukan bahan baku produk olahan. | Reitou shita, sakana wa, kakou shokuhin no, genryou ni naranai. | × | inferred |
| 32 | 2025 | さかなのかこうに、しおをつかうことが、おおい。 | Garam sering digunakan dalam pengolahan ikan. | Sakana no kakou ni, shio o tsukau koto ga ooi. | ○ | inferred |
| 33 | 2025 | しょうゆ、さとうは、ちょうみりょうである。 | Kecap asin dan gula adalah bumbu penyedap. | Shouyu, satou wa, choumiryou de aru. | ○ | inferred |
| 34 | 2025 | こうしんりょうは、かこうひんに、かおりや、あじをつける。 | Rempah memberi aroma dan rasa pada produk olahan. | Koushinryou wa, kakouhin ni, kaori ya, aji o tsukeru. | ○ | inferred |
| 35 | 2025 | しょうゆ、さとうは、こうしんりょうである。 | Kecap asin dan gula adalah rempah-rempah. | Shouyu, satou wa, koushinryou de aru. | × | inferred |
| 36 | 2025 | さかなのかこうに、しおや、さとうは、つかわない。 | Garam dan gula tidak digunakan dalam pengolahan ikan. | Sakana no kakou ni, shio ya, satou wa, tsukawanai. | × | inferred |
| 37 | 2025 | ほうちょうの、しゅるいは、せいぞうする、かこうひんにより、きまっている。 | Jenis pisau ditentukan berdasarkan produk olahan yang dibuat. | Houchou no, shurui wa, seizou suru, kakouhin ni yori, kimatte iru. | ○ | inferred |
| 38 | 2025 | さかなのあたまは、さしみぼうちょうできる。 | Kepala ikan dipotong dengan pisau sashimi. | Sakana no atama wa, sashimi bouchou de kiru. | × | inferred |
| 39 | 2025 | すいさんかこうしょくひんの、せいぞうには、きかいを、つかうことが、おおい。 | Produksi produk olahan hasil laut sering menggunakan mesin. | Suisan kakou shokuhin no, seizou ni wa, kikai o tsukau koto ga ooi. | ○ | inferred |
| 40 | 2025 | さかなは、きかい(さかなあらいき)で、あらうことが、できる。 | Ikan dapat dicuci dengan mesin pencuci ikan. | Sakana wa, kikai (sakana araiki) de, arau koto ga dekiru. | ○ | inferred |
| 41 | 2025 | さかなのかこうに、ぎょたいしょりきを、つかうことがある。 | Pengolahan ikan kadang menggunakan mesin pengolah tubuh ikan. | Sakana no kakou ni, gyotai shoriki o tsukau koto ga aru. | ○ | inferred |
| 42 | 2025 | さかなの、あたまをきり、ないぞうをとる、きかいがある。 | Ada mesin untuk memotong kepala ikan dan mengambil jeroan. | Sakana no, atama o kiri, naizou o toru, kikai ga aru. | ○ | inferred |
| 43 | 2025 | しょくひんに、きんぞくが、まじっているのを、しらべる、きかいがある。 | Ada mesin untuk memeriksa logam yang tercampur dalam makanan. | Shokuhin ni, kinzoku ga, majitte iru no o, shiraberu, kikai ga aru. | ○ | inferred |
| 44 | 2025 | すいさんかこうしょくひんを、つくるとき、きかいは、つかわない。 | Saat membuat produk olahan hasil laut, mesin tidak digunakan. | Suisan kakou shokuhin o, tsukuru toki, kikai wa, tsukawanai. | × | inferred |
| 45 | 2025 | さかなの、あたまをきる、きかいは、ない。 | Tidak ada mesin untuk memotong kepala ikan. | Sakana no, atama o kiru, kikai wa, nai. | × | inferred |

| 1 | 2026 | いわしは、かこうしょくひんのげんりょうとして、つかう。 | Iwashi digunakan sebagai bahan baku produk olahan. | Iwashi wa, kakou shokuhin no genryou to shite, tsukau. | ○ | inferred |
| 2 | 2026 | さかなのあぶらには、えいようがある。 | Minyak ikan mengandung nutrisi. | Sakana no abura ni wa, eiyou ga aru. | ○ | inferred |
| 3 | 2026 | さかなは、どのしゅるいでも、あじは、おなじである。 | Semua jenis ikan memiliki rasa yang sama. | Sakana wa, dono shurui demo, aji wa onaji de aru. | × | inferred |
| 4 | 2026 | てのつめは、いつでも、みじかくきっておく。 | Kuku tangan harus selalu dipotong pendek. | Te no tsume wa, itsudemo, mijikaku kitte oku. | ○ | inferred |
| 5 | 2026 | さかなのないぞうは、くさっても、においは、かわらない。 | Bau jeroan ikan tidak berubah walaupun membusuk. | Sakana no naizou wa, kusatte mo, nioi wa kawaranai. | × | inferred |
| 6 | 2026 | さかなのせなかのにくは、はらのにくにくらべて、あぶらがすくない。 | Daging punggung ikan lebih sedikit lemaknya daripada daging perut. | Sakana no senaka no niku wa, hara no niku ni kurabete, abura ga sukunai. | ○ | inferred |
| 7 | 2026 | さかなのかこうに、ちょうみりょうは、つかわない。 | Bumbu penyedap tidak digunakan dalam pengolahan ikan. | Sakana no kakou ni, choumiryou wa, tsukawanai. | × | inferred |
| 8 | 2026 | さかなのあたまをきり、ないぞうをとるきかいがある。 | Ada mesin untuk memotong kepala ikan dan mengambil jeroan. | Sakana no atama o kiri, naizou o toru kikai ga aru. | ○ | inferred |
| 9 | 2026 | かにのからは、かねつすると、あおくなる。 | Cangkang kepiting menjadi biru ketika dipanaskan. | Kani no kara wa, kanetsu suru to, aoku naru. | × | inferred |
| 10 | 2026 | まぐろ、さばには、ちあいにくがない。 | Tuna dan makarel tidak memiliki daging gelap. | Maguro, saba ni wa, chiainiku ga nai. | × | inferred |
| 11 | 2026 | ほうちょう、まないたは、つかったあと、せんざいであらう。 | Pisau dan talenan dicuci dengan deterjen setelah digunakan. | Houchou, manaita wa, tsukatta ato, senzai de arau. | ○ | inferred |
| 12 | 2026 | くさったさかなは、かこうひんのげんりょうにならない。 | Ikan busuk bukan bahan baku produk olahan. | Kusatta sakana wa, kakouhin no genryou ni naranai. | ○ | inferred |
| 13 | 2026 | かねつするしょくひんは、えいせいにちゅういして、つくらなくてよい。 | Makanan yang dipanaskan tidak perlu dibuat dengan memperhatikan higiene. | Kanetsu suru shokuhin wa, eisei ni chuui shite, tsukuranakute yoi. | × | inferred |
| 14 | 2026 | すいさんかこうしょくひんをつくるとき、きぐはつかわない。 | Saat membuat produk olahan hasil laut, alat tidak digunakan. | Suisan kakou shokuhin o tsukuru toki, kigu wa tsukawanai. | × | inferred |
| 15 | 2026 | しょくひんかこうじょうでは、さぎょうい、ながぐつ、ぼうし、ますくをちゃくようする。 | Di pabrik pengolahan makanan harus mengenakan baju kerja, sepatu bot, topi, dan masker. | Shokuhin kakoujou de wa, sagyoui, nagagutsu, boushi, masuku o chakuyou suru. | ○ | inferred |
| 16 | 2026 | まぐろ、かつおは、つくだにのげんりょうである。 | Tuna dan cakalang merupakan bahan baku tsukudani. | Maguro, katsuo wa, tsukudani no genryou de aru. | ○ | inferred |
| 17 | 2026 | ちょうみかこうひんは、しおだけであじをつけたせいひんである。 | Produk olahan berbumbu adalah produk yang rasanya hanya diberi garam. | Choumi kakouhin wa, shio dake de aji o tsuketa seihin de aru. | × | inferred |
| 18 | 2026 | さかなをつくだににかこうすると、ながいあいだ、ちょぞうできる。 | Ikan yang diolah menjadi tsukudani dapat disimpan lama. | Sakana o tsukudani ni kakou suru to, nagai aida, chozou dekiru. | ○ | inferred |
| 19 | 2026 | つくだには、うかしに、いりつけになどで、つくる。 | Tsukudani dibuat dengan metode ukashi, iritsuke, dan lainnya. | Tsukudani wa, ukashi ni, iritsuke ni nado de, tsukuru. | ○ | inferred |
| 20 | 2026 | するめは、ちょうみかこうひんである。 | Surume adalah produk olahan berbumbu. | Surume wa, choumi kakouhin de aru. | ○ | inferred |

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

Sumber: `soal-asli/kensetsu 2017 shokyu.pdf`, `kensetsu 2018 shokyu.pdf`, `kensetsu 2019 shokyu.pdf`, dan `kensetsu 2020 shokyu.pdf`. Total 100 soal baru, level `shokyu`. Seluruh soal Kensetsu Shokyu (ID 496-695) kini menggunakan hiragana penuh pada teks soal; reading diberi spasi antarkata.

| id | tahun | soal | terjemahan | reading | answer | catatan |
| --- | --- | --- | --- | --- | --- | --- |
| 596 | 2017 | しゃりょうけいけんせつきかいなどをうんてんするばあい、へるめっとやあんぜんようぐをつけ、ふくそうをととのえて、きかいをうんてんします。 | Ketika akan mengoperasikan mesin konstruksi dan lain-lain, kenakan helm, perlengkapan keselamatan, dan pakaian yang sesuai. | sharyoukei kensetsukikai nado wo unten suru baai, herumetto ya anzen yougu wo tsuke, fukusou wo totonoete, kikai wo unten shimasu. | ○ | source/inferred |
| 597 | 2017 | へるめっとやあんぜんようぐをつけて、うんてんします。 | Mengoperasikan mesin dengan mengenakan helm dan perlengkapan keselamatan. | herumetto ya anzen yougu wo tsukete, unten shimasu. | ○ | source/inferred |
| 598 | 2017 | へるめっとをつけるときは、あごひものしめつけをします。 | Kencangkan tali dagu ketika mengenakan helm. | herumetto wo tsukeru toki ha, agohimo no shimetsuke wo shimasu. | ○ | source/inferred |
| 599 | 2017 | さぎょうかいし（じょうしゃ）まえにしゅういのあんぜんかくにんをします。 | Pastikan keamanan sekitar sebelum memulai pekerjaan (naik mesin). | sagyou kaishi(jousha) mae ni shuui no anzen kakunin wo shimasu. | ○ | source/inferred |
| 600 | 2017 | きかいののりおりはかならずさんてんしじ（りょうてとかたあし、またはかたてとりょうあし）でおこないます。 | Naik dan turun dari mesin harus selalu menggunakan tiga titik tumpuan (kedua tangan dan satu kaki, atau satu tangan dan kedua kaki). | kikai no noriori ha kanarazu san ten shiji (ryoute to kataashi, mataha katate to ryouashi) de okonaimasu. | ○ | source/inferred |
| 601 | 2017 | さぎょうをするとき、うんてんせきでないところに、にんをのせてもいいです。 | Saat bekerja, boleh membawa orang di tempat yang bukan kursi pengemudi. | sagyou wo suru toki, untenseki denai tokoro ni, hito wo nosete mo ii desu. | × | source/inferred |
| 602 | 2017 | けんせつきかいのうんてんしゃは、えんじんをかけたまま、うんてんせきをはなれてはいけません。 | Pengemudi mesin konstruksi tidak boleh meninggalkan kursi pengemudi ketika mesin masih menyala. | kensetsu kikai no untensha ha, enjin wo kaketa mama, untenseki wo hanarete ha ikemasen. | ○ | source/inferred |
| 603 | 2017 | ぶれーきやばけっとなどは、じめんにさげておかなくてもよいです。 | Rem, bucket, dan bagian lainnya tidak perlu diturunkan ke tanah. | bureeki ya baketto nado ha, jimen ni sagete okanakute mo yoi desu. | × | source/inferred |
| 604 | 2017 | さぎょうればーはすべてちゅうりつにして、ろっくをします。 | Semua tuas kerja dinetralkan lalu dikunci. | sagyou rebaa ha subete chuuritsu ni shite, rokku wo shimasu. | ○ | source/inferred |
| 605 | 2017 | えんじんていしちゅうは、さぎょうればーをそうさしてもよいです。 | Tuas kerja boleh dioperasikan ketika mesin sedang berhenti. | enjin teishi chuu ha, sagyou rebaa wo sousa shite mo yoi desu. | × | source/inferred |
| 606 | 2017 | ぶるどーざーはとらくたにぶれーどをとりつけたきかいで、おおきいぶるどーざーはくっさくさぎょうに、ちーさいぶるどーざーはおうどやせいちさぎょうなどにつかわれます。 | Buldozer adalah mesin berupa traktor yang dipasangi blade. Buldozer besar digunakan untuk penggalian, sedangkan buldozer kecil untuk mendorong dan meratakan tanah. | burudoozaa ha torakuta ni bureedo wo toritsuketa kikai de, ookii burudoozaa ha kussaku sagyou ni, chiisai burudoozaa ha oshido ya seichi sagyou nado ni tsukawaremasu. | ○ | source/inferred |
| 607 | 2017 | ばっくほうはおもにじめんよりもしたのくっさくにつかわれて、ゆあつしょべるのなかでもっともよくみかけるきかいです。 | Backhoe terutama digunakan untuk menggali di bawah permukaan tanah dan merupakan mesin yang paling sering dijumpai di antara shovel hidrolik. | bakkuhou ha omoni jimen yorimo shita no kussaku ni tsukawarete, yuatsu shoberu no naka de mottomo yoku mikakeru kikai desu. | ○ | source/inferred |
| 608 | 2017 | ろーでぃんぐしょべるはおもにじめんにあるどしゃやがんせきのつみこみさぎょうにつかわれます。 | Loading shovel terutama digunakan untuk memuat tanah dan batu yang berada di permukaan tanah. | roodingushoberu ha omoni jimen ni aru dosha ya ganseki no tsumiko mi sagyou ni tsukawaremasu. | ○ | source/inferred |
| 609 | 2017 | ろーらは、どしゃやあすふぁるとなどをくっさくするさぎょうにつかわれるきかいです。 | Roller adalah mesin yang digunakan untuk menggali tanah, aspal, dan sebagainya. | roora ha, dosha ya asufaruto nado wo kussaku suru sagyou ni tsukaware ru kikai desu. | × | source/inferred |
| 610 | 2017 | ろーらのえんじんはよんさいくるです。 | Mesin roller adalah mesin empat tak. | roora no enjin ha yon saikuru desu. | ○ | source/inferred |
| 611 | 2017 | ろーらのえんじんのねんりょうはでぃーぜるえんじんだけです。 | Bahan bakar mesin roller hanya diesel. | roora no enjin no nenryou ha diizeru enjin dake desu. | × | source/inferred |
| 612 | 2017 | けんせつきかいにはおもによんさいくるしきですいれいしきのでぃーぜるえんじんがつかわれています。 | Mesin konstruksi terutama menggunakan mesin diesel empat tak dengan pendingin air. | kensetsu kikai ni ha omoni yon saikuru shiki de suireishiki no diizeru enjin ga tsukawareteimasu. | ○ | source/inferred |
| 613 | 2017 | でぃーぜるえんじんのねんりょうはがそりんです。 | Bahan bakar mesin diesel adalah bensin. | diizeru enjin no nenryou ha gasorin desu. | × | source/inferred |
| 614 | 2017 | ねんりょうにみずがまじる（みずがいる）と、えんじんのちょうしがわるくなるので、みずがまじらないようにちゅういするひつようがあります。 | Jika air tercampur ke dalam bahan bakar, kondisi mesin memburuk sehingga harus berhati-hati agar air tidak tercampur. | nenryou ni mizu ga majiru (mizu ga hairu) to, enjin no choushi ga waruku naru node, mizu ga majiranai you ni chuui suru hitsuyou ga arimasu. | ○ | source/inferred |
| 615 | 2017 | げんばでのてんけん、せいびはどこでやってもかまいません。 | Pemeriksaan dan perawatan di lapangan boleh dilakukan di mana saja. | genba de no tenken, seibi ha doko de yattemo kamaimasen. | × | source/inferred |
| 616 | 2018 | ときどきですが、へるめっとをつけないできかいをうんてんします。 | Kadang-kadang mengoperasikan mesin tanpa memakai helm. | tokidoki desuga, herumetto wo tsukenaide kikai wo unten shimasu. | × | source/inferred |
| 617 | 2018 | やぶれたさぎょうふくは、けがのげんいんになります。 | Pakaian kerja yang robek dapat menyebabkan cedera. | yabureta sagyoufuku ha, kega no gen'in ni narimasu. | ○ | source/inferred |
| 618 | 2018 | 「うんてんぎのうこうしゅう」または「とくべつきょういく」のしゅうりょうしょうがしごとできかいをうんてんするときのしかくになります。 | Sertifikat pelatihan keterampilan pengoperasian atau pendidikan khusus menjadi kualifikasi untuk mengoperasikan mesin dalam pekerjaan. | (unten ginou koushuu) mataha (tokubetsu kyouiku) no shuuryoushou ga shigoto de kikai wo unten suru toki no shikaku ni narimasu. | ○ | source/inferred |
| 619 | 2018 | えんじんをていしするまえには、あいどりんぐをおこないます。 | Lakukan idling sebelum mematikan mesin. | enjin wo teishi suru mae ni ha, aidoringu wo okonaimasu. | ○ | source/inferred |
| 620 | 2018 | きかいには、おもによんさいくるしきのでぃーぜるえんじんがつかわれています。 | Mesin konstruksi terutama menggunakan mesin diesel empat tak. | kikai ni ha, omoni yon saikuru shiki no diizeru enjin ga tsukawarete imasu. | ○ | source/inferred |
| 621 | 2018 | えんじんおいるには、ぴすとんのうごきをなめらかにするやくめがあります。 | Oli mesin berfungsi melancarkan gerakan piston. | enjin'oiru ni ha, pisuton no ugoki wo nameraka ni suru yakume ga arimasu. | ○ | source/inferred |
| 622 | 2018 | おるたねーたーはでんきをおこすそうちです。 | Alternator adalah alat untuk menghasilkan listrik. | orutaneetaa ha denki wo okosu souchi desu. | ○ | source/inferred |
| 623 | 2018 | きかいはせいびしなくてもあんぜんにこうりつよくうごかすことができます。 | Mesin dapat dioperasikan dengan aman dan efisien tanpa perawatan. | kikai ha seibi shinakute mo anzen ni kouritsu yoku ugokasu koto ga dekimasu. | × | source/inferred |
| 624 | 2018 | ばけっとのしたでてんけんをするときはあんぜんしちゅうをつかいます。 | Gunakan tiang pengaman saat memeriksa bagian bawah bucket. | baketto no shita de tenken wo suru toki ha anzen shichuu wo tsukaimasu. | ○ | source/inferred |
| 625 | 2018 | けいしゃちでてんけんをしなければならないばあい、かならずはどめやわとめをします。 | Jika harus memeriksa mesin di medan miring, selalu pasang ganjal roda. | keishachi de tenken wo shinakereba naranai baai, kanarazu hadome ya wadome wo shimasu. | ○ | source/inferred |
| 626 | 2018 | さぎょうそうちのうごきをえんじんしどうまえにてんけんしました。 | Saya memeriksa gerakan peralatan kerja sebelum menyalakan mesin. | sagyou souchi no ugoki wo enjin shidou mae ni tenken shimashita. | ○ | source/inferred |
| 627 | 2018 | はじめてのきかいをうんてんするとき、とりあつかいせつめいしょをよくよみ、うんてんしどうをうけます。 | Saat mengoperasikan mesin untuk pertama kali, baca manual dengan baik dan terima pengarahan pengoperasian. | hajimete no kikai wo unten suru toki, toriatsukai setsumeisho wo yo ku yomi, unten shidou wo ukemasu. | ○ | source/inferred |
| 628 | 2018 | きかいはてんけんしなくてもこしょうしません。 | Mesin tidak akan rusak meskipun tidak diperiksa. | kikai ha tenken shinakute mo koshou shimasen. | × | source/inferred |
| 629 | 2018 | きかいのさぎょうかいしまえてんけんはひつようありません。 | Pemeriksaan sebelum memulai pekerjaan mesin tidak diperlukan. | kikai no sagyou kaishi mae tenken ha hitsuyou arimasen. | × | source/inferred |
| 630 | 2018 | きかいのけいきがさどうしないときは、さぎょうしゅうりょうのちにてんけんします。 | Jika meteran mesin tidak berfungsi, periksa setelah pekerjaan selesai. | kikai no keiki ga sadou shinai toki ha, sagyou shuuryou go ni tenken shimasu. | × | source/inferred |
| 631 | 2018 | さぎょうしゅうりょうのち、つぎにうんてんするにんのためにえんじんをかけたままにします。 | Setelah pekerjaan selesai, mesin dibiarkan menyala untuk orang yang akan mengoperasikannya berikutnya. | sagyou shuuryou go, tsugi ni unten suru hito no tame ni enjin wo kaketa mama ni shimasu. | × | source/inferred |
| 632 | 2018 | すべてのきかいがやはらかなじめんでこうりつよくさぎょうができます。 | Semua mesin dapat bekerja dengan efisien di tanah yang lunak. | subete no kikai ga yawarakana jimen de kouritsu yoku sagyou ga dekimasu. | × | source/inferred |
| 633 | 2018 | ゆあつしょべるはおもにおうどさぎょうにつかわれます。 | Shovel hidrolik terutama digunakan untuk pekerjaan mendorong tanah. | yuatsu shoberu ha omoni oshido sagyou ni tsukawaremasu. | × | source/inferred |
| 634 | 2018 | ゆあつしょべるのばけっとつーすに、わいやをかけてにもつをつることはほうりつできんしされています。 | Menggantung barang dengan kawat pada gigi bucket shovel hidrolik dilarang oleh hukum. | yuatsu shoberu no baketto tsuusu ni, waiya wo kakete nimotsu wo tsuru koto ha houritsu de kinshi sareteimasu. | ○ | source/inferred |
| 635 | 2018 | ゆあつしょべるのばけっとがとらっくのうんてんせきのうえをつうかするやりかたでどしゃをつみこみます。 | Memuat tanah dengan cara bucket shovel hidrolik melewati atas kursi pengemudi truk. | yuatsu shoberu no baketto ga torakku no unten seki no ue wo tsuuka suru yarikata de dosha wo tsumikomimasu. | × | source/inferred |
| 636 | 2019 | さぎょうちゅうはかならずへるめっとをかぶります。 | Selama bekerja, selalu kenakan helm. | sagyou chuuu ha kanarazu herumetto wo kaburimasu. | ○ | source/inferred |
| 637 | 2019 | さぎょうのしゅるいがかわっても、おなじしゅるいのてぶくろをつかいます。 | Tetap menggunakan jenis sarung tangan yang sama meskipun jenis pekerjaan berubah. | sagyou no shurui ga kawattemo, onaji shurui no tebukuro wo tsukaimasu. | × | source/inferred |
| 638 | 2019 | きかいをやめるとき、ばけっとはじめんにくだろします。 | Turunkan bucket ke tanah saat menghentikan mesin. | kikai wo tomeru toki, baketto ha jimen ni oroshimasu. | ○ | source/inferred |
| 639 | 2019 | うんてんせきからおりるとき、とびおりしてもよいです。 | Boleh melompat turun dari kursi pengemudi. | untenseki kara oriru toki, tobiori shite mo yoidesu. | × | source/inferred |
| 640 | 2019 | えんじんには、でぃーぜるえんじんとがそりんえんじんがあります。 | Ada mesin diesel dan mesin bensin. | enjin ni ha, diizeruenjin to gasorin'enjin ga arimasu. | ○ | source/inferred |
| 641 | 2019 | えんじんおいるには、ぴすとんのうごきをなめらかにするやくめがあります。 | Oli mesin berfungsi melancarkan gerakan piston. | enjin'oiru ni ha, pisuton no ugoki wo nameraka ni suru yakume ga arima su. | ○ | source/inferred |
| 642 | 2019 | きかいはせいびをしなくても、あんぜんにうごかすことができます。 | Mesin dapat dioperasikan dengan aman tanpa perawatan. | kikai ha seibi wo shinakute mo, anzen ni ugokasu koto ga dekimasu. | × | source/inferred |
| 643 | 2019 | えんじんをうごかすまえにれいきゃくすいのりょうはてんけんしません。 | Jumlah air pendingin tidak perlu diperiksa sebelum menyalakan mesin. | enjin wo ugokasu mae ni reikyakusui no ryou ha tenkenshimasen. | × | source/inferred |
| 644 | 2019 | きかいをひとまわりしながら、かくぶぶんをよくてんけんします。 | Periksa setiap bagian dengan mengelilingi mesin. | kikai wo hitomawari shinagara, kakububun wo yoku tenkenshimasu. | ○ | source/inferred |
| 645 | 2019 | ぐりーすがんをつかって、ぐりーすをほきゅうします。 | Gunakan grease gun untuk menambahkan grease. | guriisu gan wo tsukatte, guriisu wo hokyuu shimasu. | ○ | source/inferred |
| 646 | 2019 | ねんりょうをほきゅうするとき、えんじんはとめます。 | Matikan mesin saat mengisi bahan bakar. | nenryou wo hokyuu suru toki, enjin ha tomemasu. | ○ | source/inferred |
| 647 | 2019 | きかいをうごかすとき、うごかすほうこうだけのあんぜんをかくにんすればじゅうぶんです。 | Saat menggerakkan mesin, cukup memastikan keamanan hanya pada arah gerak. | kikai wo ugokasu toki, ugokasu houkou dake no anzen wo kakunin suru reba juubun desu. | × | source/inferred |
| 648 | 2019 | きかいののうりょくをこえるさぎょうをしてはいけません。 | Dilarang melakukan pekerjaan yang melampaui kemampuan mesin. | kikai no nouryoku wo koeru sagyou wo shite ha ikemasen. | ○ | source/inferred |
| 649 | 2019 | はじめてのきかいでも、とりあつかいせつめいしょをよまないでうんてんします。 | Mengoperasikan mesin untuk pertama kali tanpa membaca manual. | hajimete no kikai demo, toriatsukai setsumeisho wo yomanaide untenshi masu. | × | source/inferred |
| 650 | 2019 | きかいのめーたーがうごかないときも、そのままさぎょうします。 | Tetap bekerja meskipun meteran mesin tidak bergerak. | kikai no meetaa ga ugokanai toki mo, sonomama sagyou shimasu. | × | source/inferred |
| 651 | 2019 | さぎょうばところに、しごとにかんけいないにんがいっってきてもさぎょうをつづけます。 | Tetap bekerja meskipun orang yang tidak berkaitan masuk ke area kerja. | sagyou basho ni, shigoto ni kankeinai hito ga haitte kitemo sagyou wo tsuzukemasu. | × | source/inferred |
| 652 | 2019 | きかいはつかいかたがきまっているので、それいがいのさぎょうにつかってはいけません。 | Karena cara penggunaan mesin sudah ditentukan, mesin tidak boleh digunakan untuk pekerjaan lain. | kikai ha tsukaikata ga kimatteiru node, sore igai no sagyou ni tsukatte ha ikemasen. | ○ | source/inferred |
| 653 | 2019 | きかいはきゅうはっしん、きゅうぶれーきなどのらんぼうなうんてんをしてもよいです。 | Mesin boleh dioperasikan secara kasar, seperti start dan pengereman mendadak. | kikai ha kyuu hasshin, kyuu bureeki nado no ranbou na unten wo shite mo yoi desu. | × | source/inferred |
| 654 | 2019 | ばっくほうのばけっとがだんぷとらっくのうんてんせきのうえをとうるやりかたでどしゃをつみこみます。 | Memuat tanah dengan cara bucket backhoe melewati atas kursi pengemudi dump truck. | bakkuhou no baketto ga danputorakku no untenseki no ue wo tooru yarikata de dosha wo tsumikomimasu. | × | source/inferred |
| 655 | 2019 | ばっくほうのばけっとのつめにわいやをかけてにもつをつってはいけません。 | Dilarang mengaitkan kawat pada ujung bucket backhoe untuk mengangkat barang. | bakkuhou no baketto no tsume ni waiya wo kakete nimotsu wo tsutte ha i kemasen. | ○ | source/inferred |
| 656 | 2020 | けんせつきかいのうんてんせきのなかはへるめっとをかぶらなくてもよいです。 | Di dalam kursi pengemudi mesin konstruksi boleh tidak memakai helm. | kensetsu kikai no untenseki no naka ha herumetto wo kaburanakutemo yoi desu. | × | source/inferred |
| 657 | 2020 | しごとがしやすくじこからからだをまもるふくをちゃくます。 | Kenakan pakaian yang memudahkan pekerjaan dan melindungi tubuh dari kecelakaan. | shigoto ga shiyasuku jiko kara karada wo mamoru fuku wo kimasu. | ○ | source/inferred |
| 658 | 2020 | きかいのつかいかたをまちがえるとじこやけがをすることがあります。 | Kesalahan penggunaan mesin dapat menyebabkan kecelakaan atau cedera. | kikai no tsukai kata wo machigaeru to jiko ya kega wo suru koto ga arima su. | ○ | source/inferred |
| 659 | 2020 | あしばがよければさんてんしじできかいにのりおりしなくてもよいです。 | Jika pijakannya baik, tidak perlu menggunakan tiga titik tumpuan saat naik dan turun dari mesin. | ashiba ga yokereba santen shiji de kikai ni nori ori shinakute mo yoidesu. | × | source/inferred |
| 660 | 2020 | えんじんおいるはぴすとんのうごきをなめらかにします。 | Oli mesin melancarkan gerakan piston. | enjin oiru ha pisuton no ugoki wo namerakani shimasu. | ○ | source/inferred |
| 661 | 2020 | けんせつきかいのえんじんにはにさいくるしきのがそりんえんじんがおおいです。 | Mesin konstruksi banyak menggunakan mesin bensin dua tak. | kensetsu kikai no enjin ni ha ni saikuru shiki no gasorin enjin ga ooi desu. | × | source/inferred |
| 662 | 2020 | きかいのめーたがうごかなくなったときはすぐにきかいをてんけんします。 | Jika meteran mesin berhenti bergerak, segera periksa mesin. | kikai no meeta ga ugokanaku natta toki ha sugu ni kikai wo tenken shimasu. | ○ | source/inferred |
| 663 | 2020 | 「さぎょうしゅうりょうのちてんけん」はほうりつできめられています。 | “Pemeriksaan setelah pekerjaan selesai” ditetapkan oleh undang-undang. | (sagyou shuuryou go tenken) ha houritsu de kimerarete imasu. | ○ | source/inferred |
| 664 | 2020 | ばけっとのしたでてんけんするとき、あんぜんしちゅうでばけっとをささえます。 | Saat memeriksa bagian bawah bucket, topang bucket dengan tiang pengaman. | baketto no shita de tenken suru toki, anzen shichuu de baketto wo sasaemasu. | ○ | source/inferred |
| 665 | 2020 | てんけんやじしゅけんさのきろくはほぞんするひつようがありません。 | Catatan pemeriksaan dan inspeksi mandiri tidak perlu disimpan. | tenken ya jishu kensa no kiroku ha hozon suru hitsuyou ga arimasen | × | source/inferred |
| 666 | 2020 | ゆあつさどうあぶらにごみがいるときかいがこしょうするときがあります。 | Jika kotoran masuk ke oli hidrolik, mesin dapat mengalami kerusakan. | yuatsu sadouyu ni gomi ga hairu to kikai ga koushou suru toki ga arimasu. | ○ | source/inferred |
| 667 | 2020 | たばこをすいながらきかいにねんりょうをいれます。 | Mengisi bahan bakar mesin sambil merokok. | tabako wo suinagara kikai ni nenryou wo iremasu. | × | source/inferred |
| 668 | 2020 | きかいののうりょくをこえるさぎょうをしてはいけません。 | Mesin tidak boleh digunakan untuk pekerjaan yang melampaui kemampuannya. | kikai no nouryoku wo koeru sagyou wo shite ha ikemasen. | ○ | source/inferred |
| 669 | 2020 | きかいをてんけんしていじょうがあったときせきにんしゃにほうこくし、なにをするかしじをうけます。 | Jika ditemukan kelainan saat memeriksa mesin, laporkan kepada penanggung jawab dan ikuti instruksi. | kikai wo tenken shite ijou ga atta toki sekininsha ni houkoku shi, nani wo suru ka shiji wo ukemasu. | ○ | source/inferred |
| 670 | 2020 | ばけっとなどのうごきはえんじんをうごかすまえにかくにんします。 | Periksa gerakan bucket dan bagian lain sebelum menyalakan mesin. | baketto nado no ugoki ha enjin wo ugokasu mae ni kakunin shimasu. | ○ | source/inferred |
| 671 | 2020 | さぎょうがおわったら、きかいをきめられたばしょまでいどうさせてちゅうしゃします。 | Setelah pekerjaan selesai, pindahkan dan parkirkan mesin di tempat yang ditentukan. | sagyou ga owattara, kikai wo kimerareta basho made idou sasete chuusha shimasu. | ○ | source/inferred |
| 672 | 2020 | すべてのけんせつきかいがやはらかなじめんでもさぎょうができます。 | Semua mesin konstruksi dapat bekerja di tanah yang lunak. | subete no kensetsu kikai ga yawarakana jimen demo sagyou ga dekimasu. | × | source/inferred |
| 673 | 2020 | さぎょうばところがまちのなかでもばけっとなどでさぎょうばところをかこいません。 | Meskipun tempat kerja berada di kota, area kerja tidak perlu dikelilingi dengan bucket atau lainnya. | sagyou basho ga machi no naka demo baketto nado de sagyou basho wo ka koimasen. | × | source/inferred |
| 674 | 2020 | ばけっとは、ばけっとをとりかえていろいろなさぎょうにつかえます。 | Bucket dapat diganti sehingga digunakan untuk berbagai pekerjaan. | baketto ha, baketto wo torikaete iroirona sagyou ni tsukaemasu. | ○ | source/inferred |
| 675 | 2020 | あんぜんかくにんはめでみることだけでおこないます。 | Pemeriksaan keselamatan dilakukan hanya dengan melihat. | anzen kakunin ha me de miru koto dake de okonaimasu. | × | source/inferred |
| 676 | 2020 | ときどきですがへるめっとをかぶらないできかいをうんてんします。 | Kadang-kadang mengoperasikan mesin tanpa memakai helm. | tokidoki desuga herumetto wo kaburanaide kikai wo unten shimasu. | × | source/inferred |
| 677 | 2020 | さぎょうしゅうりょうのち、つぎにうんてんするにんのためにえんじんきーをつけたままにします。 | Setelah pekerjaan selesai, kunci mesin dibiarkan terpasang untuk pengemudi berikutnya. | sagyou shuuryou go, tsugi ni unten suru hito no tame ni enjinkii wo tsuketa mama ni shimasu. | × | source/inferred |
| 678 | 2020 | やぶれたさぎょうふくをきているとけがをすることがあります。 | Mengenakan pakaian kerja yang robek dapat menyebabkan cedera. | yabureta sagyou fuku wo kite iru to kega wo suru koto ga arimasu. | ○ | source/inferred |
| 679 | 2020 | でぃーぜるえんじんのねんりょうはがそりんです。 | Bahan bakar mesin diesel adalah bensin. | diizeru enjin no nenryou ha gasorin desu. | × | source/inferred |
| 680 | 2020 | けんせつきかいのうんてんしゃは、えんじんをとめないでうんてんせきをはなれてはいけません。 | Pengemudi mesin konstruksi tidak boleh meninggalkan kursi pengemudi tanpa mematikan mesin. | kensetsu kikai no untensha ha, enjin wo tomenaide untenseki wo hanareteha ikemasen. | ○ | source/inferred |
| 681 | 2020 | げんばでてんけんをするとき、ぶれーきやあんぜんろっくはかけません。 | Saat memeriksa mesin di lapangan, rem dan kunci keselamatan tidak perlu dipasang. | genba de tenken wo suru toki, bureeki ya anzen rokku ha kake mase n. | × | source/inferred |
| 682 | 2020 | きかいはせいびをしなくてもよいです。 | Mesin tidak perlu dirawat. | kikai ha seibi wo shinakute mo yoi desu. | × | source/inferred |
| 683 | 2020 | おおくのけんせつきかいがよんさいくるしきのでぃーぜるえんじんをつかっています。 | Banyak mesin konstruksi menggunakan mesin diesel empat tak. | ooku no kensetsu kikai ga yon saikuru shiki no diizeru enjin wo tsukatteimasu. | ○ | source/inferred |
| 684 | 2020 | けいしゃちできかいをとめててんけんするとき、わとめをつかいます。 | Gunakan ganjal roda saat menghentikan dan memeriksa mesin di medan miring. | keishachi de kikai wo tomete tenken suru toki, wadome wo tsukaimasu. | ○ | source/inferred |
| 685 | 2020 | はじめてのきかいですが、とりあつかいせつめいしょをよまないでうんてんしました。 | Mengoperasikan mesin untuk pertama kali tanpa membaca manual. | hajimete no kikai desu ga, toriatsukai setsumeisho wo yomanaide unten shimashita. | × | source/inferred |
| 686 | 2020 | きかいをていししたとき、ばけっとなどはあげたままにします。 | Saat menghentikan mesin, bucket dan bagian lainnya dibiarkan terangkat. | kikai wo teishi shita toki, baketto nado ha ageta mama ni shimasu. | × | source/inferred |
| 687 | 2020 | きかいのちょうしがわるかったので、すぐにせきにんしゃにほうこくし、べつのきかいにのりかえてうんてんしました。 | Karena kondisi mesin buruk, segera laporkan kepada penanggung jawab dan gunakan mesin lain. | kikai no choushi ga warukatta node, suguni sekininsha ni houkoku shi, betsu no kikai ni norikaete unten shimashita. | ○ | source/inferred |
| 688 | 2020 | きかいのうんてんちゅうにめーたがうごかなくなったときすぐにあんぜんなばしょできかいをとめます。 | Jika meteran berhenti saat mesin berjalan, segera hentikan mesin di tempat yang aman. | kikai no unten chuu ni meeta ga ugokanaku natta toki sugu ni an zen na basho de kikai wo tomemasu. | ○ | source/inferred |
| 689 | 2020 | くっさくさぎょうにきかいはつかいません。 | Mesin tidak digunakan untuk pekerjaan penggalian. | kussaku sagyou ni kikai ha tsukaimasen. | × | source/inferred |
| 690 | 2020 | きかいはのうりょくをこえるさぎょうをしてはいけません。 | Mesin tidak boleh digunakan untuk pekerjaan yang melampaui kemampuannya. | kikai ha nouryoku wo koeru sagyou wo shite ha ikemasen. | ○ | source/inferred |
| 691 | 2020 | きかいはつかいかたがきまっているので、それいがいのさぎょうにつかってはいけません。 | Karena cara penggunaan mesin sudah ditentukan, mesin tidak boleh digunakan untuk pekerjaan lain. | kikai ha tsukaikata ga kimatte iru node, soreigai no sagyou ni tsukatteha ikemasen. | ○ | source/inferred |
| 692 | 2020 | あんぜんかくにんはめでみることだけでおこないます。 | Pemeriksaan keselamatan dilakukan hanya dengan melihat. | anzen kakunin ha me de miru koto dake de okonaimasu. | × | source/inferred |
| 693 | 2020 | やまのしゃめんをきかいでのぼるときは、まっすぐにのぼります。 | Saat menaiki lereng gunung dengan mesin, naiklah lurus. | yama no shamen wo kikai de noboru toki ha, massugu ni noborimasu. | ○ | source/inferred |
| 694 | 2020 | ばけっとはぶーむをたかくあげてそうこうします。 | Mesin dijalankan dengan boom dan bucket diangkat tinggi. | baketto ha buumu baketto wo takaku agete soukou shimasu. | × | source/inferred |
| 695 | 2020 | だんぷとらっくをひくいばしょにおくと、ばっくほうによるつみこみさぎょうがしやすくなります。 | Jika dump truck ditempatkan di tempat rendah, pekerjaan pemuatan dengan backhoe menjadi lebih mudah. | danputorakku wo hikui basho ni okuto, bakkuhou ni yoru tsumikomi sagyou ga shiyasuku narimasu. | ○ | source/inferred |

---

# Review Sesi 1 — 育林 (Ikurin)

## Ringkasan Sumber

- `soal-asli/soal-ikurin-shokyu-2025-a.docx`: 20 soal, level `shokyu`, tahun 2025.
- `soal-asli/soal-ikurin-shokyu-2025-b.docx`: 20 soal, level `shokyu`, tahun 2025.
- `soal-asli/soal-ikurin-shokyu-2025-c.docx`: 20 soal, level `shokyu`, tahun 2025.
- Total draf: 60 soal.
- Kategori aplikasi: `ikurin` / 育林.
- Kunci `○`/`×` tercetak pada sumber dan ditandai `source`; reading perlu dinormalisasi sesuai aturan proyek.

## Hal yang Perlu Dikonfirmasi

- Periksa transkripsi soal yang merujuk gambar: gambar sumber belum dipasangkan ke field `image`.
- Periksa normalisasi kana, spasi partikel, istilah teknis, reading romaji, dan terjemahan.
- Sumber B memuat daftar jawaban teks tambahan setelah soal; kunci pada setiap baris soal sudah dipakai.
- Sumber C memiliki beberapa kemungkinan typo/transkripsi, misalnya `えではらい` dan `Uestsuke` pada terjemahan; mohon cek sebelum dimasukkan ke JSON.
- Pastikan 60 soal ini boleh diproses ke `questions-ikurin.json`; belum dimasukkan ke aplikasi.

## Draf Soal yang Memerlukan Konfirmasi

Hanya soal yang merujuk gambar atau memiliki transkripsi/reading yang belum dapat dipastikan dicatat di bagian ini. Soal yang jelas sudah dimasukkan ke JSON aplikasi.
|---:|---:|---|---|---|:---:|---|
soal-ikurin-shokyu-2025-a.docx 20
| 1 | 2025 | した の しゃしん は うえつけ を して います。 | Gambar di bawah adalah “uetsuke”. | NEED-CONFIRM | × | source; reading perlu review |
| 2 | 2025 | したがり とは なえぎ の まわり の くさ を かる こと です。 | “Shitagari” adalah kegiatan memotong rumput di sekitar pohon bibit. | NEED-CONFIRM | ○ | source; reading perlu review |
| 3 | 2025 | えだうち は した の ず の あかい せん の ところ を きります。 | "Edauchi" memotong bagian yang ditandai garis merah pada gambar di bawah. | NEED-CONFIRM | × | source; reading perlu review |
| 4 | 2025 | じごしらえ には かりはらいき や チェーンソーを つかいます。 | Dalam “jigoshirae”, digunakan alat pemotong rumput dan chainsaw. | NEED-CONFIRM | ○ | source; reading perlu review |
| 5 | 2025 | したがり には した の ず の おおきな かま も つかいます。 | "Shitagari" juga menggunakan sabit besar seperti yang terlihat pada gambar di bawah. | NEED-CONFIRM | ○ | source; reading perlu review |
| 6 | 2025 | かりはらいき を つかう とき は ちかく で さぎょう を しません。 | Saat menggunakan alat pemotong rumput, tidak melakukan pekerjaan di dekatnya. | NEED-CONFIRM | ○ | source; reading perlu review |
| 7 | 2025 | かぜ が つよい とき に き を たおします。 | Menebang pohon ketika angin kencang. | NEED-CONFIRM | × | source; reading perlu review |
| 8 | 2025 | した の ず の きかい を チェーンソー と いいます。 | Alat pada gambar di bawah disebut chainsaw. | NEED-CONFIRM | ○ | source; reading perlu review |
| 9 | 2025 | した の ず の さぎょう を えだはらい と いいます。 | Kegiatan pada gambar di bawah disebut “edaharai”. | NEED-CONFIRM | ○ | source; reading perlu review |
| 10 | 2025 | たまぎり は ざい に かかって いる あつりょく に ちゅうい して おこないます。 | "Tamagiri" dilakukan dengan memperhatikan tekanan pada kayu. | NEED-CONFIRM | ○ | source; reading perlu review |
| 11 | 2025 | チェーンソー の あんぜんそうち には ソーチェーン が あります。 | Pada perangkat keamanan chainsaw terdapat rantai chainsaw. | NEED-CONFIRM | × | source; reading perlu review |
| 12 | 2025 | した の ず の あかい せん の ぶぶん は キックバック が おきやすく きけん です。 | Bagian yang ditandai garis merah pada gambar di bawah rawan terjadi kickback dan berbahaya. | NEED-CONFIRM | ○ | source; reading perlu review |
| 13 | 2025 | かりはらいき の は は １ねん に １かい きず と へんけい を かくにん します。 | Mata pisau alat pemotong rumput diperiksa kerusakan dan deformasi setahun sekali. | NEED-CONFIRM | × | source; reading perlu review |
| 14 | 2025 | した の どうぐ は かま と いいます。 | Alat pada gambar di bawah disebut “kama”. | NEED-CONFIRM | × | source; reading perlu review |
| 15 | 2025 | たまぎり で ガイドバー が はさまった とき は した の ず の どうぐ を つかいます。 | Ketika guide bar terjepit saat "tamagiri", gunakan alat pada gambar di bawah. | NEED-CONFIRM | ○ | source; reading perlu review |
| 16 | 2025 | チェーンソー を つかう とき は ぼうごずぼん を はきます。 | Saat menggunakan chainsaw, kenakan celana pelindung. | NEED-CONFIRM | ○ | source; reading perlu review |
| 17 | 2025 | うえつけ では くわ を おおぶり して あな を ほります。 | Dalam “uetsuke”, cangkul digerakkan dengan ayunan lebar untuk menggali lubang. | NEED-CONFIRM | × | source; reading perlu review |
| 18 | 2025 | きよせ とは もくざい を あつめる さぎょう を いいます。 | "Kiyose" adalah kegiatan mengumpulkan kayu. | NEED-CONFIRM | ○ | source; reading perlu review |
| 19 | 2025 | えだはらい では ざい や えだ に かかる あつりょく に ちゅうい して おこないます。 | Dalam “edaharai”, dilakukan dengan memperhatikan tekanan pada kayu dan dahan. | NEED-CONFIRM | ○ | source; reading perlu review |
| 20 | 2025 | じこ が おきた とき は ただち に たすけ を よびます。 | Jika terjadi kecelakaan, segera meminta pertolongan. | NEED-CONFIRM | ○ | source; reading perlu review |
soal-ikurin-shokyu-2025-b.docx 20
| 1 | 2025 | した の ず は うえつけ を して います。 | Gambar di bawah menunjukkan proses “uetsuke”. | NEED-CONFIRM | ○ | source; reading perlu review |
| 2 | 2025 | じごしらえ とは なえぎ の まわり の くさ を かる こと です。 | “Jigoshirae” adalah kegiatan memotong rumput di sekitar bibit pohon. | NEED-CONFIRM | × | source; reading perlu review |
| 3 | 2025 | した の ず は えだはらい を して います。 | Gambar di bawah menunjukkan proses “edaharai”. | NEED-CONFIRM | × | source; reading perlu review |
| 4 | 2025 | じごしらえ は うえつけ が はじまる まえ に おこないます。 | “Jigoshirae” dilakukan sebelum penanaman dimulai. | NEED-CONFIRM | ○ | source; reading perlu review |
| 5 | 2025 | した の どうぐ は のこぎり と いいます。 | Alat pada gambar di bawah disebut “nokogiri”. | NEED-CONFIRM | × | source; reading perlu review |
| 6 | 2025 | かりはらいき の さぎょう は ほか の さぎょうしゃ の ちかく で しません。 | Pekerjaan dengan alat pemotong rumput tidak dilakukan di dekat pekerja lain. | NEED-CONFIRM | ○ | source; reading perlu review |
| 7 | 2025 | かぜ が つよい とき は き を たおしません。 | Saat angin kencang, pohon tidak ditebang. | NEED-CONFIRM | ○ | source; reading perlu review |
| 8 | 2025 | した の ず の きかい を チェーンソー と いいます。 | Alat pada gambar di bawah disebut chainsaw. | NEED-CONFIRM | × | source; reading perlu review |
| 9 | 2025 | した の ず の さぎょう を えだはらい と いいます。 | Kegiatan pada gambar di bawah disebut “edaharai”. | NEED-CONFIRM | ○ | source; reading perlu review |
| 10 | 2025 | たまぎり は ざい に かかって いる ちから の かかりかた に ちゅうい して おこないます。 | “Tamagiri” dilakukan dengan memperhatikan distribusi tekanan pada kayu. | NEED-CONFIRM | ○ | source; reading perlu review |
| 11 | 2025 | した の ず は きよせ を して います。 | Gambar di bawah menunjukkan proses “kiyose”. | NEED-CONFIRM | ○ | source; reading perlu review |
| 12 | 2025 | チェーンソー や かりはらいき の キックバック は きけん で けが を する こと が あります。 | Kickback pada chainsaw atau alat pemotong rumput berbahaya dan dapat menyebabkan cedera. | NEED-CONFIRM | ○ | source; reading perlu review |
| 13 | 2025 | かりはらいき の は は まいにち きず と へんけい が ないこと を かくにん します。 | Pisau alat pemotong rumput diperiksa setiap hari untuk memastikan tidak ada kerusakan atau deformasi. | NEED-CONFIRM | ○ | source; reading perlu review |
| 14 | 2025 | えだうち は した の ず の あかい せん の ところ を きります。 | “Edauchi” dilakukan pada bagian yang ditandai garis merah pada gambar di bawah. | NEED-CONFIRM | × | source; reading perlu review |
| 15 | 2025 | たまぎり で ガイドバー が はさまった とき は した の ず の どうぐ を つかいます。 | Jika guide bar terjepit saat “tamagiri”, gunakan alat pada gambar di bawah. | NEED-CONFIRM | ○ | source; reading perlu review |
| 16 | 2025 | チェーンソー を つかう とき は チェーンソー よう の ぼうごずぼん を はきます。 | Saat menggunakan chainsaw, kenakan celana pelindung khusus chainsaw. | NEED-CONFIRM | ○ | source; reading perlu review |
| 17 | 2025 | き を たおす まえ には さだめられた あいず を おこない まわり の ひと の あんぜん を かくにん します。 | Sebelum menebang pohon, berikan isyarat yang ditentukan dan pastikan keamanan orang di sekitar. | NEED-CONFIRM | ○ | source; reading perlu review |
| 18 | 2025 | はち が とんで いる じき は した の しゃしん の ぼうほう も つけます。 | Saat musim lebah terbang, gunakan juga pelindung wajah seperti pada gambar di bawah. | NEED-CONFIRM | ○ | source; reading perlu review |
| 19 | 2025 | さぎょうふく は うごき やすく あんぜん な もの を つかいます。 | Pakaian kerja harus nyaman bergerak dan aman. | NEED-CONFIRM | ○ | source; reading perlu review |
| 20 | 2025 | ひと の いのち に かかわる じこ が おきた とき は だたちに けいさつ を よびます。 | Jika terjadi kecelakaan yang mengancam nyawa, segera hubungi polisi. | NEED-CONFIRM | × | source; reading perlu review |
soal-ikurin-shokyu-2025-c.docx 20
| 1 | 2025 | じごしらえ は なえぎ を うえる こと です。 | “Jigoshirae” adalah kegiatan menanam bibit pohon. | NEED-CONFIRM | × | source; reading perlu review |
| 2 | 2025 | うえつけ とは なえぎ の まわり の くさ を かる こと です。 | “Uetsuke” merupakan kegiatan memotong rumput di sekitar bibit. | NEED-CONFIRM | × | source; reading perlu review |
| 3 | 2025 | したがり とは なえぎ を うえる こと です。 | “Shitagari” adalah proses penanaman bibit pohon. | NEED-CONFIRM | × | source; reading perlu review |
| 4 | 2025 | じょばつ とは そだち の わるい き や しぜん に はえて きた いらない き を きる こと です。 | “Jobatsu” adalah penebasan pohon yang pertumbuhannya buruk atau pohon tidak perlu yang tumbuh alami. | NEED-CONFIRM | ○ | source; reading perlu review |
| 5 | 2025 | じごしらえ は かならず はる に おこない ます。 | “Jigoshirae” harus dilakukan pada musim semi. | NEED-CONFIRM | × | source; reading perlu review |
| 6 | 2025 | ふつうなえ の うえつけ は かならず ふゆ に おこない ます。 | “Uestsuke” bibit harus selalu dilakukan pada musim dingin. | NEED-CONFIRM | × | source; reading perlu review |
| 7 | 2025 | したがり は つうじょう ６がつ から ８がつ に おこないます。 | “Shitagari” biasanya dilakukan dari bulan Juni hingga Agustus. | NEED-CONFIRM | ○ | source; reading perlu review |
| 8 | 2025 | えだうち は きる いち を きめて のこぎり や なた で おこないます。 | “Edauchi” dilakukan dengan menentukan titik potong menggunakan gergaji atau parang. | NEED-CONFIRM | ○ | source; reading perlu review |
| 9 | 2025 | き を たおす ばあい は あんぜん に たおす ほうこう を きめます。 | Saat menebang pohon, harus menentukan arah menjatuhkan yang aman. | NEED-CONFIRM | ○ | source; reading perlu review |
| 10 | 2025 | き を たおす ばあい は たいひ する ばしょ を かくにん します。 | Ketika menebang pohon, perlu dipastikan lokasi untuk menghindar. | NEED-CONFIRM | ○ | source; reading perlu review |
| 11 | 2025 | ず の さぎょう は えではらい です。 | Kegiatan pada gambar adalah pembersihan cabang. | NEED-CONFIRM | × | source; reading perlu review |
| 12 | 2025 | えだはらい を する ばあい は チェーンソー の ガイドバー の せんたん のみ つかいます。 | Saat melakukan pembersihan cabang, hanya ujung guide bar chainsaw yang digunakan. | NEED-CONFIRM | × | source; reading perlu review |
| 13 | 2025 | たまぎり では チェーンソー を つかいます。 | “Tamagiri” menggunakan chainsaw. | NEED-CONFIRM | ○ | source; reading perlu review |
| 14 | 2025 | たまぎり では ガイドバー が はさまる こと は ありません。 | Dalam “tamagiri”, guide bar tidak akan terjepit. | NEED-CONFIRM | × | source; reading perlu review |
| 15 | 2025 | チェーンソー は したくさ を かりはらう きかい です。 | Chainsaw adalah alat untuk memotong rumput bawah. | NEED-CONFIRM | × | source; reading perlu review |
| 16 | 2025 | チェーンソー の ソーチェーン は １ねん に １かい はり の じょうたい を かくにん します。 | Rantai chainsaw (saw chain) diperiksa kondisi mata pisaunya setahun sekali. | NEED-CONFIRM | × | source; reading perlu review |
| 17 | 2025 | かりはらいき の キックバック は エンジン の かいてんすう を あげる こと で ふせぐ こと が できます。 | Kickback pada alat pemotong rumput dapat dicegah dengan meningkatkan putaran mesin. | NEED-CONFIRM | × | source; reading perlu review |
| 18 | 2025 | かりはらいき を つかった したかり さぎょう は けいしゃ の ある ばしょ では けいしゃ の じょうげ いち に わかれて さぎょう を します。 | “Shitakari” dengan alat pemotong rumput di lereng dilakukan dengan membagi area kerja menjadi zona atas dan bawah. | NEED-CONFIRM | × | source; reading perlu review |
| 19 | 2025 | チェーンソー を つかう ばあい は イヤーマフを つけます。 | Saat menggunakan chainsaw, harus menggunakan pelindung telinga (ear muff). | NEED-CONFIRM | ○ | source; reading perlu review |
| 20 | 2025 | ねっちゅうしょう は すいぶん を とらない こと で ふせげます。 | Heat stroke dapat dicegah dengan tidak mengonsumsi cairan. | NEED-CONFIRM | × | source; reading perlu review |
| 1 | 2015 | にほん　の　こくど　は、やま　が　おおく、のうち　が　すくない　です。Tanah di Jepang memiliki banyak gunung dan sedikit ladang |  | NEED-CONFIRM | inferred |
| 2 | 2015 | にほん　には、はる、なつ、あき、ふゆ　が　あります。Di Jepang terdapat musim semi, panas, gugur, dan salju |  | NEED-CONFIRM | inferred |
| 3 | 2015 | にほん　の　いなさく　は、ほとんど　が　じかまき　さいばい　です。Budidaya beras di Jepang kebanyakan dengan metode jikamaki |  | NEED-CONFIRM | inferred |
| 4 | 2015 | にほん　で　かって　いる　おもな　かちく　は、うし、ぶた、にわとり　の　３つ　です。Ternak yang umum di Jepang adalah tiga jenis hewan, yaitu sapi, babi, dan ayam |  | NEED-CONFIRM | inferred |
| 5 | 2015 | あさ、かちく　の　いじょう　を　みつけたら、ゆうがた　しごと　が　おわった　とき　に、ほうこく　します。Apabila menemukan kelainan hewan di pagi hari, maka melapor di sore hari setelah selesai bekerja |  | NEED-CONFIRM | inferred |
| 6 | 2015 | たいひ　は　ふんにょう　を　はたけ　に　のづみ　して　つくり　ます。Pupuk kompos dibuat dengan mengumpulkan kotoran hewan ke ladang |  | NEED-CONFIRM | inferred |
| 7 | 2015 | にくとん（にくぶた）は、はんしょく　に　つかう　ぼとん（ははぶた）の　こと　です。Babi pedaging adalah babi indukan yang digunakan untuk berkembang biak |  | NEED-CONFIRM | inferred |
| 8 | 2015 | ぶた　の　じんこうにゅう　は、ひいく　に　つかう　えさ　です。Susu buatan untuk babi digunakan sebagai makanan pertumbuhan |  | NEED-CONFIRM | inferred |
| 9 | 2015 | ぶんべんしゃ　は　にくとん　を　そだてる　とんしゃ　です。Bunbensha adalah kandang untuk membesarkan babi pedaging |  | NEED-CONFIRM | inferred |
| 10 | 2015 | にくとん　は、やく　115キログラム（きろぐらむ）に　そだて　しゅっか　します。Babi pedaging dibesarkan hingga berat 115 KG sebelum dijual |  | NEED-CONFIRM | inferred |
| 11 | 2015 | とんしゃ　に　はいる　とき　は、ながぐつ　を　ふみこみしょうどくそう　で、しょうどく　します。Mengenakan sepatu panjang dan mensterilkannya di disinfeksi injak sebelum memasuki kandang babi |  | NEED-CONFIRM | inferred |
| 12 | 2015 | とんしゃない　の　せいそう　は、まいにち　おこない　ます。Pembersihan dalam kandang babi dilaksanakan setiap hari |  | NEED-CONFIRM | inferred |
| 13 | 2015 | ぶた　は、1ねん　に　３かい　しゅっさん　します。Babi melahirkan 3 kali dalam 1 tahun |  | NEED-CONFIRM | inferred |
| 14 | 2015 | ぼとん　は、いちど　に　20とう　こぶた　を　うみ　ます。Babi indukan melahirkan 20 anak babi sekaligus |  | NEED-CONFIRM | inferred |
| 15 | 2015 | ランドレース（らんどれーす）しゅ　は、しろい　ぶた　です。Jenis Landrace adalah babi berwarna putih |  | NEED-CONFIRM | inferred |
| 16 | 2015 | にほん　の　ひいくとん（にくとん）は、おなじ　ひんしゅ　を　かけあわせた　ぶた　が　おおい　です。Kebanyakan babi pedaging di Jepang adalah hasil perkawinan babi yang sejenis |  | NEED-CONFIRM | inferred |
| 17 | 2015 | ひいくとん　は、むれ　で　しいく　しています。Babi pedaging dibesarkan secara berkelompok |  | NEED-CONFIRM | inferred |
| 18 | 2015 | こぶた　は、さむさ　に　つよい　です。Anak babi kuat terhadap dingin |  | NEED-CONFIRM | inferred |
| 19 | 2015 | ひいくとん　は、えさ　の　たべのこし　が　ないよう　に、りょう　を　せいげん（すくなく）して　そだて　ます。Babi pedaging dibesarkan dengan porsi makan yang dikurangi agar tidak menyisakan makanan |  | NEED-CONFIRM | inferred |
| 20 | 2015 | びょうき　を　ふせぐ　ため、えいせいかんり　が　たいせつ　です。Pengelolaan kebersihan diperlukan untuk mencegah penyakit |  | NEED-CONFIRM | inferred |
| 21 | 2018 | にほん　は　やま　が　すくなく、のうち　が　おおい　です。Jepang mempunyai sedikit gunung dan banyak ladang |  | NEED-CONFIRM | inferred |
| 22 | 2018 | にほん　には、はる、なつ、あき、ふゆ　が　あり　ます。Di Jepang terdapat musim semi, panas, gugur, dan salju |  | NEED-CONFIRM | inferred |
| 23 | 2018 | にほん　の　いなさく　は、なえ　を　そだて　たうえ　を　する　のが　おおい　です。Budidaya beras di Jepang kebanyakan dilakukan dengan menanam ke ladang setelah menumbuhkan benihnya |  | NEED-CONFIRM | inferred |
| 24 | 2018 | にほん　で　かって　いる　かちく　は、ぶた　と　にわとり　だけ　です。Hewan ternak di Jepang hanyalah babi dan ayam |  | NEED-CONFIRM | inferred |
| 25 | 2018 | たいひ　は、はたけ　に　のづみ　して　つくり　ます。Pupuk kompos dibuat dengan mengumpulkan ke ladang |  | NEED-CONFIRM | inferred |
| 26 | 2018 | ぶた　の　いじょう　を　みつけたら、すぐ　に　しらせ　ます。Apabila menemukan kelainan pada babi, segera melapor |  | NEED-CONFIRM | inferred |
| 27 | 2018 | はんしょくよう　の　たねぶた　は、１とう　ずつ　かい　ます。Babi benih untuk pengembangbiakan dipelihara satu per satu |  | NEED-CONFIRM | inferred |
| 28 | 2018 | ひいくとん　には、あまり　えさ　を　あたえ　ません。Tidak terlalu banyak memberikan pakan untuk babi pedaging |  | NEED-CONFIRM | inferred |
| 29 | 2018 | ぶんべんしゃ　は、ひいくとん　を　そだてる　ところ　です。Bunbensha adalah tempat untuk membesarkan babi pedaging |  | NEED-CONFIRM | inferred |
| 30 | 2018 | ぶた　は　うまれて　から、110キログラム（きろぐらむ）～ 120キログラム　に　そだて、　しゅっか　します。Setelah lahir, babi dijual setelah mencapai berat 110 hingga 120 kg |  | NEED-CONFIRM | inferred |
| 31 | 2018 | ふみこみしょうどくそう　の　しょうどくえき　は、１ねん　に　１っかい　あたらしく　します。Cairan disinfektan di disinfektan injak diperbarui sekali setahun |  | NEED-CONFIRM | inferred |
| 32 | 2018 | デュロック（ぢゅろっく）しゅ　は、しろい　いろ　の　ぶた　です。Jenis Duroc adalah babi berwarna putih |  | NEED-CONFIRM | inferred |
| 33 | 2018 | しょうどくえき　を　つかう　とき　は、　しようほうほう　と　しようりょう　を　まもり　ます。Mematuhi aturan dan porsi penggunaan ketika menggunakan cairan disinfektan |  | NEED-CONFIRM | inferred |
| 34 | 2018 | ぶた　は、１ねん　に　４かい　しゅっさん　します。Babi melahirkan 4 kali dalam setahun |  | NEED-CONFIRM | inferred |
| 35 | 2018 | ぶた　の　はんしょく　は、じんこうじゅせい　が　でき　ます。Babi dapat berkembang biak dengan pembuahan buatan |  | NEED-CONFIRM | inferred |
| 36 | 2018 | ははぶた　は、１かい　に　30とう　の　こぶた　を　うみ　ます。Babi indukan melahirkan 30 anak babi sekaligus |  | NEED-CONFIRM | inferred |
| 37 | 2018 | にほん　の　ひいくとん　は、ちがう　ひんしゅ　を　かけあわせた　もの　が　おおい　です。Babi pedaging di Jepang kebanyakan adalah hasil perkawinan jenis babi yang berbeda |  | NEED-CONFIRM | inferred |
| 38 | 2018 | こぶた　は、さむさ　に　よわい　です。Anak babi lemah terhadap dingin |  | NEED-CONFIRM | inferred |
| 39 | 2018 | メス（めす）の　こぶた　は、きょせい　を　します。Anak babi betina dikebiri |  | NEED-CONFIRM | inferred |
| 40 | 2018 | ワクチン（わくちん）は、びょうき　を　よぼう　する　ため　に　つかい　ます。Vaksin bertujuan untuk mencegah penyakit |  | NEED-CONFIRM | inferred |
| 41 | 2019 | にほん　は　ほとんど　が　ねったい　きこう　です。Kebanyakan tanah di Jepang beriklim tropis |  | NEED-CONFIRM | inferred |
| 42 | 2019 | にほん　の　こくど　は　なんぼく　に　ながい　です。Wilayah Jepang melintang Utara ke Selatan |  | NEED-CONFIRM | inferred |
| 43 | 2019 | にほん　では　きぼ　の　おおきい　のうじょう　が　ふえてきます。Di Jepang ladang berskala besar semakin bertambah |  | NEED-CONFIRM | inferred |
| 44 | 2019 | にほん　で　かう　おもな　かちく　は　うし、ぶた、にわとり　の　みっつ　です。Hewan ternak yang umum di Jepang ada tiga, yakni sapi, babi, dan ayam |  | NEED-CONFIRM | inferred |
| 45 | 2019 | しょうどくえき　は　じかん　が　たつと　こうか　が　あがります。Efek cairan disinfektan menguat seiring berjalannya waktu |  | NEED-CONFIRM | inferred |
| 46 | 2019 | とんしゃ　に　はいる　とき　は、ながぐつ　を　ふみこみしょうどくそう　で　しょうどく　します。Mengenakan sepatu panjang dan membersihkannya di bak disinfeksi injak sebelum masuk ke kandang babi |  | NEED-CONFIRM | inferred |
| 47 | 2019 | たいひ　は　かちく　の　ふんにょう　を　はっこうさせて　つくります。Pupuk kompos dibuat dengan melakukan fermentasi pada kotoran ternak |  | NEED-CONFIRM | inferred |
| 48 | 2019 | こぶた　の　じんこうにゅう　は　いっしゅるい　です。Susu buatan untuk babi hanya ada satu jenis |  | NEED-CONFIRM | inferred |
| 49 | 2019 | たねぶた　は　はんしょく　に　つかう　ぶた　です。Babi benih adalah babi untuk berkembang biak |  | NEED-CONFIRM | inferred |
| 50 | 2019 | ぶんべんしゃ　は　にくとん　を　そだてる　ところ　です。Bunbensha adalah tempat untuk membesarkan babi pedaging |  | NEED-CONFIRM | inferred |
| 51 | 2019 | ぶた　は　50キログラム　から 60キログラム　に　そだて　しゅっか　します。Babi dijual setelah dibesarkan hingga mencapai berat 50~60 kg |  | NEED-CONFIRM | inferred |
| 52 | 2019 | ぶた　は、１ねん　に　３かい　しゅっさん　します。Babi melahirkan 3 kali dalam 1 tahun |  | NEED-CONFIRM | inferred |
| 53 | 2019 | デュロックしゅ　は　しろいろ　の　ぶた　です。Jenis Duroc adalah babi berwarna putih |  | NEED-CONFIRM | inferred |
| 54 | 2019 | ぶた　の　はんしょく　は　じんこうじゅせい　が　できます。Babi dapat berkembang biak dengan pembuahan buatan |  | NEED-CONFIRM | inferred |
| 55 | 2019 | ぶた　の　にんしん　きかん　は　やく　５００にち　です。Masa hamil babi sekitar 500 hari |  | NEED-CONFIRM | inferred |
| 56 | 2019 | めすぶたしゅ　は　うまれてから　やく　はっかげつぶん　こうはい　を　します。Babi betina kawin sekitar 8 bulan setelah lahir |  | NEED-CONFIRM | inferred |
| 57 | 2019 | おす　の　こぶた　は　きょせい　を　します。Anak babi jantan dikebiri |  | NEED-CONFIRM | inferred |
| 58 | 2019 | けんこう　な　ぶた　は　おっこって　さがります。? |  | NEED-CONFIRM | inferred |
| 59 | 2019 | はんしょくとん　は　つねに　しりょう　が　たべられる　ように　して　おきます。Babi untuk berkembang biak dibuat supaya bisa makan di segala waktu |  | NEED-CONFIRM | inferred |
| 60 | 2019 | びょうき　を　ふせぐ　ため、えいせい　かんり　が　たいせつ　です。Pengelolaan kebersihan penting untuk mencegah penyakit |  | NEED-CONFIRM | inferred |
| 61 | 2020 | にほん　は　やま　が　おおく　のうち　が　すくない　です。Di Jepang terdapat banyak gunung dan sedikit ladang |  | NEED-CONFIRM | inferred |
| 62 | 2020 | にほん　には　はる、なつ、あき　の　みっつ　の　きせつ　だけ　が　あります。Di Jepang terdapat tiga musim saja, yaitu musim semi, panas, dan gugur |  | NEED-CONFIRM | inferred |
| 63 | 2020 | にほん　では　きぼ　の　おおきい　のうじょう　が　ふえて　きます。Ladang berskala besar di Jepang semakin bertambah |  | NEED-CONFIRM | inferred |
| 64 | 2020 | にほん　で　かう　おもな　かちく　は　うし、ぶた、にわとり　の　みっつ　です。Hewan ternak yang umum di Jepang ada tiga, yakni sapi, babi, dan ayam |  | NEED-CONFIRM | inferred |
| 65 | 2020 | はっこうちゅう　の　たいひ　は　おんど　が　さがります。Pupus kompos yang sedang difermentasi, suhunya menurun |  | NEED-CONFIRM | inferred |
| 66 | 2020 | しりょう　を　たべない　かちく　が　いたら　すぐに　ようす　を　しらせます。Segera melaporkan keadaan apabila ada ternak yang tidak mau makan |  | NEED-CONFIRM | inferred |
| 67 | 2020 | とんしゃ　に　はいる　とき　は、ながぐつ　を　ふみこみしょうどくそう　で、　しょうどく　します。Memakai sepatu panjang dan membersihkannya di bak disinfeksi injak sebelum masuk ke kandang babi |  | NEED-CONFIRM | inferred |
| 68 | 2020 | だいずかす　は　ぶた　の　しりょう　に　よく　つかいます。Ampas kedelai sering digunakan sebagai pakan babi |  | NEED-CONFIRM | inferred |
| 69 | 2020 | こぶた　の　じんこうにゅう　は　いっしゅるい　です。Susu buatan untuk anak babi hanya ada satu jenis |  | NEED-CONFIRM | inferred |
| 70 | 2020 | ぶんべんしゃ　は　にくとん　を　そだてる　ところ　です。Bunbensha adalah tempat membesarkan babi pedaging |  | NEED-CONFIRM | inferred |
| 71 | 2020 | ぶた　は　50キログラム　から　60キログラム　に　そだて　しゅっか　します。Babi dijual setelah dibesarkan hingga mencapai 50~60 kg |  | NEED-CONFIRM | inferred |
| 72 | 2020 | しょうどくやく　は　つかいかた　と　りょう　を　まもります。Patuhi aturan dan jumlah penggunaan untuk disinfektan |  | NEED-CONFIRM | inferred |
| 73 | 2020 | ランドレースしゅ　は　しろいろ　の　ぶた　です。Jenis Landrace adalah babi berwarna putih |  | NEED-CONFIRM | inferred |
| 74 | 2020 | ぶた　の　にんしん　きかん　は　やく　365にち　です。Masa kehamilan babi sekitar 365 hari |  | NEED-CONFIRM | inferred |
| 75 | 2020 | たねぶた　は　はんしょく　に　つかう　ぶた　です。Babi benih digunakan untuk berkembang biak |  | NEED-CONFIRM | inferred |
| 76 | 2020 | おす　の　こぶた　は　きょせい　を　します。Anak babi jantan dikebiri |  | NEED-CONFIRM | inferred |
| 77 | 2020 | はんしょくとん　は　いつも　しりょう　が　たべられる　ように　して　おきます。Babi kembang biak dibuat agar bisa makan di segala waktu |  | NEED-CONFIRM | inferred |
| 78 | 2020 | しょうどくえき　は　じかん　が　たつと　こうか　が　あがります。Cairan disinfektan semakin bekerja seiring berjalannya waktu |  | NEED-CONFIRM | inferred |
| 79 | 2020 | トンコレラ　は　かんせん　します。Kolera babi menular |  | NEED-CONFIRM | inferred |
| 80 | 2020 | びょうき　を　ふせぐ　ために　ワクチン　を　つかいます。Menggunakan vaksin untuk mencegah penyakit |  | NEED-CONFIRM | inferred |
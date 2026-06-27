# Neon Pong AI: Hand-Tracking Web Game

**Neon Pong AI**, Google's Mediapipe el takibi teknolojisini kullanan, fütüristik neon tasarıma sahip modern bir web tabanlı Pong oyunudur. Oyunu klavye veya fare ile değil, doğrudan **el hareketlerinizle** web kamerası üzerinden oynarsınız!

![Oyun İçi Görüntü](game.png)

## Özellikler

- **Yapay Zeka Destekli El Takibi:** Google Mediapipe sayesinde avuç içiniz anlık olarak tespit edilir ve raketiniz elinizle senkronize hareket eder.
- **Takım Seçimi & Akıllı Yönlendirme:** Başlangıçta oynamak istediğiniz takımı (Sol/Sağ) seçebilirsiniz. Seçiminize göre kamera ayna (mirror) etkisini hesaba katarak doğru elinizi algılar. AI (Yapay Zeka) rakip ise otomatik olarak karşı tarafa geçer.
- **Neon / Cyberpunk Tasarım:** Tamamen Vanilla CSS ile tasarlanmış cam (glassmorphism) efektli, karanlık temalı ve yüksek kaliteli parlamalara sahip interaktif oyun menüsü.
- **Akıllı Rakip:** Topu takip eden ancak insanımsı bir hata payı (zorluk eğrisi) barındıran bir yapay zeka. Ralliler uzadıkça heyecan artar, top hızlanır!
- **Tam Kontrol:** Oyun başlamadan önce menü üzerinden topun başlangıç hızını ayarlayabilirsiniz.

## Kullanılan Teknolojiler

- **HTML5 & CSS3:** Modern, duyarlı ve şık arayüz tasarımı.
- **Vanilla JavaScript (ES6+):** Oyun döngüsü, çarpışma fizikleri ve uygulama mantığı.
- **HTML5 Canvas:** Kesintisiz oyun çizimi, animasyonlar ve neon parlama efektleri.
- **[Google Mediapipe](https://developers.google.com/mediapipe):** Kamera üzerinden anlık görüntü işleme ve iskelet tabanlı el takibi (Hand Tracking modeli).

## Nasıl Çalıştırılır?

Modern web tarayıcıları, güvenlik politikaları (CORS & Secure Context) gereği web kamerasına erişim için yerel bir sunucu bağlantısı gerektirir. Bu yüzden HTML dosyasına çift tıklamak yerine yerel sunucu kullanmalısınız.

1. Bilgisayarınızda [Node.js](https://nodejs.org/)'in kurulu olduğundan emin olun.
2. Terminal üzerinden projenin bulunduğu klasöre gidin:
   ```bash
   cd /Users/osmanbugrabolat/Desktop/pong-with-mediapipe
   ```
3. Yerel sunucuyu başlatmak için şu komutu çalıştırın:
   ```bash
   npx serve
   ```
4. Terminalde size verilen adresi (genellikle `http://localhost:3000`) tarayıcınızda açın.
5. Tarayıcınızın sağ üst veya sol üst kısmında belirecek olan **Kamera İzni**ni onaylayın.
6. Hızınızı, takımınızı seçin ve **OYUNA BAŞLA**'ya tıklayın!

## Oynanış İpuçları

- Kameranın elinizi (özellikle avuç içinizi) net görebileceği ve ortam ışığının iyi olduğu bir mesafede durun.
- Seçtiğiniz takıma uygun olan elinizi kameraya doğru tutun (Örn: Sol takım için sol eliniz).
- Elinizi yukarı-aşağı hareket ettirerek raketi kontrol edin.

---

**Geliştirici:** [Osman Buğra Bolat](https://osmanbugrabolat.com.tr)

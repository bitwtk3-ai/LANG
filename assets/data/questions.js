export const categories = [
    {
        id: 'lang',
        name_key: 'lang_name',
        icon: 'fa-language',
        color: 'from-blue-500 to-indigo-600',
        questions: [
            { q: "Ability", a: "Yetenek", options: ["Yetenek", "Erişim", "Bina", "Zorluk"] },
            { q: "Access", a: "Erişim", options: ["Erişim", "İnanmak", "Temizlemek", "Gelecek"] },
            { q: "Believe", a: "İnanmak", options: ["İnanmak", "Yetenek", "Bilgi", "Aile"] },
            { q: "Challenge", a: "Zorluk", options: ["Zorluk", "Bina", "Erişim", "Temizlemek"] },
            { q: "Knowledge", a: "Bilgi", options: ["Bilgi", "Eğitim", "Gelecek", "Yaygın"] },
            { q: "Success", a: "Başarı", options: ["Başarı", "Deneyim", "Fırsat", "Sonuç"] },
            { q: "Develop", a: "Geliştirmek", options: ["Geliştirmek", "Uygulamak", "Yönetmek", "Planlamak"] },
            { q: "Improve", a: "İyileştirmek", options: ["İyileştirmek", "Değiştirmek", "Onarmak", "Korumak"] },
            { q: "Understand", a: "Anlamak", options: ["Anlamak", "Anlatmak", "Dinlemek", "Okumak"] },
            { q: "Remember", a: "Hatırlamak", options: ["Hatırlamak", "Unutmak", "Düşünmek", "Bilmek"] },
            { q: "Dangerous", a: "Tehlikeli", options: ["Tehlikeli", "Güvenli", "Hızlı", "Yavaş"] },
            { q: "Beautiful", a: "Güzel", options: ["Güzel", "Çirkin", "Büyük", "Küçük"] },
            { q: "Journey", a: "Yolculuk", options: ["Yolculuk", "Hedef", "Durak", "Bilet"] },
            { q: "Important", a: "Önemli", options: ["Önemli", "Gereksiz", "Sıradan", "Kolay"] }
        ]
    },
    {
        id: 'science',
        name_key: 'science_name',
        icon: 'fa-flask-vial',
        color: 'from-emerald-500 to-teal-600',
        questions: [
            { q: "H2O nedir?", a: "Su", options: ["Su", "Hava", "Ateş", "Toprak"] },
            { q: "En yakın yıldız hangisidir?", a: "Güneş", options: ["Güneş", "Proxima Centauri", "Sirius", "Kutup Yıldızı"] },
            { q: "Suyun donma noktası kaç derecedir?", a: "0", options: ["0", "10", "-10", "100"] },
            { q: "Işık hızı yaklaşık ne kadardır?", a: "300.000 km/s", options: ["300.000 km/s", "150.000 km/s", "1.000.000 km/s", "10.000 km/s"] },
            { q: "Hangisi bir gezegen değildir?", a: "Plüton", options: ["Plüton", "Mars", "Jüpiter", "Venüs"] }
        ]
    },
    {
        id: 'math',
        name_key: 'math_name',
        icon: 'fa-calculator',
        color: 'from-orange-500 to-rose-600',
        questions: [
            { q: "12 x 12 = ?", a: "144", options: ["144", "124", "164", "142"] },
            { q: "√64 = ?", a: "8", options: ["8", "6", "7", "9"] },
            { q: "25 + 75 = ?", a: "100", options: ["100", "90", "110", "120"] },
            { q: "3^3 = ?", a: "27", options: ["27", "9", "81", "18"] },
            { q: "Pi sayısı yaklaşık kaçtır?", a: "3.14", options: ["3.14", "2.14", "4.14", "3.41"] }
        ]
    },
    {
        id: 'culture',
        name_key: 'culture_name',
        icon: 'fa-earth-americas',
        color: 'from-purple-500 to-pink-600',
        questions: [
            { q: "Türkiye'nin başkenti neresidir?", a: "Ankara", options: ["Ankara", "İstanbul", "İzmir", "Bursa"] },
            { q: "Mona Lisa tablosu kime aittir?", a: "Da Vinci", options: ["Da Vinci", "Picasso", "Van Gogh", "Michelangelo"] },
            { q: "En çok dile sahip ülke hangisidir?", a: "Papua Yeni Gine", options: ["Papua Yeni Gine", "Hindistan", "Çin", "Nijerya"] },
            { q: "Eyfel Kulesi hangi şehirdedir?", a: "Paris", options: ["Paris", "Berlin", "Londra", "Roma"] },
            { q: "Olimpiyat halkaları kaç adettir?", a: "5", options: ["5", "4", "6", "7"] },
            { q: "En büyük okyanus hangisidir?", a: "Büyük Okyanus", options: ["Büyük Okyanus", "Atlas Okyanusu", "Hint Okyanusu", "Arktik Okyanusu"] },
            { q: "Kızıl Gezegen olarak bilinen hangisidir?", a: "Mars", options: ["Mars", "Venüs", "Jüpiter", "Satürn"] },
            { q: "Türk Lirası'nın simgesi nedir?", a: "₺", options: ["₺", "$", "€", "£"] },
            { q: "İstiklal Marşı'nın yazarı kimdir?", a: "Mehmet Akif Ersoy", options: ["Mehmet Akif Ersoy", "Ziya Gökalp", "Namık Kemal", "Tevfik Fikret"] }
        ]
    }
];

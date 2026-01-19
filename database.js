/**
 * ====================================================================
 * PROJECT: RAFFA STORE - ENTERPRISE DATABASE
 * FILE: database.js
 * VERSION: 125.1 (ADDED: INFO POPUP CONFIG)
 * AUTHOR: RAFFA DEV TEAM
 * ====================================================================
 */

const DATABASE = {

    // =================================================================
    // 1. KONFIGURASI HARGA DASAR (JOKI CALCULATOR)
    // =================================================================
    pricing: {
        "Grandmaster": 4000,
        "Epic": 5000,
        "Legend": 7000,
        "Mythic": 10000
    },

    // =================================================================
    // 2. KODE VOUCHER DISKON
    // =================================================================
    vouchers: {
        "RAFFA2025": 1000,
        "MEMBERBARU": 500,
        "SULTAN": 5000,
        "GAJIAN": 2000,
        "PROMO50": 500
    },

    // =================================================================
    // 3. KATEGORI MENU (TABS NAVIGASI)
    // =================================================================
    categories: [
        {
            id: "games",
            name: "Top Up Game",
            items: [
                { id: "ml", name: "Mobile Legends", img: "https://upload.wikimedia.org/wikipedia/en/3/36/Mobile_Legends_Bang_Bang_logo.png", status: "⚡ Instan" },
                { id: "ff", name: "Free Fire", img: "https://upload.wikimedia.org/wikipedia/en/a/a3/Free_Fire_Battlegrounds_Logo.png", status: "⚡ Instan" },
                { id: "pubg", name: "PUBG Mobile", img: "https://upload.wikimedia.org/wikipedia/en/0/06/PUBG_Mobile_Logo.png", status: "🟢 Ready" },
                { id: "hok", name: "Honor of Kings", img: "https://seeklogo.com/images/H/honor-of-kings-logo-8A39308103-seeklogo.com.png", status: "🔥 Promo" },
                { id: "genshin", name: "Genshin Impact", img: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/1200px-Genshin_Impact_logo.svg.png", status: "🌙 Slow" },
                { id: "codm", name: "Call of Duty", img: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Call_of_Duty_Mobile_Logo.png/220px-Call_of_Duty_Mobile_Logo.png", status: "🔫 Fast" },
                { id: "higgs", name: "Higgs Domino", img: "https://play-lh.googleusercontent.com/9-33r8XhwT0tJk_ZTkXWzZ_K9k_K9k_K9k_K9k_K9k_K9k_K9k_K9k", status: "💰 Koin" },
                { id: "sausage", name: "Sausage Man", img: "https://play-lh.googleusercontent.com/1-111111", status: "🌭 Unik" },
                { id: "supersus", name: "Super Sus", img: "https://play-lh.googleusercontent.com/2-222222", status: "🚀 Viral" }
            ]
        },
        {
            id: "pc",
            name: "Voucher PC",
            items: [
                { id: "valorant", name: "Valorant", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png", status: "⚡ Instan" },
                { id: "steam", name: "Steam Wallet", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png", status: "💸 IDR" },
                { id: "roblox", name: "Roblox", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Roblox_Logo_2022.svg/1200px-Roblox_Logo_2022.svg.png", status: "🧱 Robux" },
                { id: "minecraft", name: "Minecraft", img: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png", status: "⛏️ Coins" }
            ]
        },
        {
            id: "joki",
            name: "Joki Rank",
            items: [
                { id: "joki_ml", name: "Joki Rank ML", img: "https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Mythic.png", status: "🏆 Calculator" },
                { id: "joki_ff", name: "Joki Rank FF", img: "https://dl.dir.freefiremobile.com/common/web_event/hash/202005/3d3d3d3d3d3d3d3d/img/rank_icon_7.png", status: "🔥 GM" },
                { id: "joki_gendong", name: "Joki Gendong", img: "https://cdn-icons-png.flaticon.com/512/2622/2622056.png", status: "🤝 Mabar" }
            ]
        },
        {
            id: "akun",
            name: "Jual Akun",
            items: [
                { id: "stok_akun", name: "Stok Akun Sultan", img: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png", status: "🔥 Rare" }
            ]
        },
        {
            id: "digital",
            name: "Produk Digital",
            items: [
                { id: "panel_bot", name: "Panel & Bot WA", img: "https://cdn-icons-png.flaticon.com/512/2111/2111728.png", status: "🤖 Canggih" },
                { id: "domain", name: "Domain & Hosting", img: "https://cdn-icons-png.flaticon.com/512/3059/3059531.png", status: "🌐 Web" }
            ]
        },
        {
            id: "pulsa",
            name: "Pulsa & PPOB",
            items: [
                { id: "pulsa_all", name: "Pulsa All Operator", img: "https://cdn-icons-png.flaticon.com/512/3616/3616927.png", status: "📶 24 Jam" },
                { id: "token_pln", name: "Token Listrik", img: "https://cdn-icons-png.flaticon.com/512/2830/2830296.png", status: "⚡ PLN" },
                { id: "kuota", name: "Paket Data", img: "https://cdn-icons-png.flaticon.com/512/6863/6863837.png", status: "🌐 Internet" }
            ]
        },
        {
            id: "sosmed",
            name: "Sosial Media",
            items: [
                { id: "ig", name: "Instagram", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png", status: "📸 Murah" },
                { id: "tiktok", name: "TikTok", img: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/2560px-TikTok_logo.svg.png", status: "🎵 Viral" },
                { id: "youtube", name: "YouTube", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png", status: "▶️ Subs" }
            ]
        },
        {
            id: "murid",
            name: "Join Murid",
            items: [
                { id: "join_murid", name: "Daftar Murid", img: "https://cdn-icons-png.flaticon.com/512/3413/3413535.png", status: "👨‍🏫 Open" }
            ]
        }
    ],

    // =================================================================
    // 4. METODE PEMBAYARAN
    // =================================================================
    paymentMethods: [
        {
            code: "QRIS",
            name: "QRIS (All Payment)",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/QRIS_logo.svg/1200px-QRIS_logo.svg.png",
            type: "qris",
            details: { name: "Raffa Store", number: "N/A", image: "qris.jpg" }
        },
        {
            code: "DANA",
            name: "DANA",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_DANA.png/640px-Logo_DANA.png",
            type: "ewallet",
            details: { name: "Raffa Store Official", number: "0895-6224-94773" }
        },
        {
            code: "GOPAY",
            name: "GoPay",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png",
            type: "ewallet",
            details: { name: "Raffa Store Official", number: "0813-8543-5612" }
        },
        {
            code: "OVO",
            name: "OVO",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png",
            type: "ewallet",
            details: { name: "Raffa Store Official", number: "0813-8543-5612" }
        },
        {
            code: "SHOPEE",
            name: "ShopeePay",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png",
            type: "ewallet",
            details: { name: "Raffa Store Official", number: "0813-8543-5612" }
        },
        
        // --- BANK TRANSFER ---
        {
            code: "BCA",
            name: "Bank BCA",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png",
            type: "bank",
            details: {
                name: "PT Raffa Store Indonesia",
                number: "70001081385435612" // Update sesuai request
            }
        },
        {
            code: "BRI",
            name: "Bank BRI",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png",
            type: "bank",
            details: {
                name: "PT Raffa Store Indonesia",
                number: "30135081385435612" // Update sesuai request
            }
        },
        {
            code: "ALFAMART",
            name: "Alfamart",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Alfamart_logo.svg/2560px-Alfamart_logo.svg.png",
            type: "retail",
            details: { name: "Top Up Gopay Admin", number: "0813-8543-5612" }
        }
    ],

    // =================================================================
    // 5. DATABASE PRODUK (FULL LISTING)
    // =================================================================
    products: {
        
        // --- MOBILE LEGENDS ---
        "ml": [
            { name: "3 Diamond", price: 1500 },
            { name: "5 Diamond", price: 2000 },
            { name: "12 Diamond", price: 4000 },
            { name: "14 Diamond", price: 5000 },
            { name: "28 Diamond", price: 8000 },
            { name: "42 Diamond", price: 12000 },
            { name: "59 Diamond", price: 16000 },
            { name: "74 Diamond", price: 19500 },
            { name: "86 Diamond", price: 20000 },
            { name: "172 Diamond", price: 40000 },
            { name: "257 Diamond", price: 60000 },
            { name: "344 Diamond", price: 80000 },
            { name: "429 Diamond", price: 100000 },
            { name: "514 Diamond", price: 120000 },
            { name: "706 Diamond", price: 165000 },
            { name: "878 Diamond", price: 205000 },
            { name: "Weekly Diamond Pass", price: 27500 },
            { name: "Weekly Pass (x2)", price: 55000 },
            { name: "Weekly Pass (x3)", price: 82500 },
            { name: "Twilight Pass", price: 145000 },
            { name: "Starlight Member", price: 150000 },
            { name: "Starlight Premium", price: 300000 }
        ],

        // --- FREE FIRE ---
        "ff": [
            { name: "5 Diamonds", price: 1000 },
            { name: "12 Diamonds", price: 2000 },
            { name: "50 Diamonds", price: 7000 },
            { name: "70 Diamonds", price: 9200 },
            { name: "100 Diamonds", price: 13500 },
            { name: "140 Diamonds", price: 17500 },
            { name: "210 Diamonds", price: 26500 },
            { name: "355 Diamonds", price: 42500 },
            { name: "500 Diamonds", price: 60000 },
            { name: "720 Diamonds", price: 83000 },
            { name: "1000 Diamonds", price: 118000 },
            { name: "1450 Diamonds", price: 167000 },
            { name: "2180 Diamonds", price: 252000 },
            { name: "3640 Diamonds", price: 420000 },
            { name: "Member Mingguan", price: 27000 },
            { name: "Member Bulanan", price: 79000 },
            { name: "Level Up Pass", price: 15000 },
            { name: "Booyah Pass", price: 41000 }
        ],

        // --- PUBG MOBILE ---
        "pubg": [
            { name: "60 UC", price: 14000 },
            { name: "325 UC", price: 72000 },
            { name: "660 UC", price: 145000 },
            { name: "1800 UC", price: 350000 },
            { name: "3850 UC", price: 700000 },
            { name: "8100 UC", price: 1400000 }
        ],

        // --- HONOR OF KINGS ---
        "hok": [
            { name: "8 Token", price: 2000 },
            { name: "16 Token", price: 3500 },
            { name: "88 Token", price: 13000 },
            { name: "256 Token", price: 45000 },
            { name: "432 Token", price: 75000 },
            { name: "608 Token", price: 100000 }
        ],

        // --- VALORANT ---
        "valorant": [
            { name: "125 Points", price: 15000 },
            { name: "420 Points", price: 50000 },
            { name: "700 Points", price: 80000 },
            { name: "1375 Points", price: 150000 },
            { name: "2400 Points", price: 250000 },
            { name: "4000 Points", price: 400000 }
        ],

        // --- GENSHIN IMPACT ---
        "genshin": [
            { name: "60 Genesis", price: 15000 },
            { name: "300 Genesis", price: 75000 },
            { name: "980 Genesis", price: 230000 },
            { name: "1980 Genesis", price: 450000 },
            { name: "3280 Genesis", price: 750000 },
            { name: "6480 Genesis", price: 1450000 },
            { name: "Welkin Moon", price: 80000 }
        ],

        // --- JOKI & GRADING ---
        "joki_ml": [
            { name: "Joki Grading (10 Win)", price: 90000 },
            { name: "Paket GM ke Epic", price: 125000 },
            { name: "Paket Epic ke Legend", price: 150000 },
            { name: "Paket Legend ke Mythic", price: 200000 }
        ],
        "joki_ff": [
            { name: "Gold - Platinum", price: 15000 },
            { name: "Platinum - Diamond", price: 25000 },
            { name: "Diamond - Master", price: 50000 },
            { name: "Master - GM", price: 100000 }
        ],

        // --- STOK AKUN (SULTAN & RARE) ---
        "stok_akun": [
            { 
                name: "Akun ML Sultan Ex-Glory", 
                price: 500000, 
                img: "https://i.pinimg.com/736x/8a/a8/9a/8aa89a1955c425095037d00f68285526.jpg", 
                status: "🔥 Rare" 
            },
            { 
                name: "Akun FF Old Season 1", 
                price: 350000, 
                img: "https://i.pinimg.com/736x/2c/3c/30/2c3c306563f82e814529329706797505.jpg", 
                status: "🌵 Old" 
            },
            { 
                name: "Akun Genshin Impact AR 58", 
                price: 800000, 
                img: "https://wallpapers.com/images/hd/hu-tao-genshin-impact-portrait-c7x8y5z9w1a2b3c4.jpg", 
                status: "❄️ Mahal" 
            },
            { 
                name: "Akun PUBG Mobile", 
                price: 1200000, 
                img: "https://i.pinimg.com/originals/1a/2b/3c/1a2b3c4d5e6f7g8h9i0j.jpg", 
                status: "🔫 Sultan" 
            }
        ],

        // --- PRODUK DIGITAL ---
        "panel_bot": [
            { name: "Panel Pterodactyl 1GB", price: 5000 },
            { name: "Panel Pterodactyl 2GB", price: 10000 },
            { name: "Panel Pterodactyl 4GB", price: 20000 },
            { name: "Panel Unlimited", price: 50000 },
            { name: "Script Bot WA V5 (No Enc)", price: 50000 },
            { name: "Source Code Web Topup", price: 150000 }
        ],
        "domain": [
            { name: "Domain .COM (1 Tahun)", price: 165000 },
            { name: "Domain .MY.ID (1 Tahun)", price: 15000 },
            { name: "Domain .ID (1 Tahun)", price: 250000 },
            { name: "Domain .XYZ (1 Tahun)", price: 25000 }
        ],

        // --- PULSA & KUOTA ---
        "pulsa_all": [
            { name: "Pulsa 5.000", price: 7000 },
            { name: "Pulsa 10.000", price: 12000 },
            { name: "Pulsa 20.000", price: 22000 },
            { name: "Pulsa 50.000", price: 52000 },
            { name: "Pulsa 100.000", price: 102000 }
        ],
        "token_pln": [
            { name: "Token 20.000", price: 22000 },
            { name: "Token 50.000", price: 52000 },
            { name: "Token 100.000", price: 102000 },
            { name: "Token 200.000", price: 202000 }
        ],
        "kuota": [
            { name: "Telkomsel 3GB", price: 15000 },
            { name: "Telkomsel 10GB", price: 45000 },
            { name: "Indosat 5GB", price: 20000 },
            { name: "XL 10GB", price: 35000 }
        ],

        // --- SOSIAL MEDIA ---
        "ig": [
            { name: "100 Followers", price: 5000 },
            { name: "500 Followers", price: 20000 },
            { name: "1000 Followers", price: 38000 }
        ],
        "tiktok": [
            { name: "1000 Views", price: 1000 },
            { name: "100 Followers", price: 15000 },
            { name: "1000 Followers", price: 120000 }
        ],
        "youtube": [
            { name: "100 Subs", price: 50000 },
            { name: "1000 Subs", price: 450000 },
            { name: "4000 Jam Tayang", price: 800000 }
        ],

        // --- JOIN MURID ---
        "join_murid": [
            { name: "Murid Basic (Tutorial)", price: 50000 },
            { name: "Murid VIP (Full Bimbingan)", price: 150000 },
            { name: "Murid Sultan (Dapet Script)", price: 500000 }
        ],

        // --- VOUCHER PC ---
        "steam": [
            { name: "IDR 12.000", price: 15000 },
            { name: "IDR 45.000", price: 50000 },
            { name: "IDR 90.000", price: 98000 }
        ],
        "roblox": [
            { name: "80 Robux", price: 15000 },
            { name: "400 Robux", price: 75000 },
            { name: "800 Robux", price: 145000 }
        ],
        "higgs": [
            { name: "30M Koin", price: 5000 },
            { name: "60M Koin", price: 10000 },
            { name: "200M Koin", price: 25000 },
            { name: "1B Koin", price: 65000 }
        ]
    },

    // =================================================================
    // 6. GALERI TESTIMONI PELANGGAN
    // =================================================================
    proofs: [
        { img: "https://i.pinimg.com/736x/28/23/d5/2823d517852a36214213d297924e5436.jpg", caption: "Done 86 Diamond ⚡" },
        { img: "https://i.pinimg.com/736x/8a/53/7c/8a537c0411a76203a298539074092497.jpg", caption: "Amanah 100% 🔥" },
        { img: "https://i.pinimg.com/736x/d6/3c/65/d63c650170a41d068407425178972175.jpg", caption: "Joki Mythic Win" },
        { img: "https://i.pinimg.com/736x/44/2c/80/442c8038753235339396791783307267.jpg", caption: "Respon Admin Cepat" },
        { img: "https://i.pinimg.com/736x/21/5d/0f/215d0f19904944917534438317d74026.jpg", caption: "Proses 1 Detik" }
    ],

    // =================================================================
    // 7. POPUP INFO / PENGUMUMAN ADMIN
    // =================================================================
    infoPopup: {
        active: true, // Ubah ke 'false' jika ingin mematikan popup
        img: "https://img.freepik.com/free-vector/gradient-breaking-news-background_23-2151122765.jpg", // Gambar Header
        title: "📢 INFO PENTING!",
        message: "Selamat datang di Raffa Store. <br> Server Mobile Legends sedang <b>padat/delay</b>. Mohon bersabar ya!",
        btnText: "SIAP, PAHAM"
    }

};
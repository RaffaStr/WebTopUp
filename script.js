/**
 * ====================================================================================================
 * * ██████╗  █████╗ ███████╗███████╗███████╗ █████╗     ███████╗████████╗ ██████╗ ██████╗ ███████╗
 * ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗    ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
 * ██████╔╝███████║█████╗  █████╗  ███████╗███████║    ███████╗   ██║   ██║   ██║██████╔╝█████╗  
 * ██╔══██╗██╔══██║██╔══╝  ██╔══╝  ██╔═══██╗██╔══██║    ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  
 * ██║  ██║██║  ██║██║     ██║     ██║   ██║██║  ██║    ███████║   ██║   ╚██████╔╝██║  ██║███████╗
 * ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝   ╚═╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
 * * * PROJECT NAME        : RAFFA STORE - CORE ENGINE
 * * ARCHITECTURE        : MONOLITHIC CLIENT-SIDE CONTROLLER
 * * VERSION             : 500.0.0 (TITAN EDITION)
 * * AUTHOR              : RAFFA DEVELOPMENT TEAM
 * * ENVIRONMENT         : PRODUCTION
 * * COPYRIGHT           : © 2025 RAFFA STORE INDONESIA. ALL RIGHTS RESERVED.
 * ====================================================================================================
 */

'use strict';

/* ==================================================================================================
   MODULE 1: SYSTEM CONFIGURATION & ENUMS
   Konfigurasi terpusat untuk mengelola variabel global dan pengaturan aplikasi.
   ================================================================================================== */

const AppConfig = {
    meta: {
        appName: "Raffa Store",
        version: "500.0.0",
        buildDate: "2025-01-01",
        debugMode: true // Set false untuk production
    },

    localization: {
        locale: "id-ID",
        currency: "IDR",
        timezone: "Asia/Jakarta"
    },

    api: {
        telegram: {
            botToken: "8503557283:AAFYVigvAZ5Y9fKQoSjsLUm5K5AtBYDp6wQ", 
            chatId: "6358759122", 
            timeout: 15000,
            retryLimit: 3
        }
    },

    storage: {
        prefix: "raffa_store_v500_",
        driver: window.localStorage,
        keys: {
            THEME: "theme_preference",
            SESSION: "user_session_token",
            USERS: "user_database_local",
            ORDERS: "order_transaction_history",
            NEWS: "system_announcements",
            REVIEWS: "customer_feedback_data",
            CUSTOM_PRODUCTS: "admin_dynamic_products",
            PROMO_SEEN: "promo_popup_status"
        }
    },

    ui: {
        animationSpeed: 300,
        toastDuration: 4000,
        loaderMinTime: 1500,
        scrollOffset: 80,
        maxToastCount: 3
    }
};

/* ==================================================================================================
   MODULE 2: ADVANCED LOGGING & DIAGNOSTICS
   Sistem pencatatan log untuk keperluan debugging dan monitoring performa.
   ================================================================================================== */

class Logger {
    /**
     * Mengambil timestamp saat ini dalam format presisi tinggi.
     * @returns {string} Timestamp string
     */
    static get timestamp() {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    }

    /**
     * Mencatat informasi umum sistem.
     * @param {string} context - Nama modul/fungsi
     * @param {string} message - Pesan log
     * @param {any} [data] - Data tambahan (opsional)
     */
    static info(context, message, data = null) {
        if (!AppConfig.meta.debugMode) return;
        const style = 'color: #3b82f6; font-weight: bold; background: rgba(59, 130, 246, 0.1); padding: 2px 5px; border-radius: 3px;';
        console.log(`%c[INFO] [${this.timestamp}] [${context}]`, style, message, data || '');
    }

    /**
     * Mencatat keberhasilan operasi.
     * @param {string} context - Nama modul/fungsi
     * @param {string} message - Pesan sukses
     */
    static success(context, message) {
        const style = 'color: #10b981; font-weight: bold; background: rgba(16, 185, 129, 0.1); padding: 2px 5px; border-radius: 3px;';
        console.log(`%c[SUCCESS] [${this.timestamp}] [${context}]`, style, message);
    }

    /**
     * Mencatat peringatan (non-fatal error).
     * @param {string} context - Nama modul/fungsi
     * @param {string} message - Pesan peringatan
     */
    static warn(context, message) {
        const style = 'color: #f59e0b; font-weight: bold; background: rgba(245, 158, 11, 0.1); padding: 2px 5px; border-radius: 3px;';
        console.warn(`%c[WARN] [${this.timestamp}] [${context}]`, style, message);
    }

    /**
     * Mencatat error kritis.
     * @param {string} context - Nama modul/fungsi
     * @param {string} message - Pesan error
     * @param {Error|any} [error] - Objek error
     */
    static error(context, message, error = null) {
        const style = 'color: #ef4444; font-weight: bold; background: rgba(239, 68, 68, 0.1); padding: 2px 5px; border-radius: 3px;';
        console.error(`%c[ERROR] [${this.timestamp}] [${context}]`, style, message, error || '');
    }
}

/* ==================================================================================================
   MODULE 3: UTILITY HELPER SERVICE
   Kumpulan fungsi bantuan statis untuk manipulasi data string, number, dan date.
   ================================================================================================== */

class Utils {
    /**
     * Memformat angka menjadi format mata uang Rupiah (IDR).
     * Contoh: 10000 -> "Rp 10.000"
     * @param {number} amount - Nominal angka
     * @returns {string} String terformat
     */
    static formatCurrency(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            Logger.warn('Utils', 'Invalid currency amount', amount);
            return "Rp 0";
        }
        return new Intl.NumberFormat(AppConfig.localization.locale, {
            style: 'currency',
            currency: AppConfig.localization.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Membuat ID Invoice unik yang aman dari duplikasi sederhana.
     * Format: INV-DDMM-RANDOM
     * @returns {string} Invoice ID
     */
    static generateInvoiceId() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(100000 + Math.random() * 900000); // 6 Digit Random
        return `INV-${day}${month}-${random}`;
    }

    /**
     * Mendapatkan waktu saat ini dalam format yang mudah dibaca manusia.
     * @returns {string} Formatted Date String
     */
    static getCurrentDateTime() {
        return new Date().toLocaleString(AppConfig.localization.locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Menunda eksekusi (Async Sleep) untuk keperluan animasi atau loading palsu.
     * @param {number} ms - Milidetik
     * @returns {Promise}
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Menyalin teks ke clipboard pengguna dengan fallback compatibility.
     * @param {string} text - Teks yang akan disalin
     */
    static async copyToClipboard(text) {
        if (!navigator.clipboard) {
            UIManager.toast.error("Browser tidak mendukung fitur copy!");
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            UIManager.toast.success('Berhasil disalin ke clipboard!');
        } catch (err) {
            UIManager.toast.error('Gagal menyalin teks.');
            Logger.error('Utils', 'Clipboard failed', err);
        }
    }

    /**
     * Membersihkan string input dari karakter berbahaya (XSS Protection).
     * @param {string} str - Input string
     * @returns {string} Sanitized string
     */
    static sanitize(str) {
        if (!str) return "";
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, (m) => map[m]);
    }
}

/* ==================================================================================================
   MODULE 4: STORAGE SERVICE (DATA PERSISTENCE)
   Wrapper untuk LocalStorage dengan Error Handling dan Namespacing.
   ================================================================================================== */

class StorageService {
    /**
     * Mengambil kunci lengkap dengan prefix aplikasi.
     * @param {string} key - Kunci pendek
     * @returns {string} Kunci lengkap
     */
    static _getKey(key) {
        // Compatibility mapping untuk versi lama (Admin Panel V200)
        const compatibilityMap = {
            [AppConfig.storage.keys.SESSION]: "raffa_session_v200",
            [AppConfig.storage.keys.USERS]: "raffa_users_v200",
            [AppConfig.storage.keys.ORDERS]: "raffa_orders_v200",
            [AppConfig.storage.keys.NEWS]: "raffa_news_v200",
            [AppConfig.storage.keys.REVIEWS]: "raffa_reviews_v200",
            [AppConfig.storage.keys.CUSTOM_PRODUCTS]: "raffa_custom_products_v200"
        };

        if (compatibilityMap[key]) {
            return compatibilityMap[key];
        }
        return AppConfig.storage.prefix + key;
    }

    /**
     * Menyimpan data ke local storage.
     * @param {string} key - Kunci data
     * @param {any} value - Nilai data (akan di-stringify)
     * @returns {boolean} Status keberhasilan
     */
    static set(key, value) {
        try {
            const fullKey = this._getKey(key);
            const serialized = JSON.stringify(value);
            AppConfig.storage.driver.setItem(fullKey, serialized);
            return true;
        } catch (error) {
            Logger.error('Storage', `Write failed for key: ${key}`, error);
            if (error.name === 'QuotaExceededError') {
                alert("Penyimpanan Browser Penuh! Mohon hapus cache.");
            }
            return false;
        }
    }

    /**
     * Mengambil data dari local storage.
     * @param {string} key - Kunci data
     * @param {any} defaultValue - Nilai default jika data tidak ditemukan
     * @returns {any} Data yang diparsing
     */
    static get(key, defaultValue = null) {
        try {
            const fullKey = this._getKey(key);
            const item = AppConfig.storage.driver.getItem(fullKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            Logger.error('Storage', `Read failed for key: ${key}`, error);
            return defaultValue;
        }
    }

    /**
     * Menghapus data dari local storage.
     * @param {string} key - Kunci data
     */
    static remove(key) {
        try {
            const fullKey = this._getKey(key);
            AppConfig.storage.driver.removeItem(fullKey);
        } catch (error) {
            Logger.error('Storage', `Remove failed for key: ${key}`, error);
        }
    }

    /**
     * Membersihkan semua data aplikasi (Hati-hati).
     */
    static clearAll() {
        try {
            AppConfig.storage.driver.clear();
            Logger.warn('Storage', 'All local data cleared');
        } catch (error) {
            Logger.error('Storage', 'Clear all failed', error);
        }
    }
}

/* ==================================================================================================
   MODULE 5: USER INTERFACE (UI) MANAGER
   Mengelola komponen visual: Toast, Loader, Modal, dan Tema.
   ================================================================================================== */

class UIManager {
    static init() {
        this.initTheme();
        this.createToastContainer();
    }

    static createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    }

    static get toast() {
        return {
            success: (msg) => this.showToast(msg, 'success'),
            error: (msg) => this.showToast(msg, 'error'),
            info: (msg) => this.showToast(msg, 'info'),
            warning: (msg) => this.showToast(msg, 'warning')
        };
    }

    static showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Limit toast count
        if (container.childElementCount >= AppConfig.ui.maxToastCount) {
            container.removeChild(container.firstChild);
        }

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        let bgColor = '#3b82f6'; // Info Blue

        switch (type) {
            case 'success':
                iconHtml = '<i class="fa-solid fa-circle-check"></i>';
                bgColor = '#10b981'; // Success Green
                break;
            case 'error':
                iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
                bgColor = '#ef4444'; // Error Red
                break;
            case 'warning':
                iconHtml = '<i class="fa-solid fa-bell"></i>';
                bgColor = '#f59e0b'; // Warning Orange
                break;
        }

        // Inline Styles for robustness
        toast.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: sans-serif;
            font-size: 0.9rem;
            min-width: 300px;
            max-width: 400px;
            animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            border: 1px solid rgba(255,255,255,0.1);
            cursor: pointer;
            z-index: 100000;
        `;

        toast.innerHTML = `<span style="font-size:1.2rem;">${iconHtml}</span> <span>${message}</span>`;
        
        // Click to dismiss
        toast.onclick = () => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        };

        container.appendChild(toast);

        // Auto dismiss
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'fadeOut 0.4s forwards';
                setTimeout(() => {
                    if (toast.parentElement) toast.remove();
                }, 400);
            }
        }, AppConfig.ui.toastDuration);
    }

    static initTheme() {
        const savedTheme = StorageService.get(AppConfig.storage.keys.THEME) || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        StorageService.set(AppConfig.storage.keys.THEME, newTheme);
        this.updateThemeIcon(newTheme);
        
        Logger.info('UI', `Theme switched to ${newTheme}`);
    }

    static updateThemeIcon(theme) {
        const btn = document.getElementById('theme-icon');
        if (btn) {
            btn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
            // Simple rotation animation
            btn.style.transition = 'transform 0.5s';
            btn.style.transform = 'rotate(360deg)';
            setTimeout(() => btn.style.transform = 'rotate(0deg)', 500);
        }
    }

    static hideLoader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.6s ease, visibility 0.6s';
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
                Logger.info('UI', 'Loader hidden');
            }, 600);
        }
    }
}

/* ==================================================================================================
   MODULE 6: AUTHENTICATION & SECURITY SYSTEM
   Menangani Sesi, Login, Register, dan Magic Access.
   ================================================================================================== */

class AuthSystem {
    
    /**
     * Memproses login pengguna dari form HTML.
     */
    static async login() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!usernameInput || !passwordInput) return; // Prevent error if not on login page

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            return UIManager.toast.error("Username & Password wajib diisi!");
        }

        UIManager.toast.info("Memverifikasi kredensial...");
        await Utils.sleep(800); // Simulasi network delay

        // 1. Check Hardcoded Super Admin
        if (username === "admin" && password === "123") {
            this._createSession({ 
                id: "ADM-001", 
                name: "Super Administrator", 
                username: "admin", 
                role: "admin",
                token: "SECURE-ROOT-ACCESS"
            });
            return;
        }

        // 2. Check Local Database
        const users = StorageService.get(AppConfig.storage.keys.USERS) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this._createSession(user);
        } else {
            UIManager.toast.error("Username atau Password salah!");
            Logger.warn('Auth', `Failed login attempt for user: ${username}`);
        }
    }

    /**
     * Memproses registrasi pengguna baru.
     */
    static async register() {
        const nameInput = document.getElementById('reg-name');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!nameInput || !usernameInput || !passwordInput) return;

        const name = nameInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!name || !username || !password) {
            return UIManager.toast.error("Semua kolom wajib diisi!");
        }

        const users = StorageService.get(AppConfig.storage.keys.USERS) || [];
        
        // Check duplicate
        if (users.find(u => u.username === username)) {
            return UIManager.toast.error("Username sudah terdaftar! Gunakan yang lain.");
        }

        UIManager.toast.info("Mendaftarkan akun baru...");
        await Utils.sleep(1000);

        const newUser = {
            id: `USR-${Date.now()}`,
            name: Utils.sanitize(name),
            username: Utils.sanitize(username),
            password: password, // Note: Should be hashed in real backend
            role: "member",
            joinedAt: Utils.getCurrentDateTime()
        };

        users.push(newUser);
        StorageService.set(AppConfig.storage.keys.USERS, users);

        UIManager.toast.success("Registrasi Berhasil! Silakan Login.");
        setTimeout(() => window.location.href = "login.html", 1500);
    }

    /**
     * Internal method untuk membuat sesi login.
     */
    static _createSession(user) {
        StorageService.set(AppConfig.storage.keys.SESSION, user);
        UIManager.toast.success(`Login Berhasil! Halo, ${user.name}`);
        setTimeout(() => window.location.href = "index.html", 1000);
    }

    /**
     * Memeriksa status login saat halaman dimuat.
     */
    static checkSession() {
        const session = StorageService.get(AppConfig.storage.keys.SESSION);
        const navContainer = document.querySelector('.nav-links');
        const adminTools = document.getElementById('admin-tools');

        if (session && navContainer) {
            let adminButton = '';
            if (session.role === 'admin') {
                adminButton = `
                    <a href="admin.html" class="nav-icon-link" title="Panel Admin" style="background: #ef4444; color: white; border: 1px solid #dc2626;">
                        <i class="fa-solid fa-user-shield"></i>
                    </a>
                `;
                
                // Show Admin Widget if element exists
                if (adminTools) {
                    AdminWidget.render(adminTools);
                }
            }

            // Update Navigation Bar
            navContainer.innerHTML = `
                ${adminButton}
                <a href="riwayat.html" class="nav-icon-link" title="Riwayat Transaksi">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                </a>
                <div class="user-pill" style="display: inline-flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.1); padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; border: 1px solid var(--border); transition: all 0.3s;">
                    <i class="fa-solid fa-circle-user" style="color: var(--primary);"></i>
                    <span style="font-weight: 600;">${session.name}</span>
                    <a href="#" onclick="AuthSystem.logout()" style="color: #ef4444; margin-left: 8px; font-size: 1rem;" title="Logout">
                        <i class="fa-solid fa-power-off"></i>
                    </a>
                </div>
            `;
        }
    }

    static logout() {
        if (confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
            StorageService.remove(AppConfig.storage.keys.SESSION);
            window.location.href = "index.html";
        }
    }

    // --- MAGIC KEYBOARD FEATURE (ADMIN BACKDOOR) ---
    static initMagicKey() {
        let buffer = "";
        const secretCode = "raffa88";
        
        document.addEventListener('keydown', (e) => {
            buffer += e.key;
            if (buffer.length > 20) buffer = buffer.slice(-20);
            
            if (buffer.endsWith(secretCode)) {
                this._createSession({ 
                    id: "ADM-MAGIC", 
                    name: "Magic Admin", 
                    username: "admin", 
                    role: "admin", 
                    token: "GOD-MODE" 
                });
                UIManager.toast.success("🔓 GOD MODE: ADMIN ACCESS GRANTED");
            }
        });
    }
}

/* ==================================================================================================
   MODULE 7: COMMERCE STATE MANAGEMENT
   Mengelola data keranjang belanja dan status transaksi sementara.
   ================================================================================================== */

const CartState = {
    // Initial State
    data: {
        gameId: null,
        gameName: null,
        itemName: null,
        itemPrice: 0,
        paymentMethod: null,
        userData: null,
        invoiceId: null,
        discount: 0,
        timestamp: null,
        status: null
    },

    /**
     * Mereset state cart ke awal.
     */
    reset() {
        this.data = {
            gameId: null, gameName: null, itemName: null,
            itemPrice: 0, paymentMethod: null, userData: null,
            invoiceId: null, discount: 0, status: null
        };
        Logger.info('Cart', 'State Reset');
    },

    /**
     * Mengatur produk yang dipilih.
     */
    setProduct(name, price) {
        this.data.itemName = name;
        this.data.itemPrice = price;
        
        // Visual Feedback (Reset Border)
        document.querySelectorAll('.selection-card').forEach(el => {
            if(el.id.startsWith('prod')) el.style.borderColor = 'var(--border)';
        });
    },

    /**
     * Mengatur metode pembayaran yang dipilih.
     */
    setPayment(code) {
        this.data.paymentMethod = code;
        
        // Visual Feedback
        document.querySelectorAll('.selection-card').forEach(el => {
            if(el.id.startsWith('pay')) el.style.borderColor = 'var(--border)';
        });
    }
};

/* ==================================================================================================
   MODULE 8: COMMERCE ENGINE (CORE LOGIC)
   Logika bisnis utama: Render Produk, Kalkulator Joki, dan Proses Checkout.
   ================================================================================================== */

class Commerce {
    /**
     * Inisialisasi Commerce Engine.
     */
    static async init() {
        if (typeof DATABASE === 'undefined') {
            Logger.error('Commerce', 'CRITICAL: DATABASE.JS NOT LOADED');
            UIManager.toast.error("Database Error! Silakan refresh halaman.");
            return;
        }

        // 1. Merge Custom Products from Admin (LocalStorage) -> DATABASE
        const customProds = StorageService.get(AppConfig.storage.keys.CUSTOM_PRODUCTS) || {};
        for (const [key, items] of Object.entries(customProds)) {
            if (DATABASE.products[key]) {
                DATABASE.products[key] = [...DATABASE.products[key], ...items];
            } else {
                DATABASE.products[key] = items;
            }
        }

        // 2. Render Initial UI Elements
        if (document.getElementById('home-grid')) {
            this.renderCategory('games'); // Default category
            NewsSystem.render();
            ReviewSystem.render();
            
            if (typeof this.renderProofs === 'function') {
                this.renderProofs();
            }
        }

        // 3. Finish Booting
        await Utils.sleep(AppConfig.ui.loaderMinTime);
        UIManager.hideLoader();
    }

    /**
     * Menampilkan daftar produk berdasarkan kategori.
     * @param {string} categoryId 
     */
    static renderCategory(categoryId) {
        const grid = document.getElementById('home-grid');
        const invoiceArea = document.getElementById('invoice-area');
        
        if (!grid) return;

        // Reset View
        grid.style.display = 'grid';
        if (invoiceArea) invoiceArea.style.display = 'none';
        grid.innerHTML = '';

        // Update Active Tab UI
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            // Cek apakah tombol ini yang diklik (berdasarkan onclick attr)
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(categoryId)) {
                btn.classList.add('active');
            }
        });

        // Get Data
        const category = DATABASE.categories.find(c => c.id === categoryId);
        
        if (category && category.items) {
            category.items.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'card animate-enter';
                card.style.animationDelay = `${index * 0.05}s`;
                card.onclick = () => this.openForm(item.id, item.name);
                
                // Badge Logic
                let badgeClass = 'badge-info';
                if(item.status.includes('Promo')) badgeClass = 'badge-warning';
                if(item.status.includes('Instan')) badgeClass = 'badge-success';
                if(item.status.includes('Rare')) badgeClass = 'badge-danger';

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${item.img}" alt="${item.name}" loading="lazy">
                    </div>
                    <h4>${item.name}</h4>
                    <span class="card-status ${badgeClass}">${item.status}</span>
                `;
                grid.appendChild(card);
            });
        }
    }

    /**
     * Membuka form pemesanan produk.
     * @param {string} id - ID Game/Produk
     * @param {string} name - Nama Game/Produk
     */
    static openForm(id, name) {
        CartState.reset();
        CartState.data.gameId = id;
        CartState.data.gameName = name;

        const grid = document.getElementById('home-grid');
        grid.style.display = 'block'; // Switch grid to block for form view

        // Auto-load last input
        const lastId = localStorage.getItem('last_user_id') || "";
        let formInputHTML = "";
        let productSectionHTML = "";

        const productList = DATABASE.products[id];
        
        // --- 1. HANDLING STOK KOSONG ---
        if (id !== 'joki_ml' && (!productList || productList.length === 0)) {
            grid.innerHTML = `
                <div style="background:var(--bg-surface); padding:40px 20px; border-radius:16px; border:1px solid var(--border); text-align:center; margin-bottom:50px;">
                    <div style="display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:20px;">
                        <button onclick="Commerce.renderCategory('games')" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--text-main);"><i class="fa-solid fa-arrow-left"></i></button>
                        <h3 style="margin:0;">${name}</h3>
                    </div>
                    <i class="fa-solid fa-box-open" style="font-size:4rem;color:var(--text-muted);margin-bottom:15px;opacity:0.5;"></i>
                    <h4 style="color:var(--text-main);">Stok Belum Tersedia</h4>
                    <p style="color:var(--text-muted);font-size:0.9rem;">Produk ini sedang kosong atau belum diupdate admin.<br>Silakan cek kembali nanti.</p>
                    <button onclick="Commerce.renderCategory('games')" class="btn-pay" style="width:auto;padding:10px 25px;margin-top:20px;background:var(--bg-surface-2);border:1px solid var(--border);">Kembali ke Menu</button>
                </div>
            `;
            return;
        }

        // --- 2. LOGIKA FORM KHUSUS (JOKI) ---
        if (id === 'joki_ml') {
            const ranks = ["Grandmaster", "Epic", "Legend", "Mythic"];
            const tiers = ["V", "IV", "III", "II", "I"];
            const rO = ranks.map((x,i)=>`<option value="${i}">${x}</option>`).join('');
            const tO = tiers.map((x,i)=>`<option value="${i}">${x}</option>`).join('');

            formInputHTML = `
                <div style="background:var(--bg-surface-2); padding:15px; border-radius:10px; border:1px solid var(--border); margin-bottom:20px;">
                    <h4 style="color:var(--primary);margin-bottom:10px;"><i class="fa-solid fa-calculator"></i> Kalkulator Joki</h4>
                    <div style="display:flex;gap:5px;margin-bottom:10px;">
                        <select id="joki-rank-start" class="form-input" onchange="calcJoki()">${rO}</select>
                        <select id="joki-tier-start" class="form-input" onchange="calcJoki()">${tO}</select>
                        <input type="number" id="joki-star-start" class="form-input" placeholder="Bintang" onchange="calcJoki()">
                    </div>
                    <div style="display:flex;gap:5px;margin-bottom:15px;">
                        <select id="joki-rank-end" class="form-input" onchange="calcJoki()">${rO}</select>
                        <select id="joki-tier-end" class="form-input" onchange="calcJoki()">${tO}</select>
                        <input type="number" id="joki-star-end" class="form-input" placeholder="Bintang" onchange="calcJoki()">
                    </div>
                    <div style="border-top:1px dashed var(--border); padding-top:10px; display:flex; justify-content:space-between;">
                        <span>Total: <b id="joki-total-stars">0</b> Bintang</span>
                        <b id="joki-total-price" style="color:var(--primary); font-size:1.2rem;">Rp 0</b>
                    </div>
                </div>
                <div class="form-group"><label>Login Via</label><select id="input-login" class="form-input"><option>Moonton</option><option>VK</option><option>TikTok</option></select></div>
                <div class="form-group"><label>Email / No HP</label><input type="text" id="input-email" class="form-input"></div>
                <div class="form-group"><label>Password</label><input type="text" id="input-pass" class="form-input"></div>
            `;
            productSectionHTML = `<div style="text-align:center;padding:15px;color:var(--text-muted);font-style:italic;">Harga dihitung otomatis oleh sistem.</div>`;
        } 
        // --- 3. LOGIKA FORM NORMAL ---
        else {
            if(id.includes('murid')) {
                formInputHTML = `<div class="form-group"><label>Nama Lengkap</label><input id="input-nama" class="form-input" placeholder="Nama Kamu"></div><div class="form-group"><label>Nomor WhatsApp</label><input id="input-wa" class="form-input" placeholder="08xx (Wajib Aktif)"></div>`;
            } else if(id === 'ml') {
                formInputHTML = `<div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;"><div class="form-group"><label>User ID</label><input id="input-id" class="form-input" value="${lastId}" placeholder="123456"></div><div class="form-group"><label>Server</label><input id="input-server" class="form-input" placeholder="1234"></div></div>`;
            } else if(id === 'genshin') {
                formInputHTML = `<div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;"><div class="form-group"><label>UID</label><input id="input-id" class="form-input" value="${lastId}"></div><div class="form-group"><label>Server</label><select id="input-server" class="form-input"><option>Asia</option><option>America</option><option>Europe</option></select></div></div>`;
            } else {
                formInputHTML = `<div class="form-group"><label>Data Target (ID/HP)</label><input id="input-data" class="form-input" value="${lastId}" placeholder="Masukkan ID / No HP"></div>`;
            }

            productSectionHTML = `
                <h4 style="margin:20px 0 10px;">Pilih Nominal</h4>
                <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:10px;">
                    ${productList.map((p, i) => `
                        <div id="prod-${i}" onclick="selProd(${i}, '${p.name}', ${p.price})" class="selection-card" style="padding:15px;border:1px solid var(--border);border-radius:10px;text-align:center;cursor:pointer;background:var(--bg-surface);display:flex;flex-direction:column;align-items:center;gap:5px;transition:0.2s;">
                            ${p.img ? `<img src="${p.img}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:5px;">` : ''}
                            <b style="font-size:0.9rem;">${p.name}</b>
                            <span style="color:var(--primary);font-weight:bold;">${Utils.formatCurrency(p.price)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // --- RENDER FORM LENGKAP ---
        grid.innerHTML = `
            <div style="background:var(--bg-surface);padding:20px;border-radius:16px;border:1px solid var(--border);margin-bottom:100px;animation:slideUp 0.3s;">
                
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;border-bottom:1px dashed var(--border);padding-bottom:10px;">
                    <button onclick="Commerce.renderCategory('games')" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--text-main);"><i class="fa-solid fa-arrow-left"></i></button>
                    <h3 style="margin:0;">Order ${name}</h3>
                </div>
                
                ${formInputHTML}
                
                ${productSectionHTML}

                <div style="margin: 20px 0;">
                    <label style="font-size:0.8rem; font-weight:bold; color:var(--text-muted); margin-bottom:5px; display:block;">Kode Voucher (Opsional)</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="input-voucher" class="form-input" placeholder="MASUKAN KODE" style="text-transform:uppercase; width:100%;">
                        <button onclick="applyVoucher()" class="btn-voucher-check">CEK</button>
                    </div>
                    <small id="voucher-msg" style="display:block;margin-top:5px;font-weight:bold;"></small>
                </div>

                <h4 style="margin:20px 0 10px;">Metode Pembayaran</h4>
                <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;">
                    ${DATABASE.paymentMethods.map((m,i)=>`
                        <div id="pay-${i}" onclick="selPay(${i},'${m.code}')" class="selection-card" style="padding:10px;border:1px solid var(--border);border-radius:10px;text-align:center;cursor:pointer;background:var(--bg-surface);transition:0.2s;">
                            <img src="${m.img}" style="height:25px;object-fit:contain;margin-bottom:5px;">
                            <span style="font-size:0.75rem;display:block;">${m.code}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="position:fixed;bottom:0;left:0;width:100%;padding:15px;background:var(--bg-surface);border-top:1px solid var(--border);z-index:99;display:flex;justify-content:center;box-shadow:0 -5px 20px rgba(0,0,0,0.2);">
                <button onclick="Commerce.processCheckout('${id}')" class="btn-pay" style="width:100%;max-width:600px;padding:15px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;background:var(--primary);color:white;font-size:1rem;">BAYAR SEKARANG</button>
            </div>
        `;
    }

    /**
     * Memproses logika checkout saat tombol bayar ditekan.
     */
    static async processCheckout(id) {
        if (!CartState.data.paymentMethod) return UIManager.toast.error("Pilih Metode Pembayaran dulu!");

        let userData = "";

        // Validasi Form Khusus Joki
        if (id === 'joki_ml') {
            const priceText = document.getElementById('joki-total-price').innerText;
            const price = parseInt(priceText.replace(/\D/g,''));
            
            if (price <= 0) return UIManager.toast.error("Rank Tujuan tidak valid!");
            
            CartState.data.itemPrice = price;
            CartState.data.itemName = `Joki Rank (${document.getElementById('joki-total-stars').innerText} Bintang)`;
            
            const l=document.getElementById('input-login').value;
            const e=document.getElementById('input-email').value;
            const p=document.getElementById('input-pass').value;
            
            if(!e||!p) return UIManager.toast.error("Email & Password Wajib Diisi!");
            userData = `Login: ${l}\nEmail: ${e}\nPass: ${p}`;
        } 
        // Validasi Form Normal
        else {
            if (!CartState.data.itemName) return UIManager.toast.error("Silakan Pilih Item/Produk!");
            
            if (id.includes('murid')) {
                const n=document.getElementById('input-nama').value;
                const w=document.getElementById('input-wa').value;
                if(!n||!w) return UIManager.toast.error("Data Diri Belum Lengkap!");
                userData = `Nama: ${n}\nWA: ${w}`;
            } else if (id==='ml') {
                const i=document.getElementById('input-id').value;
                const s=document.getElementById('input-server').value;
                if(!i||!s) return UIManager.toast.error("User ID & Server Wajib Diisi!");
                userData = `ID: ${i} (${s})`;
                localStorage.setItem('last_user_id', i);
            } else {
                const d=document.getElementById('input-data').value;
                if(!d) return UIManager.toast.error("Data Target Wajib Diisi!");
                userData = `Target: ${d}`;
                localStorage.setItem('last_user_id', d);
            }
        }

        // Terapkan Diskon
        if(CartState.data.discount > 0) {
            CartState.data.itemPrice = Math.max(0, CartState.data.itemPrice - CartState.data.discount);
        }

        // Finalisasi Data Order
        CartState.data.userData = userData;
        CartState.data.invoiceId = Utils.generateInvoiceId();
        CartState.data.timestamp = Utils.getCurrentDateTime();
        CartState.data.status = 'Pending';

        // Simpan ke Riwayat Lokal
        let history = StorageService.get(AppConfig.storage.keys.ORDERS) || [];
        history.unshift(CartState.data);
        StorageService.set(AppConfig.storage.keys.ORDERS, history);

        UIManager.toast.info("Membuat Invoice...");
        await Utils.sleep(1000);
        
        // Kirim Notifikasi ke Telegram Admin
        TelegramService.sendOrder(CartState.data);
        
        // Tampilkan Halaman Invoice
        this.renderInvoice();
    }

    /**
     * Menampilkan halaman Invoice (Menunggu Pembayaran).
     */
    static renderInvoice() {
        document.getElementById('home-grid').style.display = 'none';
        const inv = document.getElementById('invoice-area');
        inv.style.display = 'block';

        const method = DATABASE.paymentMethods.find(x => x.code === CartState.data.paymentMethod);
        
        // Render Payment Details (QRIS vs Manual Transfer)
        const pView = method.type === 'qris' 
            ? `<center><img src="${method.details.image}" style="width:200px;border-radius:10px;border:2px dashed var(--primary);padding:10px;margin:15px 0;"></center>`
            : `<div style="background:var(--bg-surface-2);padding:15px;border-radius:10px;border:1px solid var(--border);margin:15px 0;"><h2 style="color:var(--primary);margin:0;">${method.details.number}</h2><p style="margin:5px 0;">A/N ${method.details.name}</p><button onclick="Utils.copyToClipboard('${method.details.number}')" style="padding:5px 15px;border:1px solid var(--border);background:none;color:var(--text-main);border-radius:5px;cursor:pointer;margin-top:5px;"><i class="fa-regular fa-copy"></i> Salin Nomor</button></div>`;

        inv.innerHTML = `
            <div class="card" style="padding:25px;border-top:5px solid var(--primary);animation:fadeIn 0.5s;">
                <center>
                    <h2>Menunggu Pembayaran</h2>
                    <p style="color:var(--text-muted);">Invoice ID: ${CartState.data.invoiceId}</p>
                </center>
                
                <div style="border-bottom:1px dashed var(--border);padding:15px 0;margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span>Item</span>
                        <b>${CartState.data.itemName}</b>
                    </div>
                    <div style="background:var(--bg-surface-2);padding:10px;border-radius:6px;margin-top:5px;font-family:monospace;font-size:0.85rem;color:var(--text-secondary);">
                        ${CartState.data.userData.replace(/\n/g,'<br>')}
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-top:15px;font-size:1.2rem;font-weight:bold;">
                        <span>Total Bayar</span>
                        <span style="color:var(--primary);">${Utils.formatCurrency(CartState.data.itemPrice)}</span>
                    </div>
                </div>
                
                ${pView}
                
                <div style="margin-top:20px;">
                    <h4 style="margin-bottom:10px;">Upload Bukti Transfer</h4>
                    <label class="file-upload-box" style="display:block;border:2px dashed var(--border);padding:20px;text-align:center;border-radius:10px;cursor:pointer;transition:0.3s;">
                        <input type="file" id="proof-file" accept="image/*" style="display:none;" onchange="previewFile()">
                        <div id="upload-label" style="display:flex;flex-direction:column;align-items:center;gap:5px;">
                            <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem;color:var(--primary);"></i>
                            <span>Klik untuk Upload Foto</span>
                        </div>
                    </label>
                    
                    <button onclick="TelegramService.sendProof()" class="btn-pay" style="width:100%;margin-top:15px;background:#0088cc;color:white;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;">
                        <i class="fa-solid fa-paper-plane"></i> KIRIM BUKTI
                    </button>
                </div>
                
                <button onclick="location.reload()" style="width:100%;margin-top:15px;padding:12px;background:transparent;border:1px solid var(--border);border-radius:10px;color:var(--text-muted);cursor:pointer;">
                    Batalkan Pesanan
                </button>
            </div>
        `;
        window.scrollTo(0,0);
    }

    /**
     * Menampilkan galeri bukti transaksi (Screenshot).
     */
    static renderProofs() {
        const container = document.getElementById('proof-list');
        if (!container) return;
        
        const proofs = DATABASE.proofs || [];
        if (proofs.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); width:100%; text-align:center;">Belum ada screenshot terbaru.</p>`;
            return;
        }
        
        container.innerHTML = proofs.map(p => `
            <div class="proof-card" onclick="window.open('${p.img}', '_blank')">
                <img src="${p.img}" class="proof-img" alt="Bukti Testi" loading="lazy">
                <div class="proof-caption">
                    <i class="fa-solid fa-check-circle" style="color:#22c55e;"></i> ${p.caption}
                </div>
            </div>
        `).join('');
    }
}

/* ==================================================================================================
   MODULE 9: EXTERNAL SERVICES (TELEGRAM INTEGRATION)
   Menangani komunikasi API ke Bot Telegram untuk notifikasi real-time.
   ================================================================================================== */

class TelegramService {
    /**
     * Mengirim pesan teks order ke Telegram.
     */
    static async sendOrder(d) {
        const msg = `
🛒 *ORDER MASUK - RAFFA STORE*
========================
🆔 *Invoice:* \`#${d.invoiceId}\`
📅 *Waktu:* ${d.timestamp}

🎮 *Game:* ${d.gameName}
💎 *Item:* ${d.itemName}
💰 *Total:* ${Utils.formatCurrency(d.itemPrice)}
💳 *Metode:* ${d.paymentMethod}

📝 *DATA AKUN:*
\`${d.userData}\`
========================
_Mohon segera diproses admin!_
        `;

        try {
            await fetch(`https://api.telegram.org/bot${AppConfig.api.telegram.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: AppConfig.api.telegram.chatId,
                    text: msg,
                    parse_mode: 'Markdown'
                })
            });
            Logger.success('Telegram', 'Order notification sent');
        } catch (e) {
            Logger.error('Telegram', 'Send Order Failed', e);
        }
    }

    /**
     * Mengirim foto bukti transfer ke Telegram.
     */
    static async sendProof() {
        const f = document.getElementById('proof-file').files[0];
        if(!f) return UIManager.toast.error("Pilih Foto Bukti Dulu!");
        
        const fd = new FormData();
        fd.append("chat_id", AppConfig.api.telegram.chatId);
        fd.append("photo", f);
        fd.append("caption", `🧾 *BUKTI TRANSFER*\n🆔 Invoice: #${CartState.data.invoiceId}\n💰 Total: ${Utils.formatCurrency(CartState.data.itemPrice)}`);
        
        UIManager.toast.info("Mengirim bukti...");
        
        try {
            const r = await fetch(`https://api.telegram.org/bot${AppConfig.api.telegram.botToken}/sendPhoto`, {
                method: 'POST',
                body: fd
            });
            
            if(r.ok) {
                UIManager.toast.success("✅ Bukti Terkirim! Mohon Tunggu Konfirmasi.");
                document.getElementById('upload-label').innerHTML = `<i class="fa-solid fa-check-circle" style="color:#10b981;font-size:2rem;"></i><span style="color:#10b981;font-weight:bold;">Terkirim!</span>`;
            } else {
                throw new Error("API Response not OK");
            }
        } catch (e) {
            Logger.error('Telegram', 'Send Proof Failed', e);
            UIManager.toast.error("Gagal Kirim Bukti. Cek Koneksi!");
        }
    }
}

/* ==================================================================================================
   MODULE 10: EXTENDED FEATURES (WIDGETS & MARKETING)
   Fitur tambahan untuk meningkatkan engagement dan UX.
   ================================================================================================== */

class ReviewSystem {
    static render() {
        const container = document.getElementById('list-ulasan'); 
        if(!container) return;
        
        let reviews = StorageService.get(AppConfig.storage.keys.REVIEWS);
        if(!reviews || reviews.length === 0) {
            // Default Dummy Review
            reviews = [{name:"Admin", text:"Terimakasih sudah mampir!", stars:5, date:"System"}];
            StorageService.set(AppConfig.storage.keys.REVIEWS, reviews);
        }
        
        document.getElementById('total-ulasan').innerText = reviews.length;
        
        container.innerHTML = reviews.slice().reverse().map(x => `
            <div style="min-width:260px;padding:15px;background:var(--bg-surface);border:1px solid var(--border);border-radius:12px;margin-right:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <b>${x.name}</b>
                    <small style="color:#fbbf24">${'⭐'.repeat(x.stars)}</small>
                </div>
                <p style="font-size:0.9rem;margin:8px 0;color:var(--text-secondary);">"${x.text}"</p>
                ${x.reply ? `<div style="background:var(--bg-surface-2);padding:8px;border-radius:6px;font-size:0.8rem;border-left:3px solid var(--primary);margin-top:8px;"><b>Admin:</b> ${x.reply}</div>` : ''}
            </div>
        `).join('');
    }
}

class AdminWidget {
    static render(container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:20px;border-radius:16px;margin-bottom:20px;box-shadow:0 10px 20px rgba(37,99,235,0.2);">
                <div style="display:flex;justify-content:space-between;margin-bottom:15px;align-items:center;">
                    <b><i class="fa-solid fa-shield-cat"></i> Admin Quick Panel</b>
                    <a href="admin.html" style="color:white;background:rgba(255,255,255,0.2);padding:5px 10px;border-radius:6px;font-size:0.8rem;text-decoration:none;">Dashboard Full <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div style="display:flex;gap:10px;">
                    <input id="news-title" placeholder="Judul Info" style="flex:1;padding:10px;border-radius:8px;border:none;background:rgba(255,255,255,0.9);">
                    <input id="news-content-input" placeholder="Isi Pesan" style="flex:2;padding:10px;border-radius:8px;border:none;background:rgba(255,255,255,0.9);">
                    <button onclick="AdminWidget.post()" style="background:white;color:#2563eb;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,0.1);">POST</button>
                </div>
            </div>
        `;
    }
    
    static post() {
        const t = document.getElementById('news-title').value;
        const c = document.getElementById('news-content-input').value;
        if(!t||!c) return UIManager.toast.error("Isi Data!");
        
        const n = StorageService.get(AppConfig.storage.keys.NEWS)||[];
        n.push({title:t, content:c, date:Utils.getCurrentDateTime()});
        StorageService.set(AppConfig.storage.keys.NEWS, n);
        
        UIManager.toast.success("Info Diposting!");
        NewsSystem.render();
        
        // Reset Inputs
        document.getElementById('news-title').value = '';
        document.getElementById('news-content-input').value = '';
    }
}

class NewsSystem {
    static render() {
        const c = document.getElementById('news-content'); if(!c) return;
        const d = StorageService.get(AppConfig.storage.keys.NEWS)||[{title:"Selamat Datang!", content:"Top Up Game 24 Jam Nonstop & Amanah.", date:"System"}];
        c.innerHTML = d.slice().reverse().map(i => `
            <div style="background:var(--bg-surface);padding:15px 20px;border-radius:12px;border-left:4px solid var(--primary);margin-bottom:15px;box-shadow:0 4px 10px rgba(0,0,0,0.03);border:1px solid var(--border);">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <b style="color:var(--text-main);">${i.title}</b>
                    <small style="opacity:0.7">${i.date}</small>
                </div>
                <p style="margin:0;opacity:0.9;line-height:1.5;">${i.content}</p>
            </div>
        `).join('');
    }
}

const FakeNotif = {
    names: ["Budi", "Ahmad", "Rizky", "Putri", "Dewi", "Kevin", "Dika", "Fajar", "Siti", "Aldo"],
    products: [ 
        { name: "86 Diamond ML", icon: "💎" }, 
        { name: "Weekly Diamond Pass", icon: "🎫" }, 
        { name: "140 Diamond FF", icon: "🔥" }, 
        { name: "Starlight Member", icon: "⭐" },
        { name: "60 UC PUBG", icon: "🔫" }
    ],
    
    init() {
        const div = document.createElement('div');
        div.id = 'live-notification';
        div.className = 'live-notif';
        document.body.appendChild(div);
        this.loop();
    },
    
    show() {
        const el = document.getElementById('live-notification');
        const rName = this.names[Math.floor(Math.random() * this.names.length)];
        const rProd = this.products[Math.floor(Math.random() * this.products.length)];
        
        el.innerHTML = `
            <div class="notif-img">${rProd.icon}</div>
            <div class="notif-content">
                <h5>${rName} membeli</h5>
                <p>${rProd.name}</p>
                <span class="notif-time">Baru saja</span>
            </div>
        `;
        
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 4000);
    },
    
    loop() {
        // Random interval between 5 to 15 seconds
        const interval = Math.floor(Math.random() * 10000) + 5000;
        setTimeout(() => { 
            this.show(); 
            this.loop(); 
        }, interval);
    }
};

const PromoSystem = {
    init() {
        const hasSeen = sessionStorage.getItem(AppConfig.storage.keys.PROMO_SEEN);
        if (!hasSeen) {
            setTimeout(() => {
                const popup = document.getElementById('promo-popup');
                if(popup) popup.classList.add('active');
            }, 2500); // Muncul setelah 2.5 detik
        }
    },
    
    close() {
        const popup = document.getElementById('promo-popup');
        if(popup) popup.classList.remove('active');
        sessionStorage.setItem(AppConfig.storage.keys.PROMO_SEEN, 'true');
    },
    
    claim(code) {
        Utils.copyToClipboard(code);
        const inputVoucher = document.getElementById('input-voucher');
        if (inputVoucher) {
            inputVoucher.value = code;
            if(typeof window.applyVoucher === 'function') window.applyVoucher();
        }
        this.close();
    }
};

// --- SISTEM POPUP INFO ADMIN ---
const InfoPopupSystem = {
    init() {
        // Cek database dulu
        if (typeof DATABASE === 'undefined' || !DATABASE.infoPopup || !DATABASE.infoPopup.active) return;

        // Cek apakah user baru saja menutupnya (Session Storage)
        // Kalau mau muncul TERUS setiap refresh, hapus baris 'if' di bawah ini:
        if (sessionStorage.getItem('raffa_info_seen')) return; 

        this.render();
    },

    render() {
        const d = DATABASE.infoPopup;
        
        // Buat elemen HTML langsung lewat JS
        const overlay = document.createElement('div');
        overlay.id = 'info-popup-overlay';
        overlay.className = 'info-overlay';
        
        overlay.innerHTML = `
            <div class="info-box">
                <img src="${d.img}" class="info-header-img" alt="Info">
                <div class="info-body">
                    <h3>${d.title}</h3>
                    <p>${d.message}</p>
                    <button class="btn-close-info" onclick="InfoPopupSystem.close()">${d.btnText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animasi Masuk
        setTimeout(() => { overlay.classList.add('show'); }, 500);
    },

    close() {
        const overlay = document.getElementById('info-popup-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            
            // Simpan tanda kalau user sudah baca (biar gak muncul lagi sampai browser ditutup)
            sessionStorage.setItem('raffa_info_seen', 'true');
        }
    }
};

/* ==================================================================================================
   MODULE 11: GLOBAL EVENT BINDINGS (BRIDGE HTML -> JS)
   Menghubungkan fungsi JS ke elemen HTML onclick.
   ================================================================================================== */

window.selProd = (i, n, p) => { 
    CartState.setProduct(n, p); 
    document.getElementById(`prod-${i}`).style.borderColor = 'var(--primary)'; 
};

window.selPay = (i, c) => { 
    CartState.setPayment(c); 
    document.getElementById(`pay-${i}`).style.borderColor = 'var(--primary)'; 
};

window.previewFile = () => {
    const file = document.getElementById('proof-file').files[0];
    if(file) document.getElementById('upload-label').innerHTML = `<i class="fa-solid fa-file-image"></i> ${file.name}`;
};

window.calcJoki = () => {
    const rS = parseInt(document.getElementById('joki-rank-start').value);
    const sS = parseInt(document.getElementById('joki-star-start').value) || 0;
    const rE = parseInt(document.getElementById('joki-rank-end').value);
    const sE = parseInt(document.getElementById('joki-star-end').value) || 0;
    
    // Formula Bintang
    const score = (r, s) => (r * 25) + s;
    const tot = score(rE, sE) - score(rS, sS);
    
    if (tot <= 0) { 
        document.getElementById('joki-total-stars').innerText = "0"; 
        document.getElementById('joki-total-price').innerText = "Rp 0"; 
    } else { 
        // Logika Harga Dinamis
        const basePrice = 5000; // Harga per bintang
        const price = tot * basePrice;
        
        document.getElementById('joki-total-stars').innerText = tot; 
        document.getElementById('joki-total-price').innerText = Utils.formatCurrency(price); 
    }
};

window.applyVoucher = () => {
    const c = document.getElementById('input-voucher').value.toUpperCase();
    const m = document.getElementById('voucher-msg');
    
    if(DATABASE.vouchers && DATABASE.vouchers[c]) { 
        CartState.data.discount = DATABASE.vouchers[c]; 
        m.style.color = '#10b981'; 
        m.innerHTML = `<i class="fa-solid fa-check"></i> Hemat ${Utils.formatCurrency(CartState.data.discount)}`; 
    } else { 
        CartState.data.discount = 0; 
        m.style.color = '#ef4444'; 
        m.innerText = "❌ Kode Voucher Tidak Valid"; 
    }
};

window.kirimUlasan = () => {
    const n = document.getElementById('ulasan-nama').value;
    const t = document.getElementById('ulasan-teks').value;
    const s = document.getElementById('ulasan-bintang').value;
    
    if(!n || !t) return UIManager.toast.error("Nama dan Ulasan wajib diisi!");
    
    const r = StorageService.get(AppConfig.storage.keys.REVIEWS) || [];
    r.push({
        name: Utils.sanitize(n), 
        text: Utils.sanitize(t), 
        stars: parseInt(s), 
        date: Utils.getCurrentDateTime()
    });
    
    StorageService.set(AppConfig.storage.keys.REVIEWS, r);
    UIManager.toast.success("Ulasan berhasil dikirim!");
    ReviewSystem.render();
    
    // Clear Form
    document.getElementById('ulasan-nama').value = '';
    document.getElementById('ulasan-teks').value = '';
};

window.searchProduct = () => {
    const v = document.getElementById('search-game').value.toLowerCase();
    const g = document.getElementById('home-grid');
    
    if(v.length > 0) { 
        g.style.display = 'grid'; 
        const inv = document.getElementById('invoice-area');
        if(inv) inv.style.display = 'none'; 
    }
    
    const c = g.getElementsByClassName('card');
    for(let i=0; i<c.length; i++) { 
        c[i].style.display = c[i].innerText.toLowerCase().includes(v) ? "" : "none"; 
    }
};

// Expose Core Methods Globally
window.handleLogin = () => AuthSystem.login();
window.handleRegister = () => AuthSystem.register();
window.UIManager = UIManager;
window.filterHome = (id) => Commerce.renderCategory(id);
window.PromoSystem = PromoSystem;

/* ==================================================================================================
   MODULE 12: APPLICATION ENTRY POINT (BOOTSTRAP)
   Mulai menjalankan aplikasi setelah DOM siap.
   ================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    Logger.info('System', 'Booting Raffa Store Engine v500.0...');
    
    try {
        AuthSystem.initMagicKey();
        UIManager.init();
        AuthSystem.checkSession();
        Commerce.init();
        
        // Init Add-ons
        FakeNotif.init();
        PromoSystem.init();
        InfoPopupSystem.init();
        
        Logger.success('System', 'Engine Started Successfully');
    } catch (e) {
        Logger.error('System', 'Fatal Boot Error', e);
        alert("Gagal memuat aplikasi. Mohon refresh halaman.");
    }
});
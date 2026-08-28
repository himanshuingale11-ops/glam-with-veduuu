/* ==========================================================================
   GLAM WITH VEDU - Core JavaScript Application
   ========================================================================== */

// --- Default Data ---
const DEFAULT_PRODUCTS = [
    {
        id: "prod_1",
        title: "Lumina Aura Advanced Serum",
        category: "cosmetics",
        price: 899,
        image: "assets/images/cosmetic_serum.jpg",
        description: "Luxury hydrating regenerating serum with peptide glow complex. Gives instant glass skin shine.",
        tag: "Best Seller",
        custom: false
    },
    {
        id: "prod_2",
        title: "Royal Indian Bridal Mehandi",
        category: "mehandi",
        price: 3500,
        image: "assets/images/mehandi_art.jpg",
        description: "Intricate bridal henna design covering full hands & arms with peacock and mandala motifs. Booking available!",
        tag: "Bridal Special",
        custom: false
    },
    {
        id: "prod_3",
        title: "Enchanted Mini Clay Cottage",
        category: "clay",
        price: 999,
        image: "assets/images/clay_craft.jpg",
        description: "Adorable handmade moulding clay fairy cottage with pastel mushrooms, bunny figurine, and flowers.",
        tag: "Handcrafted",
        custom: false
    },
    {
        id: "prod_4",
        title: "Cyber Velvet Matte Lipstick",
        category: "cosmetics",
        price: 499,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
        description: "Long-lasting non-drying liquid matte lipstick in iconic deep crimson rose shade.",
        tag: "Trending",
        custom: false
    },
    {
        id: "prod_5",
        title: "Arabic Fusion Mehndi Design",
        category: "mehandi",
        price: 1200,
        image: "https://images.unsplash.com/photo-1606103920295-9a091573f160?auto=format&fit=crop&w=600&q=80",
        description: "Elegant modern Arabic henna trail with bold lines, shading, and finger highlights for parties.",
        tag: "Party Special",
        custom: false
    },
    {
        id: "prod_6",
        title: "Custom Clay Chibi Avatar Keychain",
        category: "clay",
        price: 349,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
        description: "Hand-moulded personalized miniature clay figure keychain customized according to your photos!",
        tag: "Custom Gift",
        custom: false
    },
    {
        id: "prod_7",
        title: "Luxury Ferrero Rocher & Rose Bouquet",
        category: "bouquet",
        price: 1499,
        image: "assets/images/chocolate_bouquet.jpg",
        description: "Exquisite handmade chocolate bouquet arrangement with premium Ferrero Rocher chocolates, velvet red roses, and luxury ribbon wrap.",
        tag: "Bestselling Gift",
        custom: false
    }
];

const DEFAULT_REVIEWS = [
    {
        id: "rev_1",
        name: "Priya Sharma",
        category: "Mehandi Bride",
        rating: 5,
        comment: "Vedu did my bridal mehandi and everyone at the wedding couldn't stop admiring the deep color and dark intricate mandala pattern! Highly recommended!",
        date: "2 days ago"
    },
    {
        id: "rev_2",
        name: "Riya Verma",
        category: "Cosmetics Client",
        rating: 5,
        comment: "The Lumina Aura serum is unbelievable! Gave me glowing glass skin within a week. Ordering again via WhatsApp was super fast!",
        date: "5 days ago"
    },
    {
        id: "rev_3",
        name: "Sneha Patel",
        category: "Moulding Clay Buyer",
        rating: 5,
        comment: "Got a customized clay cottage keychain for my bestie's birthday. The detailing Vedu put into the clay art is astounding!",
        date: "1 week ago"
    }
];

// --- State Variables ---
let products = [];
let reviews = [];
let whatsappNumber = "917028021081";
let activeCategory = "all";
let searchQuery = "";
let selectedRating = 5;
let isAdmin = sessionStorage.getItem("glam_vedu_admin") === "true";

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    loadLocalStorageData();
    initFashionShowcase();
    initStarfieldCanvas();
    renderProducts();
    renderReviews();
    setupEventListeners();
    updateCategoryCounts();
    updateAdminUI();
});

// --- LocalStorage Logic ---
function loadLocalStorageData() {
    const storedProds = localStorage.getItem("glam_vedu_products");
    if (storedProds) {
        products = JSON.parse(storedProds);
    } else {
        products = [...DEFAULT_PRODUCTS];
        saveProducts();
    }

    const storedRevs = localStorage.getItem("glam_vedu_reviews");
    if (storedRevs) {
        reviews = JSON.parse(storedRevs);
    } else {
        reviews = [...DEFAULT_REVIEWS];
        saveReviews();
    }

    const navDisplay = document.getElementById("navNumberDisplay");
    if (navDisplay) navDisplay.innerText = "+" + whatsappNumber;
}

function saveProducts() {
    localStorage.setItem("glam_vedu_products", JSON.stringify(products));
    updateCategoryCounts();
}

function saveReviews() {
    localStorage.setItem("glam_vedu_reviews", JSON.stringify(reviews));
}

// --- Render Products ---
function renderProducts() {
    const grid = document.getElementById("productGrid");
    const emptyState = document.getElementById("emptyState");
    grid.innerHTML = "";

    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            (p.tag && p.tag.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    grid.classList.remove("hidden");
    emptyState.classList.add("hidden");

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        let tagClass = "tag-cosmetics";
        let catLabel = "Cosmetics";
        if (p.category === "mehandi") {
            tagClass = "tag-mehandi";
            catLabel = "Mehandi Art";
        } else if (p.category === "clay") {
            tagClass = "tag-clay";
            catLabel = "Moulding Clay";
        } else if (p.category === "bouquet") {
            tagClass = "tag-bouquet";
            catLabel = "Chocolate Bouquet";
        }

        const deleteBtnHtml = p.custom ? `
            <button class="delete-btn" onclick="deleteProduct('${p.id}')" title="Delete Item">
                <i class="fa-solid fa-trash"></i>
            </button>
        ` : '';

        card.innerHTML = `
            <div class="card-img-wrapper" onclick="openLightbox('${p.image}', '${escapeHtml(p.title)}')">
                <span class="category-tag ${tagClass}">${catLabel}</span>
                ${p.tag ? `<span class="badge-tag">${escapeHtml(p.tag)}</span>` : ''}
                <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Glam+With+Vedu'">
                ${deleteBtnHtml}
            </div>
            <div class="card-body">
                <h3 class="card-title">${escapeHtml(p.title)}</h3>
                <p class="card-desc">${escapeHtml(p.description)}</p>
                <div class="card-footer">
                    <span class="card-price">₹${p.price}</span>
                    <button class="btn-whatsapp-order" onclick="sendWhatsAppOrder('${escapeHtml(p.title)}', '${p.category}', ${p.price}, '${escapeHtml(p.description)}')">
                        <i class="fa-brands fa-whatsapp"></i> Buy / Inquire
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateCategoryCounts() {
    document.getElementById("count-all").innerText = products.length;
    document.getElementById("count-cosmetics").innerText = products.filter(p => p.category === "cosmetics").length;
    document.getElementById("count-mehandi").innerText = products.filter(p => p.category === "mehandi").length;
    document.getElementById("count-clay").innerText = products.filter(p => p.category === "clay").length;
    const bouquetCountEl = document.getElementById("count-bouquet");
    if (bouquetCountEl) bouquetCountEl.innerText = products.filter(p => p.category === "bouquet").length;
}

// --- WhatsApp Integration ---
function sendWhatsAppOrder(title, category, price, description) {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const message = `Hello Vedu! 💎 I am interested in ordering/inquiring about *"${title}"* from Glam with Vedu website.%0A%0A📌 *Category:* ${category.toUpperCase()}%0A💰 *Price:* ₹${price}%0A📝 *Details:* ${description}%0A%0APlease let me know availability and how to proceed!`;
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, '_blank');
}

// --- Delete Product ---
function deleteProduct(id) {
    if (confirm("Are you sure you want to remove this item?")) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        showToast("Item deleted successfully!", "info");
    }
}

// --- Render Reviews ---
function renderReviews() {
    const list = document.getElementById("feedbackList");
    list.innerHTML = "";

    reviews.forEach(r => {
        const card = document.createElement("div");
        card.className = "feedback-card";
        const initials = r.name.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= r.rating) {
                starsHtml += `<i class="fa-solid fa-star"></i>`;
            } else {
                starsHtml += `<i class="fa-regular fa-star"></i>`;
            }
        }

        card.innerHTML = `
            <div class="fb-header">
                <div class="fb-user">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-info">
                        <h4>${escapeHtml(r.name)}</h4>
                        <span class="user-tag">${escapeHtml(r.category)}</span>
                    </div>
                </div>
                <div class="fb-stars">${starsHtml}</div>
            </div>
            <p class="fb-comment">"${escapeHtml(r.comment)}"</p>
        `;
        list.appendChild(card);
    });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Search
    document.getElementById("searchInput").addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Category Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.category;
            renderProducts();
        });
    });

    // Modals
    const addModal = document.getElementById("addProductModal");
    const settingsModal = document.getElementById("settingsModal");

    const openAddModal = () => addModal.classList.remove("hidden");
    const closeAddModal = () => addModal.classList.add("hidden");

    document.getElementById("openAddModalBtn").addEventListener("click", openAddModal);
    document.getElementById("heroAddBtn").addEventListener("click", openAddModal);
    document.getElementById("emptyAddBtn").addEventListener("click", openAddModal);
    document.getElementById("footerAddBtn").addEventListener("click", (e) => {
        e.preventDefault();
        openAddModal();
    });
    document.getElementById("closeAddModalBtn").addEventListener("click", closeAddModal);
    document.getElementById("cancelAddBtn").addEventListener("click", closeAddModal);

    // Owner Admin Modal & Login
    const adminModal = document.getElementById("adminModal");
    const openAdminModalBtn = document.getElementById("openAdminModalBtn");
    const closeAdminModalBtn = document.getElementById("closeAdminModalBtn");
    const exitAdminBtn = document.getElementById("exitAdminBtn");

    if (openAdminModalBtn) {
        openAdminModalBtn.addEventListener("click", (e) => {
            e.preventDefault();
            adminModal.classList.remove("hidden");
        });
    }

    if (closeAdminModalBtn) {
        closeAdminModalBtn.addEventListener("click", () => {
            adminModal.classList.add("hidden");
        });
    }

    if (exitAdminBtn) {
        exitAdminBtn.addEventListener("click", () => {
            isAdmin = false;
            sessionStorage.removeItem("glam_vedu_admin");
            updateAdminUI();
            showToast("Exited Owner Mode. You are in Visitor View.", "info");
        });
    }

    document.getElementById("adminForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const pin = document.getElementById("adminPinInput").value.trim();
        // Owner Password: 2404
        if (pin === "2404") {
            isAdmin = true;
            sessionStorage.setItem("glam_vedu_admin", "true");
            updateAdminUI();
            adminModal.classList.add("hidden");
            document.getElementById("adminForm").reset();
            confetti({ particleCount: 60, spread: 50 });
            showToast("Welcome Vedu! Owner Mode unlocked. Add Item button is now active.", "success");
        } else {
            showToast("Incorrect Owner Password!", "error");
        }
    });

    // Image Upload source toggle
    const radioFile = document.querySelector('input[name="imageSource"][value="file"]');
    const radioUrl = document.querySelector('input[name="imageSource"][value="url"]');
    const fileContainer = document.getElementById("fileUploadContainer");
    const urlContainer = document.getElementById("urlInputContainer");

    document.querySelectorAll('input[name="imageSource"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "file") {
                fileContainer.classList.remove("hidden");
                urlContainer.classList.add("hidden");
            } else {
                fileContainer.classList.add("hidden");
                urlContainer.classList.remove("hidden");
            }
        });
    });

    // File Preview
    const fileInput = document.getElementById("prodImageFile");
    const filePreview = document.getElementById("filePreview");
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                filePreview.src = event.target.result;
                filePreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Add Product Form Submit
    document.getElementById("addProductForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("prodTitle").value.trim();
        const category = document.getElementById("prodCategory").value;
        const price = parseFloat(document.getElementById("prodPrice").value);
        const tag = document.getElementById("prodTag").value.trim();
        const description = document.getElementById("prodDesc").value.trim();
        const imgSource = document.querySelector('input[name="imageSource"]:checked').value;

        let imageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80";

        if (imgSource === "file") {
            const file = fileInput.files[0];
            if (file) {
                imageUrl = await readFileAsDataURL(file);
            } else {
                showToast("Please select an image file to upload!", "error");
                return;
            }
        } else {
            const urlVal = document.getElementById("prodImageUrl").value.trim();
            if (urlVal) imageUrl = urlVal;
        }

        const newProduct = {
            id: "prod_" + Date.now(),
            title,
            category,
            price,
            image: imageUrl,
            description,
            tag: tag || null,
            custom: true
        };

        products.unshift(newProduct);
        saveProducts();
        renderProducts();
        closeAddModal();
        document.getElementById("addProductForm").reset();
        filePreview.classList.add("hidden");

        // Trigger celebration confetti
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        showToast("New item added to Glam with Vedu showcase!", "success");
    });

    // Star Rating
    const stars = document.querySelectorAll("#starRating .star");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            const val = parseInt(star.dataset.value);
            selectedRating = val;
            document.getElementById("fbRatingVal").value = val;
            stars.forEach((s, idx) => {
                if (idx < val) s.classList.add("active");
                else s.classList.remove("active");
            });
        });
    });

    // Submit Feedback Form
    document.getElementById("feedbackForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("fbName").value.trim();
        const cat = document.getElementById("fbCategory").value;
        const rating = parseInt(document.getElementById("fbRatingVal").value);
        const comment = document.getElementById("fbComment").value.trim();

        const newReview = {
            id: "rev_" + Date.now(),
            name,
            category: cat,
            rating,
            comment,
            date: "Just now"
        };

        reviews.unshift(newReview);
        saveReviews();
        renderReviews();
        document.getElementById("feedbackForm").reset();

        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        showToast("Thank you for your feedback!", "success");
    });

    // Lightbox Close
    document.getElementById("closeLightboxBtn").addEventListener("click", () => {
        document.getElementById("lightboxModal").classList.add("hidden");
    });

    // Mobile Navigation Toggle
    document.getElementById("mobileMenuBtn").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("active");
    });
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function openLightbox(imgUrl, title) {
    const modal = document.getElementById("lightboxModal");
    document.getElementById("lightboxImg").src = imgUrl;
    document.getElementById("lightboxCaption").innerText = title;
    modal.classList.remove("hidden");
}

function showToast(msg, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    let icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-exclamation";
    if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function updateAdminUI() {
    if (isAdmin) {
        document.body.classList.add("is-admin");
        document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
    } else {
        document.body.classList.remove("is-admin");
        document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// --- Realistic Fashion Woman Hero Showcase ---
function initFashionShowcase() {
    const heroImg = document.getElementById("fashionHeroImg");
    if (!heroImg) return;

    const fashionImages = {
        cosmetics: "assets/images/woman_cosmetics.jpg",
        mehandi: "assets/images/woman_mehandi.jpg",
        clay: "assets/images/woman_clay.jpg",
        bouquet: "assets/images/chocolate_bouquet.jpg"
    };

    document.querySelectorAll(".model-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".model-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const type = btn.dataset.fashion;
            if (fashionImages[type]) {
                heroImg.style.opacity = "0";
                setTimeout(() => {
                    heroImg.src = fashionImages[type];
                    heroImg.style.opacity = "1";
                }, 200);
            }
        });
    });
}

function createParticles() {
    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xff2a8d,
        size: 0.06,
        transparent: true,
        opacity: 0.6
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// --- Background Starfield Canvas ---
function initStarfieldCanvas() {
    const canvas = document.getElementById("bg-stars-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            speed: 0.2 + Math.random() * 0.5
        });
    }

    function renderStars() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.y -= star.speed;
            if (star.y < 0) star.y = height;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(renderStars);
    }
    renderStars();
}

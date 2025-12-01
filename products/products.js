const formP = document.getElementById("product-form");
const listaP = document.getElementById("products-list");
const searchInput = document.getElementById("search-input");
const priceMinInput = document.getElementById("price-min");
const priceMaxInput = document.getElementById("price-max");
const clearFiltersBtn = document.getElementById("clear-filters");

// Modal / add-button elements
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeProductModalBtn = document.getElementById('close-product-modal');

function openProductModal(){
    if (!productModal) return;
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden','false');
    const t = document.getElementById('title'); if (t) t.focus();
}

function closeProductModal(){
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden','true');
}

if (addProductBtn) addProductBtn.addEventListener('click', openProductModal);
if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
if (productModal) productModal.addEventListener('click', (e)=>{ if (e.target === productModal) closeProductModal(); });

let products = [];
let filteredProducts = [];

const STORAGE_KEY_PRODUCTS = 'products';

function saveProducts() {
    try {
        saveToStorage(STORAGE_KEY_PRODUCTS, products);
    } catch (e) {
        console.warn('Não foi possível salvar products no localStorage', e);
    }
}

function loadProductsFromStorage() {
    try {
        return loadFromStorage(STORAGE_KEY_PRODUCTS);
    } catch (e) {
        console.warn('Erro ao ler products do localStorage', e);
    }
    return null;
}

async function initProducts() {
    // 1) Prefer seed file if present (assets/products-seed.json)
    try {
        const seedResp = await fetch('assets/products-seed.json');
        if (seedResp && seedResp.ok) {
            const seed = await seedResp.json();
            if (Array.isArray(seed) && seed.length) {
                // map seed shape to internal shape (thumbnail expected)
                products = seed.map(s => ({
                    title: s.title || s.name || '',
                    description: s.description || '',
                    price: s.price || s.preco || '',
                    brand: s.brand || '',
                    category: s.category || '',
                    thumbnail: s.image || s.thumbnail || ''
                }));
                products = sortPromotionFirst(products);
                saveProducts();
                renderProducts();
                return;
            }
        }
    } catch (e) {
        // seed not found or parse error — continue to next sources
        console.warn('Seed local não encontrada ou inválida:', e);
    }

    // 2) then localStorage
    const stored = loadProductsFromStorage();
    if (stored) {
        products = sortPromotionFirst(stored);
        renderProducts();
        return;
    }

    // 3) Primeiro, tentar importar produtos do site sufgang (hotlink das imagens)
    let imported = [];
    try {
        imported = await fetchSufgangProducts();
    } catch (e) {
        imported = [];
    }

    if (imported && imported.length) {
        products = sortPromotionFirst(imported);
        saveProducts();
        renderProducts();
        return;
    }

    // 4) Fallback para dummyjson
    try {
        const resposta = await fetch("https://dummyjson.com/products");
        const dados = await resposta.json();
        products = dados.products.map(p => ({
            title: p.title,
            description: p.description,
            price: p.price,
            brand: p.brand,
            category: p.category,
            thumbnail: p.thumbnail
        }));
        products = sortPromotionFirst(products);
    } catch (err) {
        alert("Erro ao carregar API, carregando lista vazia...");
        products = [];
    }

    saveProducts();
    renderProducts();
}

initProducts();

// Search and filter event listeners
function applyFilters() {
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const priceMin = Number(priceMinInput?.value) || 0;
    const priceMax = Number(priceMaxInput?.value) || Infinity;

    filteredProducts = products.filter(p => {
        const matchesSearch = !searchTerm || 
            (p.title?.toLowerCase().includes(searchTerm)) ||
            (p.brand?.toLowerCase().includes(searchTerm)) ||
            (p.category?.toLowerCase().includes(searchTerm));
        
        const price = Number(String(p.price || '').replace(',', '.'));
        const matchesPrice = price >= priceMin && price <= priceMax;
        
        return matchesSearch && matchesPrice;
    });

    renderProducts();
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (priceMinInput) priceMinInput.addEventListener('input', applyFilters);
if (priceMaxInput) priceMaxInput.addEventListener('input', applyFilters);

if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        filteredProducts = [...products];
        renderProducts();
    });
}

function renderProducts() {
    listaP.innerHTML = "";

    const toDisplay = filteredProducts.length > 0 ? filteredProducts : products;

    const placeholder = PLACEHOLDER_IMAGE || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='12'>Sem imagem</text></svg>";

    if (toDisplay.length === 0) {
        listaP.innerHTML = '<li style="grid-column:1/-1;text-align:center;color:#999;padding:40px;"><strong>Nenhum produto encontrado.</strong><br>Tente ajustar os filtros.</li>';
        return;
    }

    toDisplay.forEach((p, index) => {
        const thumb = p.thumbnail && p.thumbnail.length > 0 ? p.thumbnail : placeholder;
        // format price (if possible)
        let formattedPrice = formatPrice(p.price);

        // badge: use helper isPromotion
        let badgeHtml = '';
        try {
            if (isPromotion(p.price)) {
                badgeHtml = `<span class="badge">PROMOÇÃO</span>`;
            }
        } catch (e) { badgeHtml = ''; }

        listaP.innerHTML += `
            <li class="card">
                <div class="card-left">
                    <img src="${thumb}" alt="Foto de ${escapeHtml(p.title)}" onerror="this.onerror=null;this.src='${placeholder}'" />
                    <div>
                        <strong>${escapeHtml(p.title)}</nobr></strong><br>
                        ${escapeHtml(p.description)}<br>
                        ${badgeHtml}
                        <div class="product-price">${formattedPrice || formatPrice(p.price)}</div>
                        Marca: ${escapeHtml(p.brand)}<br>
                        Categoria: ${escapeHtml(p.category)}
                    </div>
                </div>
                <button class="remove-btn" aria-label="Remover produto ${escapeHtml(p.title)}" onclick="removerP(${index})">Remover</button>
            </li>
        `;
    });
}

function removerP(i) {
    const produto = products[i];
    const ok = confirm(`Remover o produto "${produto?.title || 'item'}"?`);
    if (!ok) return;
    products.splice(i, 1);
    saveProducts();
    renderProducts();
}

// Validation helpers: show inline messages instead of alerts
function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('input-error');
    const next = input.nextElementSibling;
    if (next && next.classList && next.classList.contains('error-message')) next.remove();
    input.removeAttribute('aria-invalid');
}

function showFieldError(input, msg) {
    if (!input) return;
    clearFieldError(input);
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    const span = document.createElement('div');
    span.className = 'error-message';
    span.textContent = msg;
    input.insertAdjacentElement('afterend', span);
}

function clearAllErrors(form) {
    const els = form.querySelectorAll('.input-error');
    els.forEach(el => clearFieldError(el));
}

if (formP) {
    formP.addEventListener("submit", (e) => {
        e.preventDefault();
        clearAllErrors(formP);

    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const priceEl = document.getElementById("price");
    const brandEl = document.getElementById("brand");
    const categoryEl = document.getElementById("category");
    const thumbnailEl = document.getElementById("thumbnail");

    const title = titleEl.value.trim();
    const description = descriptionEl.value.trim();
    const price = Number(priceEl.value);
    const brand = brandEl.value.trim();
    const category = categoryEl.value.trim();
    const thumbnail = thumbnailEl.value.trim();

    let valid = true;

    if (title.length < 3 || title.length > 50) {
        showFieldError(titleEl, 'Título inválido (3 a 50 caracteres)');
        valid = false;
    }

    if (description.length < 3 || description.length > 50) {
        showFieldError(descriptionEl, 'Descrição inválida (3 a 50 caracteres)');
        valid = false;
    }

    if (Number.isNaN(price) || price <= 0 || price >= 120) {
        showFieldError(priceEl, 'Preço inválido (1 a 119)');
        valid = false;
    }

    if (brand.length < 3 || brand.length > 50) {
        showFieldError(brandEl, 'Marca inválida (3 a 50 caracteres)');
        valid = false;
    }

    if (category.length < 3 || category.length > 50) {
        showFieldError(categoryEl, 'Categoria inválida (3 a 50 caracteres)');
        valid = false;
    }

    if (thumbnail.length > 0) {
        try {
            new URL(thumbnail);
        } catch {
            showFieldError(thumbnailEl, 'URL de imagem inválida');
            valid = false;
        }
    }

        if (!valid) return;

        const novo = { title, description, price, brand, category, thumbnail };
        products.unshift(novo);
        filteredProducts = [...products];
        saveProducts();

        renderProducts();
        formP.reset();
        // close modal if present
        try{ closeProductModal(); }catch(e){}
    });
}


// Tenta buscar a página pública do sufgang e extrair imagens/títulos genéricos.
async function fetchSufgangProducts() {
    const url = 'https://sufgang.com.br/collections/all';
    try {
        const resp = await fetch(url);
        if (!resp.ok) return [];
        const text = await resp.text();

        // Busca imagens e textos alt em tags <img>
        const regex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi;
        const found = new Map();
        let m;
        while ((m = regex.exec(text)) !== null) {
            let src = m[1];
            const alt = m[2] || '';

            // Consertos em src relativo
            if (src.startsWith('//')) src = 'https:' + src;
            if (src.startsWith('/')) src = 'https://sufgang.com.br' + src;

            // filtra imagens de produtos (heurística: contém '/products/' ou '/cdn')
            if (/products|cdn|files/.test(src)) {
                if (!found.has(src)) found.set(src, { title: alt, thumbnail: src });
            }
        }

        const items = Array.from(found.values()).slice(0, 24).map((p, idx) => ({
            title: p.title || `Produto ${idx + 1}`,
            description: '',
            price: '',
            brand: '',
            category: '',
            thumbnail: p.thumbnail
        }));

        return items;
    } catch (e) {
        console.warn('Erro ao buscar sufgang:', e);
        return [];
    }
}

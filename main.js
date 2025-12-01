/* main.js
   Popula a seção de produtos em destaque na página inicial.
   Mostra TODOS os produtos que estão em promoção (price < R$ 200)
*/

const featuredEl = document.getElementById('featured-products');
const STORAGE_KEY_PRODUCTS = 'products';

async function loadFeatured() {
	if (!featuredEl) return;

	let products = null;
	
	// Try seed file first
	try {
		const seedResp = await fetch('assets/products-seed.json');
		if (seedResp && seedResp.ok) {
			const seed = await seedResp.json();
			if (Array.isArray(seed) && seed.length) {
				products = seed;
			}
		}
	} catch (e) {
		console.warn('Seed not found');
	}

	// Then try localStorage
	if (!products) {
		try {
			const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
			if (raw) products = JSON.parse(raw);
		} catch (e) {
			products = null;
		}
	}

	// Fallback to dummyjson
	if (!products) {
		try {
			const res = await fetch('https://dummyjson.com/products');
			const json = await res.json();
			products = json.products || [];
		} catch {
			products = [];
		}
	}

	// Filter only promotional products (price < 200)
	const promotional = products.filter(p => isPromotion(p.price || p.thumbnail?.price));
	
	featuredEl.innerHTML = '';

	const placeholder = PLACEHOLDER_IMAGE || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='180'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='14'>Sem imagem</text></svg>";

	promotional.forEach(p => {
		const thumb = p.thumbnail && p.thumbnail.length > 0 ? p.thumbnail : placeholder;
		const image = p.image || thumb;
		const title = p.title || p.name || '';
		const price = p.price || '';
		
		const card = document.createElement('div');
		card.className = 'featured-card';
		card.innerHTML = `
			<img src="${image}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='${placeholder}'" />
			<div class="featured-info">
				<strong>${escapeHtml(title)}</strong>
				<div class="price">${formatPrice(price)}</div>
				<span class="badge">PROMOÇÃO</span>
			</div>
		`;
		featuredEl.appendChild(card);
	});

	// If no promotional products, show a message
	if (promotional.length === 0) {
		featuredEl.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">Nenhum produto em promoção no momento.</p>';
	}
}

loadFeatured();

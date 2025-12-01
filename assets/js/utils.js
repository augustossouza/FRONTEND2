// Shared helpers for the frontend app
(function(){
    // Placeholder SVG data URI
    window.PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='180'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='14'>Sem imagem</text></svg>";

    window.escapeHtml = function(str){
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    window.formatPrice = function(value){
        try{
            const num = Number(String(value||'').replace(',', '.'));
            if (Number.isNaN(num)) return String(value||'');
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
        }catch(e){
            return String(value||'');
        }
    };

    window.saveToStorage = function(key, data){
        try{
            localStorage.setItem(key, JSON.stringify(data));
        }catch(e){ console.warn('saveToStorage failed', e); }
    };

    window.loadFromStorage = function(key){
        try{
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
            return parsed;
        }catch(e){ console.warn('loadFromStorage failed', e); return null; }
    };

    // Promotion predicate (price < 200 and numeric)
    window.isPromotion = function(price){
        try{
            const num = Number(String(price||'').replace(',', '.'));
            return !Number.isNaN(num) && num > 0 && num < 200;
        }catch(e){ return false; }
    };

    // Sort products so promotional ones appear first (keeps relative order otherwise)
    window.sortPromotionFirst = function(arr){
        if (!Array.isArray(arr)) return arr;
        return arr.slice().sort((a,b) => {
            const aPromo = window.isPromotion(a.price);
            const bPromo = window.isPromotion(b.price);
            if (aPromo === bPromo) return 0;
            return aPromo ? -1 : 1;
        });
    };
})();

const form = document.getElementById("user-form");
const lista = document.getElementById("users-list");

let users = [];

const STORAGE_KEY_USERS = 'users';

function saveUsers() {
    try {
        saveToStorage(STORAGE_KEY_USERS, users);
    } catch (e) {
        console.warn('Não foi possível salvar users no localStorage', e);
    }
}

function loadUsersFromStorage() {
    try {
        return loadFromStorage(STORAGE_KEY_USERS);
    } catch (e) {
        console.warn('Erro ao ler users do localStorage', e);
    }
    return null;
}

async function init() {
    const stored = loadUsersFromStorage();
    if (stored) {
        users = stored;
        render();
        return;
    }

    try {
        const resposta = await fetch("https://dummyjson.com/users");
        const dados = await resposta.json();
        users = dados.users.map(u => ({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            age: u.age,
            image: u.image
        }));
    } catch (err) {
        alert("Erro ao carregar API, carregando lista vazia...");
        users = [];
    }

    saveUsers();
    render();
}

init();

function render() {
    lista.innerHTML = "";

    const placeholder = PLACEHOLDER_IMAGE || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='12'>Sem imagem</text></svg>";

    users.forEach((u, index) => {
        const img = u.image && u.image.length > 0 ? u.image : placeholder;
        lista.innerHTML += `
            <li class="card">
                <div class="card-left">
                    <img src="${img}" alt="Foto de ${escapeHtml(u.firstName + ' ' + u.lastName)}" onerror="this.onerror=null;this.src='${placeholder}'" />
                    <div>
                        <strong>${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</strong><br>
                        Email: ${escapeHtml(u.email)}<br>
                        Idade: ${escapeHtml(String(u.age))}
                    </div>
                </div>
                <button class="remove-btn" aria-label="Remover usuário ${escapeHtml(u.firstName + ' ' + u.lastName)}" onclick="remover(${index})">Remover</button>
            </li>
        `;
    });
}

function remover(i) {
    const usuario = users[i];
    const ok = confirm(`Remover o usuário "${usuario?.firstName || ''} ${usuario?.lastName || ''}"?`);
    if (!ok) return;
    users.splice(i, 1);
    saveUsers();
    render();
}

// Inline validation helpers
function clearFieldErrorUser(input) {
    if (!input) return;
    input.classList.remove('input-error');
    const next = input.nextElementSibling;
    if (next && next.classList && next.classList.contains('error-message')) next.remove();
    input.removeAttribute('aria-invalid');
}

function showFieldErrorUser(input, msg) {
    if (!input) return;
    clearFieldErrorUser(input);
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    const span = document.createElement('div');
    span.className = 'error-message';
    span.textContent = msg;
    input.insertAdjacentElement('afterend', span);
}

function clearAllErrorsUser(formEl) {
    const els = formEl.querySelectorAll('.input-error');
    els.forEach(el => clearFieldErrorUser(el));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrorsUser(form);

    const firstNameEl = document.getElementById("firstName");
    const lastNameEl = document.getElementById("lastName");
    const emailEl = document.getElementById("email");
    const ageEl = document.getElementById("age");
    const imageEl = document.getElementById("image");

    const firstName = firstNameEl.value.trim();
    const lastName = lastNameEl.value.trim();
    const email = emailEl.value.trim();
    const age = Number(ageEl.value);
    const image = imageEl.value.trim();

    let valid = true;

    if (firstName.length < 3 || firstName.length > 50) {
        showFieldErrorUser(firstNameEl, 'Nome inválido (3 a 50 caracteres)');
        valid = false;
    }

    if (lastName.length < 3 || lastName.length > 50) {
        showFieldErrorUser(lastNameEl, 'Sobrenome inválido (3 a 50 caracteres)');
        valid = false;
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        showFieldErrorUser(emailEl, 'Email inválido');
        valid = false;
    }

    if (Number.isNaN(age) || age <= 0 || age >= 120) {
        showFieldErrorUser(ageEl, 'Idade inválida (1 a 119)');
        valid = false;
    }

    if (image.length > 0) {
        try {
            new URL(image);
        } catch {
            showFieldErrorUser(imageEl, 'URL da imagem inválida');
            valid = false;
        }
    }

    if (!valid) return;

    const novo = { firstName, lastName, email, age, image };
    users.unshift(novo);
    saveUsers();

    render();
    form.reset();
});


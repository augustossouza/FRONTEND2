// script.js - validação e fluxo entre form.html e confirmation.html
(function(){
  'use strict';

  // Regex sugerida para email (normalizada para JS)
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function validate(values){
    const errors = [];
    const nome = (values.nome || '').trim();
    const sobrenome = (values.sobrenome || '').trim();
    const email = (values.email || '').trim();
    const idadeRaw = values.idade;
    const idade = idadeRaw === '' || idadeRaw === null || idadeRaw === undefined ? NaN : Number(idadeRaw);

    if(!nome || nome.length < 3 || nome.length > 50) errors.push('Nome deve ter entre 3 e 50 caracteres.');
    if(!sobrenome || sobrenome.length < 3 || sobrenome.length > 50) errors.push('Sobrenome deve ter entre 3 e 50 caracteres.');
    if(!email || !emailRegex.test(email)) errors.push('Email inválido.');
    if(!Number.isInteger(idade) || idade <= 0 || idade >= 120) errors.push('Idade deve ser um inteiro positivo menor que 120.');

    return errors;
  }

  function readForm(){
    return {
      nome: document.getElementById('nome') ? document.getElementById('nome').value : '',
      sobrenome: document.getElementById('sobrenome') ? document.getElementById('sobrenome').value : '',
      email: document.getElementById('email') ? document.getElementById('email').value : '',
      idade: document.getElementById('idade') ? document.getElementById('idade').value : ''
    };
  }

  function populateFormFromPending(){
    // If there is a pendingSubmission (from recent submit), prefill the form fields
    try{
      const raw = sessionStorage.getItem('pendingSubmission');
      const data = raw ? JSON.parse(raw) : null;
      // if no pending, try to prefill from lastSubmission (localStorage) as fallback
      const fallbackRaw = !data ? localStorage.getItem('lastSubmission') : null;
      const fallback = fallbackRaw ? JSON.parse(fallbackRaw) : null;
      const src = data || fallback;
      if(!src) return;
      if(document.getElementById('nome')) document.getElementById('nome').value = src.nome || '';
      if(document.getElementById('sobrenome')) document.getElementById('sobrenome').value = src.sobrenome || '';
      if(document.getElementById('email')) document.getElementById('email').value = src.email || '';
      if(document.getElementById('idade')) document.getElementById('idade').value = src.idade !== undefined ? src.idade : '';
    }catch(e){ /* ignore parse errors */ }
  }

  function showErrors(el, list){
    if(!el) return;
    if(list.length === 0){ el.textContent = ''; return; }
    el.innerHTML = '<strong>Erros:</strong><ul style="margin:6px 0 0 18px;padding:0">' + list.map(e => '<li>' + e + '</li>').join('') + '</ul>';
  }

  // Handle submit on form.html
  function handleFormSubmit(e){
    e.preventDefault();
    const values = readForm();
    const errors = validate(values);
    const errorsEl = document.getElementById('errors');
    showErrors(errorsEl, errors);
    if(errors.length === 0){
      // store temporarily and go to confirmation
      sessionStorage.setItem('pendingSubmission', JSON.stringify(values));
      window.location.href = 'confirmation.html';
    }
  }

  // Populate confirmation page
  function populateConfirmation(){
    const dataRaw = sessionStorage.getItem('pendingSubmission');
    if(!dataRaw) return;
    const data = JSON.parse(dataRaw);
    const review = document.getElementById('review');
    if(review){
      review.innerHTML = '<strong>Nome:</strong> ' + escapeHtml(data.nome) + '<br>' +
                         '<strong>Sobrenome:</strong> ' + escapeHtml(data.sobrenome) + '<br>' +
                         '<strong>Email:</strong> ' + escapeHtml(data.email) + '<br>' +
                         '<strong>Idade:</strong> ' + escapeHtml(String(data.idade));
    }

    const editBtn = document.getElementById('editBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    if(editBtn) editBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      // go back to edit
      window.location.href = 'form.html';
    });

    if(confirmBtn) confirmBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      confirmAndSave(data);
    });
  }

  function confirmAndSave(data){
    // Final validation before saving
    const errors = validate(data);
    if(errors.length){
      const msg = document.getElementById('msg');
      if(msg) { msg.style.color = '#b91c1c'; msg.textContent = 'Dados inválidos, volte e corrija.'; }
      return;
    }

    // create JSON content
    const payload = {
      nome: data.nome.trim(),
      sobrenome: data.sobrenome.trim(),
      email: data.email.trim(),
      idade: Number(data.idade)
    };

    // Save to localStorage for persistence in browser
    try{ localStorage.setItem('lastSubmission', JSON.stringify(payload)); } catch(e){}

    // Trigger download of data.json with the payload (simulates saving to file)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // optional: show message then redirect
    const msg = document.getElementById('msg');
    if(msg){ msg.style.color = 'green'; msg.textContent = 'Dados salvos. Redirecionando para a página inicial...'; }

    // clear pending submission
    sessionStorage.removeItem('pendingSubmission');

    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  }

  // small helper to avoid XSS when injecting strings
  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, function (s) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]; }); }

  // Attach events depending on page
  document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('userForm');
    if(form) form.addEventListener('submit', handleFormSubmit);

    // If on form page, try to prefill from pending or last submission so "Editar" works as expected
    if(form) populateFormFromPending();

    // if on confirmation page, populate
    if(document.getElementById('review')) populateConfirmation();
  });

})();

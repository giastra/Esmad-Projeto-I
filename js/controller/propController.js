import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/props';

const headers = () => ({
  'Authorization': `Bearer ${getToken()}`
});

const headersJson = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar todos os props
export const getProps = () =>
  fetch(BASE_URL, { headers: headersJson() }).then(r => r.json());

// Ver prop por ID
export const getPropById = (id) =>
  fetch(`${BASE_URL}/${id}`, { headers: headersJson() }).then(r => r.json());

// Criar prop com imagem (admin) — envia FormData com name + img
export const criarProp = (name, imgFile) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('img', imgFile);

  return fetch(BASE_URL, {
    method: 'POST',
    headers: headers(),
    body: formData
  }).then(r => r.json());
};

// Atualizar prop (admin) — imgFile é opcional
export const atualizarProp = (id, name, imgFile = null) => {
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (imgFile) formData.append('img', imgFile);

  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: formData
  }).then(r => r.json());
};

// Eliminar prop (admin)
export const apagarProp = (id) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: headersJson()
  }).then(r => r.json());
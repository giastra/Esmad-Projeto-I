import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/props';

// Headers sem Content-Type para form-data (multer)
const headers = () => ({
  'Authorization': `Bearer ${getToken()}`
});

// Headers para JSON
const headersJson = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar objetos
export const getProps = () => fetch(BASE_URL, {
  headers: headersJson()
}).then(r => r.json());

// Ver objeto por id
export const getPropById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headersJson()
}).then(r => r.json());

// Criar objeto com imagem (admin) — usa FormData
export const criar = (formData) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: formData
}).then(r => r.json());

// Atualizar objeto com imagem (admin) — usa FormData
export const atualizar = (id, formData) => fetch(`${BASE_URL}/${id}`, {
  method: 'PUT',
  headers: headers(),
  body: formData
}).then(r => r.json());

// Eliminar objeto (admin)
export const apagar = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headersJson()
}).then(r => r.json());

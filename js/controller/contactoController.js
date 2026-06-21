import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/contactos';

const headersJson = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const headersPublic = () => ({
  'Content-Type': 'application/json'
});

// Enviar contacto — público (sem token)
export const enviarContacto = (dados) =>
  fetch(BASE_URL, {
    method: 'POST',
    headers: headersPublic(),
    body: JSON.stringify(dados)
  }).then(r => r.json());

// Listar todos os contactos — admin
export const getContactos = () =>
  fetch(BASE_URL, {
    headers: headersJson()
  }).then(r => r.json());

// Ver contacto por ID — admin
export const getContactoById = (id) =>
  fetch(`${BASE_URL}/${id}`, {
    headers: headersJson()
  }).then(r => r.json());

// Marcar como lida — admin
export const marcarComoLida = (id) =>
  fetch(`${BASE_URL}/${id}/lida`, {
    method: 'PATCH',
    headers: headersJson()
  }).then(r => r.json());
  
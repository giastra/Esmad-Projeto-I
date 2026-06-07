import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/diary';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar entradas do diário
export const getMeusDiarios = () => fetch(BASE_URL, {
  headers: headers()
}).then(r => r.json());

// Ver entrada por id
export const getDiarioById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Criar entrada
export const criar = (data) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar entrada
export const atualizar = (id, data) => fetch(`${BASE_URL}/${id}`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar entrada
export const apagar = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

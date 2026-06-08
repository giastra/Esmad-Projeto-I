import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/colors';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar cores
export const getColors = () => fetch(BASE_URL, {
  headers: headers()
}).then(r => r.json());

// Ver cor por id
export const getColorById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Criar cor (admin)
export const criar = (data) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar cor (admin)
export const atualizar = (id, data) => fetch(`${BASE_URL}/${id}`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar cor (admin)
export const apagar = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

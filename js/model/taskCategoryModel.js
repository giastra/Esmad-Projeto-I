import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/task-categories';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar categorias
export const getMinhasCategorias = () => fetch(BASE_URL, {
  headers: headers()
}).then(r => r.json());

// Ver categoria por id
export const getCategoriaById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Criar categoria
export const criar = (data) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar categoria
export const atualizar = (id, data) => fetch(`${BASE_URL}/${id}`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar categoria
export const DeletarCat = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

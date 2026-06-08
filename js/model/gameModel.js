import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/game';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar posições do utilizador com prop populado
export const getMinhasPosicoes = () => fetch(BASE_URL, {
  headers: headers()
}).then(r => r.json());

// Ver posição por id
export const getPosicaoById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Criar posição — prop é escolhido aleatoriamente pelo backend
export const criar = (data) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar posição
export const apagar = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

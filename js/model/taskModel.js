import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/tasks';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar tarefas com filtros opcionais (?status, ?priority, ?category)
export const getMinhasTarefas = (filtros = {}) => {
  const query = new URLSearchParams(filtros).toString();
  return fetch(`${BASE_URL}?${query}`, {
    headers: headers()
  }).then(r => r.json());
};

// Ver tarefa por id
export const getTarefaById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Criar tarefa
export const criar = (data) => fetch(BASE_URL, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar tarefa
export const atualizar = (id, data) => fetch(`${BASE_URL}/${id}`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar tarefa
export const apagar = (id) => fetch(`${BASE_URL}/${id}`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

import { getToken } from '../utils/auth.js';

const BASE_URL = 'http://localhost:5000/api/users';

// Headers com token para rotas protegidas
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Registar utilizador
export const register = (data) => fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(r => r.json());

// Login
export const login = (data) => fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(r => r.json());

// Logout
export const logout = () => fetch(`${BASE_URL}/logout`, {
  method: 'POST',
  headers: headers()
}).then(r => r.json());

// Ver perfil próprio
export const getMe = () => fetch(`${BASE_URL}/me`, {
  method: 'GET',
  headers: headers()
}).then(r => r.json());

// Atualizar nome
export const updateMe = (data) => fetch(`${BASE_URL}/me`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar email
export const updateEmail = (data) => fetch(`${BASE_URL}/me/email`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Atualizar password
export const updatePassword = (data) => fetch(`${BASE_URL}/me/password`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data)
}).then(r => r.json());

// Eliminar conta
export const deleteMe = () => fetch(`${BASE_URL}/me`, {
  method: 'DELETE',
  headers: headers()
}).then(r => r.json());

// Listar utilizadores (admin)
export const getUsers = () => fetch(BASE_URL, {
  headers: headers()
}).then(r => r.json());

// Ver utilizador por id (admin)
export const getUserById = (id) => fetch(`${BASE_URL}/${id}`, {
  headers: headers()
}).then(r => r.json());

// Atualizar roles (admin)
export const updateUserRole = (id, roles) => fetch(`${BASE_URL}/${id}/roles`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify({ roles })
}).then(r => r.json());

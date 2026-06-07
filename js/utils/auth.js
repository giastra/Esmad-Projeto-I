// Lê o token do localStorage
export const getToken = () => localStorage.getItem('token');

// Guarda o token no localStorage
export const setToken = (token) => localStorage.setItem('token', token);

// Remove o token do localStorage
export const removeToken = () => localStorage.removeItem('token');

// Verifica se o utilizador está autenticado
export const isLoggedIn = () => !!getToken();

// Lê os dados do utilizador do localStorage
export const getUser = () => JSON.parse(localStorage.getItem('user'));

// Guarda os dados do utilizador no localStorage
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove os dados do utilizador do localStorage
export const removeUser = () => localStorage.removeItem('user');

// Verifica se o utilizador é admin
export const isAdmin = () => getUser()?.roles?.includes('admin');

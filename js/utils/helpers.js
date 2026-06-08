// Formata uma data para exibição ex: 24/08/2024
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-PT');
};

// Formata uma data para input type="date" ex: 2024-08-24
export const formatDateInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Mostra mensagem de erro num elemento
export const showError = (elementId, message) => {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
};

// Mostra mensagem de sucesso num elemento
export const showSuccess = (elementId, message) => {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
};

// Limpa mensagens de erro e sucesso
export const clearMessages = (...elementIds) => {
  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
};
// Redireciona se não estiver autenticado
export const requireAuth = () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/index.html';
  }
};

// Redireciona se não for admin
export const requireAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.roles?.includes('admin')) {
    window.location.href = '/index.html';
  }
};

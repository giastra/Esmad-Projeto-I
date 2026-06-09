import { register, login, logout, getMe, updateMe, updateEmail, updatePassword, deleteMe } from '../model/userModel.js';
import { setToken, setUser, removeToken, removeUser } from '../utils/auth.js';
import { requireAuth } from '../utils/helpers.js';
import { renderErroLogin, limparErroLogin, renderErroRegister, limparErroRegister, renderErro, renderSucesso, limparMensagens, renderPerfil } from '../view/userView.js';


// REGISTER
document.getElementById('form-register')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparErroRegister();

  const res = await register({
    name: document.getElementById('name').value,
    email: document.getElementById('email-register').value,
    password: document.getElementById('password-register').value
  });

  if (res.success) {
    setToken(res.token);
    setUser(res.data);
    window.location.href = 'html/Home.html';
  } else {
    renderErroRegister(res.message);
  }
});


// LOGIN
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparErroLogin();

  const res = await login({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  });

  if (res.success) {
    setToken(res.token);
    setUser(res.data);
    window.location.href = 'html/Home.html';
  } else {
    renderErroLogin(res.message);
  }
});


// LOGOUT
document.getElementById('btn-logout')?.addEventListener('click', async () => {
  await logout();
  removeToken();
  removeUser();
  window.location.href = '/index.html';
});


// GET ME — carrega os dados do utilizador na página
const carregarPerfil = async () => {
  requireAuth();
  const res = await getMe();
  if (res.success) renderPerfil(res.data);
};


// ATUALIZAR NOME
document.getElementById('form-update')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await updateMe({
    name: document.getElementById('novo-nome').value
  });

  if (res.success) {
    setUser(res.data);
    renderPerfil(res.data);
    document.getElementById('novo-nome').value = '';
    renderSucesso('Nome atualizado com sucesso.');
  } else {
    renderErro(res.message);
  }
});


// ATUALIZAR EMAIL
document.getElementById('form-email')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await updateEmail({
    email: document.getElementById('novo-email').value,
    password: document.getElementById('password-confirm').value
  });

  if (res.success) {
    document.getElementById('novo-email').value = '';
    document.getElementById('password-confirm').value = '';
    renderSucesso('Email atualizado com sucesso.');
  } else {
    renderErro(res.message);
  }
});


// ATUALIZAR PASSWORD
document.getElementById('form-password')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparMensagens();

  const res = await updatePassword({
    currentPassword: document.getElementById('password-atual').value,
    newPassword: document.getElementById('password-nova').value
  });

  if (res.success) {
    document.getElementById('password-atual').value = '';
    document.getElementById('password-nova').value = '';
    renderSucesso('Password atualizada com sucesso.');
  } else {
    renderErro(res.message);
  }
});


// ELIMINAR CONTA
document.getElementById('btn-delete')?.addEventListener('click', async () => {
  const confirmar = confirm('Tens a certeza que queres eliminar a conta?');
  if (!confirmar) return;

  const res = await deleteMe();
  if (res.success) {
    removeToken();
    removeUser();
    window.location.href = '/index.html';
  } else {
    renderErro(res.message);
  }
});


// Inicializa a página de perfil apenas se estiver na página de perfil e autenticado
if (document.getElementById('nome') && localStorage.getItem('token')) {
  carregarPerfil();
}

//ADMIM PAGINA 
document.getElementById('btn-admin')?.addEventListener('click', () => {
    window.location.href = "EdiçãoAdmim.html";
});
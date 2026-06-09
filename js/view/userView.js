// Abre o modal de login
export const abrirModalLogin = () => {
  const modal = document.getElementById('modal-login');
  if (modal) modal.style.display = 'flex';
};

// Abre o modal de registo
export const abrirModalRegisto = () => {
  const modal = document.getElementById('modal-registo');
  if (modal) modal.style.display = 'flex';
};

// Fecha todos os modais
export const fecharModais = () => {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
};

// Preenche os dados do perfil na página e os placeholders dos inputs
export const renderPerfil = (user) => {
  // Dados visíveis
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  if (nome) nome.textContent = user.name;
  if (email) email.textContent = user.email;

  // Placeholders dos inputs com os dados atuais
  const inputNome = document.getElementById('novo-nome');
  const inputEmail = document.getElementById('novo-email');
  if (inputNome) inputNome.placeholder = user.name;
  if (inputEmail) inputEmail.placeholder = user.email;
};

// Mostra erro no formulário de registo
export const renderErroRegister = (mensagem) => {
  const el = document.getElementById('erro-register');
  if (el) el.textContent = mensagem;
};

// Limpa erro do formulário de registo
export const limparErroRegister = () => {
  const el = document.getElementById('erro-register');
  if (el) el.textContent = '';
};

// Mostra erro no formulário de login
export const renderErroLogin = (mensagem) => {
  const el = document.getElementById('erro-login');
  if (el) el.textContent = mensagem;
};

// Limpa erro do formulário de login
export const limparErroLogin = () => {
  const el = document.getElementById('erro-login');
  if (el) el.textContent = '';
};

// Mostra mensagem de erro no perfil
export const renderErro = (mensagem) => {
  const el = document.getElementById('erro');
  if (el) el.textContent = mensagem;
};

// Mostra mensagem de sucesso no perfil
export const renderSucesso = (mensagem) => {
  const el = document.getElementById('sucesso');
  if (el) el.textContent = mensagem;
};

// Limpa mensagens de erro e sucesso
export const limparMensagens = () => {
  const erro = document.getElementById('erro');
  const sucesso = document.getElementById('sucesso');
  if (erro) erro.textContent = '';
  if (sucesso) sucesso.textContent = '';
};
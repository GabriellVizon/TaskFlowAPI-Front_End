import { getToken } from '../utils/storage';

const BASE_URL = 'http://localhost:5089';

async function request(endpoint, options = {}) {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join('\n');
        errorMessage = fieldErrors;
      } else {
        errorMessage = errorData.message || errorData.title || errorMessage;
      }
    } catch {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email, senha) =>
      request('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      }),
    register: (nome, email, telefone, senha) =>
      request('/api/Auth/register', {
        method: 'POST',
        body: JSON.stringify({ nome, email, telefone, senha }),
      }),
  },
  agendamentos: {
    list: () => request('/api/Agendamentos'),
    listByUsuario: (usuarioId) => request(`/api/Agendamentos/usuario/${usuarioId}`),
    create: (data, hora, nomeUsuario, nomeBarbeiro) =>
      request('/api/Agendamentos', {
        method: 'POST',
        body: JSON.stringify({ data, hora, nomeUsuario, nomeBarbeiro }),
      }),
    update: (id, data, hora) =>
      request(`/api/Agendamentos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data, hora }),
      }),
    delete: (id) =>
      request(`/api/Agendamentos/${id}`, {
        method: 'DELETE',
      }),
  },
  usuarios: {
    list: () => request('/api/Usuarios'),
    create: (nome, email, senha) =>
      request('/api/Usuarios', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
      }),
  },
  barbeiros: {
    list: () => request('/api/Barbeiros'),
    create: (nome, especialidade, telefone) =>
      request('/api/Barbeiros', {
        method: 'POST',
        body: JSON.stringify({ nome, especialidade, telefone }),
      }),
  },
};

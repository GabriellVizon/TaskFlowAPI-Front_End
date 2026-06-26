import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token_navalha';
const USER_KEY = 'user_navalha';

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Erro ao salvar token:', e);
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Erro ao remover token:', e);
  }
}

export async function getUser() {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Erro ao salvar usuário:', e);
  }
}

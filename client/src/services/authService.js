const LOGIN_URL = import.meta.env.VITE_LAMBDA_ENDPOINT;

export async function login(username, password) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export const authService = {
  login,
};

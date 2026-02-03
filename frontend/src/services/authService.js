const API_URL = "http://localhost:5000/api/auth";

/*
  Auth Service
  Handles login and signup API calls
*/

// 🔹 Login Service
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return response.json();
};

// 🔹 Signup Service
export const signupUser = async (username, email, password) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  });

  return response.json();
};

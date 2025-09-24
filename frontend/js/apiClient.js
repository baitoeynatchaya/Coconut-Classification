const API_BASE_URL = "http://localhost:5000";

export async function apiRequest(endpoint, method = "GET", data = null, headers = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

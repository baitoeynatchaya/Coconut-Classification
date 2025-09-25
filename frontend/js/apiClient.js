const API_BASE_URL = "http://localhost:5000";

export async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method
  };

  if (data) {
    options.body = data;
  }

  console.log(options)
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

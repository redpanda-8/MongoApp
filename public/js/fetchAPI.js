// Reusable Fetch Function
// Avoids duplicate fetch calls
export async function fetchData(url, method = "GET", body = null) {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    if (body) options.body = JSON.stringify(body);
  
    const response = await fetch(url, options);
    return response.json();
  }
  
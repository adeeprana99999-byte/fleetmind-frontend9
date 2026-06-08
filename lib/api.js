const API = "https://fleetmind-backend.onrender.com/api/drivers";


// LOGIN (POST)
export async function login(body) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("LOGIN error:", res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("LOGIN error:", err);
    return null;
  }
}


// GET request
export async function getData(endpoint) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API}/${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}


// POST request
export async function postData(path, body) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("POST error:", res.status, res.statusText);
  }

  return res.json();
}

// PUT request
export async function putData(path, body) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("PUT error:", res.status, res.statusText);
  }

  return res.json();
}

// DELETE request
export async function deleteData(path) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("DELETE error:", res.status, res.statusText);
  }

  return res.json();
}

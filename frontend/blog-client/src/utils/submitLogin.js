export const submitLogin = async (email, password) => {
  const url = "http://localhost:3000/api/v1/auth/token/";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(
        `Response Status: ${res.status}, Response Message: ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

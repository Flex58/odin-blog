export const verifyRefreshtoken = async () => {
  const url = "http://localhost:3000/api/v1/auth/token/refresh";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(
        `Response Status: ${res.status}, Response Message: ${res.statusText}`,
      );
    }
    const result = await res.json();
    return { accessToken: result.accessToken, user: result.user };
  } catch (error) {
    console.log(error);
  }
};

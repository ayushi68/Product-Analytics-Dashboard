import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/apiService";
import { setToken } from "../services/tokenService";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      if (!response?.token) {
        throw new Error("Token missing in login response.");
      }
      setToken(response.token);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-center">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Product Analytics</h1>
        <p>Sign in to continue</p>

        <label>
          Username
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;

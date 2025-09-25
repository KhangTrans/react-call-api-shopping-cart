import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_API = "http://localhost:8080/api/v1/auth/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) {
      setErr("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Đăng nhập thất bại (HTTP ${res.status})`);
      }

      // Theo BE: { token, userId }
      if (!data?.token) throw new Error("Không nhận được token từ server.");
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("tokenType", "Bearer");
      storage.setItem("userId", String(data.userId || ""));
      // Nếu bạn muốn lưu thêm email để hiển thị:
      storage.setItem("user", JSON.stringify({ id: data.userId, email }));

      // Bắn event để các component khác biết đã đăng nhập
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (e) {
      setErr(e.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <h3 className="mt-4 mb-3">Đăng nhập</h3>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Mật khẩu</label>
          <div className="input-group">
            <input
              type={showPwd ? "text" : "password"}
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={3}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPwd((v) => !v)}
            >
              {showPwd ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        <div className="form-check my-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
        <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ tôi</label>
        </div>

        <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="text-muted small mt-3">
        * Đảm bảo CORS cho origin FE và endpoint <code>/api/v1/auth/login</code> được <em>permitAll()</em>.
      </p>
    </div>
  );
}

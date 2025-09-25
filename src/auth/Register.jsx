import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const REGISTER_API = "http://localhost:8080/api/v1/auth/register";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(true); // mặc định kích hoạt
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Chuẩn hoá số điện thoại: bỏ khoảng trắng, chỉ giữ số
  const normalizePhone = (s) => (s || "").replace(/\D/g, "");

  const validate = () => {
    if (!fullName.trim()) return "Vui lòng nhập họ và tên.";
    if (!email.trim()) return "Vui lòng nhập email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Email không hợp lệ.";
    if (!password) return "Vui lòng nhập mật khẩu.";
    if (password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    if (password !== confirm) return "Xác nhận mật khẩu không khớp.";
    if (!phone.trim()) return "Vui lòng nhập số điện thoại.";
    const p = normalizePhone(phone);
    if (p.length < 9) return "Số điện thoại không hợp lệ.";
    if (!address.trim()) return "Vui lòng nhập địa chỉ.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const res = await fetch(REGISTER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi đủ các trường theo DB: full_name/email/password/phone/address/status
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: normalizePhone(phone),
          address: address.trim(),
          status, // true/false
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Đăng ký thất bại (HTTP ${res.status})`
        );
      }

      // BE trả { token, userId }
      if (!data?.token) throw new Error("Không nhận được token từ server.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenType", "Bearer");
      localStorage.setItem("userId", String(data.userId || ""));
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          email: email.trim(),
          fullName: fullName.trim(),
          phone: normalizePhone(phone),
          address: address.trim(),
          status,
        })
      );

      window.dispatchEvent(new Event("auth-changed"));
      navigate("/"); // hoặc navigate("/login") nếu muốn bắt đăng nhập lại
    } catch (e) {
      setErr(e.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h3 className="mt-4 mb-3">Đăng ký tài khoản</h3>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              placeholder="0987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Địa chỉ</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPwd ? "text" : "password"}
                className="form-control"
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPwd((v) => !v)}
                aria-label="Hiện/ẩn mật khẩu"
              >
                {showPwd ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type={showPwd ? "text" : "password"}
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="col-12">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="status">
                Kích hoạt tài khoản (status)
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        <div className="text-muted small mt-3">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </form>

      <p className="text-muted small mt-3">
        * Form gửi đủ trường: <code>fullName, email, password, phone, address, status</code>.  
        Đảm bảo BE map các trường này vào entity trước khi lưu DB.
      </p>
    </div>
  );
}

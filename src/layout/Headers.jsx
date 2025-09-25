import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cart3 } from "react-bootstrap-icons";

// ---- Utils ----
function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}
function getUserId() {
  return Number(localStorage.getItem("userId") || 0);
}
function getToken() {
  return localStorage.getItem("token") || "";
}

export default function Headers() {
  const [user, setUser] = useState(getUser());
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Gọi API count, handle cả JSON number / JSON object / text
  const fetchCartCount = async () => {
    const uid = getUserId();
    const token = getToken();
    if (!uid || !token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/users/${uid}/cart/total-quantity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("HTTP " + res.status);

      let count = 0;
      // Ưu tiên parse JSON
      try {
        const data = await res.json();
        count = (typeof data === "number") ? data : Number(data?.totalQuantity ?? 0);
      } catch {
        // Nếu không phải JSON (trả text/plain)
        const text = await res.text();
        count = Number(text);
      }

      setCartCount(Number.isFinite(count) ? count : 0);
    } catch (e) {
      console.error("Fetch cart count failed:", e);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const onStorage = (e) => {
      if (["user", "userId", "token"].includes(e.key)) {
        setUser(getUser());
        fetchCartCount();
      }
    };
    const onAuthChanged = () => { setUser(getUser()); fetchCartCount(); };
    const onCartChanged = () => { fetchCartCount(); };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("cart-changed", onCartChanged);

    fetchCartCount(); // load lần đầu

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("cart-changed", onCartChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Navbar</Link>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="collapsibleNavId">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Sản phẩm</Link></li>
            </ul>

            <div className="d-flex align-items-center">
              <Link to="/cart" className="btn btn-outline-secondary me-3 d-flex align-items-center">
                <Cart3 size={20} />
                <span className="badge bg-danger ms-2">{cartCount}</span>
              </Link>

              {user ? (
                <>
                  <span className="me-3 text-truncate" style={{ maxWidth: 200 }}>
                    {user.email || user.fullName || "Người dùng"}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-danger">Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">Đăng nhập</Link>
                  <Link to="/register" className="btn btn-primary">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

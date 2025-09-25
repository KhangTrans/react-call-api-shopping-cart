import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8080/api/v1/products";
const CART_API_BASE = "http://localhost:8080/api/users"; // /{userId}/cart

function formatVND(n) {
  if (n == null || isNaN(Number(n))) return "—";
  try {
    return Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } catch {
    return `${n}`;
  }
}

function getAuth() {
  // Sau login nhớ lưu: localStorage.setItem("token", token); localStorage.setItem("userId", userId);
  const token = localStorage.getItem("token") || "";
  const userId = Number(localStorage.getItem("userId") || 0);
  return { token, userId, isLoggedIn: !!token && !!userId };
}

async function addToServerCart(userId, token, productId, qty = 1) {
  const res = await fetch(`${CART_API_BASE}/${userId}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity: qty })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Add to cart failed (${res.status})`);
  }
  const data = await res.json().catch(() => null);
  window.dispatchEvent(new Event("cart-changed"));
  return data;
}

export default function ListProduct() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [addingId, setAddingId] = useState(0); // id SP đang thêm
  const [message, setMessage] = useState("");

  const url = useMemo(() => `${API_BASE}?page=${page}&size=${size}`, [page, size]);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setErr("");
      setMessage("");
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data?.content) ? data.content : []);
        setTotalPages(Number(data?.totalPages ?? 0));
        setTotalElements(Number(data?.totalElements ?? 0));
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Fetch thất bại");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [url]);

  // Tự đóng message sau 1s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 1000);
    return () => clearTimeout(t);
  }, [message]);

  // Tự đóng lỗi sau 2s
  useEffect(() => {
    if (!err) return;
    const t = setTimeout(() => setErr(""), 2000);
    return () => clearTimeout(t);
  }, [err]);

  const onPrev = () => setPage((p) => Math.max(0, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const onChangeSize = (e) => { setSize(Number(e.target.value)); setPage(0); };

  const handleAddToCart = async (product) => {
    setMessage("");
    if (!product?.id) return;

    // ⛔ Chưa đăng nhập -> thông báo và dừng
    const { token, userId, isLoggedIn } = getAuth();
    if (!isLoggedIn) {
      setErr("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    if (!product.productStatus) {
      return setErr("Sản phẩm đang ngừng bán.");
    }
    if (product.productStock <= 0) {
      return setErr("Sản phẩm đã hết hàng.");
    }

    setAddingId(product.id);
    try {
      // ✅ Đã đăng nhập -> gọi API BE
      await addToServerCart(userId, token, product.id, 1);

      setMessage("Đã thêm vào giỏ!");
      // (tuỳ chọn) cập nhật tồn kho hiển thị trên UI
      setItems(prev => prev.map(p =>
        p.id === product.id
          ? { ...p, productStock: Math.max(0, (p.productStock || 0) - 1) }
          : p
      ));
    } catch (e) {
      setErr(e.message || "Thêm vào giỏ thất bại.");
    } finally {
      setAddingId(0);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">Danh sách sản phẩm</h3>
        <div className="d-flex gap-2 align-items-center">
          <small className="text-muted">Tổng: {totalElements}</small>
          <select className="form-select form-select-sm" style={{ width: 110 }} value={size} onChange={onChangeSize}>
            {[4, 8, 12, 16, 24].map((n) => <option key={n} value={n}>{n} / trang</option>)}
          </select>
        </div>
      </div>

      {message && <div className="alert alert-success py-2">{message}</div>}
      {loading && <div className="alert alert-info">Đang tải sản phẩm...</div>}
      {err && !loading && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && items.length === 0 && <div className="alert alert-warning">Không có sản phẩm.</div>}

      <div className="row g-3">
        {items.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100">
              <img
                className="card-img-top"
                src={p.imageUrl || "https://th.bing.com/th/id/OIP.O2Eb0RfuXZE6k3W3pVRyewHaEK?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
                alt={p.productName}
                style={{ objectFit: "cover", height: 180 }}
                onError={(e) => (e.currentTarget.src = "https://th.bing.com/th/id/OIP.O2Eb0RfuXZE6k3W3pVRyewHaEK?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7")}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1" title={p.productName}>{p.productName}</h5>

                <div className="mb-2">
                  <span className={`badge me-1 ${p.productStatus ? "bg-success" : "bg-secondary"}`}>
                    {p.productStatus ? "Đang bán" : "Ngừng bán"}
                  </span>
                  {p.categoryName && <span className="badge bg-light text-dark">#{p.categoryName}</span>}
                </div>

                <p className="card-text mb-2"><strong>{formatVND(p.productPrice)}</strong></p>
                <p className="text-muted mb-3">Tồn kho: {p.productStock}</p>

                <div className="mt-auto d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    disabled={!p.productStatus || p.productStock <= 0 || addingId === p.id}
                    onClick={() => handleAddToCart(p)}
                  >
                    {addingId === p.id ? "Đang thêm..." : "Thêm vào giỏ"}
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" type="button">Chi tiết</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-outline-primary" onClick={onPrev} disabled={page <= 0}>← Trang trước</button>
          <span>Trang {page + 1} / {totalPages}</span>
          <button className="btn btn-outline-primary" onClick={onNext} disabled={page >= totalPages - 1}>Trang sau →</button>
        </div>
      )}
    </div>
  );
}

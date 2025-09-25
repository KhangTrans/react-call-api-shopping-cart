import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getToken() {
  return localStorage.getItem("token") || "";
}
function getUserId() {
  return Number(localStorage.getItem("userId") || 0);
}

export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      const userId = getUserId();
      if (!userId || !token) {
        setErr("Bạn cần đăng nhập để xem giỏ hàng.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Giả sử BE trả CartSummaryDTO với field items = []
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setErr(e.message || "Không tải được giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const formatVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  return (
    <div className="container my-4">
      <h3>Giỏ hàng của bạn</h3>

      {loading && <div className="alert alert-info">Đang tải giỏ hàng...</div>}
      {err && !loading && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="alert alert-warning">Giỏ hàng đang trống.</div>
      )}

      {items.length > 0 && (
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id || idx}>
                <td>{idx + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        it.imageUrl ||
                        "https://via.placeholder.com/60x60?text=No+Image"
                      }
                      alt={it.productName}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                      className="me-2"
                    />
                    <span>{it.productName}</span>
                  </div>
                </td>
                <td>{formatVND(it.unitPrice)}</td>
                <td>{it.quantity}</td>
                <td>{formatVND(it.unitPrice * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length > 0 && (
        <div className="text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/checkout")}
          >
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
}

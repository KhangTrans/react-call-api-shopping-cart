import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api/users";

function getToken() {
  return localStorage.getItem("token") || "";
}
function getUserId() {
  return Number(localStorage.getItem("userId") || 0);
}
async function readError(res) {
  const text = await res.text().catch(() => "");
  try {
    const j = JSON.parse(text || "{}");
    return j.message || j.error || text || res.statusText;
  } catch {
    return text || res.statusText;
  }
}

export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rowBusy, setRowBusy] = useState({}); // { [cartId]: true }
  const navigate = useNavigate();

  const formatVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice || 0) * Number(it.quantity || 0)), 0);
  const totalQty = items.reduce((s, it) => s + Number(it.quantity || 0), 0);

  // Load giỏ hàng
  const fetchCart = async () => {
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) {
      setErr("Bạn cần đăng nhập để xem giỏ hàng.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/${userId}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${await readError(res)}`);
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setErr(e.message || "Không tải được giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // PUT /api/users/{userId}/cart/{cartId}  body: {quantity}
  const putQuantity = async (cartId, quantity) => {
    const token = getToken();
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/${userId}/cart/${cartId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: Number(quantity) }),
    });
    if (res.status === 204) return { removed: true };
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await readError(res)}`);
    const dto = await res.json();
    return { dto };
  };

  const updateQuantity = async (it, nextQty) => {
    const cartId = it.id; // BE dùng cartId ở path
    if (!cartId) return setErr("Thiếu cartId để cập nhật.");

    // Nếu nhỏ hơn 1 -> gọi xoá luôn
    if (nextQty < 1) return removeItem(it);

    // optimistic UI
    const prev = [...items];
    setItems(prev.map(x => (x.id === cartId ? { ...x, quantity: nextQty } : x)));
    setRowBusy(m => ({ ...m, [cartId]: true }));

    try {
      const { removed, dto } = await putQuantity(cartId, nextQty);
      if (removed) {
        // server xoá khi qty <= 0
        setItems(prev.filter(x => x.id !== cartId));
      } else if (dto) {
        // đồng bộ qty thực tế từ server (nếu service có chỉnh gì thêm)
        setItems(prev.map(x => (x.id === cartId ? { ...x, quantity: dto.quantity } : x)));
      }
    } catch (e) {
      setErr(e.message || "Cập nhật số lượng thất bại");
      setItems(prev); // revert
    } finally {
      setRowBusy(m => {
        const { [cartId]: _, ...rest } = m;
        return rest;
      });
    }
  };

  const increase = (it) => updateQuantity(it, Number(it.quantity || 0) + 1);
  const decrease = (it) => updateQuantity(it, Number(it.quantity || 0) - 1);

  // DELETE /api/users/{userId}/cart/{cartId}
  const removeItem = async (it) => {
    const cartId = it.id;
    if (!cartId) return setErr("Thiếu cartId để xoá.");

    const token = getToken();
    const userId = getUserId();
    const prev = [...items];

    setItems(prev.filter(x => x.id !== cartId));
    setRowBusy(m => ({ ...m, [cartId]: true }));

    try {
      const res = await fetch(`${API_BASE}/${userId}/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (![200, 202, 204].includes(res.status) && !res.ok) {
        throw new Error(`HTTP ${res.status} ${await readError(res)}`);
      }
    } catch (e) {
      setErr(e.message || "Xoá sản phẩm thất bại");
      setItems(prev); // revert
    } finally {
      setRowBusy(m => {
        const { [cartId]: _, ...rest } = m;
        return rest;
      });
    }
  };

  // Nhập trực tiếp
  const onChangeQtyInput = (it, val) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    setItems(arr => arr.map(x => (x.id === it.id ? { ...x, quantity: n } : x)));
  };
  const onBlurQtyInput = (it) => {
    const n = Math.max(1, Number(it.quantity || 1));
    updateQuantity(it, n);
  };

  return (
    <div className="container my-4">
      <h3>Giỏ hàng của bạn</h3>

      {loading && <div className="alert alert-info">Đang tải giỏ hàng...</div>}
      {err && !loading && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="alert alert-warning">Giỏ hàng đang trống.</div>
      )}

      {items.length > 0 && (
        <>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th style={{ width: 140 }}>Giá</th>
                <th style={{ width: 200 }}>Số lượng</th>
                <th style={{ width: 160 }}>Tổng</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const busy = !!rowBusy[it.id];
                const qty = Number(it.quantity || 0);
                return (
                  <tr key={it.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={it.imageUrl || "https://picsum.photos/seed/noimg/60/60"}
                          alt={it.productName}
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                          className="me-2"
                          onError={(e) => (e.currentTarget.src = "https://picsum.photos/seed/noimg/60/60")}
                        />
                        <span>{it.productName}</span>
                      </div>
                    </td>
                    <td>{formatVND(it.unitPrice)}</td>
                    <td>
                      <div className="input-group input-group-sm" style={{ maxWidth: 200 }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          disabled={busy || qty <= 1}
                          onClick={() => decrease(it)}
                          title="Giảm 1"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          min={1}
                          step={1}
                          value={qty}
                          onChange={(e) => onChangeQtyInput(it, e.target.value)}
                          onBlur={() => onBlurQtyInput(it)}
                          disabled={busy}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          disabled={busy}
                          onClick={() => increase(it)}
                          title="Tăng 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatVND((it.unitPrice || 0) * qty)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => removeItem(it)}
                        disabled={busy}
                        title="Xoá khỏi giỏ"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Tổng số lượng:</strong> {totalQty}</td>
                <td></td>
                <td className="text-end"><strong>Tạm tính:</strong></td>
                <td colSpan={2}><strong>{formatVND(subtotal)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
              ← Tiếp tục mua sắm
            </button>
            <button className="btn btn-success" onClick={() => navigate("/checkout")}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}

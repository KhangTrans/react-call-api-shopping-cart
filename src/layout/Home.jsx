import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">ShopManage Store</h1>
          <p className="hero__subtitle">
            Mua sắm dễ dàng – Giá tốt mỗi ngày. Giao nhanh trong 2h nội thành.
          </p>
          <div className="hero__actions">
            <a href="#features" className="btn btn--primary">Khám phá ngay</a>
            <a href="#categories" className="btn btn--ghost">Danh mục</a>
          </div>
        </div>
      </section>

      {/* USP / Features */}
      <section id="features" className="features container">
        <div className="feature">
          <div className="feature__icon">🚚</div>
          <h3>Giao hàng nhanh</h3>
          <p>Miễn phí nội thành cho đơn từ 499.000đ.</p>
        </div>
        <div className="feature">
          <div className="feature__icon">🔒</div>
          <h3>Thanh toán an toàn</h3>
          <p>Hỗ trợ COD, thẻ nội địa, thẻ quốc tế.</p>
        </div>
        <div className="feature">
          <div className="feature__icon">🎧</div>
          <h3>Hỗ trợ 24/7</h3>
          <p>Tư vấn nhanh chóng qua chat & hotline.</p>
        </div>
        <div className="feature">
          <div className="feature__icon">💯</div>
          <h3>Chính hãng</h3>
          <p>Bảo hành theo tiêu chuẩn nhà sản xuất.</p>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="categories container">
        <h2 className="section-title">Danh mục nổi bật</h2>
        <div className="grid">
          {[
            { title: "Điện thoại", img: "https://via.placeholder.com/500x300?text=Dien+thoai" },
            { title: "Laptop", img: "https://via.placeholder.com/500x300?text=Laptop" },
            { title: "Tai nghe", img: "https://via.placeholder.com/500x300?text=Tai+nghe" },
            { title: "Đồng hồ", img: "https://via.placeholder.com/500x300?text=Dong+ho" },
          ].map((c) => (
            <a key={c.title} href="#" className="card">
              <img src={c.img} alt={c.title} />
              <div className="card__body">
                <h3>{c.title}</h3>
                <p>Xem sản phẩm →</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products (tĩnh) */}
      <section className="products container">
        <h2 className="section-title">Sản phẩm gợi ý</h2>
        <div className="grid">
          {[
            { name: "Tai nghe Bluetooth A1", price: "399.000đ" },
            { name: "Chuột không dây M3", price: "259.000đ" },
            { name: "Bàn phím cơ K87", price: "1.190.000đ" },
            { name: "Sạc nhanh 33W", price: "199.000đ" },
          ].map((p) => (
            <div key={p.name} className="card">
              <img src="https://via.placeholder.com/500x300?text=Product" alt={p.name} />
              <div className="card__body">
                <h3>{p.name}</h3>
                <p className="price">{p.price}</p>
                <button className="btn btn--primary" type="button">Thêm vào giỏ</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="promo">
        <div className="promo__inner container">
          <h2>Flash Sale cuối tuần</h2>
          <p>Giảm đến 50% cho hơn 1.000 sản phẩm – Số lượng có hạn.</p>
          <a className="btn btn--light" href="#">Mua ngay</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials container">
        <h2 className="section-title">Khách hàng nói gì?</h2>
        <div className="grid">
          {[
            { name: "Anh Minh", text: "Giao hàng rất nhanh, sản phẩm đúng mô tả." },
            { name: "Chị Hoa", text: "CSKH hỗ trợ nhiệt tình, đổi trả dễ dàng." },
            { name: "Bạn Lộc", text: "Giá tốt, nhiều mã giảm, trải nghiệm mượt." },
          ].map((t) => (
            <div key={t.name} className="quote card">
              <p>“{t.text}”</p>
              <span>— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter__inner container">
          <h3>Nhận ưu đãi mới mỗi tuần</h3>
          <form
            className="newsletter__form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Đăng ký nhận tin thành công!");
            }}
          >
            <input type="email" placeholder="Nhập email của bạn" required />
            <button className="btn btn--primary" type="submit">Đăng ký</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <h4>ShopManage</h4>
            <p>© {new Date().getFullYear()} — All rights reserved.</p>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Đổi trả</a></li>
            </ul>
          </div>
          <div>
            <h4>Kết nối</h4>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Zalo</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

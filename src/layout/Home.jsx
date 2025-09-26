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
            { title: "Điện thoại", img: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-unselect-gallery-3-202509?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxdFgrSXpWVEhWaW9YTGlWRHFoSHU0OFQ0cUNjaUhCcnU4THJpVHdLYjhlbGd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGk5WmVzZnYxbzBuWDNWODBzL3BwaFk&traceId=1" },
            { title: "Điện thoại", img: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-unselect-gallery-3-202509?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxdFgrSXpWVEhWaW9YTGlWRHFoSHU0OFQ0cUNjaUhCcnU4THJpVHdLYjhlbGd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGk5WmVzZnYxbzBuWDNWODBzL3BwaFk&traceId=1" },
            { title: "Điện thoại", img: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-unselect-gallery-3-202509?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxdFgrSXpWVEhWaW9YTGlWRHFoSHU0OFQ0cUNjaUhCcnU4THJpVHdLYjhlbGd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGk5WmVzZnYxbzBuWDNWODBzL3BwaFk&traceId=1" },
            { title: "Đồng hồ", img: "data:image/webp;base64,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" },
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

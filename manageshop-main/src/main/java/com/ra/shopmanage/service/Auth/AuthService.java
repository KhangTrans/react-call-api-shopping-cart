package com.ra.shopmanage.service.Auth;

import com.ra.shopmanage.model.entity.User;

public interface AuthService {
    String login(String email, String password);
    User register(User user);

    // Thêm method mới
    Long getUserIdByEmail(String email);
}

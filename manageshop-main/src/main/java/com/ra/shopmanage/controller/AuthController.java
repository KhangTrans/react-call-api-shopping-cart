package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.dto.AuthRequest;
import com.ra.shopmanage.model.dto.AuthResponse;
import com.ra.shopmanage.model.entity.User;
import com.ra.shopmanage.service.Auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Gọi AuthService để xử lý đăng nhập và lấy token
        String token = authService.login(request.getEmail(), request.getPassword());

        // Trả về token cùng thông tin người dùng
        Long userId = authService.getUserIdByEmail(request.getEmail());
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .userId(userId)  // Trả về userId thay vì email
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        // Chuyển đổi AuthRequest thành User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        // Đăng ký người dùng mới
        user = authService.register(user);

        // Tạo token cho user mới
        String token = authService.login(user.getEmail(), request.getPassword());

        // Trả về token
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .userId(user.getId())  // Trả về userId từ User entity
                .build());
    }
}

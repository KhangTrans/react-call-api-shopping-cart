package com.ra.shopmanage.service.Auth;

import com.ra.shopmanage.model.entity.User;
import com.ra.shopmanage.repository.UserRepository;
import com.ra.shopmanage.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public String login(String email, String password) {
        // Kiểm tra email trong DB
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials: User not found");
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu (so sánh mật khẩu đã mã hóa)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.error("Password mismatch for email: {}", email);
            throw new RuntimeException("Invalid credentials: Incorrect password");
        }

        // Tạo và trả về JWT token
        return jwtUtils.generate(user.getEmail(), user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet()));
    }

    @Override
    public User register(User user) {
        // Kiểm tra xem email đã tồn tại chưa
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Lưu người dùng vào DB
        return userRepository.save(user);
    }

    // Phương thức lấy userId từ email
    @Override
    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));
        return user.getId();  // Trả về userId
    }
}

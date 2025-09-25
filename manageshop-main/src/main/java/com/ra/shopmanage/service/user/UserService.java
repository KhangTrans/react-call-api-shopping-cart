package com.ra.shopmanage.service.user;

import com.ra.shopmanage.model.entity.User;

import java.util.List;

public interface UserService {
    User register(User user);
    List<User> getAllUsers();
    User updateStatus(Long id, Boolean status);
}

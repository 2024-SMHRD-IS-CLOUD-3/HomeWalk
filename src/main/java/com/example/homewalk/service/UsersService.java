package com.example.homewalk.service;

import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.util.JwtUtil; // JWT 유틸리티 클래스
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtUtil jwtUtil; // JWT 유틸리티 클래스 주입

    public Users registerUser(Users users) {
        if (usersRepository.existsByUsername(users.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (usersRepository.existsByEmail(users.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        return usersRepository.save(users);
    }

    public Users authenticateUser(String username, String password) {
        Users user = usersRepository.findByUsernameAndPassword(username, password);
        if (user != null && user.getIsActive()) {
            return user;
        }
        return null;
    }

    public boolean existsByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }

    public String generateToken(Users user) {
        return jwtUtil.generateToken(user.getUsername());
    }
    
    public Users getUserById(Long userId) {
        return usersRepository.findByUserId(userId);
    }
}

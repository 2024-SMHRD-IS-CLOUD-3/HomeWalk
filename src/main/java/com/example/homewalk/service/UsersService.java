package com.example.homewalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.UsersRepository;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

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
}

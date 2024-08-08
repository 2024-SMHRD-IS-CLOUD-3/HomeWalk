package com.example.homewalk.controller;

import com.example.homewalk.entity.Users;
import com.example.homewalk.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Users users) {
        try {
            Users registeredUser = usersService.registerUser(users);
            return ResponseEntity.ok(registeredUser.getUserId()); // userId 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Users users) {
        Users authenticatedUser = usersService.authenticateUser(users.getUsername(), users.getPassword());
        if (authenticatedUser != null) {
            String token = usersService.generateToken(authenticatedUser); // 토큰 생성 메소드 호출
            return ResponseEntity.ok(new AuthResponse(authenticatedUser.getUserId(), token)); // userId와 jwt 반환
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password or user is inactive");
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = usersService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = usersService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
}

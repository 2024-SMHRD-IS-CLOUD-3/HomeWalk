package com.example.homewalk.entity;

import javax.persistence.*;

import lombok.Data;

import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String imageUrl;

    @ElementCollection
    private List<String> comments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    // Getters and Setters
    public List<String> getComments() {
        return comments;
    }
    
    private int likesCount = 0;

    public void setComments(List<String> comments) {
        this.comments = comments;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}

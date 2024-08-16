package com.example.homewalk.repository;

import com.example.homewalk.entity.Like;
import com.example.homewalk.entity.Post;
import com.example.homewalk.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Like findByUserAndPost(Users user, Post post);
    List<Like> findByUser(Users user);
    int countByPostId(Long postId);
}

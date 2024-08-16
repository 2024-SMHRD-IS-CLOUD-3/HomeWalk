package com.example.homewalk.repository;

import com.example.homewalk.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long id);

   List<Post> findByUser_UserId(Long userId);
}

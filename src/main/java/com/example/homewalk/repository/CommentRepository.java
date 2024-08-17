package com.example.homewalk.repository;

import java.util.List;  // 이 라인을 추가하세요
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.Comment;
import com.example.homewalk.entity.Post;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);  // org.hibernate.mapping.List가 아닌 java.util.List를 사용합니다.
}

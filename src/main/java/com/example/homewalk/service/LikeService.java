package com.example.homewalk.service;

import com.example.homewalk.entity.Like;
import com.example.homewalk.entity.Post;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.LikeRepository;
import com.example.homewalk.repository.PostRepository;
import com.example.homewalk.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

   @Autowired
   private LikeRepository likeRepository;

   @Autowired
   private PostRepository postRepository;

   @Autowired
   private UsersRepository userRepository;

   public boolean toggleLike(Long userId, Long postId) {
      Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
      Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

      // 사용자가 이미 이 게시물에 좋아요를 눌렀는지 확인
      Like existingLike = likeRepository.findByUserAndPost(user, post);
      if (existingLike != null) {
         // 이미 좋아요를 누른 상태라면 좋아요를 취소
         likeRepository.delete(existingLike);
         return false; // 좋아요 취소됨
      } else {
         // 좋아요를 추가
         Like like = new Like();
         like.setUser(user);
         like.setPost(post);
         likeRepository.save(like);
         return true; // 좋아요 추가됨
      }
   }

   public List<Like> getUserLikes(Long userId) {
      Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
      return likeRepository.findByUser(user);
   }

   public int getLikeCount(Long postId) {
      return likeRepository.countByPostId(postId);
   }
}

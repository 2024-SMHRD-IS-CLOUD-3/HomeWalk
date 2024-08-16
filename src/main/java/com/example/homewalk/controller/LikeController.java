package com.example.homewalk.controller;

import com.example.homewalk.dto.LikeToggleRequest;
import com.example.homewalk.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public boolean toggleLike(@RequestBody LikeToggleRequest request) {
        Long userId = request.getUserId();
        Long postId = request.getPostId();
        return likeService.toggleLike(userId, postId);
    }

    @GetMapping("/user/{userId}")
    public List<Long> getUserLikes(@PathVariable Long userId) {
        return likeService.getUserLikes(userId)
                .stream()
                .map(like -> like.getPost().getId())
                .collect(Collectors.toList());
    }

    @GetMapping("/count/{postId}")
    public int getLikeCount(@PathVariable Long postId) {
        return likeService.getLikeCount(postId);
    }
}

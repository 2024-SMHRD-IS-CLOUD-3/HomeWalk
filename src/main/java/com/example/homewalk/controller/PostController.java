package com.example.homewalk.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.homewalk.dto.CommentRequestDto;
import com.example.homewalk.entity.Post;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.PostRepository;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping("/")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping("/{userId}")
    public Post createPost(@PathVariable Long userId,
                           @RequestParam String title,
                           @RequestParam String content,
                           @RequestParam(required = false) MultipartFile file) throws IOException {
        return postService.createPost(userId, title, content, file);
    }

    @GetMapping("/{userId}")
    public List<Post> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @PostMapping("/{postId}/comment")
    public Post addComment(@PathVariable Long postId, 
                           @RequestParam Long userId,  // @RequestParam으로 userId를 받음
                           @RequestParam String content) {  // @RequestParam으로 content를 받음
        return postService.addComment(postId, userId, content);
    }
}

package com.example.homewalk.service;

import com.example.homewalk.entity.Post;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.PostRepository;
import com.example.homewalk.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsersRepository userRepository;

    // 이미지 파일을 저장할 경로를 설정합니다.
    private final Path root = Paths.get("src/main/resources/static/assets/post");

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Long userId, String title, String content, MultipartFile file) throws IOException {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 파일 저장
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            imageUrl = "/assets/post/" + filename; // 이미지 URL 경로 설정
        }

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setUser(user);

        return postRepository.save(post);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUser_UserId(userId);
    }

    public Post addComment(Long postId, String comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.getComments().add(comment);
        return postRepository.save(post);
    }
}

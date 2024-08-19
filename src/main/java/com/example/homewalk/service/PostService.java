package com.example.homewalk.service;

import com.example.homewalk.entity.Comment;
import com.example.homewalk.entity.Post;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.CommentRepository;
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

    @Autowired
    private CommentRepository commentRepository;

    private final Path root = Paths.get("src/main/resources/static/assets/post");

    public PostService() throws IOException {
        if (Files.notExists(root)) {
            Files.createDirectories(root);
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Long userId, String title, String content, MultipartFile file) throws IOException {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            String filename = file.getOriginalFilename();
            Path filePath = this.root.resolve(filename);

            // 파일이 이미 존재하는지 확인
            if (Files.notExists(filePath)) {
                Files.copy(file.getInputStream(), filePath);
                imageUrl = "/assets/post/" + filename;
            } else {
                // 파일이 이미 존재하면 해당 파일의 URL만 설정
                imageUrl = "/assets/post/" + filename;
            }
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

    public Post addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        commentRepository.save(comment);

        return post;
    }
}

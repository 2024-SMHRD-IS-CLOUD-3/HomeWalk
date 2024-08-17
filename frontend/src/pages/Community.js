import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, CssBaseline, Toolbar, Grid,
  Card, CardMedia, CardContent, CardActions, IconButton, Avatar,
  TextField, Button, Collapse, List, ListItem, Badge
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '../api/community';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useAuth } from '../context/AuthContext';
import { toggleLike, getLikeCount, getLikedPosts } from '../api/like';
import { useDrawer } from '../context/DrawerContext';
import axios from 'axios';

const Community = () => {
  const { open, toggleDrawer } = useDrawer();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { userObject } = useAuth();

  const userId = userObject?.userId;

  const loadPosts = useCallback(async () => {
    try {
      if (!userId) {
        console.error("User is not logged in");
        return;
      }

      const postsData = await fetchPosts();

      const postsWithLikes = await Promise.all(postsData.map(async (post) => {
        const likeCount = await getLikeCount(post.id);
        return { ...post, likesCount: likeCount };
      }));

      setPosts(postsWithLikes);
      setFilteredPosts(postsWithLikes);

      const likedPostIds = await getLikedPosts(userId);
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, [userId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post =>
      post.user.username.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleLike = async (postId) => {
    try {
      if (!userId) return;

      const alreadyLiked = likedPosts.includes(postId);
      await toggleLike(userId, postId);

      const likeCount = await getLikeCount(postId);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likesCount: likeCount } : post
      ));
      setFilteredPosts(filteredPosts.map(post =>
        post.id === postId ? { ...post, likesCount: likeCount } : post
      ));

      if (alreadyLiked) {
        setLikedPosts(likedPosts.filter(id => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = async (postId, commentContent) => {
    try {
      // 서버로 userId와 commentContent를 전달하여 댓글 추가
      const updatedPost = await axios.post(`/api/posts/${postId}/comment`, null, {
        params: {
          userId: userId,  // userId를 params로 전달
          content: commentContent  // 댓글 내용을 content로 전달
        }
      });

      // 상태 업데이트 - 댓글이 추가된 게시물을 최신화
      setPosts(posts.map(post =>
        post.id === postId ? updatedPost.data : post  // 서버에서 반환된 데이터로 게시물 업데이트
      ));
      setFilteredPosts(filteredPosts.map(post =>
        post.id === postId ? updatedPost.data : post  // 필터된 게시물도 업데이트
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mr: 2 }}>
                게시판
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/createpost')}
              >
                작성하기
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()} // Enter 키를 눌러도 실시간 검색이 동작하므로 추가 작업이 필요하지 않습니다.
                size="small"
                sx={{ mr: 2 }}
              />
              {/* handleSearch 함수가 필요 없으므로 아래 버튼은 생략할 수 있습니다 */}
            </Box>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'inherit', height: 'calc(100vh - 200px)', overflow: 'auto', padding: 0 }}>
            <Grid container spacing={3} sx={{ margin: 0 }}>
              {filteredPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      padding: 0,
                      backgroundColor: 'inherit'
                    }}
                  >
                    <Card sx={{ width: '100%', backgroundColor: 'white', boxShadow: 'none', borderRadius: 1, border: '1px solid', borderColor: (theme) => theme.palette.divider }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: (theme) => theme.palette.divider }}>
                        <Avatar sx={{ mr: 2 }}
                          src={post.userProfileImageUrl}
                        >{post.user.username[0].toUpperCase()}</Avatar>
                        <Typography variant="subtitle1">{post.user.username}</Typography>
                      </CardContent>
                      {post.imageUrl && (
                        <CardMedia
                          component="img"
                          height="300"
                          image={post.imageUrl}
                          alt={`Post by ${post.user.username}`}
                        />
                      )}
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {post.likesCount || 0} likes
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          <strong>{post.user.username}</strong> {post.content}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton
                          aria-label="add to favorites"
                          onClick={() => handleLike(post.id)}
                          color={likedPosts.includes(post.id) ? 'error' : 'default'}
                        >
                          <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="comment" onClick={() => toggleComments(post.id)}>
                          <Badge badgeContent={post.comments.length} color="primary">
                            <CommentIcon />
                          </Badge>
                        </IconButton>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                      </CardActions>

                      <Collapse in={expandedComments[post.id]} timeout="auto" unmountOnExit>
                        <CardContent>
                          {post.comments.map((comment, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, mr: 1 }}
                                src={comment.user.avatarCustomization}>{comment.user.username[0].toUpperCase()}</Avatar>
                              <Typography variant="body2"><strong>{comment.user.username}</strong>: {comment.content}</Typography>
                            </Box>
                          ))}
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="댓글을 입력하세요"
                            size="small"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                        </CardContent>
                      </Collapse>
                    </Card>
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </Container>
      </Box>
    </Box>
  );
};

export default Community;

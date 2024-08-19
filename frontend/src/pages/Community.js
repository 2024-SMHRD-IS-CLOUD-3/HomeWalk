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
import { usePostContext } from '../context/PostContext';
import axios from 'axios';

const Community = () => {
  const { open, toggleDrawer } = useDrawer();
  const { posts, setPosts } = usePostContext(); // PostContext에서 posts와 setPosts 가져오기
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
        return { ...post, likesCount: likeCount, comments: post.comments || [] }; // comments를 빈 배열로 초기화
      }));

      const sortedPosts = postsWithLikes.reverse(); // 최신 게시물을 맨 앞으로 정렬

      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);

      const likedPostIds = await getLikedPosts(userId);
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, [userId, setPosts]);

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
      const updatedPost = await axios.post(`/api/posts/${postId}/comment`, null, {
        params: {
          userId: userId,
          content: commentContent
        }
      });

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, comments: updatedPost.data.comments } : post
      ));
      setFilteredPosts(filteredPosts.map(post =>
        post.id === postId ? { ...post, comments: updatedPost.data.comments } : post
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
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                size="small"
                sx={{ mr: 2 }}
              />
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
                          src={post.user.avatarCustomization}
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
                          <Badge badgeContent={(post.comments || []).length} color="primary">
                            <CommentIcon />
                          </Badge>
                        </IconButton>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                      </CardActions>

                      <Collapse in={expandedComments[post.id]} timeout="auto" unmountOnExit>
                        <CardContent>
                          {(post.comments || []).map((comment, index) => (  // comments가 null 또는 undefined일 경우 빈 배열로 대체
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

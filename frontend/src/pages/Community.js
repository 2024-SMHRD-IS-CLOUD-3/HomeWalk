import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, CssBaseline, Toolbar, Grid,
  Card, CardMedia, CardContent, CardActions, IconButton, Avatar,
  TextField, Button, Collapse, List, ListItem
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, addComment } from '../api/community';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useAuth } from '../context/AuthContext';
import { toggleLike, getLikeCount } from '../api/like';

import { useDrawer } from '../context/DrawerContext'; // 드로어 상태 가져오기

const Community = () => {
  const { open, toggleDrawer } = useDrawer();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { userObject } = useAuth();

  const useravartar = userObject?.avatarCustomization;

  const loadPosts = async () => {
    try {
      const postsData = await fetchPosts(); // 서버로부터 게시글 데이터를 가져옴
      setPosts(postsData);
      setFilteredPosts(postsData);

      // 좋아요 상태를 초기화
      const likedPostIds = [];
      for (const post of postsData) {
        const likeCount = await getLikeCount(post.id); // 좋아요 수를 가져옴
        post.likesCount = likeCount;
        const userLiked = likeCount > 0 && likedPosts.includes(userObject.userId); // 현재 사용자가 좋아요를 눌렀는지 확인
        if (userLiked) {
          likedPostIds.push(post.id);
        }
      }
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  useEffect(() => {
    loadPosts(); // 컴포넌트가 마운트될 때 데이터를 불러옵니다.
  }, []);

  const handleLike = async (postId) => {
    try {
      const alreadyLiked = likedPosts.includes(postId); // 이미 좋아요를 눌렀는지 확인
      await toggleLike(userObject.userId, postId); // 좋아요 상태를 토글

      // 좋아요 상태 및 수 업데이트
      const likeCount = await getLikeCount(postId);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likesCount: likeCount } : post
      ));
      setFilteredPosts(filteredPosts.map(post =>
        post.id === postId ? { ...post, likesCount: likeCount } : post
      ));

      if (alreadyLiked) {
        setLikedPosts(likedPosts.filter(id => id !== postId)); // 좋아요 취소
      } else {
        setLikedPosts([...likedPosts, postId]); // 좋아요 추가
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

  const handleAddComment = async (postId, comment) => {
    try {
      const updatedPost = await addComment(postId, comment);
      setPosts(posts.map(post =>
        post.id === postId ? updatedPost : post
      ));
      setFilteredPosts(filteredPosts.map(post =>
        post.id === postId ? updatedPost : post
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    setFilteredPosts(posts.filter(post =>
      post.user.username.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    ));
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
                size="small"
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
              >
                검색
              </Button>
            </Box>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper', height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {filteredPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <ListItem alignItems="flex-start">
                    <Card sx={{ width: '100%' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}
                          src={useravartar}
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
                          <CommentIcon />
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
                                src={useravartar}>{comment[0].toUpperCase()}</Avatar>
                              <Typography variant="body2"><strong>{comment}</strong></Typography>
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

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CssBaseline, Toolbar, Grid, Paper,
  Card, CardMedia, CardContent, CardActions, IconButton, Avatar,
  TextField, Button, Collapse
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const Community = () => {
  const [open, setOpen] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // 더미 데이터 생성 함수
  const generateDummyPosts = (start, end) => {
    return Array.from({ length: end - start }, (_, index) => ({
      id: start + index,
      username: `user${start + index}`,
      imageUrl: `https://picsum.photos/500/500?random=${start + index}`,
      likes: Math.floor(Math.random() * 1000),
      caption: `This is post number ${start + index}`,
      comments: []
    }));
  };

  // 초기 포스트 로드
  useEffect(() => {
    setPosts(generateDummyPosts(0, 6));
  }, []);

  // 추가 포스트 로드
  const fetchMoreData = () => {
    if (posts.length >= 30) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setPosts([...posts, ...generateDummyPosts(posts.length, posts.length + 3)]);
    }, 1500);
  };

  // 좋아요 기능
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // 댓글 토글 기능
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // 댓글 추가 기능
  const addComment = (postId, comment) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  // 글 작성 페이지로 이동
  const goToCreatePost = () => {
    navigate('/createpost');  // 실제 경로에 맞게 수정해주세요
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
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              게시판
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={goToCreatePost}
            >
              작성하기
            </Button>
          </Box>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <Grid container spacing={4}>
              {posts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>{post.username[0].toUpperCase()}</Avatar>
                      <Typography variant="subtitle1">{post.username}</Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="500"
                      image={post.imageUrl}
                      alt={`Post by ${post.username}`}
                    />
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites" onClick={() => handleLike(post.id)}>
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="comment" onClick={() => toggleComments(post.id)}>
                        <CommentIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {post.likes} likes
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        <strong>{post.username}</strong> {post.caption}
                      </Typography>
                    </CardContent>
                    <Collapse in={expandedComments[post.id]} timeout="auto" unmountOnExit>
                      <CardContent>
                        {post.comments.map((comment, index) => (
                          <Typography key={index} variant="body2">{comment}</Typography>
                        ))}
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="댓글을 입력하세요"
                          size="small"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </Container>
      </Box>
    </Box>
  );
};

export default Community;
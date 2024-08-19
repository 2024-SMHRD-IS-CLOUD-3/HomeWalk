import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography, Button, TextField, Grid, Paper, List, ListItem, ListItemText, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // AccountCircleIcon 추가
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useDrawer } from '../context/DrawerContext';
import { useAuth } from '../context/AuthContext';
import { getFamilyData } from '../api/family';

import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const StyledBadge = styled(Badge)(({ theme, status }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: status === 'JOIN' ? '#44b700' : '#808080', // 초록색 (JOIN) 또는 회색 (LEAVE)
        color: status === 'JOIN' ? '#44b700' : '#808080',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));

const ChatPage = () => {
    const { open, toggleDrawer } = useDrawer();
    const { userObject } = useAuth();
    const [familyId, setFamilyId] = useState(null); // 가족 ID 상태 추가
    const [familyName, setFamilyName] = useState(''); // 가족명 상태 추가
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]); // 가족 구성원 상태 추가
    const stompClient = useRef(null);
    const messageEndRef = useRef(null);
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    useEffect(() => {
        async function fetchFamilyInfo() {
            try {
                const familyData = await getFamilyData(userObject.userId);
                setFamilyId(familyData.familyId); // 가족 ID 설정
                setFamilyName(familyData.familyName); // 가족명 설정
                // 가족 구성원 설정
                setFamilyMembers(familyData.memberDetails.map(member => ({
                    username: member.username,
                    avatarCustomization: member.avatarCustomization,
                    color: 'primary', // 기본 색상 설정
                    status: 'LEAVE', // 기본 상태는 LEAVE로 설정
                    avatarError: false,
                })));
            } catch (error) {
                console.error("Failed to fetch family info", error);
            }
        }

        fetchFamilyInfo();
    }, [userObject]);

    const onConnected = useCallback(() => {
        if (familyId) {
            stompClient.current.subscribe(`/topic/family/${familyId}`, onMessageReceived);
            stompClient.current.send(
                `/app/chat.addUser.${familyId}`,
                {},
                JSON.stringify({ sender: userObject.username, type: 'JOIN' })
            );
        }
    }, [familyId, userObject]);

    useEffect(() => {
        if (familyId) {
            const socket = new SockJS('http://192.168.219.55:8085/ws');
            stompClient.current = Stomp.over(socket);
            stompClient.current.connect({}, onConnected, onError);
        }

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [onConnected, familyId]);

    const onError = (error) => {
        console.error('WebSocket error: ', error);
    };

    const onMessageReceived = (message) => {
        const messageContent = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, messageContent]);

        // 서버에서 받은 사용자 상태 맵을 이용해 가족 구성원의 상태 업데이트
        if (messageContent.userStatusMap) {
            // 서버에서 전체 상태를 전달받았을 때, 이를 가족 구성원 상태에 반영
            setFamilyMembers((prevMembers) =>
                prevMembers.map((member) =>
                    ({
                        ...member,
                        status: messageContent.userStatusMap[member.username] || 'LEAVE',
                    })
                )
            );
        } else if (messageContent.type === 'JOIN' || messageContent.type === 'LEAVE') {
            // 개별 JOIN 또는 LEAVE 메시지를 받았을 때, 해당 사용자 상태만 업데이트
            setFamilyMembers((prevMembers) =>
                prevMembers.map((member) =>
                    member.username === messageContent.sender
                        ? { ...member, status: messageContent.type }
                        : member
                )
            );
        }
    };

    const handleSendMessage = () => {
        if (stompClient.current && message.trim() !== '') {
            const chatMessage = {
                sender: userObject.username,
                content: message,
                type: 'CHAT',
            };
            stompClient.current.send(`/app/chat.sendMessage.${familyId}`, {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleLeaveChat = () => {
        if (stompClient.current) {
            const chatMessage = {
                sender: userObject.username,
                type: 'LEAVE',
            };
            stompClient.current.send(`/app/chat.sendMessage.${familyId}`, {}, JSON.stringify(chatMessage));
        }
        navigate('/dashboard'); // 메인 페이지로 이동
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleAvatarError = (index) => {
        setFamilyMembers(prevMembers => {
            const newMembers = [...prevMembers];
            newMembers[index].avatarError = true; // 이미지 로드 에러 상태 업데이트
            return newMembers;
        });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
            <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom>
                                    {familyName} 가족 채팅방
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12}>
                                        <Paper sx={{ height: '400px', overflowY: 'auto', p: 2 }}>
                                            <List>
                                                {messages.map((msg, index) => (
                                                    <ListItem key={index} alignItems="flex-start">
                                                        <ListItemText
                                                            primary={`${msg.sender}`}
                                                            secondary={msg.content}
                                                        />
                                                    </ListItem>
                                                ))}
                                                <div ref={messageEndRef} style={{ height: 0 }} />
                                            </List>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <TextField
                                            fullWidth
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            variant="outlined"
                                            placeholder="메시지를 입력하세요..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleSendMessage}
                                            sx={{ height: '100%' }}
                                        >
                                            전송
                                        </Button>
                                    </Grid>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        onClick={handleLeaveChat}
                                        sx={{ mt: 2 }}
                                    >
                                        나가기
                                    </Button>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    가족 구성원
                                </Typography>
                                <List>
                                    {familyMembers && familyMembers.map((member, index) => (
                                        <ListItem key={index}>
                                            <StyledBadge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant="dot"
                                                status={member.status} // JOIN 또는 LEAVE에 따라 뱃지 색상 변경
                                            >
                                                {!member.avatarError && member.avatarCustomization ? (
                                                    <img
                                                        src={member.avatarCustomization}
                                                        alt="User Avatar"
                                                        onError={() => handleAvatarError(index)}
                                                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                                                    />
                                                ) : (
                                                    <Avatar sx={{ bgcolor: `${member.color}.dark`, width: 40, height: 40 }}>
                                                        <AccountCircleIcon sx={{ fontSize: 30 }} />
                                                    </Avatar>
                                                )}
                                            </StyledBadge>
                                            <ListItemText primary={member.username} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ChatPage;

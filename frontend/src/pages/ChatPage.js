import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography, Button, TextField, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 메인 페이지로 이동하기 위한 useNavigate 훅
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useDrawer } from '../context/DrawerContext';
import { useAuth } from '../context/AuthContext';
import { getFamilyData } from '../api/family'; // 가족 정보를 가져오는 API 호출

import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const { open, toggleDrawer } = useDrawer();
    const { userObject } = useAuth();
    const [familyId, setFamilyId] = useState(null); // 가족 ID 상태 추가
    const [familyName, setFamilyName] = useState(''); // 가족명 상태 추가
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const stompClient = useRef(null);
    const messageEndRef = useRef(null);
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    // 1단계: 가족 정보를 불러오는 API 호출
    useEffect(() => {
        async function fetchFamilyInfo() {
            try {
                const familyData = await getFamilyData(userObject.userId);
                setFamilyId(familyData.familyId); // 가족 ID 설정
                setFamilyName(familyData.familyName); // 가족명 설정
            } catch (error) {
                console.error("Failed to fetch family info", error);
            }
        }

        fetchFamilyInfo();
    }, [userObject]);

    // 2단계: WebSocket 연결 및 가족별 채팅방 설정
    const onConnected = useCallback(() => {
        if (familyId) {
            // 가족 ID를 이용하여 가족별 채팅방에 구독
            stompClient.current.subscribe(`/topic/family/${familyId}`, onMessageReceived);
            stompClient.current.send(
                `/app/chat.addUser.${familyId}`, // 가족별 고유 채팅방 경로 사용
                {},
                JSON.stringify({ sender: userObject.username, type: 'JOIN' })
            );
        }
    }, [familyId, userObject]);

    useEffect(() => {
        if (familyId) {
            const socket = new SockJS('http://localhost:8085/ws'); // 백엔드의 WebSocket 엔드포인트와 연결
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
                        <Grid item xs={12} md={10}>
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
                                                            primary={`${msg.sender} (${msg.type === 'JOIN' ? 'joined' : msg.timestamp})`}
                                                            secondary={msg.content}
                                                        />
                                                    </ListItem>
                                                ))}
                                                {/* 이 div가 정확히 리스트의 마지막에 위치해야 합니다 */}
                                                <div ref={messageEndRef} style={{ height: 0 }} />
                                            </List>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <TextField
                                            fullWidth
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={handleKeyPress} // Enter 키 이벤트 추가
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
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ChatPage;

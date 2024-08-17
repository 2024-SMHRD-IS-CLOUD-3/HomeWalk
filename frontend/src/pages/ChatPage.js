import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography, Button, TextField, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useDrawer } from '../context/DrawerContext';
import { useAuth } from '../context/AuthContext';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatPage = () => {
    const { open, toggleDrawer } = useDrawer();
    const { userObject } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const stompClient = useRef(null);

    const onConnected = useCallback(() => {
        stompClient.current.subscribe('/topic/public', onMessageReceived);
        stompClient.current.send(
            "/app/chat.addUser",
            {},
            JSON.stringify({ sender: userObject.username, type: 'JOIN' })
        );
    }, [userObject]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8085/ws'); // 백엔드의 WebSocket 엔드포인트와 연결
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [onConnected]);

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
            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');
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
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            채팅
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
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <TextField
                                    fullWidth
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
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
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default ChatPage;

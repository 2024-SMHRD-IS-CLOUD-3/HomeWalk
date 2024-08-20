export const handleKakaoLogin = () => {
    if (!window.Kakao) {
        console.error('Kakao SDK not loaded');
        return;
    }

    // 로그아웃 처리 후 새 로그인 요청
    window.Kakao.Auth.logout(() => {
        console.log('Kakao logout successful, proceeding with login');

        // 카카오 로그인 요청
        window.Kakao.Auth.authorize({
            redirectUri: 'http://192.168.219.55:3005/oauth/callback/kakao'  // 콜백 URL 설정
        });
    });
};

package com.example.homewalk.controller;

import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth")
public class OAuthController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UsersService usersService;

    private final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
    private final String CLIENT_ID = "05643ecda9086c42b45ad6285a412284"; // 카카오에서 발급받은 REST API 키
    private final String REDIRECT_URI = "http://localhost:3005/oauth/callback/kakao"; // 콜백 URL

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");

            // 1. 인증 코드로 액세스 토큰 요청
            String accessToken = null;
            RestTemplate restTemplate = new RestTemplate();

            if (code != null) {
                MultiValueMap<String, String> tokenParams = new LinkedMultiValueMap<>();
                tokenParams.add("grant_type", "authorization_code");
                tokenParams.add("client_id", CLIENT_ID);
                tokenParams.add("redirect_uri", REDIRECT_URI);
                tokenParams.add("code", code);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenParams, headers);

                Map<String, Object> tokenResponse = restTemplate.postForObject(KAKAO_TOKEN_URL, tokenRequest, Map.class);
                accessToken = (String) tokenResponse.get("access_token");
            }

            if (accessToken != null) {
                // 2. 액세스 토큰으로 사용자 정보 요청
                HttpHeaders userInfoHeaders = new HttpHeaders();
                userInfoHeaders.setBearerAuth(accessToken);
                HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

                Map<String, Object> userInfoResponse = restTemplate.postForObject(KAKAO_USER_INFO_URL, userInfoRequest, Map.class);
                Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.get("kakao_account");
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

                String kakaoId = String.valueOf(userInfoResponse.get("id"));
                String nickname = (String) profile.get("nickname");
                String profileImage = (String) profile.get("profile_image_url");
                
                // 3. 기존 사용자 확인
                Users user = usersRepository.findByKakaoId(kakaoId).orElse(null);

                if (user == null) {
                    // 기존 사용자가 없으면 새로운 사용자 생성
                    user = new Users();
                    user.setKakaoId(kakaoId);
                    user.setUsername(nickname);
                    user.setAvatarCustomization(profileImage);

                    // 새로운 이메일 생성
                    long userCount = usersRepository.count();
                    String generatedEmail = "kakao" + (userCount + 1) + "@daum.net";
                    user.setEmail(generatedEmail);

                    // 고정된 패스워드 설정
                    user.setPassword("kakao1234");

                    usersRepository.save(user);
                } else {
                    // 기존 사용자가 있을 경우, 로그인 상태 업데이트
                    user.setIsActive(true);
                }

                usersRepository.save(user);

                // 4. 토큰 생성 및 AuthResponse 반환
                String token = usersService.generateToken(user);

                AuthResponse authResponse = new AuthResponse(
                    user.getUserId(),
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatarCustomization(),
                    user.getDailyStepGoal(),
                    user.getWeeklyStepGoal(),
                    user.getMonthlyStepGoal(),
                    user.getIsActive()
                );

                return ResponseEntity.ok(authResponse);
            } else {
                // 액세스 토큰을 얻지 못한 경우 JSON 형식으로 에러 메시지 반환
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to obtain access token");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

        } catch (Exception e) {
            e.printStackTrace();

            // 예외 발생 시 JSON 형식으로 에러 메시지 반환
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to login with Kakao");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}

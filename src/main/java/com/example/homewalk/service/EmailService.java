package com.example.homewalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Reset Your Password");

            // HTML 형식의 이메일 내용
            String htmlMsg = "<p>To reset your password, click the link below:</p>" +
                             "<a href=\"" + resetLink + "\">Reset Password</a>";

            helper.setText(htmlMsg, true); // 두 번째 파라미터를 true로 설정하여 HTML로 처리

            helper.setFrom("no-reply@yourdomain.com");

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}

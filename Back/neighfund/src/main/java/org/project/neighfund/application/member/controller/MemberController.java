package org.project.neighfund.application.member.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.member.dto.*;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.second.member.dto.LoginRequest;
import org.project.second.member.dto.LoginResponse;
import org.project.second.member.dto.LogoutResponse;
import org.project.neighfund.application.member.service.CustomUserDetailsService;
import org.project.neighfund.application.member.service.MemberService;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;  // JWT 생성 및 검증 유틸
    private final MemberRepository memberRepository;
    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest signupRequest) {
        SignupResponse u = memberService.insert(signupRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입 성공");
        response.put("email", u.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());

        try{
            Authentication authentication = authenticationManager.authenticate(token);

            Member member = memberRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

            // ✅ 인증 정보 SecurityContext에 저장
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            String accessToken = jwtProvider.generateAccessToken(authentication);
            String refreshToken = jwtProvider.generateRefreshToken(authentication);
            jwtProvider.setTokensInCookies(response, accessToken, refreshToken);

            return ResponseEntity.ok(new LoginResponse("로그인 성공", authentication.getName()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(".이메일 또는 비밀번호가 유효하지 않습니다.", loginRequest.getEmail()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtProvider.getRefreshTokenFromCookies(request);
        if (refreshToken != null && jwtProvider.validateRefreshToken(refreshToken)) {
            String username = jwtProvider.getUsernameFromToken(refreshToken, false);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            String newAccessToken = jwtProvider.generateAccessToken(authentication);
            jwtProvider.setTokensInCookies(response, newAccessToken, refreshToken);
            return ResponseEntity.ok(Map.of("message", "Access Token이 재발행 되었습니다."));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Refresh Token이 유효하지 않습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(HttpServletResponse response,
                                                                               @AuthenticationPrincipal CustomUserDetails userDatails) {
        // DB에서 리프레쉬 토큰 null 처리
        Member member = userDatails.getMember();
        member.setRefreshToken(null);
        memberRepository.save(member);

        // 쿠키 삭제
        jwtProvider.clearTokensInCookies(response);
        return ResponseEntity.ok(new LogoutResponse("로그아웃 성공"));
    }

    @DeleteMapping("deletion")
    public ResponseEntity<String> deleteMember(@AuthenticationPrincipal CustomUserDetails userDetails, HttpServletResponse response) {
        Member member = userDetails.getMember();
        memberService.deleteMember(member);
        jwtProvider.clearTokensInCookies(response);
        return ResponseEntity.ok("계정이 정상적으로 삭제되었습니다.");
    }

    @PostMapping("/mypage/upload")
    public ResponseEntity<String> uploadProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("file") MultipartFile file) {
        try {
            memberService.uploadProfileImage(userDetails.getMember(), file);
            return ResponseEntity.ok("프로필 이미지가 업로드 되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/mypage/editProfile")
    public ResponseEntity<?> editProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @RequestBody EditProfileRequest editProfileRequest, HttpServletResponse response) {
        try {
            Member member = userDetails.getMember();
            Member updatedMember = memberService.editProfile(member, editProfileRequest);

            CustomUserDetails updatedUserDetails = new CustomUserDetails(updatedMember);

            // 토큰 재 생성을 위해 Authentication 재설정
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    updatedUserDetails, null, updatedUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            jwtProvider.clearTokensInCookies(response);
            String newAccessToken = jwtProvider.generateAccessToken(authentication);
            String newRefreshToken = jwtProvider.generateRefreshToken(authentication);
            jwtProvider.setTokensInCookies(response, newAccessToken, newRefreshToken);

            return ResponseEntity.ok(new EditProfileResponse("프로필 변경 완료", updatedMember.getUsername(), updatedMember.getEmail(), updatedMember.getPhone(), updatedMember.getAddress(), updatedMember.getDongName()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("mypage/checkPwd")
    public ResponseEntity<String> checkPassword(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                @RequestBody CheckPasswordRequest pwdRequest) {
        Member m = userDetails.getMember();
        String password = pwdRequest.getPassword();
        boolean result = memberService.checkPassword(m, password);

        if (result) {
            return ResponseEntity.ok("비밀번호 일치");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다");
        }
    }

    @GetMapping("/roleinfo")
    public ResponseEntity<RoleInfoResponse> getRoleInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        RoleInfoResponse response = memberService.getRoleInfo(m);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type")
    public ResponseEntity<LoginTypeResponse> getTypeInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        LoginTypeResponse type = memberService.getTypeInfo(m);
        return ResponseEntity.ok(type);
    }

}

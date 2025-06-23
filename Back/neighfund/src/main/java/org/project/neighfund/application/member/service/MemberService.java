package org.project.neighfund.application.member.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.member.dto.*;
import org.project.neighfund.domain.Role.Role;
import org.project.neighfund.domain.Role.RoleRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.enums.RoleName;
import org.project.neighfund.global.image.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final ImageService imageService;

    public SignupResponse insert(@Valid SignupRequest signupRequest) {
        if (memberRepository.existsByEmail(signupRequest.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }

        if (memberRepository.existsByUsername(signupRequest.getUsername())){
            throw new IllegalArgumentException("이미 존재하는 유저네임 입니다.");
        }

        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("입력하신 비밀번호가 서로 일치하지 않습니다.");
        }

        String enPass = passwordEncoder.encode(signupRequest.getPassword());

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new IllegalArgumentException("기본 USER 역할이 DB에 없습니다."));

        Member member = Member.builder()
                .email(signupRequest.getEmail())
                .password(enPass)
                .username(signupRequest.getUsername())
                .address(signupRequest.getAddress())
                .dongName(signupRequest.getDongName())
                .phone(signupRequest.getPhone())
                .role(userRole)
                .build();

        Member savedMember = memberRepository.save(member);

        return SignupResponse.builder()
                .email(savedMember.getEmail())
                .build();
    }

    public void deleteMember(Member member) {
        memberRepository.delete(member);
    }

    public void uploadProfileImage(Member member, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        // 사용자별 디렉토리 생성 (예: /uploads/user@example.com/)
        String relativePath = "/uploads/" + member.getEmail();
        String absolutePath = imageService.getAbsolutePath() + File.separator + member.getEmail();
        Files.createDirectories(Paths.get(absolutePath));

        // 기존 DB랑 디렉토리에 path랑 이미지가 있으면 삭제
        if (member.getImageUrl() != null) {
            try {
                // 삭제 시에는 절대경로로 변환해서 삭제
                String existingImagePath = member.getImageUrl().replace("/", File.separator);  // 상대 경로 처리
                if (!existingImagePath.startsWith(System.getProperty("user.dir"))) {  // 절대경로 중복 방지
                    existingImagePath = System.getProperty("user.dir") + existingImagePath;
                }
                Files.deleteIfExists(Paths.get(existingImagePath));
            } catch (IOException e) {
                System.err.println("기존 프로필 이미지 삭제 실패: " + e.getMessage());
            }
        }

        // 파일 이름 생성 (중복 방지를 위해 UUID 사용)
        String originalFileName = file.getOriginalFilename(); // image1
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // .jpg
        String newFileName = UUID.randomUUID().toString() + fileExtension; // 1sd2fsf4fdfsdf.jpg

        String savedAbsoluteFilePath = absolutePath + File.separator + newFileName;
        String savedRelativePath = relativePath + "/" + newFileName;

        // 파일 저장
        file.transferTo(new File(savedAbsoluteFilePath));

        // Member 엔티티에 파일 경로 저장
        member.setImageUrl(savedRelativePath);
        memberRepository.save(member);
    }

    public Member editProfile(Member member, EditProfileRequest editProfileRequest) {
        Optional<Member> OpUser = memberRepository.findByEmail(member.getEmail());
        if (OpUser.isPresent()) {
            Member m = OpUser.get();
            if (!editProfileRequest.getName().equals(m.getUsername())
                    && memberRepository.existsByUsername(editProfileRequest.getName())) {
                throw new IllegalArgumentException("이미 존재하는 유저네임 입니다.");
            }

            m.setUsername(editProfileRequest.getName());
            m.setEmail(editProfileRequest.getEmail());
            m.setAddress(editProfileRequest.getAddress());
            m.setDongName(editProfileRequest.getDongName());
            m.setPhone(editProfileRequest.getPhone());

            return memberRepository.save(m);
        }
        throw new IllegalArgumentException("등록되어 있지 않은 이메일입니다.");
    }

    public boolean checkPassword(Member m, String password) {
        Optional<Member>  opUser = memberRepository.findById(m.getId());
        if (opUser.isPresent()) {
            Member member = opUser.get();

            if (!passwordEncoder.matches(password, member.getPassword())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
            }

            return true;
        }
        return false;
    }

    public RoleInfoResponse getRoleInfo(Member m) {
        Optional<Member> opUser =  memberRepository.findById(m.getId());
        if (opUser.isPresent()) {
            Member member = opUser.get();
            String role = member.getRole().getName().name();
            RoleInfoResponse response = new RoleInfoResponse();
            response.setRoleName(role);
            return response;
        } else {
            throw new UsernameNotFoundException("해당 회원을 찾을 수 없습니다.");
        }
    }

    public LoginTypeResponse getTypeInfo(Member m) {
        if (m == null) {
            throw new IllegalArgumentException("인증되지 않은 사용자입니다.");
        }

        String type = (m.getSocialProvider() == null) ? "LOCAL" : m.getSocialProvider().name();
        return new LoginTypeResponse(type);
    }

}

# 🧩 Project_NeighFund  
> "펀딩과 소모임으로 실현하는 지역 공동체 플랫폼"

---

## ✨ 프로젝트 소개
- 지역 문제 해결을 **우리 모두의 일**로  
- **소상공인에게는 새로운 수요의 기회**,  
- **주민에게는 참여와 관계 회복의 시작점**으로  
- 지역 주민이 제안하고, 이웃과 함께 공감과 펀딩을 통해 지역 문제를 해결하는 **사회서비스형 커뮤니티 플랫폼**입니다.

---

## 🛠 사용 기술 (Tech Stack)

### 🔹 Frontend
- React  
- React Router DOM  
- Context API
- CSS Module / Styled Components  

### 🔹 Backend
- Spring Boot 3.4  
- Spring Security  
- JPA (Hibernate)  
- MySQL  
- JWT (JJWT)  
- WebSocket + STOMP
- Multipart File, Validation 등 

### 🔹 Deploy / 협업
- AWS EC2
- GitHub 
- Notion, Figma 

---

## ✅ 주요 기능 (Features)

- 💬 **제안 게시판**  
  - 제안 등록/수정/삭제
  - 카테고리 필터링, 정렬, 공감(좋아요), 페이지네이션  

- 💰 **펀딩 기능**  
  - 정책 동의 → 정보 입력 → 스토리 작성 → 리워드 작성 (4단계 흐름)  
  - 펀딩 목록 무한스크롤, 리워드 선택, 참여  

- 📊 **설문조사**  
  - 관리자 설문 등록  
  - 사용자 투표 및 실시간 결과 비율 확인

- 👤 **관리자 페이지**  
  - 제안/펀딩/설문 승인 및 상태 변경  
  - 사용자 활동 관리  

- 🌐 **실시간 알림**  
  - WebSocket 기반 참여/진행 알림

---

## 🚀 실행 방법 (Run Locally)

```bash
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
./gradlew bootRun

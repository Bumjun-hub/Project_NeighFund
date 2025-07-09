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

로컬 환경에서 NeighFund 프로젝트를 실행하기 위한 가이드입니다.

---

### 🔹 Frontend 실행 (VSCode 기준)

1. VSCode로 `frontend` 디렉토리를 엽니다.
2. 터미널을 열고 아래 명령어를 입력합니다.

```bash
cd frontend
npm install       # 패키지(의존성) 설치
npm start         # 개발 서버 실행 (기본 주소: http://localhost:3000)
```

### 🔹 Backend 실행 (IntelliJ 기준)

1. IntelliJ로 `backend` 디렉토리를 엽니다.
2. Gradle 프로젝트로 불러온 후, `build.gradle` 파일이 정상 인식되었는지 확인합니다.
3. Gradle 탭에서 `bootRun` 실행 또는 터미널에서 아래 명령어 입력:

```bash
cd backend
./gradlew bootRun       # macOS / Linux
gradlew.bat bootRun     # Windows
백엔드 서버가 실행되면 기본 주소는 http://localhost:8080 입니다.
```
⚠️ 실행 전 확인사항:

MySQL이 실행 중이어야 하며, 해당 DB 설정이 application.yml 또는 application.properties에 올바르게 입력되어 있어야 합니다.

DB 계정, 포트, 스키마 이름 등은 환경에 맞게 수정 필요

## 👥 팀원 소개 (Team Members)

| 이름     | 담당 역할 | 주요 작업 내용 |
|----------|-----------|----------------|
| **정범준** | Frontend | - 전체 레이아웃 설계<br>- 펀딩 페이지 구현<br>- 제안 게시판 UI 개발 |
| **김태형** | Frontend | - 메인 페이지 구현<br>- 마이페이지, 로그인/로그아웃 UI 구현<br>- 소모임 페이지 UI 개발 |
| **이승빈** | Backend  | - DB 설계 및 회원관리<br>- 로그인/로그아웃 (JWT, 프로필 이미지, 구글 소셜 로그인)<br>- 소모임 게시글 CRUD, 이미지 연동<br>- 실시간 알림 / 실시간 채팅 구현 |
| **안순화** | Backend  | - 제안 및 펀딩 기능 API 구현<br>- CRUD 기반 게시글 및 이미지 연동<br>- 신청자 관리 및 구매 페이지 기능 개발 |



## 📸 주요 화면 예시

### 💬 제안 게시판

- 사용자가 자유롭게 지역 제안 글을 작성하고 공유할 수 있는 커뮤니티 기능입니다.
- 필터링, 정렬, 좋아요(공감) 등의 기능으로 사용성과 접근성을 높였습니다.

![제안 목록](./screenshots/suggestion.png)
> 제안 게시판 목록 화면 - 제목, 작성자, 카테고리, 좋아요 수 확인 가능

![제안 작성](./screenshots/suggestionwrite.png)
> 제안 작성 화면 - 카테고리 선택, 내용 입력, 이미지 첨부 가능

![제안 수정](./screenshots/suggestionedit.png)
> 제안 수정 화면 - 기존 작성 글을 수정하고 재업로드 or 삭제

![좋아요 기능](./screenshots/suggestionlike.png)
> 좋아요(공감) 기능 - 실시간으로 반영되어 인기글 파악 가능


---


### 💰 펀딩 기능

- 제안된 아이디어를 실제로 실현하기 위한 지역 기반 펀딩 기능입니다.
- 사용자 참여 흐름을 4단계로 나누어 직관적으로 구성하였습니다.

![펀딩 메인](./screenshots/fund.png)
> 펀딩 목록 화면 - 진행 중인 펀딩들을 썸네일 형식으로 확인

![펀딩 작성 - Step 1](./screenshots/fundcreate1.png)
> Step 1: 약관 동의 - 펀딩 생성 전 사용자 약관 동의 화면

![펀딩 작성 - Step 2](./screenshots/fundcreate2.png)
> Step 2: 기본 정보 입력 - 카테고리, 제목, 목표 금액, 기간 설정

![펀딩 작성 - Step 3](./screenshots/fundcreate3.png)
> Step 3: 스토리 작성 - 소개, 대표 이미지, 상세 설명 입력

![펀딩 작성 - Step 4](./screenshots/fundcreate4.png)
> Step 4: 리워드 작성 - 리워드 항목 설정 및 가격 입력

![펀딩 상세 1](./screenshots/fundinfo1.png)
> 펀딩 상세 정보 화면 - 이미지, 설명, 참여자 수 확인

![펀딩 상세 2](./screenshots/fundinfo2.png)
> 리워드 선택 화면 - 다양한 리워드를 선택하여 참여 가능


---

### 📊 설문조사

- 관리자만 등록 가능한 설문 기능으로 사용자 의견 수렴 및 피드백 반영을 위한 기능입니다.
- 사용자 투표와 실시간 비율 확인이 가능합니다.

![설문조사 화면](./screenshots/fundsurvey.png)
> 설문조사 화면 - 투표 완료 시 결과 비율이 실시간으로 반영되어 시각화




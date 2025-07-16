export const dummydata = [
    {
        id: 1,
        category: '환경',
        title: '동네에 쓰레기통 설치가 필요한 것 같습니다',
        content: '쓰레기가 너무 많아요 ㅠㅠ',
        likes: 45,
        date: '25.06.22',
        status: '🗨️공감모집중',
    },
    {
        id: 2,
        category: '환경',
        title: '공원에 가로등이 부족해서 어두워요 ㅠㅠ',
        content: '제목과 내용이 다르게 들어가는 예시',
        likes: 120,
        date: '25.06.22',
        status: '🗨️공감모집중',
    },
    {
        id: 3,
        category: '교육',
        title: '어린이가 체험할 수 있는 클래스 열어주세요!',
        content: '',
        likes: 120,
        date: '25.06.22',
        status: '🗨️공감모집중',
    },
];

export const dummyFunds = [
    {
        id: 1,
        title: '천연 방향제 펀딩',
        description: '시나몬과 오렌지 껍질로 만든 인테리어용 천연 방향제입니다. 향이 강하지 않고 은은하게 퍼져서 집안 분위기를 살려줍니다. 실제 사용자들의 만족도도 높고, 선물용으로도 많이 활용됩니다.',
        imageUrl: process.env.PUBLIC_URL + '/images/perfume.jpg',
        tag: '소확행',
        fundingRate: 376,         // 달성률
        likeCount: 120,           // 좋아요 수
        goalAmount: '500,000원',   // 목표 금액
        participants: 38,         // 참여자 수
        remainDays: 5,            // 남은 일수
        detailText: `✔️ 100% 천연 재료 사용\n✔️ 손으로 직접 제작한 핸드메이드 상품\n✔️ 펀딩 수익금 일부는 지역 환경보호 단체에 기부됩니다`,
    },
    {
        id: 2,
        title: '레트로 감성 액자 펀딩',
        description: '레트로 분위기 완성! 독립작가 감성 소품',
        imageUrl: process.env.PUBLIC_URL + '/images/frame.jpg',
        tag: '디자인',
    },
    {
        id: 3,
        title: '건강한 간식 펀딩',
        description: '직접 구운 건강한 과일칩, 아이 간식용으로 최고!',
        imageUrl: process.env.PUBLIC_URL + '/images/food.jpg',
        tag: '식품',
    },
    {
        id: 4,
        title: '수공예 비누 펀딩',
        description: '천연 재료로 만든 고체비누, 환경도 생각했어요',
        imageUrl: process.env.PUBLIC_URL + '/images/soap.jpg',
        tag: '생활용품',
    },
    {
        id: 5,
        title: '친환경 텀블러 펀딩',
        description: '디자인과 기능 모두 잡은 친환경 보틀!',
        imageUrl: process.env.PUBLIC_URL + '/images/tumblr.png',
        tag: '에코',
    },
    {
        id: 6,
        title: '친환경 텀블러 펀딩',
        description: '디자인과 기능 모두 잡은 친환경 보틀!',
        imageUrl: process.env.PUBLIC_URL + '/images/tumblr.png',
        tag: '에코',
    },
    {
        id: 7,
        title: '친환경 텀블러 펀딩',
        description: '디자인과 기능 모두 잡은 친환경 보틀!',
        imageUrl: process.env.PUBLIC_URL + '/images/tumblr.png',
        tag: '에코',
    },
    {
        id: 8,
        title: '친환경 텀블러 펀딩',
        description: '디자인과 기능 모두 잡은 친환경 보틀!',
        imageUrl: process.env.PUBLIC_URL + '/images/tumblr.png',
        tag: '에코',
    },
];



// mainpage더미
export const slides = [
    {
      title: "우리 동네의\n미래를 함께 만들어요",
      subtitle: "주민 제안부터 실현까지,",
      description: "지역 공동체가 함께하는 혁신 플랫폼",
      image: "/images/mainimg.png",
      alt: "지역 공동체 이미지",
      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
    },
    {
      title: "친환경 텀블러로\n지구를 지켜요",
      subtitle: "디자인과 기능 모두 잡은 친환경 보틀",
      description: "재활용 소재로 만든 보온텀블러 펀딩 진행중",
      image: "/images/tumblr.png",
      alt: "친환경 텀블러 펀딩",
      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "천연 방향제 펀딩",
      subtitle: "시나몬과 오렌지 껍질로 만든 인테리어용 천연 방향제",
      description: "",
      image: "/images/perfume.jpg",
      alt: "천연 방향제 펀딩",
      background: "linear-gradient(135deg,rgb(255, 181, 181) 0%,rgb(255, 228, 169) 100%)",
    },
    {
      title: "동네 작가들의\n핸드메이드 마켓",
      subtitle: "로컬 브랜드 모음전",
      description: "우리 동네에서 만든 유니크한 수공예품을 만나보세요",
      image: "/images/mainimg3.jpg",
      alt: "지역 협업 스토어",
    }
  ];

export const categories = [
    { id: 1, name: '주민제안', icon: '🏠', color: '#fef3c7' },
    { id: 2, name: '펀딩', icon: '🍰', color: '#fecaca' },
    { id: 3, name: '취향 모임', icon: '💼', color: '#bfdbfe' },
    { id: 4, name: '음식', icon: '🍎', color: '#f3e8ff' },
    { id: 5, name: '음악', icon: '🎵', color: '#fce7f3' },
    { id: 6, name: '기타', icon: '🎯', color: '#bbf7d0' }
  ];

export const neighborhoodProjects = [
    
    {
      id: 1,
      title: '남동구 구월동',
      subtitle: '아파트 단지 리모델링 펀딩',
      progress: 89,
      image: '/api/placeholder/250/150'
    },
    {
      id: 2,
      title: '부평구 부평동',
      subtitle: '커뮤니티 센터 조성 펀딩',
      progress: 76,
      image: '/api/placeholder/250/150'
    },
    {
      id: 3,
      title: '연수구 송도동',
      subtitle: '공원 환경 개선 펀딩',
      progress: 63,
      image: '/api/placeholder/250/150'
    }
  ];
  

export const lastMinuteProjects = [
    {
      id: 1,
      title: '마감 임박 프로젝트 1',
      subtitle: '커뮤니티 공간 조성',
      progress: 85,
      image: '/api/placeholder/250/150'
    },
    {
      id: 2,
      title: '마감 임박 프로젝트 2',
      subtitle: '동네 카페 리뉴얼',
      progress: 92,
      image: '/api/placeholder/250/150'
    },
    {
      id: 3,
      title: '마감 임박 프로젝트 3',
      subtitle: '공원 환경 개선',
      progress: 78,
      image: '/api/placeholder/250/150'
    }
  ];

//Gathering 더미데이터
export const gatheringData = [
  {
    id: 1,
    title: "🚀 스타트업 창업 스터디 모임",
    content: "예비 창업가 실전 스터디! 매주 목요일 7시 강남역에서 진행되는 창업 준비 모임입니다.",
    dongName: "강남구",
    titleImage: "/images/coffee.jpg",
    category: "JOB",
    likes: 24,
    memberCount: 8,
    createdAt: "2025-07-10T09:00:00Z",
    liked: false
  },
  {
    id: 2,
    title: "💼 직장인 협업툴 마스터 클래스",
    content: "직장인들을 위한 협업툴 완전 정복 프로그램! 노션, 슬랙, 피그마, 아사나, 트렐로 등 최신 협업툴을 A부터 Z까지 마스터하는 8주 완성 코스입니다. 단순한 기능 소개를 넘어서 실제 업무 시나리오를 기반으로 한 실습 중심의 커리큘럼으로 구성되어 있어요.",
    dongName: "서초구",
    titleImage: "/images/programmer.jpg",
    category: "SELF_IMPROVEMENT",
    likes: 31,
    memberCount: 12,
    createdAt: "2025-07-08T14:30:00Z",
    liked: false
  },
  {
    id: 3,
    title: "🎨 UX/UI 디자이너 성장 모임",
    content: "디자이너 포트폴리오 리뷰 모임입니다. 함께 성장하고 피드백을 주고받으며 실력을 향상시켜요.",
    dongName: "홍대입구",
    titleImage: "/images/study.jpg",
    category: "SELF_IMPROVEMENT",
    likes: 47,
    memberCount: 15,
    createdAt: "2025-07-05T16:20:00Z",
    liked: false
  },
  {
    id: 4,
    title: "🏺 도자기 공예 원데이 클래스",
    content: "손으로 직접 만드는 도자기의 매력을 느껴보세요! 20년 경력의 전문 도예가 선생님과 함께하는 특별한 하루 체험 클래스입니다. 물레 돌리기부터 시작해서 성형, 장식, 유약 바르기까지 도자기 제작의 전 과정을 직접 경험할 수 있어요.",
    dongName: "홍대입구",
    titleImage: "/images/pottery.jpg",
    category: "CRAFT",
    likes: 19,
    memberCount: 6,
    createdAt: "2025-07-12T11:15:00Z",
    liked: false
  },
  {
    id: 5,
    title: "🌲 주말 등산 힐링 모임",
    content: "매주 토요일 서울 근교 등산 모임입니다. 자연 속에서 힐링하며 건강한 취미생활을 즐겨보세요.",
    dongName: "종로구",
    titleImage: "/images/mountaineer.jpg",
    category: "OUTDOOR",
    likes: 63,
    memberCount: 25,
    createdAt: "2025-07-01T08:00:00Z",
    liked: false
  },
  {
    id: 6,
    title: "💻 개발자 알고리즘 스터디",
    content: "개발자 취업을 꿈꾸는 모든 분들을 위한 체계적인 알고리즘 마스터 과정입니다! 코딩테스트는 이제 모든 IT 기업의 필수 관문이 되었죠. 혼자서는 막막하고 어려운 알고리즘 공부를 함께 해결해나가요. 매주 월, 수, 금 저녁 8시부터 2시간씩 온라인으로 진행됩니다.",
    dongName: "강남구",
    titleImage: "/images/noImage.png",
    category: "STUDY",
    likes: 89,
    memberCount: 18,
    createdAt: "2025-06-28T19:45:00Z",
    liked: false
  },
  {
    id: 7,
    title: "📚 독서 토론 모임 '북클럽'",
    content: "한 달 한 권 깊이 읽기를 통해 다양한 관점을 나누는 독서 모임입니다. 함께 책을 읽고 토론해요.",
    dongName: "마포구",
    titleImage: "/images/noImage.png",
    category: "LITERATURE",
    likes: 42,
    memberCount: 10,
    createdAt: "2025-07-03T15:30:00Z",
    liked: false
  },
  {
    id: 8,
    title: "🍳 요리 초보 탈출 클래스",
    content: "자취생을 위한 완벽한 요리 클래스가 드디어 오픈합니다! 라면과 배달음식에 지친 여러분을 위해 준비한 8주 완성 홈쿡 마스터 과정이에요. 칼질하는 법부터 시작해서 기본 조리법, 양념 비율, 식재료 보관법까지 요리의 기초를 탄탄하게 다져드립니다.",
    dongName: "용산구",
    titleImage: "/images/noImage.png",
    category: "COOKING",
    likes: 56,
    memberCount: 14,
    createdAt: "2025-07-06T12:20:00Z",
    liked: false
  },
  {
    id: 9,
    title: "🎵 통기타 동아리 '울림'",
    content: "기타 치면서 힐링하자! 함께 연주하고 노래하며 음악의 즐거움을 나누는 동아리입니다.",
    dongName: "신촌",
    titleImage: "/images/noImage.png",
    category: "MUSIC",
    likes: 38,
    memberCount: 9,
    createdAt: "2025-07-09T18:00:00Z",
    liked: false
  },
  {
    id: 10,
    title: "📱 앱 서비스 기획 워크샵",
    content: "나만의 앱을 기획해보는 특별한 경험을 제공하는 4주 완성 워크샵입니다! IT 업계에서 10년간 다양한 서비스를 론칭한 현직 PM들이 직접 멘토링하며, 아이디어 발굴부터 시작해서 사용자 리서치, 와이어프레임 작성, UI/UX 설계, 비즈니스 모델 구축까지 앱 서비스 기획의 전 과정을 체계적으로 학습할 수 있어요.",
    dongName: "판교",
    titleImage: "/images/noImage.png",
    category: "SELF_IMPROVEMENT",
    likes: 72,
    memberCount: 16,
    createdAt: "2025-06-30T10:30:00Z",
    liked: false
  },
  {
    id: 11,
    title: "🏃‍♀️ 러닝크루 '새벽바람'",
    content: "매일 새벽 6시 한강 러닝으로 건강한 하루를 시작해요. 함께 뛰며 건강도 챙기고 인맥도 쌓아요!",
    dongName: "여의도",
    titleImage: "/images/noImage.png",
    category: "SPORTS",
    likes: 91,
    memberCount: 32,
    createdAt: "2025-06-25T06:00:00Z",
    liked: false
  },
  {
    id: 12,
    title: "🎬 영화 제작 동아리 '시네마틱'",
    content: "영화를 사랑하는 사람들이 모여 직접 단편 영화를 제작하는 창작 동아리입니다! 시나리오 작성부터 촬영, 편집, 사운드 작업까지 영화 제작의 모든 과정을 함께 경험해볼 수 있어요. 전문 장비는 동아리에서 대여해드리며, 영화학과 출신 멘토들이 기술적인 부분을 친절하게 가르쳐드립니다.",
    dongName: "홍대입구",
    titleImage: "/images/noImage.png",
    category: "CULTURE",
    likes: 54,
    memberCount: 11,
    createdAt: "2025-07-02T13:45:00Z",
    liked: false
  },
  {
    id: 13,
    title: "💰 주식 투자 스터디",
    content: "초보자 환영! 기초부터 차근차근 배워가는 주식 투자 스터디입니다. 함께 공부하며 현명한 투자자가 되어봐요.",
    dongName: "여의도",
    titleImage: "/images/noImage.png",
    category: "SELF_IMPROVEMENT",
    likes: 76,
    memberCount: 20,
    createdAt: "2025-06-27T17:20:00Z",
    liked: false
  },
  {
    id: 14,
    title: "🌸 플라워 아트 클래스",
    content: "꽃과 함께하는 힐링 시간을 선사하는 정규 플라워 아트 클래스가 새롭게 문을 엽니다! 신선한 생화를 활용한 꽃꽂이부터 시작해서 리스 만들기, 부케 제작, 압화 아트, 플라워 박스 디자인까지 다양한 플라워 아트 기법을 배울 수 있어요.",
    dongName: "신사동",
    titleImage: "/images/noImage.png",
    category: "CRAFT",
    likes: 45,
    memberCount: 8,
    createdAt: "2025-07-04T14:10:00Z",
    liked: false
  },
  {
    id: 15,
    title: "⚽ 직장인 풋살 리그",
    content: "매주 화요일 저녁 풋살 경기를 통해 스트레스도 풀고 동료들과 친목도 다져보세요!",
    dongName: "잠실",
    titleImage: "/images/noImage.png",
    category: "SPORTS",
    likes: 103,
    memberCount: 24,
    createdAt: "2025-06-26T19:30:00Z",
    liked: false
  },
  {
    id: 16,
    title: "🎤 스피치 & 프레젠테이션 마스터",
    content: "대중 앞에서 자신감 있게 말하는 것이 어려우신가요? 체계적인 스피치 트레이닝을 통해 발표의 달인이 되어보세요! 현직 아나운서와 방송인이 직접 진행하는 8주 집중 과정으로, 발성과 발음 교정부터 시작해서 논리적 구성법, 청중과의 소통 기술, 프레젠테이션 슬라이드 활용법까지 모든 것을 다룹니다.",
    dongName: "강남구",
    titleImage: "/images/noImage.png",
    category: "SELF_IMPROVEMENT",
    likes: 67,
    memberCount: 13,
    createdAt: "2025-07-07T11:00:00Z",
    liked: false
  }
];

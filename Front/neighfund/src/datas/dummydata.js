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
export const gatheringData  = [
  {
    id: 1,
    title: "🚀 스타트업 창업 스터디 모임",
    description: "예비 창업가 실전 스터디! 매주 목요일 7시 강남역",
    price: "월 5만원",
    image: "/api/placeholder/200/150",
    likes: 24,
    comments: 18,
    category: "창업"
  },
  {
    id: 2,
    title: "💼 직장인 협업툴 마스터 클래스",
    description: "직장인들을 위한 협업툴 완전 정복 프로그램! 노션, 슬랙, 피그마, 아사나, 트렐로 등 최신 협업툴을 A부터 Z까지 마스터하는 8주 완성 코스입니다. 단순한 기능 소개를 넘어서 실제 업무 시나리오를 기반으로 한 실습 중심의 커리큘럼으로 구성되어 있어요. 프로젝트 관리, 팀 커뮤니케이션, 문서 협업, 디자인 협업까지 모든 업무 영역에서 효율성을 극대화하는 노하우를 전수합니다. 수강생들에게는 각종 템플릿과 워크시트를 제공하며, 수료 후에도 지속적인 Q&A 지원을 받을 수 있어요.",
    price: "8만원",
    image: "/api/placeholder/200/150",
    likes: 31,
    comments: 12,
    category: "협업"
  },
  {
    id: 3,
    title: "🎨 UX/UI 디자이너 성장 모임",
    description: "디자이너 포트폴리오 리뷰 모임",
    price: "월 3만원",
    image: "/api/placeholder/200/150",
    likes: 47,
    comments: 29,
    category: "디자인"
  },
  {
    id: 4,
    title: "🏺 도자기 공예 원데이 클래스",
    description: "손으로 직접 만드는 도자기의 매력을 느껴보세요! 20년 경력의 전문 도예가 선생님과 함께하는 특별한 하루 체험 클래스입니다. 물레 돌리기부터 시작해서 성형, 장식, 유약 바르기까지 도자기 제작의 전 과정을 직접 경험할 수 있어요. 초보자도 걱정 없이 참여할 수 있도록 1:1 개별 지도를 제공하며, 각자의 개성이 담긴 유니크한 작품을 완성할 수 있습니다. 완성된 작품은 전문 가마에서 구워져 2주 후 픽업 가능하며, 일상에서 실제로 사용할 수 있는 실용적인 그릇으로 제작됩니다. 홍대 감성 가득한 아늑한 공방에서 진행되며, 차와 간식도 함께 제공돼요!",
    price: "6만원",
    image: "/api/placeholder/200/150",
    likes: 19,
    comments: 8,
    category: "공예"
  },
  {
    id: 5,
    title: "🌲 주말 등산 힐링 모임",
    description: "매주 토요일 서울 근교 등산 모임",
    price: "무료 (교통비 개별)",
    image: "/api/placeholder/200/150",
    likes: 63,
    comments: 34,
    category: "자연"
  },
  {
    id: 6,
    title: "💻 개발자 알고리즘 스터디",
    description: "개발자 취업을 꿈꾸는 모든 분들을 위한 체계적인 알고리즘 마스터 과정입니다! 코딩테스트는 이제 모든 IT 기업의 필수 관문이 되었죠. 혼자서는 막막하고 어려운 알고리즘 공부를 함께 해결해나가요. 매주 월, 수, 금 저녁 8시부터 2시간씩 온라인으로 진행되며, 백준과 프로그래머스의 난이도별 문제를 단계적으로 풀어나갑니다. 각 문제마다 다양한 풀이 방법을 토론하고, 시간복잡도와 공간복잡도를 분석하며 최적화된 해답을 찾아가는 과정을 통해 실력을 키워나가요. 현직 네이버, 카카오, 라인 개발자들이 멘토로 참여하여 실제 기업 코딩테스트 출제 경향과 면접 팁도 공유합니다.",
    price: "월 2만원",
    image: "/api/placeholder/200/150",
    likes: 89,
    comments: 56,
    category: "스터디"
  },
  {
    id: 7,
    title: "📚 독서 토론 모임 '북클럽'",
    description: "한 달 한 권 깊이 읽기",
    price: "월 1만원",
    image: "/api/placeholder/200/150",
    likes: 42,
    comments: 21,
    category: "독서"
  },
  {
    id: 8,
    title: "🍳 요리 초보 탈출 클래스",
    description: "자취생을 위한 완벽한 요리 클래스가 드디어 오픈합니다! 라면과 배달음식에 지친 여러분을 위해 준비한 8주 완성 홈쿡 마스터 과정이에요. 칼질하는 법부터 시작해서 기본 조리법, 양념 비율, 식재료 보관법까지 요리의 기초를 탄탄하게 다져드립니다. 매주 화요일 저녁 7시부터 3시간 동안 함께 요리하고 맛있게 먹으면서 자연스럽게 실력이 늘어나요. 김치찌개, 된장찌개, 불고기, 잡채, 계란말이 등 한국인이라면 꼭 알아야 할 기본 요리들을 마스터할 수 있으며, 마지막 주에는 한 상 차리기 프로젝트로 그동안 배운 것들을 총정리합니다. 요리 도구와 앞치마는 모두 제공되니 빈손으로 오셔도 돼요!",
    price: "회당 4만원",
    image: "/api/placeholder/200/150",
    likes: 56,
    comments: 38,
    category: "요리"
  },
  {
    id: 9,
    title: "🎵 통기타 동아리 '울림'",
    description: "기타 치면서 힐링하자!",
    price: "월 3만원",
    image: "/api/placeholder/200/150",
    likes: 38,
    comments: 15,
    category: "음악"
  },
  {
    id: 10,
    title: "📱 앱 서비스 기획 워크샵",
    description: "나만의 앱을 기획해보는 특별한 경험을 제공하는 4주 완성 워크샵입니다! IT 업계에서 10년간 다양한 서비스를 론칭한 현직 PM들이 직접 멘토링하며, 아이디어 발굴부터 시작해서 사용자 리서치, 와이어프레임 작성, UI/UX 설계, 비즈니스 모델 구축까지 앱 서비스 기획의 전 과정을 체계적으로 학습할 수 있어요. 매주 토요일 오후 2시부터 4시간씩 진행되며, 소규모 팀 프로젝트 방식으로 실제 출시 가능한 수준의 기획서를 완성하게 됩니다. 워크샵 수료 후에는 개발자와의 네트워킹 기회도 제공하여 실제 개발까지 연결될 수 있도록 지원하고 있어요. 기획 경험이 전혀 없어도 괜찮으니 새로운 도전을 해보고 싶은 분들은 언제든 환영합니다!",
    price: "15만원",
    image: "/api/placeholder/200/150",
    likes: 72,
    comments: 43,
    category: "기획"
  },
  {
    id: 11,
    title: "🏃‍♀️ 러닝크루 '새벽바람'",
    description: "매일 새벽 6시 한강 러닝",
    price: "무료",
    image: "/api/placeholder/200/150",
    likes: 91,
    comments: 67,
    category: "운동"
  },
  {
    id: 12,
    title: "🎬 영화 제작 동아리 '시네마틱'",
    description: "영화를 사랑하는 사람들이 모여 직접 단편 영화를 제작하는 창작 동아리입니다! 시나리오 작성부터 촬영, 편집, 사운드 작업까지 영화 제작의 모든 과정을 함께 경험해볼 수 있어요. 전문 장비는 동아리에서 대여해드리며, 영화학과 출신 멘토들이 기술적인 부분을 친절하게 가르쳐드립니다. 매월 하나의 작품을 완성하는 것이 목표이며, 연말에는 상영회를 통해 1년간의 작품들을 공개하고 시상식도 진행해요. 연출, 촬영, 편집, 연기 등 어떤 분야든 관심 있는 역할을 맡아 참여할 수 있으며, 완성된 작품들은 지역 영화제에도 출품하고 있습니다. 영화 제작 경험을 쌓고 싶거나 새로운 취미를 찾고 있는 분들에게 추천드려요!",
    price: "월 5만원",
    image: "/api/placeholder/200/150",
    likes: 54,
    comments: 28,
    category: "영화"
  },
  {
    id: 13,
    title: "💰 주식 투자 스터디",
    description: "초보자 환영! 기초부터 차근차근",
    price: "월 4만원",
    image: "/api/placeholder/200/150",
    likes: 76,
    comments: 89,
    category: "투자"
  },
  {
    id: 14,
    title: "🌸 플라워 아트 클래스",
    description: "꽃과 함께하는 힐링 시간을 선사하는 정규 플라워 아트 클래스가 새롭게 문을 엽니다! 신선한 생화를 활용한 꽃꽂이부터 시작해서 리스 만들기, 부케 제작, 압화 아트, 플라워 박스 디자인까지 다양한 플라워 아트 기법을 배울 수 있어요. 20년 경력의 플로리스트 선생님이 직접 지도하며, 색채학과 디자인 이론도 함께 배워 더욱 완성도 높은 작품을 만들 수 있습니다. 매주 목요일 오후 7시부터 2시간 30분 동안 진행되며, 모든 재료와 도구는 제공됩니다. 완성된 작품은 집으로 가져가실 수 있고, 특별한 날에는 선물용 포장도 해드려요. 플라워샵 창업을 꿈꾸는 분들을 위한 심화 과정과 자격증 취득 과정도 함께 운영하고 있습니다.",
    price: "회당 6만원",
    image: "/api/placeholder/200/150",
    likes: 45,
    comments: 19,
    category: "공예"
  },
  {
    id: 15,
    title: "⚽ 직장인 풋살 리그",
    description: "매주 화요일 저녁 풋살 경기",
    price: "월 8만원",
    image: "/api/placeholder/200/150",
    likes: 103,
    comments: 78,
    category: "운동"
  },
  {
    id: 16,
    title: "🎤 스피치 & 프레젠테이션 마스터",
    description: "대중 앞에서 자신감 있게 말하는 것이 어려우신가요? 체계적인 스피치 트레이닝을 통해 발표의 달인이 되어보세요! 현직 아나운서와 방송인이 직접 진행하는 8주 집중 과정으로, 발성과 발음 교정부터 시작해서 논리적 구성법, 청중과의 소통 기술, 프레젠테이션 슬라이드 활용법까지 모든 것을 다룹니다. 매주 실전 발표 연습을 통해 점진적으로 실력을 향상시키며, 개인별 맞춤 피드백으로 약점을 보완해나가요. 직장에서의 회의 발표, 취업 면접, 각종 PT 상황에서 당당하고 설득력 있게 말할 수 있는 스킬을 완벽하게 마스터할 수 있습니다. 소수 정예로 운영되어 개별 관리가 철저하며, 수료 시 수료증도 발급해드려요.",
    price: "20만원",
    image: "/api/placeholder/200/150",
    likes: 67,
    comments: 34,
    category: "교육"
  }
];

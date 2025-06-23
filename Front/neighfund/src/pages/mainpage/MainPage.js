import Section from "../../components/Section";
import './MainPage.css';

const MainPage= ()=>{

    const categories = [
    { id: 1, name: '주민제안', icon: '🏠', color: '#fef3c7' },
    { id: 2, name: '펀딩', icon: '🍰', color: '#fecaca' },
    { id: 3, name: '취향 모임', icon: '💼', color: '#bfdbfe' },
    { id: 4, name: '음식', icon: '🍎', color: '#f3e8ff' },
    { id: 5, name: '음악', icon: '🎵', color: '#fce7f3' },
    { id: 6, name: '기타', icon: '🎯', color: '#bbf7d0' }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: '어떤한 육성 스마트팩 프로젝트',
      description: 'IoT 기술을 활용한 스마트 수직농장으로 지역 먹거리 자급자족과 공동체 활성화를 동시에 실현합니다.',
      category: '펀딩 중',
      progress: 147,
      supporters: 126,
      daysLeft: 17,
      image: '/api/placeholder/300/200'
    }
  ];

  const neighborhoodProjects = [
    
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
  

  const lastMinuteProjects = [
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


    return(
        <Section>
            <div className="main-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                <div className="hero-text">
                    <h1>우리 동네의<br />미래를 함께 만들어요</h1>
                    <p>주민 제안부터 실현까지,</p>
                    <p>지역 공동체가 함께하는 혁신 플랫폼</p>
                </div>
                <div className="hero-image">
                    <div className="hero-placeholder"></div>
                </div>
                </div>
            </section>

            {/* Categories */}
            <section className="categories">
                <div className="container">
                <div className="category-grid">
                    {categories.map(category => (
                    <div 
                        key={category.id} 
                        className="category-item"
                        style={{ backgroundColor: category.color }}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <span className="category-name">{category.name}</span>
                    </div>
                    ))}
                </div>
                </div>
            </section>

            {/* Featured Project */}
            <section className="featured-section">
                <div className="container">
                <h2 className="section-title">주목할 만한 프로젝트</h2>
                <div className="featured-project">
                    <div className="project-image">
                    <div className="project-placeholder">
                        <div className="growth-icon">📈</div>
                    </div>
                    </div>
                    <div className="project-info">
                    <div className="project-badge">펀딩 중</div>
                    <h3 className="project-title">어떤한 육성 스마트팩 프로젝트</h3>
                    <p className="project-description">
                        IoT 기술을 활용한 스마트육성솔루션으로 반려식물 키우기를 쉽게!
                    </p>
                    <p className="project-detail">
                        농업 기술과 융합한 농업 IoT 상품입니다
                    </p>
                    <div className="project-stats">
                        <div className="stat">
                        <span className="stat-value">147%</span>
                        <span className="stat-label">달성률</span>
                        </div>
                        <div className="stat">
                        <span className="stat-value">126</span>
                        <span className="stat-label">서포터</span>
                        </div>
                        <div className="stat">
                        <span className="stat-value">17일</span>
                        <span className="stat-label">남음</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            {/* Neighborhood Projects */}
            <section className="projects-section">
                <div className="container">
                <h2 className="section-title">우리동네 펀딩</h2>
                <div className="projects-grid">
                    {neighborhoodProjects.map(project => (
                    <div key={project.id} className="project-card">
                        <div className="project-card-image">
                        <div className="project-placeholder blue-gradient"></div>
                        </div>
                        <div className="project-card-content">
                        <h4 className="project-card-title">{project.title}</h4>
                        <p className="project-card-subtitle">{project.subtitle}</p>
                        <div className="progress-bar">
                            <div 
                            className="progress-fill" 
                            style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{project.progress}%</span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </section>

            {/* Last Minute Projects */}
            <section className="projects-section">
                <div className="container">
                <h2 className="section-title">마감 임박 펀딩</h2>
                <div className="projects-grid">
                    {lastMinuteProjects.map(project => (
                    <div key={project.id} className="project-card">
                        <div className="project-card-image">
                        <div className="project-placeholder purple-gradient"></div>
                        </div>
                        <div className="project-card-content">
                        <h4 className="project-card-title">{project.title}</h4>
                        <p className="project-card-subtitle">{project.subtitle}</p>
                        <div className="progress-bar">
                            <div 
                            className="progress-fill urgent" 
                            style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{project.progress}%</span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </section>
            </div>
        </Section>
    )

}

export default MainPage;
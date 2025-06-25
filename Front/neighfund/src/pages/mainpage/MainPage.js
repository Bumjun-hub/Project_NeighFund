import Section from "../../components/Section";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MainPage.css';
import { slides, categories, neighborhoodProjects, lastMinuteProjects } from '../../datas/dummydata';

const MainPage= ()=>{

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // 자동 슬라이드
    useEffect(() => {
        if (!isAutoPlay) return;
        
        const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5초마다 자동 전환

        return () => clearInterval(timer);
    }, [slides.length, isAutoPlay]);

    // 타이머 초기화 함수
    const resetAutoPlay = () => {
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 5000); // 5초 후 자동재생 재시작
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        resetAutoPlay();
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        resetAutoPlay();
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        resetAutoPlay();
    };

    const handleSlideClick = (link) => {
        window.location.href = link;
    };

    return(
        <Section>
            <div className="main-page">
            {/* Hero Section */}
            <section className="hero-slider">
                <div className="slider-container">
                    {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ background: slide.background }}
                        onClick={() => handleSlideClick(slide.link)}
                    >
                        <div className="hero-content">
                        <div className="hero-text">
                            <h1>{slide.title.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < slide.title.split('\n').length - 1 && <br />}
                            </React.Fragment>
                            ))}</h1>
                            <p className="subtitle">{slide.subtitle}</p>
                            <p className="description">{slide.description}</p>
                        </div>
                        <div className="hero-image">
                            <img src={slide.image} alt={slide.alt} />
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* 네비게이션 버튼 */}
                <button className="nav-btn prev-btn" onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
                <button className="nav-btn next-btn" onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>

                {/* 인디케이터 도트 */}
                <div className="indicators">
                    {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                    ))}
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
                    <h3 className="project-title">아파트 옥상 스마트팜 프로젝트</h3>
                    <p className="project-description">
                        IoT 기술을 활용한 스마트 수직농장으로 
                        지역 먹거리 자급자족과 공동체 활성화를 동시에 실현합니다.
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
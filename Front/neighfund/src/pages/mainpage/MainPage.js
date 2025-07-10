import Section from "../../components/Section";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MainPage.css';
import { slides, categories, neighborhoodProjects, lastMinuteProjects } from '../../datas/dummydata';

const MainPage = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [funds, setFunds] = useState([]);

    // 마감일
    const calcDday = (deadlineStr) => {
        if (!deadlineStr) return null;
        const deadlineDate = new Date(deadlineStr);
        const today = new Date();
        const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? `D-${diff}` : '마감됨';
    };


    useEffect(() => {
        fetch("/api/fund/view")
            .then(res => res.json())
            .then(data => {

                // 백엔드에서 내려주는 imageUrl을 그대로 사용
                setFunds(data);
            })
            .catch(err => console.error("펀딩 데이터 불러오기 실패:", err));
    }, []);



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

    // 주목할 만한 프로젝트
    const bestFund = funds
        .filter(f => new Date(f.deadline) > new Date()) // 마감되지 않은 펀딩
        .sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];

    // 마감임박 펀딩
    const urgentFunds = funds.filter(f => {
        const daysLeft = Math.floor((new Date(f.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft >= 0;
    });



    return (
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
                        {bestFund ? (
                            <div className="featured-project"> {/* 🔄 수정됨 */}
                                <div className="project-image">
                                    <img src={bestFund.imageUrl} alt={bestFund.title} className="fund-info-image" />

                                </div>
                                <div className="project-info">
                                    <div className="project-badge">펀딩 중</div>
                                    <h3 className="project-title">{bestFund.title}</h3>
                                    <p className="project-description">{bestFund.subTitle}</p>
                                    <p className="project-detail">{bestFund.content?.slice(0, 50)}...</p>
                                    <div className="project-stats">
                                        <div className="stat">
                                            <span className="stat-value">
                                                {Math.floor((bestFund.currentAmount / bestFund.targetAmount) * 100)}%
                                            </span>
                                            <span className="stat-label">달성률</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">{bestFund.currentParticipants}</span>
                                            <span className="stat-label">서포터</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">
                                                {Math.floor((new Date(bestFund.deadline) - new Date()) / (1000 * 60 * 60 * 24))}일
                                            </span>
                                            <span className="stat-label">남음</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>진행 중인 펀딩이 없습니다.</p>
                        )}
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
                            {urgentFunds.length === 0 ? (
                                <p>마감 임박 펀딩이 없습니다.</p>
                            ) : (
                                urgentFunds.map(project => (
                                    <div key={project.id} className="project-card">
                                        <div className="project-card-image">
                                            <img src={project.imageUrl} alt={project.title} className="fund-info-image" />


                                        </div>
                                        <div className="project-card-content">
                                            <h4 className="project-card-title">{project.title}</h4>
                                            <p className="project-card-subtitle">{project.subTitle}</p>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill urgent"
                                                    style={{
                                                        width: `${Math.floor((project.currentAmount / project.targetAmount) * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="project-footer">
                                                <span className="progress-text">
                                                    {Math.floor((project.currentAmount / project.targetAmount) * 100)}%
                                                </span>
                                                <span className="dday-text">{calcDday(project.deadline)}</span> {/* ✅ 여기에 표시 */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

            </div>
        </Section>
    )

}

export default MainPage;
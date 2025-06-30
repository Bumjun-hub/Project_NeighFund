
import { useEffect, useState } from 'react';
import './SuggestionPage.css';
import { useNavigate } from "react-router-dom";
import Section from "../../components/Section";

const SuggestionPage = () => {
    const [categoryFilter, setCategoryFilter] = useState('전체');
    const [sortType, setSortType] = useState('최신순');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const categoryMap = {
        EDUCATION: '교육',
        ENVIRONMENT: '환경',
        CULTURE: '문화',
        PET: '애완동물',
        SPORTS: '운동',
        FOOD: '음식',
        HOBBY: '취미',
        WELFARE: '복지',
        ETC: '기타',
    };

    const status = {
        FUNDED: '펀딩 완료',
        ON_HOLD: '보류 중',
        RECRUITING: '모집 중',
    };

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                const res = await fetch('/api/community/view', {
                    credentials: 'include',
                });
                const data = await res.json();
                setSuggestions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("제안글 불러오기 실패:", err);
            }
        };
        fetchSuggestion();
    }, []);




    const filtered = suggestions
        .filter((item) =>
            categoryFilter === '전체' ? true : item.category === categoryFilter
        )
        .sort((a, b) => {
            if (sortType === '공감순') return b.likes - a.likes;


            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const handleLike = (id) => {
        setSuggestions((prev) =>
            prev.map((item) => {
                if (item.id === id && item.status === 'RECRUITING') {
                    return { ...item, likes: item.likes + 1 };
                }
                return item;
            })
        );
    };

    return (
        <Section>
            <div className="suggestion-wrapper">
                <div className="suggestion-header">
                    <div className="suggestion-title">
                        <h2>제안</h2>
                    </div>
                    <div className="filters">
                        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                            <option value="최신순">최신순</option>
                            <option value="공감순">공감순</option>
                        </select>

                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="전체">전체</option>
                            {Object.keys(categoryMap).map((key) => (
                                <option key={key} value={key}>{categoryMap[key]}</option>
                            ))}
                        </select>

                        <button
                            className="suggestion-write-button"
                            onClick={() => navigate('/suggestion/write')}
                        >
                            제안 글쓰기
                        </button>
                    </div>
                </div>

                <div className="suggestion-list">
                    {filtered.map((item) => (
                        <div key={item.id} className="suggestion-card" data-category={item.category}>
                             <button
                                    className="suggestion-edit-button" // 🔧 이 클래스는 스타일링용
                                    onClick={() => navigate(`/suggestion/write/${item.id}`)} // 🔧 수정 페이지로 이동
                                >
                                     ✏
                                </button>
                            <div className="suggestion-category">#{categoryMap[item.category]}</div>
                            <div className="title">{item.title}</div>
                            <div className="suggestion-content">{item.content}</div>
                            <div className="suggestion-meta">
                                <span
                                    style={{ cursor: item.status === 'RECRUITING' ? 'pointer' : 'not-allowed' }}
                                    onClick={() => item.status === 'RECRUITING' && handleLike(item.id)}
                                >
                                    ♡ {item.likes}
                                </span>
                                <span>{item.createdAt}</span>
                                <span className="suggestion-status">{status[item.status]}</span>
                               
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default SuggestionPage;

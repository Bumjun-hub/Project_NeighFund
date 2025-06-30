
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
        '환경': '환경',
        '교통': '교통',
        '문화': '문화',
        '교육': '교육',
        '복지': '복지',
    };

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                const res = await fetch('/api/community/view/SUGGESTION', {
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
            prev.map((item) =>
                item.id === id ? { ...item, likes: item.likes + 1 } : item
            )
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
                            <div className="suggestion-category">#{item.category}</div>
                            <div className="title">{item.title}</div>
                            <div className="suggestion-content">{item.content}</div>
                            <div className="suggestion-meta">
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleLike(item.id)}
                                >
                                    ♡ {item.likes}
                                </span>
                                {/* 날짜 포맷 예쁘게 하고 싶을때} */}
                                {/* <span>{new Date(item.createdAt).toLocaleDateString()}</span> */}
                                <span>{item.createdAt}</span>
                                <span className="suggestion-status">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default SuggestionPage;

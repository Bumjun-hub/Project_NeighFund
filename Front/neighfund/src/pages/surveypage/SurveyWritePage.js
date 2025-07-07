import React, { useEffect, useState } from 'react';
import './SurveyWritePage.css';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import { refreshToken } from '../../utils/authUtils';

const SurveyWritePage = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                let res = await fetch("/api/auth/roleinfo", { credentials: "include" });

                if (res.status === 401) {
                    const refreshed = await refreshToken();
                    if (refreshed) {
                        res = await fetch("/api/auth/roleinfo", { credentials: "include" });
                    }
                }

                const data = await res.json();
                if (data.roleName === "ROLE_ADMIN") {
                    setIsAdmin(true);
                } else {
                    alert("관리자만 접근 가능합니다.");
                    navigate("/");
                }
            } catch (err) {
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        };
        checkAdmin();
    }, [navigate]);

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index) => {
        const updated = [...options];
        updated.splice(index, 1);
        setOptions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/survey/admin/write', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: question,
                    options,
                }),
            });

            if (res.ok) {
                alert('설문이 등록되었습니다!');
                navigate('/funding');
            } else {
                const msg = await res.text();
                alert('실패: ' + msg);
            }
        } catch (err) {
            alert('서버 오류 발생');
        }
    };

    if (!isAdmin) return null;

    return (
        <Section>
            <div className="survey-write-wrapper">
                <h2>설문조사 글쓰기</h2>
                <form onSubmit={handleSubmit}>
                    <label>질문</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />

                    <label>옵션</label>
                    {options.map((opt, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                required
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(i)}>삭제</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption}>옵션 추가</button>

                    <br /><br />
                    <button type="submit">등록</button>
                </form>
            </div>
        </Section>
    );
};

export default SurveyWritePage;

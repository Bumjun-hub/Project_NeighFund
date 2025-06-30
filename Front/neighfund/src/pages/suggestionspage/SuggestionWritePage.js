import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SuggestionWritePage.css';
import Section from '../../components/Section';

const SuggestionWritePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '환경',
  });

  const categoryMap = {
    '환경': '환경',
    '교통': '교통',
    '문화': '문화',
    '교육': '교육',
    '복지': '복지',
  };

  // 수정 시 기존 글 데이터 불러오기 (API가 없으면 이 부분 생략 가능)
  useEffect(() => {
    if (isEdit) {
      fetch(`/api/community/view/SUGGESTION`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          const post = data.find(item => item.id === parseInt(id));
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              category: post.category,
            });
          }
        })
        .catch(err => console.error('수정글 로딩 실패:', err));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      category: 'SUGGESTION', // 고정 또는 formData.category로 쓰면 유동적
    };

    const url = isEdit
      ? `/api/community/edit/${id}`
      : '/api/community/write';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEdit ? '제안글이 수정되었습니다!' : '제안글이 등록되었습니다!');
        navigate('/suggestion');
      } else {
        const msg = await res.text();
        alert('요청 실패: ' + msg);
      }
    } catch (err) {
      console.error('요청 실패:', err);
      alert('서버 오류');
    }
  };

  return (
    <Section>
      <div className="suggestion-write-wrapper">
        <form className="suggestion-write-form" onSubmit={handleSubmit}>
          <h2 className="suggestion-write-title">
            {isEdit ? '제안글 수정' : '제안 글쓰기'}
          </h2>

          <label>제목</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            required
          />

          <label>카테고리</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {Object.keys(categoryMap).map((key) => (
              <option key={key} value={key}>{categoryMap[key]}</option>
            ))}
          </select>

          <button type="submit" className="suggestion-write-submit">
            {isEdit ? '수정' : '등록'}
          </button>
        </form>
      </div>
    </Section>
  );
};

export default SuggestionWritePage;

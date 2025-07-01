import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SuggestionWritePage.css';
import Section from '../../components/Section';
import { refreshToken } from '../../utils/authUtils';
import SuggestionAPI from './SuggestionAPI';

const SuggestionWritePage = () => {

  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'EDUCATION', // 기본값
  });

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


  //사용자 권한 읽기
  useEffect(() => {
    if (!isEdit) return; // 수정 모드일 때만 사용자 정보 요청

    const fetchUser = async () => {
      try {
        let user = await SuggestionAPI.getCurrentUser();
        setCurrentUser(user.username);
      } catch (e) {
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            const user = await SuggestionAPI.getCurrentUser();
            setCurrentUser(user.username);
          } catch (err) {
            console.error("재요청 실패:", err);
            alert("로그인이 필요합니다.");
            navigate("/login");
          }
        } else {
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [navigate, isEdit]);



  useEffect(() => {
    const fetchEditData = async () => {
      if (!isEdit || !currentUser) return; // currentUser가 없으면 대기
      try {
        const post = await SuggestionAPI.getSuggestionDetail(id);
        if (post.username !== currentUser) {
          alert("작성자만 수정할 수 있습니다.");
          navigate("/suggestion");
          return;
        }
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
        });
      } catch (err) {
        console.error('수정글 로딩 실패:', err);
      }
    };
    fetchEditData();
  }, [id, isEdit, currentUser]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, status: 'RECRUITING' };

    try {
      if (isEdit) {
        await SuggestionAPI.updateSuggestion(id, payload);
        alert('제안글이 수정되었습니다!');
      } else {
        await SuggestionAPI.createSuggestion(payload);
        alert('제안글이 등록되었습니다!');
      }
      navigate('/suggestion');
    } catch (err) {
      console.error('요청 실패:', err);
      alert('서버 오류');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await SuggestionAPI.deleteSuggestion(id);
      alert('게시글이 삭제되었습니다.');
      navigate('/suggestion');
    } catch (err) {
      console.error('삭제 실패:', err);
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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {Object.entries(categoryMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <div className="suggestion-button-group">
            <button type="submit" className="suggestion-write-submit">
              {isEdit ? '수정' : '등록'}
            </button>

            {isEdit && (
              <button
                type="button"
                className="suggestion-delete-button"
                onClick={handleDelete}
              >
                삭제
              </button>
            )}
          </div>

        </form>
      </div>
    </Section>
  );
};

export default SuggestionWritePage;

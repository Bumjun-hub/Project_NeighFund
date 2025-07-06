import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SuggestionWritePage.css';
import Section from '../../components/Section';
import { refreshToken } from '../../utils/authUtils';

const SuggestionWritePage = () => {

  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'EDUCATION',
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

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      fetch(`/api/community/detail/${id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(post => {
          if (post.username !== currentUser) {
            alert("작성자만 수정할 수 있습니다.")
            navigate("/suggestion");
            return;
          }
          setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
          });
        })
        .catch(err => console.error('수정글 로딩 실패:', err));
    }
  }, [id, isEdit]);


  //사용자 권한 읽기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        let res = await fetch("/api/roleinfo", { credentials: "include" });

        if (res.status === 401) {
          const refreshed = await refreshToken(); // 토큰 갱신 함수
          if (refreshed) {
            res = await fetch("/api/roleinfo", { credentials: "include" });
          }
        }

        if (res.ok) {
          const data = await res.json(); // 👈 username을 포함하고 있어야 함
          setCurrentUser(data.username);
        } else {
          throw new Error("로그인 필요");
        }
      } catch (e) {
        console.error("사용자 정보 확인 실패:", e);
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      status: 'RECRUITING', // 작성 시 기본 상태
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


  // 🔴 삭제 요청 핸들러 추가
  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/community/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/suggestion');
      } else {
        const msg = await res.text();
        alert('삭제 실패: ' + msg);
      }
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

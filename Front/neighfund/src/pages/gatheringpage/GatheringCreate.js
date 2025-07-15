import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GatheringAPI from './GatheringAPI';
import './GatheringCreate.css';

const GatheringCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 수정 모드인지 확인
  const isEditMode = location.state?.isEdit || false;
  const gatheringId = location.state?.gatheringId;
  const initialData = location.state?.gatheringData;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'FREE',
    dongName: '',
    content: '',
    introduction: '',
    nickname: ''
  });

  const [titleImage, setTitleImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        type: initialData.type || 'FREE',
        dongName: initialData.dongName || '',
        content: initialData.content || '',
        introduction: '', // 수정 시에는 기존 소개글 없음
        nickname: '' // 수정 시에는 기존 닉네임 없음
      });
      
      // 기존 이미지가 있으면 미리보기로 설정
      if (initialData.titleImage) {
        setTitleImagePreview(initialData.titleImage);
      }
    }
  }, [isEditMode, initialData]);

  // 카테고리 옵션
  const categories = [
  { value: 'SPORTS', label: '스포츠' },
  { value: 'SOCIAL', label: '친목' },
  { value: 'LITERATURE', label: '문학' },
  { value: 'OUTDOOR', label: '아웃도어' },
  { value: 'MUSIC', label: '음악' },
  { value: 'JOB', label: '직업/취업' },
  { value: 'CULTURE', label: '문화' },
  { value: 'LANGUAGE', label: '언어' },
  { value: 'GAME', label: '게임' },
  { value: 'CRAFT', label: '공예/만들기' },
  { value: 'DANCE', label: '댄스' },
  { value: 'VOLUNTEER', label: '봉사' },
  { value: 'PHOTO', label: '사진' },
  { value: 'SELF_IMPROVEMENT', label: '자기계발' },
  { value: 'SPORTS_WATCHING', label: '스포츠 관람' },
  { value: 'PET', label: '반려동물' },
  { value: 'COOKING', label: '요리' },
  { value: 'CAR_BIKE', label: '자동차/바이크' },
  { value: 'STUDY', label: '스터디' }
];

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 제목 이미지 변경 핸들러
  const handleTitleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTitleImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => setTitleImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => setProfileImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const removeTitleImage = () => {
    setTitleImage(null);
    setTitleImagePreview(null);
    document.getElementById('titleImageInput').value = '';
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    document.getElementById('profileImageInput').value = '';
  };

  // 폼 검증
  const validateForm = () => {
    const { title, category, dongName, content } = formData;
    
    if (!title.trim()) {
      setError('소모임 제목을 입력해주세요.');
      return false;
    }
    if (!category) {
      setError('카테고리를 선택해주세요.');
      return false;
    }
    if (!dongName.trim()) {
      setError('지역(동네명)을 입력해주세요.');
      return false;
    }
    if (!content.trim()) {
      setError('소모임 설명을 입력해주세요.');
      return false;
    }

    // 수정 모드가 아닐 때만 필수 체크
    if (!isEditMode) {
      const { introduction, nickname } = formData;
      if (!introduction.trim()) {
        setError('한줄 소개를 입력해주세요.');
        return false;
      }
      if (!nickname.trim()) {
        setError('소모임 닉네임을 입력해주세요.');
        return false;
      }
    }

    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // 수정 모드
        const editData = {
          title: formData.title,
          category: formData.category,
          dongName: formData.dongName,
          content: formData.content,
          titleImage
        };

        await GatheringAPI.editGathering(gatheringId, editData);
        alert('소모임이 성공적으로 수정되었습니다!');
        
        // 상세 페이지로 이동
        navigate(`/gathering/${gatheringId}`);
        
      } else {
        // 생성 모드
        const gatheringData = {
          ...formData,
          titleImage,
          profileImage
        };

        await GatheringAPI.createGathering(gatheringData);
        alert('소모임이 성공적으로 생성되었습니다!');
        
        // 폼 초기화
        setFormData({
          title: '',
          category: '',
          type: 'FREE',
          dongName: '',
          content: '',
          introduction: '',
          nickname: ''
        });
        setTitleImage(null);
        setProfileImage(null);
        setTitleImagePreview(null);
        setProfileImagePreview(null);
        
        // 목록 페이지로 이동
        navigate('/gathering');
      }
      
    } catch (error) {
      console.error('소모임 처리 실패:', error);
      setError(error.message || `소모임 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gathering-create-container">
      <div className="create-form-wrapper">
        <h1 className="create-title">
          {isEditMode ? '소모임 수정하기' : '새로운 소모임 만들기'}
        </h1>
        
        <form onSubmit={handleSubmit} className="create-form">
          {/* 기본 정보 섹션 */}
          <div className="form-section">
            <h2 className="section-title">기본 정보</h2>
            
            <div className="form-group">
              <label htmlFor="title">소모임 제목 *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="소모임 제목을 입력하세요"
                maxLength={50}
              />
              <span className="char-count-gathering">{formData.title.length}/50</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">카테고리 *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dongName">지역 (동네명) *</label>
              <input
                type="text"
                id="dongName"
                name="dongName"
                value={formData.dongName}
                onChange={handleInputChange}
                placeholder="예: 강남구 역삼동"
              />
            </div>
          </div>

          {/* 소모임 설명 섹션 */}
          <div className="form-section">
            <h2 className="section-title">소모임 설명</h2>
            
            <div className="form-group">
              <label htmlFor="content">소모임 소개 *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="소모임에 대해 자세히 설명해주세요"
                rows={6}
                maxLength={1000}
              />
              <span className="char-count-gathering">{formData.content.length}/1000</span>
            </div>
          </div>

          {/* 리더 정보 섹션 - 수정 모드일 때는 숨김 */}
          {!isEditMode && (
            <div className="form-section">
              <h2 className="section-title">리더 정보</h2>
              
              <div className="form-group">
                <label htmlFor="nickname">소모임 닉네임 *</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="소모임에서 사용할 닉네임"
                  maxLength={20}
                />
                <span className="char-count-gathering">{formData.nickname.length}/20</span>
              </div>

              <div className="form-group">
                <label htmlFor="introduction">한줄 소개 *</label>
                <input
                  type="text"
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="자신을 한줄로 소개해주세요"
                  maxLength={100}
                />
                <span className="char-count-gathering">{formData.introduction.length}/100</span>
              </div>
            </div>
          )}

          {/* 이미지 업로드 섹션 */}
          <div className="form-section">
            <h2 className="section-title">이미지</h2>
            
            <div className="form-group">
              <label htmlFor="titleImageInput">소모임 대표 이미지</label>
              <div className="image-upload-area">
                {titleImagePreview ? (
                  <div className="image-preview">
                    <img src={titleImagePreview} alt="대표 이미지 미리보기" />
                    <button type="button" onClick={removeTitleImage} className="remove-image-btn">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span>📷</span>
                    <p>대표 이미지를 선택하세요</p>
                  </div>
                )}
                <input
                  type="file"
                  id="titleImageInput"
                  accept="image/*"
                  onChange={handleTitleImageChange}
                  hidden
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('titleImageInput').click()}
                  className="upload-btn"
                >
                  이미지 선택
                </button>
              </div>
            </div>

            {/* 프로필 이미지 - 수정 모드일 때는 숨김 */}
            {!isEditMode && (
              <div className="form-group">
                <label htmlFor="profileImageInput">프로필 이미지</label>
                <div className="image-upload-area profile">
                  {profileImagePreview ? (
                    <div className="image-preview profile">
                      <img src={profileImagePreview} alt="프로필 이미지 미리보기" />
                      <button type="button" onClick={removeProfileImage} className="remove-image-btn">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder profile">
                      <span>👤</span>
                      <p>프로필 이미지를 선택하세요</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    hidden
                  />
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('profileImageInput').click()}
                    className="upload-btn"
                  >
                    이미지 선택
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                if (isEditMode) {
                  navigate(`/gathering/${gatheringId}`);
                } else {
                  window.history.back();
                }
              }}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditMode ? '수정 중...' : '생성 중...') 
                : (isEditMode ? '소모임 수정하기' : '소모임 만들기')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GatheringCreate;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gatheringApi from './GatheringAPI'; // 기존 API 경로 사용
import './GatheringJoin.css';

const GatheringJoin = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();
  const [gathering, setGathering] = useState(null);
  const [formData, setFormData] = useState({
    introduction: '',
    nickname: '',
    imageUrl: '' // imageUrl 필드 추가
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGatheringDetail();
  }, [gatheringId]);

  const fetchGatheringDetail = async () => {
    try {
      const data = await gatheringApi.getGatheringDetail(gatheringId);
      setGathering(data);
    } catch (error) {
      console.error('소모임 정보 조회 실패:', error);
      setError('소모임 정보를 불러올 수 없습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    
    if (url) {
      setImagePreview(url);
      setImage(null); // 파일 업로드 초기화
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, imageUrl: '' })); // URL 필드 초기화
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    document.getElementById('imageInput').value = '';
    document.getElementById('imageUrl').value = '';
  };

  const validateForm = () => {
    if (!formData.nickname.trim()) {
      setError('소모임 닉네임을 입력해주세요.');
      return false;
    }
    if (!formData.introduction.trim()) {
      setError('한줄 소개를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 기존 GatheringAPI.joinGathering 메서드 사용
      // FormData 형태로 전송 (기존 API 구조 유지)
      const joinData = {
        introduction: formData.introduction.trim(),
        nickname: formData.nickname.trim()
      };

      // 이미지가 있으면 추가 (파일 또는 URL)
      if (image) {
        joinData.image = image; // 파일 객체
      } else if (formData.imageUrl) {
        joinData.imageUrl = formData.imageUrl; // URL 문자열
      }
      
      await gatheringApi.joinGathering(gatheringId, joinData);
      
      alert('소모임 참여가 완료되었습니다!');
      navigate(`/gatherings/${gatheringId}`);
      
    } catch (error) {
      console.error('참여 실패:', error);
      if (error.message?.includes('이미 참여')) {
        setError('이미 참여한 소모임입니다.');
      } else if (error.message?.includes('블랙리스트')) {
        setError('참여가 제한된 소모임입니다.');
      } else if (error.message?.includes('닉네임')) {
        setError('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
      } else {
        setError(error.message || '참여에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/gatherings/${gatheringId}`);
  };

  if (!gathering) {
    return (
      <div className="gathering-join-container">
        <div className="loading">소모임 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="gathering-join-container">
      <div className="join-form-wrapper">
        <div className="gathering-info-header">
          <h1 className="join-title">소모임 참여하기</h1>
        </div>

        {/* 소모임 정보 미리보기 */}
        <div className="gathering-preview">
          <div className="preview-content">
            <h2 className="gathering-title">{gathering.title}</h2>
            <p className="gathering-location">📍 {gathering.dongName}</p>
            <p className="gathering-members">👥 현재 {gathering.memberCount}명 참여 중</p>
          </div>
          {gathering.titleImage && (
            <div className="preview-image">
              <img src={gathering.titleImage} alt={gathering.title} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-section">
            <h3 className="section-title">참여 정보 입력</h3>
            
            <div className="form-group">
              <label htmlFor="nickname">소모임 닉네임 *</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="소모임에서 사용할 닉네임을 입력하세요"
                maxLength={20}
                required
              />
              <span className="char-count">{formData.nickname.length}/20</span>
              <p className="field-hint">다른 참여자들에게 보여질 닉네임입니다.</p>
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
                required
              />
              <span className="char-count">{formData.introduction.length}/100</span>
              <p className="field-hint">간단한 자기소개를 통해 다른 참여자들과 친해져보세요!</p>
            </div>

            <div className="form-group">
              <label>프로필 이미지 (선택)</label>
              
              {/* 이미지 URL 입력 */}
              <div className="image-url-section">
                <label htmlFor="imageUrl">이미지 URL:</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="or-divider">
                <span>또는</span>
              </div>

              {/* 파일 업로드 */}
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="프로필 이미지 미리보기" />
                    <button type="button" onClick={removeImage} className="remove-image-btn">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span>👤</span>
                    <p>프로필 이미지를 선택하세요</p>
                  </div>
                )}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('imageInput').click()}
                  className="upload-btn"
                >
                  파일 선택
                </button>
              </div>
              <p className="field-hint">소모임에서 사용할 프로필 이미지를 설정해주세요.</p>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* 참여 규칙 */}
          <div className="join-rules">
            <h4>참여 시 주의사항</h4>
            <ul>
              <li>소모임 규칙을 준수해주세요</li>
              <li>다른 참여자들과 예의를 지켜주세요</li>
              <li>무단 불참은 자제해주세요</li>
              <li>부적절한 행동 시 퇴출될 수 있습니다</li>
            </ul>
          </div>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleBack}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? '참여 중...' : '소모임 참여하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GatheringJoin;
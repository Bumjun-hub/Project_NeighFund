import React, { useState, useEffect, useRef } from 'react';
import gatheringApi from './GatheringAPI';
import './GatheringPhotos.css';

const GatheringPhotos = ({ gatheringId, isMember }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // 모달용
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
  }, [gatheringId, isMember]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gatheringApi.getPhotos(gatheringId);
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('사진을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file) => {
    // 멤버 체크
    if (!isMember) {
      alert('소모임 멤버만 사진을 업로드할 수 있습니다.');
      return;
    }
    
    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 형식 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const result = await gatheringApi.uploadPhoto(gatheringId, file);
      
      // 업로드 성공 후 목록 새로고침
      await fetchPhotos();
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert('사진이 업로드되었습니다!');
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(`사진 업로드에 실패했습니다: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageClick = (photo) => {
    setSelectedImage(photo);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handlePhotoUpload(files[0]);
    }
  };

  if (loading) {
    return (
      <div className="photos-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>사진을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photos-container">
      {/* 업로드 섹션 - 멤버만 표시 */}
      {isMember && (
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div 
            className={`upload-area ${uploading ? 'uploading' : ''}`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="upload-progress">
                <div className="upload-spinner"></div>
                <p>업로드 중...</p>
              </div>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">📷</div>
                <p>사진을 업로드하세요</p>
                <p className="upload-hint">클릭하거나 드래그하여 이미지를 추가</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 비멤버용 안내 메시지 */}
      {!isMember && (
        <div className="non-member-notice">
          <div className="notice-content">
            <span className="notice-icon">📷</span>
            <span className="notice-text">
              사진 업로드는 소모임 멤버만 가능합니다
            </span>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchPhotos} className="retry-button">
            다시 시도
          </button>
        </div>
      )}

      {/* 사진 갤러리 */}
      <div className="photos-gallery">
        {photos.length === 0 ? (
          <div className="no-photos">
            <div className="no-photos-icon">📷</div>
            <p>아직 업로드된 사진이 없습니다.</p>
            {isMember && <p>첫 번째 사진을 업로드해보세요!</p>}
          </div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div 
                key={photo.id || index} 
                className="photo-item"
                onClick={() => handleImageClick(photo)}
              >
                <img 
                  src={photo.imageUrl || photo.url} 
                  alt={`소모임 사진 ${index + 1}`}
                  className="photo-image"
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <span className="photo-uploader">
                      {photo.uploaderNickname || '익명'}
                    </span>
                    <span className="photo-date">
                      {formatDate(photo.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              ✕
            </button>
            <img 
              src={selectedImage.imageUrl || selectedImage.url} 
              alt="확대된 사진"
              className="modal-image"
            />
            <div className="modal-info">
              <p className="modal-uploader">
                업로드: {selectedImage.uploaderNickname || '익명'}
              </p>
              <p className="modal-date">
                {formatDate(selectedImage.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatheringPhotos;
import React, { useState, useEffect } from 'react';

const ClassInfoInputPage2 = () => {
  const [formData, setFormData] = useState({
    freeParking: '',
    durationHours: ''
  });

  const [files, setFiles] = useState({
    productImages: []
  });

  const [previews, setPreviews] = useState({
    productImages: []
  });

  const [errors, setErrors] = useState({});
  const [isNextEnabled, setIsNextEnabled] = useState(true); // 이 페이지는 선택사항이므로 기본적으로 활성화
  const [gatheringId, setGatheringId] = useState(null);

  // URL 파라미터 또는 localStorage에서 gatheringId 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('gatheringId');
    
    if (idFromUrl) {
      setGatheringId(idFromUrl);
    } else {
      // localStorage에서 가져오기 (이전 페이지에서 저장했다고 가정)
      const storedId = localStorage.getItem('currentGatheringId');
      if (storedId) {
        setGatheringId(storedId);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    const fileList = e.target.files;
    const newImages = Array.from(fileList);
    
    if ((files.productImages?.length || 0) + newImages.length > 5) {
      alert('상세 이미지는 최대 5장까지 업로드할 수 있습니다.');
      return;
    }
    
    setFiles(prev => ({ 
      ...prev, 
      productImages: [...(prev.productImages || []), ...newImages] 
    }));
    
    // 이미지 미리보기 생성
    newImages.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({ 
            ...prev, 
            productImages: [...(prev.productImages || []), e.target.result] 
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeProductImage = (index) => {
    setFiles(prev => ({ 
      ...prev, 
      productImages: prev.productImages.filter((_, i) => i !== index) 
    }));
    setPreviews(prev => ({ 
      ...prev, 
      productImages: prev.productImages.filter((_, i) => i !== index) 
    }));
  };

  const handleNext = async () => {
    if (!gatheringId) {
      alert('클래스 정보를 찾을 수 없습니다. 이전 단계부터 다시 시도해주세요.');
      return;
    }

    try {
      // 세부 정보가 하나라도 있는지 확인
      if (!formData.freeParking && !formData.durationHours && files.productImages?.length === 0) {
        // 아무것도 입력하지 않았으면 바로 다음 단계로
        alert('세부 정보를 건너뛰고 다음 단계로 이동합니다.');
        window.location.href = '/classlistpage';
        return;
      }

      const updateFormData = new FormData();
      
      if (formData.freeParking) {
        updateFormData.append('freeParking', formData.freeParking);
      }
      
      if (formData.durationHours) {
        updateFormData.append('durationHours', formData.durationHours);
      }
      
      if (files.productImages?.length > 0) {
        files.productImages.forEach((file) => {
          updateFormData.append('productImages', file);
        });
      }
      
      const updateResponse = await fetch(`/api/gatherings/vendor/${gatheringId}/updateDetails`, {
        method: 'POST',
        body: updateFormData,
      });
      
      if (!updateResponse.ok) {
        throw new Error('세부 정보 저장 실패');
      }
      
      alert('세부 정보가 성공적으로 저장되었습니다. 관리자의 승인을 기다려 주십시오');
      
      localStorage.removeItem('currentGatheringId');
      
      window.location.href = '/classlistpage';
      
    } catch (error) {
      console.error('에러:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePrevious = () => {
    window.location.href = '/ClassInfoInputPage';
  };

  const handleSkip = () => {
    if (window.confirm('세부 정보를 건너뛰고 다음 단계로 이동하시겠습니까?')) {
      localStorage.removeItem('currentGatheringId');
      window.location.href = '/classlistpage';
    }
  };

  return (
    <div className="agreement-class-creation-container-vendor">
      <div className="agreement-class-creation-wrapper-vendor" style={{ maxWidth: '800px' }}>
        <h1 className="agreement-main-title-vendor">클래스 오픈 - 세부 정보</h1>

        {/* 진행 단계 */}
        <div className="agreement-progress-container">
          <div className="agreement-step">
            <span className="agreement-step-text">정책 동의</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step">
            <span className="agreement-step-text">기본 정보</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step agreement-step-active">
            <span className="agreement-step-text">세부 정보</span>
          </div>
        
          
        </div>

        <div className="info-form-container-vendor">
          {/* 세부 정보 */}
          <div className="info-section-vendor">
            <h3 className="info-section-title-vendor">⚙️ 세부 정보 (선택사항)</h3>
            
            <div className="info-field-vendor">
              <label className="info-label-vendor">수업 시간</label>
              <div className="info-duration-input-vendor">
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                  className="info-input-vendor"
                  placeholder="2"
                  min="0.5"
                  step="0.5"
                />
                <span className="info-duration-unit-vendor">시간</span>
              </div>
            </div>

            <div className="info-field-vendor">
              <label className="info-label-vendor">무료 주차</label>
              <select 
                name="freeParking" 
                value={formData.freeParking} 
                onChange={handleInputChange} 
                className="info-input-vendor"
              >
                <option value="">선택하세요</option>
                <option value="true">🅿️ 가능</option>
                <option value="false">❌ 불가능</option>
              </select>
            </div>

            <div className="info-field-vendor">
              <label className="info-label-vendor">상세 이미지 (최대 5장)</label>
              <div className="info-upload-area-vendor">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="info-file-input-vendor"
                  id="productImages"
                />
                <label htmlFor="productImages" className="info-upload-label-vendor">
                  <div className="info-upload-icon-vendor">📤</div>
                  <div className="info-upload-text-vendor">이미지를 업로드 하세요</div>
                </label>
              </div>
              
              {previews.productImages?.length > 0 && (
                <div className="info-image-grid-vendor">
                  {previews.productImages.map((preview, index) => (
                    <div key={index} className="info-image-grid-item-vendor">
                      <img src={preview} alt={`상세 이미지 ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeProductImage(index)} 
                        className="info-image-remove-vendor"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="info-button-container-vendor">
          <button 
            type="button" 
            onClick={handlePrevious} 
            className="info-prev-btn-vendor"
          >
            {'<'} 이전
          </button>
          
          <button 
            type="button" 
            onClick={handleSkip} 
            className="info-skip-btn-vendor"
            style={{ 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            건너뛰기
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="agreement-next-btn-vendor agreement-enabled-vendor"
            style={{ marginLeft: '10px' }}
          >
            다음 {'>'}
          </button>
        </div>
      </div>
    </div>
  );

};

export default ClassInfoInputPage2;
import React, { useState, useEffect } from 'react';
import './ClassInfoInputPage.css';

const ClassInfoInputPage = () => {
  const [formData, setFormData] = useState({
    title: '', category: '', dongName: '', productPrice: '',
    productName: '', maxParticipants: '', content: ''
  });

  const [files, setFiles] = useState({
    titleImage: null, businessLicense: null
  });

  const [previews, setPreviews] = useState({
    titleImage: null, businessLicense: null
  });

  const [errors, setErrors] = useState({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const categories = [
    { value: '', label: '카테고리를 선택하세요' },
    { value: 'COOKING', label: '요리' }, { value: 'CRAFT', label: '공예' },
    { value: 'FITNESS', label: '피트니스' }, { value: 'BEAUTY', label: '뷰티' },
    { value: 'MUSIC', label: '음악' }, { value: 'ART', label: '미술' },
    { value: 'LANGUAGE', label: '언어' }, { value: 'OTHER', label: '기타' }
  ];

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '클래스 제목을 입력해주세요.';
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요.';
    if (!formData.dongName.trim()) newErrors.dongName = '지역을 입력해주세요.';
    if (!formData.productPrice || Number(formData.productPrice) <= 0) newErrors.productPrice = '올바른 가격을 입력해주세요.';
    if (!formData.productName.trim()) newErrors.productName = '상품명을 입력해주세요.';
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) newErrors.maxParticipants = '올바른 참여자 수를 입력해주세요.';
    if (!formData.content.trim()) newErrors.content = '클래스 설명을 입력해주세요.';
    if (!files.businessLicense) newErrors.businessLicense = '사업자 등록증을 업로드해주세요.';
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsNextEnabled(isValid);
    return isValid;
  };

  useEffect(() => { validateForm(); }, [formData, files]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 변경 핸들러
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFiles(prev => ({ ...prev, [type]: file }));
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => ({ ...prev, [type]: null }));
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    
    try {
      // 기본 정보 저장
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('dongName', formData.dongName);
      formDataToSend.append('productPrice', String(formData.productPrice));
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('maxParticipants', String(formData.maxParticipants));
      
      if (files.titleImage) {
        formDataToSend.append('titleImage', files.titleImage);
      }
      
      if (files.businessLicense) {
        formDataToSend.append('businessLicense', files.businessLicense);
      }
      
      console.log('기본 정보 저장 중...');
      const createResponse = await fetch('/api/gatherings/vendor/create', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!createResponse.ok) {
        throw new Error('기본 정보 저장 실패');
      }
      
      const result = await createResponse.json();
      console.log('저장 성공:', result);
      
      // gatheringId를 localStorage에 저장
      localStorage.setItem('currentGatheringId', result.gatheringId);
      
      alert('클래스 정보가 성공적으로 저장되었습니다. 다음 단계로 이동합니다.');
      window.location.href = '/classInfoInputPage2';
      
    } catch (error) {
      console.error('에러:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePrevious = () => {
    alert('이전 단계(정책 동의)로 돌아갑니다!');
    window.location.href = '/classcreationpage'; 
  };

  // 파일 업로드 컴포넌트
  const FileUpload = ({ type, label, required, accept, preview, fileName, error }) => (
    <div className="info-field-vendor">
      <label className="info-label-vendor">
        {label} {required && <span className="info-required-vendor">*</span>}
      </label>
      <div className="info-upload-area-vendor">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, type)}
          className={`info-file-input-vendor ${error ? 'info-error-vendor' : ''}`}
          id={type}
        />
        <label htmlFor={type} className="info-upload-label-vendor">
          {preview ? (
            <div className="info-image-preview-vendor">
              <img src={preview} alt="미리보기" />
              <div className="info-image-overlay-vendor">
                <div className="info-upload-icon-vendor">📤</div>
                <div className="info-upload-text-vendor">이미지 변경</div>
              </div>
            </div>
          ) : (
            <>
              <div className="info-upload-icon-vendor">📤</div>
              <div className="info-upload-text-vendor">이미지 혹은 파일을 업로드 하세요</div>
            </>
          )}
        </label>
      </div>
      {fileName && <div className="info-file-preview-vendor">✅ {fileName}</div>}
      {error && <span className="info-error-text-vendor">{error}</span>}
    </div>
  );

  return (
    <div className="agreement-class-creation-container-vendor">
      <div className="agreement-class-creation-wrapper-vendor" style={{ maxWidth: '800px' }}>
        <h1 className="agreement-main-title-vendor">클래스 오픈</h1>

        {/* 진행 단계 */}
        <div className="agreement-progress-container">
          <div className="agreement-step">
            <span className="agreement-step-text">정책 동의</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step agreement-step-active">
            <span className="agreement-step-text">기본 정보</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step">
            <span className="agreement-step-text">세부 정보</span>
          </div>
          
          
        </div>

        <div className="info-form-container-vendor">
          {/* 기본 정보 */}
          <div className="info-section-vendor">
            <h3 className="info-section-title-vendor">📝 기본 정보</h3>
            
            {[
              { name: 'title', label: '클래스 제목', placeholder: '예: 홈메이드 베이킹 클래스', required: true },
              { name: 'dongName', label: '지역 (동명)', placeholder: '예: 강남동', required: true },
              { name: 'productName', label: '상품명', placeholder: '예: 베이킹 키트', required: true }
            ].map(field => (
              <div key={field.name} className="info-field-vendor">
                <label className="info-label-vendor">
                  {field.label} {field.required && <span className="info-required-vendor">*</span>}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className={`info-input-vendor ${errors[field.name] ? 'info-error-vendor' : ''}`}
                  placeholder={field.placeholder}
                />
                {errors[field.name] && <span className="info-error-text-vendor">{errors[field.name]}</span>}
              </div>
            ))}

            <div className="info-field-vendor">
              <label className="info-label-vendor">카테고리 <span className="info-required-vendor">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`info-input-vendor ${errors.category ? 'info-error-vendor' : ''}`}
              >
                {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
              {errors.category && <span className="info-error-text-vendor">{errors.category}</span>}
            </div>

            <div className="info-field-vendor">
              <label className="info-label-vendor">수강료 <span className="info-required-vendor">*</span></label>
              <div className="info-price-input-vendor">
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  className={`info-input-vendor ${errors.productPrice ? 'info-error-vendor' : ''}`}
                  placeholder="50000"
                />
                <span className="info-price-unit-vendor">원</span>
              </div>
              {errors.productPrice && <span className="info-error-text-vendor">{errors.productPrice}</span>}
            </div>

            <div className="info-field-vendor">
              <label className="info-label-vendor">최대 참여자 수 <span className="info-required-vendor">*</span></label>
              <div className="info-participants-input-vendor">
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className={`info-input-vendor ${errors.maxParticipants ? 'info-error-vendor' : ''}`}
                  placeholder="10"
                  min="1"
                />
                <span className="info-participants-unit-vendor">명</span>
              </div>
              {errors.maxParticipants && <span className="info-error-text-vendor">{errors.maxParticipants}</span>}
            </div>

            <div className="info-field-vendor">
              <label className="info-label-vendor">클래스 설명 <span className="info-required-vendor">*</span></label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`info-textarea-vendor ${errors.content ? 'info-error-vendor' : ''}`}
                placeholder="클래스에 대한 자세한 설명을 작성해주세요..."
                rows="4"
              />
              {errors.content && <span className="info-error-text-vendor">{errors.content}</span>}
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="info-section-vendor">
            <h3 className="info-section-title-vendor">📸 이미지 및 첨부파일</h3>
            
            <FileUpload 
              type="titleImage" 
              label="대표 이미지" 
              accept="image/*" 
              preview={previews.titleImage}
              fileName={files.titleImage?.name}
            />

            <FileUpload 
              type="businessLicense" 
              label="사업자 등록증" 
              required 
              accept="image/*,.pdf" 
              preview={previews.businessLicense}
              fileName={files.businessLicense?.name}
              error={errors.businessLicense}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="info-button-container-vendor">
          <button type="button" onClick={handlePrevious} className="info-prev-btn-vendor">{'<'} 이전</button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`agreement-next-btn-vendor ${isNextEnabled ? 'agreement-enabled-vendor' : 'agreement-disabled-vendor'}`}
          >
            다음 {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassInfoInputPage;
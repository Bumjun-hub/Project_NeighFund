import React, { useState, useEffect, useRef } from 'react';
import AddressInput from '../memberpage/AddressInput'; 
import './MyPageEditProfile.css';
import { deleteAccount } from '../../utils/authUtils';

const MyPageEditProfile = () => {
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: '', detailAddress: '', imageUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [phoneError, setPhoneError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const parseAddress = (fullAddress) => {
    if (!fullAddress) return { address: '', detailAddress: '' };
    const parts = fullAddress.split(' ');
    if (parts.length > 3) {
      return { 
        address: parts.slice(0, -2).join(' '), 
        detailAddress: parts.slice(-2).join(' ') 
      };
    }
    return { address: fullAddress, detailAddress: '' };
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/mypage', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        const { address, detailAddress } = parseAddress(data.address);
        
        setProfile({
          name: data.username || data.name,
          email: data.email,
          phone: data.phone,
          address,
          detailAddress,
          imageUrl: data.imageUrl || '/static/profileimages/profile1.jpg'  
        });
      }
    } catch (err) {
      console.error('프로필 로드 실패:', err);
    }
  };

  const startEdit = () => {
    setEditData({ ...profile });
    setEditMode(true);
    setPhoneError('');
    setUploadError('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData({});
    setPhoneError('');
    setUploadError('');
    setSelectedFile(null);
    setPreviewUrl('');
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
      
      // 전화번호 유효성 검사
      if (value && value.length > 0 && value.length !== 13) {
        setPhoneError(`전화번호는 13자리로 입력해주세요. (현재: ${value.length}자리)`);
      } else {
        setPhoneError('');
      }
    }
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 11자리 이상 입력 방지
    if (numbers.length > 11) {
      return editData.phone || '';
    }
    
    // 전화번호 포맷팅 (13자리: 010-1234-5678)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setUploadError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('JPG, PNG, GIF 파일만 업로드 가능합니다.');
      event.target.value = '';
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('파일 크기는 5MB 이하로 업로드해주세요.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/auth/mypage/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        // 업로드 성공 후 새로운 이미지 URL 반환 (서버에서 반환하는 경우)
        const result = await response.text();
        console.log('이미지 업로드 성공:', result);
        return true;
      } else {
        const errorText = await response.text();
        console.error('이미지 업로드 실패:', errorText);
        setUploadError('이미지 업로드에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      setUploadError('이미지 업로드 중 오류가 발생했습니다.');
      return false;
    }
  };

  const validateForm = () => {
    // 전화번호가 입력되었다면 13자리 검증
    if (editData.phone && editData.phone.length !== 13) {
      setPhoneError('전화번호는 13자리로 입력해주세요. (예: 010-1234-5678)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const updateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // 먼저 이미지 업로드 (선택된 파일이 있는 경우)
      let imageUploadSuccess = true;
      if (selectedFile) {
        imageUploadSuccess = await uploadProfileImage();
        if (!imageUploadSuccess) {
          return; // 이미지 업로드 실패 시 프로필 업데이트 중단
        }
      }

      // 프로필 정보 업데이트
      const profileResponse = await fetch('/api/auth/mypage/editProfile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          address: `${editData.address} ${editData.detailAddress}`.trim()
        })
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('프로필 업데이트 실패:', errorText);
        alert('프로필 업데이트에 실패했습니다.');
        return;
      }

      // 성공 처리
      const data = await profileResponse.json();
      console.log('서버 응답 데이터:', data);
      
      const { address, detailAddress } = parseAddress(data.address);
      
      // 프로필 상태 업데이트 (이미지가 업로드된 경우 새로 가져오기)
      if (selectedFile) {
        // 서버에서 업데이트된 프로필 정보를 다시 가져오기
        await fetchProfile();
      } else {
        setProfile({
          name: data.username || data.name,
          email: data.email,
          phone: data.phone,
          address,
          detailAddress,
          imageUrl: profile.imageUrl // 기존 이미지 유지
        });
      }
      
      setEditMode(false);
      setEditData({});
      setPhoneError('');
      setUploadError('');
      setSelectedFile(null);
      setPreviewUrl('');

      alert('프로필이 성공적으로 업데이트되었습니다.');

      // 프로필 업데이트 후 헤더와 마이페이지의 사용자 정보도 업데이트
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('profileUpdate'));

    } catch (err) {
      console.error('프로필 업데이트 중 오류:', err);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?\n\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      try {
        const result = await deleteAccount();
        if (result.success) {
          alert('회원탈퇴가 완료되었습니다.');
        }
      } catch (error) {
        alert('회원탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  // 현재 표시할 이미지 URL 결정
  const getCurrentImageUrl = () => {
    if (editMode && previewUrl) {
      return previewUrl; // 새로 선택한 파일의 미리보기
    }
    return profile.imageUrl; // 기존 프로필 이미지
  };

  return (
    <div className="mypage-container">
      <div className="mypage-card">
        <div className="mypage-header">
          <h1>프로필 편집</h1>
          {!editMode && (
            <button onClick={startEdit} className="edit-button1">편집</button>
          )}
        </div>

        <div className="profile-content">
          {/* 프로필 이미지 섹션 */}
          <div className="field-group">
            <label>프로필 이미지</label>
            <div className="profile-image-section">
              <div className="current-image">
                <img 
                  src={getCurrentImageUrl()} 
                  alt="프로필 이미지" 
                  className="profile-image-preview"
                />
              </div>
              
              {editMode && (
                <div className="image-upload-section">
                  <div className="file-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      className="file-input"
                      id="profile-image-input"
                    />
                    <label htmlFor="profile-image-input" className="file-upload-label">
                      이미지 선택
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="selected-file-info">
                      <p>선택된 파일: {selectedFile.name}</p>
                      <p>파일 크기: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
                    </div>
                  )}
                  
                  {uploadError && (
                    <div className="upload-error" style={{color: '#f44336', fontSize: '12px', marginTop: '4px'}}>
                      {uploadError}
                    </div>
                  )}
                  
                  <p className="image-help-text">
                    JPG, PNG, GIF 파일 (최대 5MB)<br/>
                    이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 기본 정보 필드들 */}
          <div className="field-group">
            <label>사용자명</label>
            {editMode ? (
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="사용자명을 입력하세요"
              />
            ) : (
              <span>{profile.name || '설정되지 않음'}</span>
            )}
          </div>

          <div className="field-group">
            <label>이메일</label>
            {editMode ? (
              <input
                type="email"
                value={editData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="이메일을 입력하세요"
                disabled
              />
            ) : (
              <span>{profile.email || '설정되지 않음'}</span>
            )}
          </div>

          <div className="field-group">
            <label>전화번호</label>
            {editMode ? (
              <div>
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="010-1234-5678 ( - 제외하고 입력 )"
                  maxLength="13"
                />
                {phoneError && (
                  <small className="phone-error" style={{color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                    {phoneError}
                  </small>
                )}
              </div>
            ) : (
              <span>{profile.phone || '설정되지 않음'}</span>
            )}
          </div>

          <div className="field-group">
            <label>주소</label>
            {editMode ? (
              <AddressInput
                address={editData.address || ''}
                detailAddress={editData.detailAddress || ''}
                onAddressChange={(address) => handleInputChange('address', address)}
                onDetailAddressChange={(detailAddress) => handleInputChange('detailAddress', detailAddress)}
                label=""
                editMode={true}
                className=""
              />
            ) : (
              <span>{`${profile.address} ${profile.detailAddress}`.trim() || '설정되지 않음'}</span>
            )}
          </div>

          <div className="bottom-section">
            <button 
              onClick={handleDeleteAccount}
              className="delete-account-btn"
            >
              회원탈퇴
            </button>
          </div>
        </div>

        {editMode && (
          <div className="action-buttons">
            <button onClick={cancelEdit} className="cancel-button1">취소</button>
            <button 
              onClick={updateProfile} 
              className="save-button"
              disabled={!!phoneError || !!uploadError}
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageEditProfile;
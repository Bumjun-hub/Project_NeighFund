import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MyPage.css';
import MyPageEditProfile from './MyPageEditProfile';
import CheckPw from './CheckPw.js'; 
import ChangePw from './ChangePw.js';
import MyPosts from './MyPosts';
import { PiFinnTheHumanBold } from "react-icons/pi";
import { authenticatedFetch } from '../../utils/authUtils';
import { useAuth } from '../../utils/AuthProvider';

const MyPage = () => {
    const [showChangePw, setShowChangePw] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null); 

    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        profileImage: ''
    });
    const [updateKey, setUpdateKey] = useState(0);
    const [currentView, setCurrentView] = useState('main'); 
    const [showPasswordCheck, setShowPasswordCheck] = useState(false); 
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // ✅ 프로필 업데이트 이벤트 감지
    useEffect(() => {
        const handleProfileUpdate = () => {
            console.log('MyPage: 프로필 업데이트 이벤트 감지 - 사용자 정보 새로고침');
            fetchUserInfo(); 
            setUpdateKey(prev => prev + 1); 
        };
        
        const handleAuthChange = () => {
            console.log('MyPage: 인증 변경 이벤트 감지 - 사용자 정보 새로고침');
            fetchUserInfo(); 
            setUpdateKey(prev => prev + 1); 
        };
        
        // 프로필 업데이트 이벤트 리스너 등록
        window.addEventListener('profileUpdate', handleProfileUpdate);
        window.addEventListener('authChange', handleAuthChange);
        
        return () => {
            window.removeEventListener('profileUpdate', handleProfileUpdate);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    // URL 변경 감지해서 메인 화면으로 리셋
    useEffect(() => {
        if (location.pathname === '/mypage' && !location.hash && !location.search) {
            setCurrentView('main');
            setSelectedRecipe(null);
            setShowChangePw(false);
            setShowPasswordCheck(false);
        }
    }, [location]);

    const handleChangePassword = () => {
        setShowChangePw(true);
        navigate('/mypage?view=changePw');
    };

    const handleCloseChangePw = () => {
        setShowChangePw(false);
        navigate('/mypage');
    };


    const getProfileImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        // ✅ 이미지 캐시 방지를 위한 타임스탬프 추가
        return `http://localhost:8080${imageUrl}?t=${Date.now()}`;
    };

    const fetchUserInfo = async () => {
        try {
            const response = await authenticatedFetch('http://localhost:8080/api/auth/mypage', {
                method: 'GET',
            });
            
            if (response.ok) {
                const data = await response.json();
                
                setUserInfo({
                    username: data.username || data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    profileImage: data.imageUrl 
                });
            }
        } catch (error) {
            console.error('MyPage: 사용자 정보 로드 실패:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleEditProfile = () => {
        setShowPasswordCheck(true);
    };

    const handlePasswordVerified = () => {
        setShowPasswordCheck(false);
        setCurrentView('editProfile');
        navigate('/mypage?view=editProfile');
    };

    const handlePasswordCheckCancel = () => {
        setShowPasswordCheck(false);
        navigate('/mypage');
    };

    const handleGoToMyPost = () => {
        setCurrentView('myPosts');
        navigate('/mypage?view=myPosts');
    };


    // ✅ 프로필 편집에서 메인으로 돌아올 때 사용자 정보 새로고침
    useEffect(() => {
        if (currentView === 'main') {
            fetchUserInfo();
        }
    }, [currentView]);

    if (currentView === 'editProfile') {
        return <MyPageEditProfile />;
    }

    if (currentView === 'myPosts') {
        return <MyPosts />;
    }

    return (
        <div className="mypage-container">
            <div className="profile-section-mypage">
                <div className="profile-image-mypage">
                    {userInfo.profileImage ? (
                        <img 
                            src={getProfileImageUrl(userInfo.profileImage)}
                            alt="프로필"
                            key={userInfo.profileImage} 
                        />
                    ) : (
                        <div className="mypage-profile-placeholder">
                            {(userInfo?.username || userInfo?.name)?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                <h2 className="profile-name-mypage" key={`username-${updateKey}`}>
                    {userInfo.username || '홍길동'}
                </h2>
                <p className="profile-email-mypage">
                    {userInfo.email || user?.email || 'example@email.com'}
                </p>
                
            </div>

            <div className="menu-section-mypage">
                <div className="menu-list-mypage">
                    <MenuItem 
                        icon="👤" 
                        text="프로필 편집" 
                        onClick={handleEditProfile}
                    />
                    <MenuItem 
                        icon="🔒" 
                        text="비밀번호 변경" 
                        onClick={handleChangePassword}
                    />
                    <MenuItem 
                        icon="📝" 
                        text="내가 쓴 글" 
                        onClick={handleGoToMyPost}
                    />
                </div>
            </div>

            {showPasswordCheck && (
                <CheckPw
                    onPasswordVerified={handlePasswordVerified}
                    onCancel={handlePasswordCheckCancel}
                />
            )}

            {showChangePw && (
                <ChangePw 
                    onClose={handleCloseChangePw}
                />
            )}
        </div>
    );
};

const MenuItem = ({ icon, text, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="menu-item-mypage"
        >
            <span className="menu-icon-mypage">{icon}</span>
            <span className="menu-text-mypage">{text}</span>
            <svg 
                className="menu-arrow-mypage" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
};

export default MyPage;
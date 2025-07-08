// services/gatheringApi.js
import { authenticatedFetch } from '../../utils/authUtils'; // authUtils import 추가

const API_BASE_URL = 'http://localhost:8080/api';

// 기본 fetch 옵션
const defaultOptions = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
};

// FormData용 옵션 (Content-Type 제외)
const formDataOptions = {
  credentials: 'include',
  headers: {}
};

class GatheringAPI {
  // 소모임 목록 조회 (인증 불필요)
  async getGatheringList() {
    try {
      const response = await fetch(`${API_BASE_URL}/gatherings/free/list`, {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`소모임 목록 조회 실패: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          console.log('로그인하지 않은 사용자 - 빈 목록 반환');
        } else if (response.status === 403) {
          console.log('접근 권한 없음 - 빈 목록 반환');
        } else if (response.status === 404) {
          console.log('API 엔드포인트를 찾을 수 없음');
        }
        
        return []; // 모든 에러에 대해 빈 배열 반환
      }

      const data = await response.json();
      console.log('소모임 목록 조회 성공:', data?.length || 0, '개');
      return data || [];
      
    } catch (error) {
      console.warn('네트워크 에러 또는 기타 문제:', error.message);
      return []; // 네트워크 에러 등의 경우에도 빈 배열 반환
    }
  }

  // 소모임 상세 조회 (인증된 사용자는 authenticatedFetch, 비인증 사용자는 일반 fetch)
  async getGatheringDetail(id) {
  try {
    console.log('🔍 getGatheringDetail 호출, ID:', id);
    
    // 캐시 방지를 위한 타임스탬프 추가
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${API_BASE_URL}/gatherings/free/detail/${id}?_t=${timestamp}`;
    
    // authenticatedFetch를 먼저 시도 (인증된 사용자 정보 포함)
    let response;
    let isAuthenticated = true;
    
    try {
      response = await authenticatedFetch(urlWithTimestamp, {
        method: 'GET'
      });
      console.log('✅ authenticatedFetch 성공');
    } catch (authError) {
      console.log('🔄 인증 실패 - 일반 fetch로 폴백');
      isAuthenticated = false;
      
      // 인증 실패 시 일반 fetch로 폴백 (비회원 조회)
      response = await fetch(urlWithTimestamp, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ getGatheringDetail 성공');
    console.log('인증 상태:', isAuthenticated);
    console.log('응답 데이터:', data);
    console.log('isMember 값:', data.isMember);
    
    return data;
    
  } catch (error) {
    console.error('❌ getGatheringDetail 에러:', error);
    throw error;
  }
}

  // 소모임 생성 (🔧 authenticatedFetch 사용)
  async createGathering(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/create`, {
      method: 'POST',
      body: formData,
      headers: {} // FormData는 Content-Type 자동 설정
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 참여 (🔧 authenticatedFetch 사용)
  async joinGathering(gatheringId, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/join`, {
      method: 'POST',
      body: formData,
      headers: {}
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.text();
  }

  // 소모임 수정 (🔧 authenticatedFetch 사용)
  async editGathering(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/edit/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 삭제 (🔧 authenticatedFetch 사용)
  async deleteGathering(id) {
    const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/delete/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // ==================== 게시판 관련 메서드 ====================

  // 게시글 목록 조회 (🔧 authenticatedFetch 사용)
  async getPosts(gatheringId) {
    try {
      console.log('🔍 getPosts 호출, gatheringId:', gatheringId);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/getPosts`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`게시글 목록을 불러오는데 실패했습니다. (${response.status})`);
      }
      
      const data = await response.json();
      console.log('✅ getPosts 성공, 개수:', data.length);
      return data;
      
    } catch (error) {
      console.error('❌ getPosts 에러:', error);
      throw error;
    }
  }

  // 게시글 상세보기 (🔧 authenticatedFetch 사용)
  async getPostDetail(gatheringId, postId) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/detail/${postId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`게시글 상세 정보를 불러오는데 실패했습니다. (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getPostDetail error:', error);
      throw error;
    }
  }

  // 게시글 작성 (🔧 authenticatedFetch 사용)
  async createPost(gatheringId, title, content, category, images = []) {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      
      // 이미지 파일들 추가
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/create/posts`, {
        method: 'POST',
        body: formData,
        headers: {}
      });
      
      if (!response.ok) {
        throw new Error(`게시글 작성에 실패했습니다. (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('createPost error:', error);
      throw error;
    }
  }

  // 게시글 수정 (🔧 authenticatedFetch 사용)
  async editPost(gatheringId, postId, title, content, images = []) {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // 이미지 파일들 추가
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/edit/${postId}`, {
        method: 'PUT',
        body: formData,
        headers: {}
      });
      
      if (!response.ok) {
        throw new Error(`게시글 수정에 실패했습니다. (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('editPost error:', error);
      throw error;
    }
  }

  

  async getCurrentUser() {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/auth/mypage`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`사용자 정보를 가져올 수 없습니다. (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw error;
    }
  }

  // 소모임 멤버십 확인 (프론트엔드에서 계산)
  async checkMembership(gatheringId) {
    try {
      const [gathering, currentUser] = await Promise.all([
        this.getGatheringDetail(gatheringId),
        this.getCurrentUser()
      ]);

      if (!currentUser || !gathering) {
        return false;
      }

      // 1. 소모임 생성자인지 확인
      if (gathering.creator && gathering.creator.username === currentUser.username) {
        return true;
      }

      // 2. 소모임 멤버 목록에 있는지 확인
      if (gathering.members && gathering.members.length > 0) {
        return gathering.members.some(member => 
          member.username === currentUser.username
        );
      }

      // 3. 참여자 목록이 있다면 확인 (API 응답 구조에 따라 조정)
      if (gathering.participants && gathering.participants.length > 0) {
        return gathering.participants.some(participant => 
          participant.username === currentUser.username
        );
      }

      return false;
    } catch (error) {
      console.error('checkMembership error:', error);
      return false; // 에러 시 false 반환
    }
  }

  // 사진 업로드 (🔧 authenticatedFetch 사용)
  async uploadPhoto(gatheringId, image) {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`, {
        method: 'POST',
        body: formData,
        headers: {}
      });
      
      if (!response.ok) {
        throw new Error(`사진 업로드에 실패했습니다. (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('uploadPhoto error:', error);
      throw error;
    }
  }

  // 사진 목록 조회 (🔧 authenticatedFetch 사용)
  async getPhotos(gatheringId) {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`사진 목록을 불러오는데 실패했습니다 (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getPhotos error:', error);
      throw error;
    }
  }
}


export default new GatheringAPI();
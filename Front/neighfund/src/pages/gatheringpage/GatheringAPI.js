// services/gatheringApi.js
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
  // 소모임 목록 조회
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

  // 소모임 상세 조회
  async getGatheringDetail(id) {
    const response = await fetch(`${API_BASE_URL}/gatherings/free/detail/${id}`, {
      ...defaultOptions,
      method: 'GET'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 생성
  async createGathering(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/gatherings/free/create`, {
      ...formDataOptions,
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 참여
  async joinGathering(gatheringId, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/join`, {
      ...formDataOptions,
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.text();
  }

  // 소모임 수정
  async editGathering(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/gatherings/free/edit/${id}`, {
      ...formDataOptions,
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 삭제
  async deleteGathering(id) {
    const response = await fetch(`${API_BASE_URL}/gatherings/free/delete/${id}`, {
      ...defaultOptions,
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 게시글 목록
  async getPosts(gatheringId) {
    const response = await fetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/getPosts`, {
      ...defaultOptions,
      method: 'GET'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 게시글 작성
  async createPost(gatheringId, data, images) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (images) images.forEach(img => formData.append('images', img));

    const response = await fetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/create/posts`, {
      ...formDataOptions,
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 사진 업로드
  async uploadPhoto(gatheringId, image) {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`, {
      ...formDataOptions,
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 사진 목록
  async getPhotos(gatheringId) {
    const response = await fetch(`${API_BASE_URL}/gatherings/free/${gatheringId}/photos`, {
      ...defaultOptions,
      method: 'GET'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }
}

export default new GatheringAPI();
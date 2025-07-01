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
      const response = await fetch(`${API_BASE_URL}/gatherings/list`, {
        ...defaultOptions,
        method: 'GET'
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('로그인이 필요합니다. 빈 목록을 반환합니다.');
          return []; // 빈 배열 반환
        }
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.warn('소모임 목록 조회 실패:', error.message);
      return []; // 에러 시 빈 배열 반환
    }
  }

  // 소모임 상세 조회
  async getGatheringDetail(id) {
    const response = await fetch(`${API_BASE_URL}/gatherings/detail/${id}`, {
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

    const response = await fetch(`${API_BASE_URL}/gatherings/create`, {
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

    const response = await fetch(`${API_BASE_URL}/gatherings/${gatheringId}/join`, {
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

    const response = await fetch(`${API_BASE_URL}/gatherings/edit/${id}`, {
      ...formDataOptions,
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 소모임 삭제
  async deleteGathering(id) {
    const response = await fetch(`${API_BASE_URL}/gatherings/delete/${id}`, {
      ...defaultOptions,
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 게시글 목록
  async getPosts(gatheringId) {
    const response = await fetch(`${API_BASE_URL}/gatherings/${gatheringId}/getPosts`, {
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

    const response = await fetch(`${API_BASE_URL}/gatherings/${gatheringId}/create/posts`, {
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

    const response = await fetch(`${API_BASE_URL}/gatherings/${gatheringId}/photos`, {
      ...formDataOptions,
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }

  // 사진 목록
  async getPhotos(gatheringId) {
    const response = await fetch(`${API_BASE_URL}/gatherings/${gatheringId}/photos`, {
      ...defaultOptions,
      method: 'GET'
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  }
}

export default new GatheringAPI();
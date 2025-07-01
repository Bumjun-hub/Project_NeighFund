const API_BASE_URL = '/api/community';
const defaultOptions = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
};

class SuggestionAPI {
  // 제안글 전체 조회
  async getAllSuggestions() {
    const res = await fetch(`${API_BASE_URL}/view`, defaultOptions);
    if (!res.ok) throw new Error('목록 조회 실패');
    return res.json();
  }

  // 제안글 상세 조회
  async getSuggestionDetail(id) {
    const res = await fetch(`${API_BASE_URL}/detail/${id}`, defaultOptions);
    if (!res.ok) throw new Error('상세 조회 실패');
    return res.json();
  }

  // 제안글 작성
  async createSuggestion(data) {
    const res = await fetch(`${API_BASE_URL}/write`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('작성 실패');
    return res.json();
  }

  // 제안글 수정
  async updateSuggestion(id, data) {
    const res = await fetch(`${API_BASE_URL}/edit/${id}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('수정 실패');
    return res.json();
  }

  // 제안글 삭제
  async deleteSuggestion(id) {
    const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
      ...defaultOptions,
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('삭제 실패');
    return res.text();
  }

  // 현재 로그인된 사용자 정보 조회
  async getCurrentUser() {
    const res = await fetch(`/api/roleinfo`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('유저 정보 조회 실패');
    return res.json();
  }
}

export default new SuggestionAPI();

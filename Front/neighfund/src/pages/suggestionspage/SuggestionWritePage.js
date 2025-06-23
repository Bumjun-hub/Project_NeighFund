// SuggestionWritePage.js
import React, { useState } from 'react';
import './SuggestionWritePage.css';

const SuggestionWritePage = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '환경',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 내용:', form);
    alert('글이 등록되었습니다. (현재는 더미 상태입니다)');
  };

  return (
    <div className="suggestion-write-wrapper">
      <h2 className="suggestion-write-title">제안 글쓰기</h2>
      <form onSubmit={handleSubmit} className="suggestion-write-form">
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows="6"
          required
        />

        <label>카테고리</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="환경">환경</option>
          <option value="교육">교육</option>
          <option value="생활환경">생활환경</option>
        </select>

        <button type="submit" className="suggestion-write-submit">등록</button>
      </form>
    </div>
  );
};

export default SuggestionWritePage;

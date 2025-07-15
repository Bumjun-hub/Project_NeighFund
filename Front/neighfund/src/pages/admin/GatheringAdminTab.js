import React, { useState } from "react";
import "./AdminStyles.css";

const GatheringAdminTab = ({ gatherings = [], onDelete }) => {
  const [selectedGathering, setSelectedGathering] = useState(null);

  return (
    <div className="gathering-admin">
      <h2>👥 소모임 관리</h2>
      <ul>
        {gatherings.length === 0 ? (
          <li>소모임 데이터가 없습니다.</li>
        ) : (
          gatherings.map((g) => (
            <li key={g.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18,
                  padding: '12px 10px', borderRadius: 8, border: '1px solid #eee', background: '#fafbfc',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedGathering(g)} // 🟢 클릭 시 상세 정보 저장
            >
              {g.titleImage && (
                <img src={g.titleImage} alt="대표이미지"
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', marginRight: 12 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div><strong>{g.title}</strong> <span style={{ color: '#888' }}>({g.category})</span></div>
                <div>동네: {g.dongName}</div>
                <div>멤버: {g.memberCount}명 | 공감수: {g.likes}</div>
                <div style={{ fontSize: 13, color: '#999' }}>생성일: {g.createdAt ? g.createdAt.split('T')[0] : '-'}</div>
              </div>
              <button
                style={{
                  background: '#e53935', color: 'white', border: 'none',
                  borderRadius: 5, padding: '8px 16px', cursor: 'pointer', fontWeight: 600
                }}
                onClick={e => { e.stopPropagation(); onDelete && onDelete(g.id); }}
              >삭제</button>
            </li>
          ))
        )}
      </ul>

      {/* 🟢 상세 정보 패널: 선택된 소모임 정보가 있으면 렌더링 */}
      {selectedGathering && (
        <div className="gathering-detail" style={{
          marginTop: 24, padding: 20, border: '1px solid #bbb',
          borderRadius: 10, background: '#fff'
        }}>
          <h3>📌 소모임 상세 정보</h3>
          {selectedGathering.titleImage && (
            <img src={selectedGathering.titleImage} alt="대표이미지"
                 style={{ width: 120, height: 120, borderRadius: 10, objectFit: 'cover', marginBottom: 12 }}/>
          )}
          <div><strong>제목:</strong> {selectedGathering.title}</div>
          <div><strong>카테고리:</strong> {selectedGathering.category}</div>
          <div><strong>동네:</strong> {selectedGathering.dongName}</div>
          <div><strong>멤버수:</strong> {selectedGathering.memberCount}명</div>
          <div><strong>공감수:</strong> {selectedGathering.likes}</div>
          <div><strong>생성일:</strong> {selectedGathering.createdAt?.split('T')[0]}</div>
          <div><strong>소개/내용:</strong> {selectedGathering.introduction || selectedGathering.content}</div>
          {/* 멤버 리스트가 있다면 표시 */}
          {selectedGathering.members && Array.isArray(selectedGathering.members) && (
            <>
              <h4 style={{ marginTop: 18 }}>👤 멤버 목록</h4>
              <ul>
                {selectedGathering.members.map(m => (
                  <li key={m.id || m.memberId}>
                    {m.nickname || m.username}
                    {/* 추가 정보 원하면 더 출력 */}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button style={{ marginTop: 20, background: '#1976d2', color: 'white', border: 'none', borderRadius: 5, padding: '8px 18px', cursor: 'pointer' }}
            onClick={() => setSelectedGathering(null)}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default GatheringAdminTab;


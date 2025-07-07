import './AdminStyles.css';

const CommunityAdminTab = ({ communityPosts, handleCommunityStatusChange }) => {
  return (
    <div className="community-admin">
      <h2>🗂 제안게시판 상태 변경</h2>
      <ul>
        {communityPosts.map((post) => (
          <li key={post.id} className="community-item">
            <span>
              <strong>{post.title}</strong>
              {" "} - 상태: {post.status}
              {" "} - 💗 공감 수: {post.likes}
            </span>
            <select
              value={post.status}
              onChange={(e) => handleCommunityStatusChange(post.id, e.target.value)}
            >
              <option value="RECRUITING">공감하기</option>
              <option value="FUNDED">펀딩 완료</option>
              <option value="ON_HOLD">보류 중</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityAdminTab;

import React, { useState, useEffect } from 'react';
import gatheringApi from './GatheringAPI';
import './GatheringBoard.css';

const GatheringBoard = ({ gatheringId, isMember }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // 게시글 목록 조회
  useEffect(() => {
    if (isMember) {
      fetchPosts();
    }
  }, [gatheringId, isMember]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await gatheringApi.getPosts(gatheringId);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 게시글 상세보기
  const handlePostClick = async (postId) => {
    try {
      const postDetail = await gatheringApi.getPostDetail(gatheringId, postId);
      setSelectedPost(postDetail);
    } catch (error) {
      console.error('Error fetching post detail:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  // 게시글 작성 폼 표시
  const handleCreatePost = () => {
    setShowCreateForm(true);
  };

  // 게시글 수정 폼 표시
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditForm(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 카테고리 한글 변환
  const getCategoryText = (category) => {
    const categoryMap = {
      'NOTICE': '공지사항',
      'GENERAL': '일반',
      'QUESTION': '질문',
      'REVIEW': '후기',
      'PHOTO': '사진'
    };
    return categoryMap[category] || category;
  };

  // 게시글 목록 렌더링
  const renderPostList = () => {
    if (loading) return <div className="loading">게시글을 불러오는 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (posts.length === 0) return <div className="empty">아직 게시글이 없습니다.</div>;

    return (
      <div className="post-list">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="post-item"
            onClick={() => handlePostClick(post.id)}
          >
            <div className="post-header-gathering">
              <span className="post-category-gathering">{getCategoryText(post.category)}</span>
              <span className="post-date-gathering">{formatDate(post.createdAt)}</span>
            </div>
            <h4 className="post-title-gathering">{post.title}</h4>
            <p className="post-content-preview-gathering">{post.content.substring(0, 100)}...</p>
            <div className="post-meta-gathering">
              <span className="post-author-gathering">👤 {post.memberNickname}</span>
              {post.images && post.images.length > 0 && (
                <span className="post-images-gathering">📷 {post.images.length}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 게시글 상세보기 모달
  const renderPostDetail = () => {
    if (!selectedPost) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{selectedPost.title}</h3>
            <button 
              className="close-button"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="post-detail-info">
              <span className="category-badge">{getCategoryText(selectedPost.category)}</span>
              <span className="author">작성자: {selectedPost.memberNickname}</span>
              <span className="date">{formatDate(selectedPost.createdAt)}</span>
            </div>
            
            <div className="post-detail-content">
              {selectedPost.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            
            {selectedPost.images && selectedPost.images.length > 0 && (
              <div className="post-images">
                {selectedPost.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image.imageUrl} 
                    alt={`게시글 이미지 ${index + 1}`}
                    className="post-image"
                  />
                ))}
              </div>
            )}
            
            <div className="post-actions">
              <button 
                className="edit-post-button"
                onClick={() => handleEditPost(selectedPost)}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 멤버가 아닌 경우 표시할 내용
  if (!isMember) {
    return (
      <div className="gathering-board">
        <div className="board-header">
          <h3>게시판</h3>
        </div>
        <div className="member-only-message">
          <p>🔒 소모임 멤버만 게시판을 이용할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gathering-board">
      <div className="board-header">
        <h3>게시판</h3>
        <button 
          className="create-post-button"
          onClick={handleCreatePost}
        >
          + 게시글 작성
        </button>
      </div>
      
      {renderPostList()}
      
      {selectedPost && renderPostDetail()}
      
      {showCreateForm && (
        <PostForm 
          gatheringId={gatheringId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchPosts}
        />
      )}
      
      {showEditForm && editingPost && (
        <PostForm 
          gatheringId={gatheringId}
          post={editingPost}
          isEdit={true}
          onClose={() => {
            setShowEditForm(false);
            setEditingPost(null);
          }}
          onSuccess={() => {
            fetchPosts();
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
};

// 게시글 작성/수정 폼 컴포넌트
const PostForm = ({ gatheringId, post, isEdit = false, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || 'GENERAL'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      if (isEdit) {
        await gatheringApi.editPost(gatheringId, post.id, formData.title, formData.content, images);
      } else {
        await gatheringApi.createPost(gatheringId, formData.title, formData.content, formData.category, images);
      }
      
      alert(`게시글이 ${isEdit ? '수정' : '작성'}되었습니다.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`게시글 ${isEdit ? '수정' : '작성'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? '게시글 수정' : '게시글 작성'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isEdit}
            >
              <option value="GENERAL">일반</option>
              <option value="NOTICE">공지사항</option>
              <option value="QUESTION">질문</option>
              <option value="REVIEW">후기</option>
              <option value="PHOTO">사진</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="내용을 입력하세요"
              rows="10"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="images">이미지</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <p className="file-info">{images.length}개의 이미지가 선택되었습니다.</p>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? '저장 중...' : (isEdit ? '수정' : '작성')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GatheringBoard;
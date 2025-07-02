import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateStoryPage.css';
import { useNavigate } from 'react-router-dom';
import { useFunding } from './FundingProvider';

const FundCreateStoryPage = () => {
  const navigate = useNavigate();
  const { setFundData } = useFunding();
  const [story, setStory] = useState({
    image: null,
    intro: '',
    details: '',
    contentImages:[],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      
      setStory({ ...story, image: files[0] });
    } else {
      setStory({ ...story, [name]: value });
    }
  };

  const handleNext = () => {
    setFundData((prev) => ({
      ...prev,
      mainImage: story.image,
      content: story.intro + '\n' + story.details,
      contentImages: story.contentImages || [],
    }));

    navigate('/funding/create/reward');
  };

  const isValid = story.image && story.intro && story.details;

  return (
    <FundCreateLayout currentStep="스토리 작성">
      <div className="story-form">
        <h2 className="fund-title">스토리 작성</h2>

        <label>
          대표 이미지
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>

        <label>
          프로젝트 소개
          <textarea
            name="intro"
            value={story.intro}
            onChange={handleChange}
            rows={3}
            placeholder="한 줄 소개를 입력해주세요."
          />
        </label>

        <label>
          상세 스토리
          <textarea
            name="details"
            value={story.details}
            onChange={handleChange}
            rows={8}
            placeholder="프로젝트의 배경, 목적, 기대효과 등을 상세히 입력해주세요."
          />
        </label>

        <label>
          상세 이미지들
          <input
            type="file"
            name="contentImages"
            accept="image/*"
            multiple
            onChange={(e) => {
              setStory(prev => ({
                ...prev,
                contentImages: Array.from(e.target.files)
              }));
            }}
          />
        </label>


        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!isValid}
        >
          다음
        </button>
      </div>
    </FundCreateLayout>
  );
};

export default FundCreateStoryPage;

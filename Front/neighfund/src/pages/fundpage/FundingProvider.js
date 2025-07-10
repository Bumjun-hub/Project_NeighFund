import React, { createContext, useContext, useState } from 'react';

const FundingContext = createContext();

export const FundingProvider = ({ children }) => {
  const [fundData, setFundData] = useState({
    category: '',           // CommunityCategory
    fundType: '',           // FundType
    fundStatus: 'ONGOING',  // 기본값 지정
    title: '',
    subTitle: '',
    content: '',
    targetAmount: '',
    deadline: '',
    hashTags: '',
    locationName:'',
    options: [              // FundOptionDto 리스트
      { title: '', description: '', amount: '' }
    ],
    mainImage: null,        // 대표 이미지
    contentImages: []       // 상세 본문 이미지 리스트
  });

  return (
    <FundingContext.Provider value={{ fundData, setFundData }}>
      {children}
    </FundingContext.Provider>
  );
};

export const useFunding = () => useContext(FundingContext);

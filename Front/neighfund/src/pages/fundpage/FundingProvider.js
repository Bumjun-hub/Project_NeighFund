import React, { createContext, useContext, useState } from 'react';

const FundingContext = createContext();

export const FundingProvider = ({ children }) => {
  const [info, setInfo] = useState({
    category: '',
    title: '',
    goalAmount: '',
    startDate: '',
    endDate: '',
  });

  const [story, setStory] = useState({
    image: null,
    intro: '',
    details: '',
  });

  const [rewards, setRewards] = useState([
    { title: '', description: '', amount: '' },
  ]);

  return (
    <FundingContext.Provider
      value={{
        info,
        setInfo,
        story,
        setStory,
        rewards,
        setRewards,
      }}
    >
      {children}
    </FundingContext.Provider>
  );
};

export const useFunding = () => useContext(FundingContext);

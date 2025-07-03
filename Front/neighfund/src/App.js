import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/mainpage/MainPage';
import SuggestionPage from './pages/suggestionspage/SuggestionPage';
import LoginPage from './pages/loginpage/LoginPage';
import MemberPage from './pages/memberpage/MemberPage';
import MyPage from './pages/mypage/MyPage';
import FundPage from './pages/fundpage/FundPage';
import FundInfoPage from './pages/fundpage/FundInfoPage';
import SuggestionWritePage from './pages/suggestionspage/SuggestionWritePage';
import { AuthProvider } from './utils/AuthProvider';
import EditProfile from './pages/mypage/MyPageEditProfile';
import Gathering from './pages/gatheringpage/Gathering';
import GatheringCreate from './pages/gatheringpage/GatheringCreate';

import FundCreateLayout from './pages/fundpage/FundCreateLayout';
import FundCreateTermsPage from './pages/fundpage/FundCreateTermsPage';
import FundCreateInfoPage from './pages/fundpage/FundCreateInfoPage';
import FundCreateStoryPage from './pages/fundpage/FundCreateStoryPage';
import FundCreateRewardPage from './pages/fundpage/FundCreateRewardPage';
import { FundingProvider } from './pages/fundpage/FundingProvider';
import ClassCreationPage from './pages/gatheringpage/ClassCreationPage';
import GatheringInfo from './pages/gatheringpage/GatheringInfo';
import FundParticipatePage from './pages/fundparticipantpage/FundParticipatePage';
import GatheringJoin from './pages/gatheringpage/GatheringJoin';


function App() {
  return (
    <div className="App">
      <FundingProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/suggestion" element={<SuggestionPage />} />
              <Route path="/suggestion/write" element={<SuggestionWritePage />} />
              <Route path="/suggestion/write/:id" element={<SuggestionWritePage />} />


              <Route path="/funding" element={<FundPage />} />
              <Route path="/funding/info/:id" element={<FundInfoPage />} />
              <Route path="/funding/create/Layout" element={<FundCreateLayout />} />
              <Route path="/funding/create/terms" element={<FundCreateTermsPage />} />
              <Route path="/funding/create/info" element={<FundCreateInfoPage />} />
              <Route path="/funding/create/story" element={<FundCreateStoryPage />} />
              <Route path="/funding/create/reward" element={<FundCreateRewardPage />} />
              <Route path="/funding/participate" element={<FundParticipatePage />} />

              <Route path="/gathering" element={<Gathering />} />
              <Route path="/gatheringcreate" element={<GatheringCreate />} />
              <Route path="/classcreationpage" element={<ClassCreationPage />} />
              <Route path="/gatherings/:gatheringId" element={<GatheringInfo />} />
              <Route path="/gatherings/:gatheringId/join" element={<GatheringJoin />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/member" element={<MemberPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/editProfile" element={<EditProfile />} />




            </Route>
          </Routes>
        </AuthProvider>
      </FundingProvider>


    </div>
  );
}

export default App;

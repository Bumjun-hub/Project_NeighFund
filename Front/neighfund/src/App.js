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

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/suggestion" element={<SuggestionPage />} />
            <Route path="/suggestion/write" element={<SuggestionWritePage />} />
            <Route path="/suggestion/write/:id" element={<SuggestionWritePage/>}/>
          

            <Route path="/funding" element={<FundPage />} />
            <Route path ="/funding/info/:id" element={<FundInfoPage/>}/>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/member" element={<MemberPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/editProfile" element={<EditProfile />} />

            <Route path="/gathering" element={<Gathering />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

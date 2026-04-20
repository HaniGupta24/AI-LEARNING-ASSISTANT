import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loginpage from './pages/Auth/Loginpage';
import Registerpage from './pages/Auth/Registerpage';
import NotFoundPage from './pages/Quizzes/NotFoundPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import DocumentDetailpage from './pages/Documents/DocumentDetailpage';
import FlashcardListPage from './pages/FlashCards/FlashcardListPage';
import Flashcardpage from './pages/FlashCards/Flashcardpage';
import Dashboardpage from './pages/Dashboard/Dashboardpage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './pages/Auth/ProtectedRoute';

const App = () => {
  const isAuthenticated = false;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-centre justify-centre h-screen" >

        <p>Loading...</p>
      </div>
    );
  }



  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Loginpage />} />

        <Route path="/register" element={<Registerpage />} />
 {/* {Protected Routes} */}
<Route element={<ProtectedRoute/>}>
  
 <Route path="/dashboard" element={<Dashboardpage/>}/>
  <Route path="/documents" element={<DocumentListPage/>}/>
 <Route path="/documents/:id" element={<DocumentDetailpage/>}/>
  <Route path="/flashcards" element={<FlashcardListPage/>}/>
   <Route path="/documents/:id/flashcards" element={<Flashcardpage/>}/>
      <Route path="/quizzes/:quizId" element={<QuizTakePage/>}/>
            <Route path="/quizzes/:quizId/results" element={<QuizResultPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                </Route>




   
   



        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
export default App

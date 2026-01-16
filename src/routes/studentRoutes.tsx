import { Route } from 'react-router-dom';
import StudentLogin from '../pages/student/StudentLogin';
import StudentDashboard from '../pages/student/StudentDashboard';
import Statistics from '../pages/student/Statistics';
import StudentChat from '../pages/student/StudentChat';
import AuthGuard from '../components/auth/AuthGuard';
import StudentQuizList from '../pages/student/StudentQuizList';
import TakeQuiz from '../pages/student/TakeQuiz';
import QuizHistory from '../pages/student/QuizHistory';
import QuizResult from '../pages/student/QuizResult';

export const studentRoutes = (
  <>
    <Route path="/student/login" element={<StudentLogin />} />
    <Route
      path="/student/dashboard"
      element={

        <AuthGuard role="student">
          <StudentDashboard />
        </AuthGuard>
      }
    />
    <Route
      path="/student"
      element={
        <AuthGuard role="student">
          <StudentDashboard />
        </AuthGuard>
      }
    />
    <Route
      path="/student/statistics"
      element={

        <AuthGuard role="student">
          <Statistics />
        </AuthGuard>
      }
    />
    <Route
      path="/student/chat"
      element={
        <AuthGuard role="student">
          <StudentChat />
        </AuthGuard>
      }
    />
    <Route
      path="/student/quizzes"
      element={
        <AuthGuard role="student">
          <StudentQuizList />
        </AuthGuard>
      }
    />
    <Route
      path="/student/quiz/:id"
      element={
        <AuthGuard role="student">
          <TakeQuiz />
        </AuthGuard>
      }
    />
    <Route
      path="/student/quiz-history"
      element={
        <AuthGuard role="student">
          <QuizHistory />
        </AuthGuard>
      }
    />
    <Route
      path="/student/quiz-result/:id"
      element={
        <AuthGuard role="student">
          <QuizResult />
        </AuthGuard>
      }
    />
  </>
);
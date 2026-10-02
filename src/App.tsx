import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AuthProvider } from '@/context/AuthContext'
import { AboutPage } from '@/pages/AboutPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminEnrollments } from '@/pages/admin/AdminEnrollments'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminMessages } from '@/pages/admin/AdminMessages'
import { AdminPrograms } from '@/pages/admin/AdminPrograms'
import { AdminRecords } from '@/pages/admin/AdminRecords'
import { CommunityPage } from '@/pages/CommunityPage'
import { ContactPage } from '@/pages/ContactPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EnrollPage } from '@/pages/EnrollPage'
import { FaqPage } from '@/pages/FaqPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { MentorshipPage } from '@/pages/MentorshipPage'
import { ProfessionalProgramsPage } from '@/pages/ProfessionalProgramsPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { VerifyCertificatePage } from '@/pages/VerifyCertificatePage'
import { HomePage } from '@/pages/HomePage'
import { JourneyPage } from '@/pages/JourneyPage'
import { LearnPage } from '@/pages/LearnPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { WorkshopsPage } from '@/pages/WorkshopsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="programs" element={<ProfessionalProgramsPage />} />
            <Route path="mentorship" element={<MentorshipPage />} />
            <Route path="verify-certificate" element={<VerifyCertificatePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="enroll" element={<RequireAuth><EnrollPage /></RequireAuth>} />
            <Route path="enroll/:slug" element={<RequireAuth><EnrollPage /></RequireAuth>} />
            <Route path="dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            <Route path="learn/:slug" element={<RequireAuth><LearnPage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route
            path="admin"
            element={
              <RequireAuth admin>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="records/:resource" element={<AdminRecords />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

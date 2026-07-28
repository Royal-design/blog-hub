import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"

import { AppShell } from "@/components/layout/app-shell"
import { PageLoader } from "@/components/loaders/page-loader"
import { ProtectedRoute } from "@/routes/protected-route"

const BookmarksPage = lazy(() =>
  import("@/pages/bookmarks-page").then((module) => ({
    default: module.BookmarksPage,
  }))
)
const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  }))
)
const EditPostPage = lazy(() =>
  import("@/pages/edit-post-page").then((module) => ({
    default: module.EditPostPage,
  }))
)
const ExplorePage = lazy(() =>
  import("@/pages/explore-page").then((module) => ({
    default: module.ExplorePage,
  }))
)
const FollowersPage = lazy(() =>
  import("@/pages/followers-page").then((module) => ({
    default: module.FollowersPage,
  }))
)
const FollowingFeedPage = lazy(() =>
  import("@/pages/following-feed-page").then((module) => ({
    default: module.FollowingFeedPage,
  }))
)
const FollowingListPage = lazy(() =>
  import("@/pages/following-list-page").then((module) => ({
    default: module.FollowingListPage,
  }))
)
const ForgotPasswordPage = lazy(() =>
  import("@/pages/forgot-password-page").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
)
const HomePage = lazy(() =>
  import("@/pages/home-page").then((module) => ({ default: module.HomePage }))
)
const LoginPage = lazy(() =>
  import("@/pages/login-page").then((module) => ({ default: module.LoginPage }))
)
const NewPostPage = lazy(() =>
  import("@/pages/new-post-page").then((module) => ({
    default: module.NewPostPage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  }))
)
const PostDetailPage = lazy(() =>
  import("@/pages/post-detail-page").then((module) => ({
    default: module.PostDetailPage,
  }))
)
const ProfilePage = lazy(() =>
  import("@/pages/profile-page").then((module) => ({
    default: module.ProfilePage,
  }))
)
const RegisterPage = lazy(() =>
  import("@/pages/register-page").then((module) => ({
    default: module.RegisterPage,
  }))
)
const SearchPage = lazy(() =>
  import("@/pages/search-page").then((module) => ({ default: module.SearchPage }))
)

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="following"
            element={
              <ProtectedRoute>
                <FollowingFeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="following-list"
            element={
              <ProtectedRoute>
                <FollowingListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="posts/new"
            element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="posts/:slug/edit"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="posts/:slug"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

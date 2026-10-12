import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

/**
 * 按路由拆包。supabase-js 只被报名／参赛／看板用到，
 * 拆出去之后首页不用等它下载完才显示。
 */
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SubmitPage = lazy(() => import("./pages/SubmitPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <span className="font-label text-xs tracking-[0.3em] text-acid">LOADING…</span>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<RouteFallback />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/submit"
          element={
            <Suspense fallback={<RouteFallback />}>
              <SubmitPage />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProjectDetailPage />
            </Suspense>
          }
        />
        {/* 筹备组看板，不做进顶部导航，靠登录保护 */}
        <Route
          path="/staff"
          element={
            <Suspense fallback={<RouteFallback />}>
              <StaffPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;

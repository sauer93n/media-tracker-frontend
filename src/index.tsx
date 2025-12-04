import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Main } from "./screens/Main";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { CreateReview } from "./screens/CreateReview";
import { PageLayout } from "./components/layout/PageLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { UpdateReview } from "./screens/UpdateReview";
import { ReviewDetails } from "./screens/ReviewDetails";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout>
              <Main />
            </PageLayout>
          }
        />
        <Route
          path="/create-review/:mediaType"
          element={
            <PageLayout>
              <CreateReview />
            </PageLayout>
          }
        />
        <Route
          path="/edit-review/:reviewId"
          element={
            <PageLayout>
              <UpdateReview />
            </PageLayout>
          }
        />
        <Route
          path="/reviews/:reviewId"
          element={
            <PageLayout>
              <ReviewDetails />
            </PageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
        } />
        <Route 
          path="/signup" 
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

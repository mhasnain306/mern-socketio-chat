import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthForm from "../components/AuthForm.tsx";
import Chat from "../components/Chat.tsx";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthForm />,
  },
  {
    path: "/auth",
    element: <AuthForm />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

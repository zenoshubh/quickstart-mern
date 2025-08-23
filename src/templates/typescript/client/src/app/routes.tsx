import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home";
import App from "./App";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          // path: "element1",
          // element: <Element1 />,
        },
        {
          // path: "element2",
          // element: <Element2 />,
        },
      ],
    },
  ]);

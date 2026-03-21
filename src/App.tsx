import { BrowserRouter } from "react-router-dom";
// import { router } from "./app/router";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
  // return <AppRouter />;
}

// export default function App() {
//   return <RouterProvider router={router} />;
// }


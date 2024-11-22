import Root from './root.tsx';
import ErrorPage from "./error-page.tsx";
import { createBrowserRouter } from 'react-router-dom';
import Contact from './contact.tsx';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      // loader: rootLoader,
      children: [
        {
          path: "contacts/:contactId",
          element: <Contact />,
        },
      ],
    },
]);

  export default router;
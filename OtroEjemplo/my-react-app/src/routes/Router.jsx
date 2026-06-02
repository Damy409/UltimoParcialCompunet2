import { createBrowserRouter } from "react-router";

import ComponentsPage from "../pages/ComponentsPage";

const router = createBrowserRouter([
    {
        path: "/", Component: ComponentsPage
    }
], { basename: "/compu2/front" });

export default router;
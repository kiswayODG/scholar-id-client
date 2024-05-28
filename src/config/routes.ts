import { ReactNode } from "react";
import Test from "@modules/test/Test";

interface routeI {
    referenceModule: number;
    path: string;
    component: React.ComponentType;
}

export const routes: routeI[] = [{
    referenceModule: 0,
    path: "/",
    component: Test
},
{
    referenceModule: 0,
    path: "/1",
    component: Test
},
{
    referenceModule: 0,
    path: "/2",
    component: Test
},

]
import { lazy, ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Constante } from "@utils/Constantes";
const Home  = lazy(() =>import("../Home"));
const EtablissementReadView  = lazy(() =>import("../modules/parametrage/ui/EtablissementReadView"));
const CycleEtudeReadView  = lazy(() =>import("../modules/parametrage/ui/CycleEtudeReadView"));
const NiveauEtudeReadView  = lazy(() =>import("../modules/parametrage/ui/NiveauEtudeReadView"));
const ClasseReadView  = lazy(() =>import("../modules/parametrage/ui/ClasseReadView"));
const EffectifReadView = lazy(()=>import("../modules/GestionEffectif/ui/EffectifReadView"));
const MainDashboard  = lazy(() =>import("../modules/dashboard/MainDashboard"));
const ImportationView = lazy(()=>import("@modules/GestionEffectif/ui/ImportationView"));
const Login  = lazy(() =>import("../modules/general/Login"));
const AddUser = lazy(()=> import("@modules/users/ui/AddUpdateUser"));
const InitETABView = lazy(()=> import("@modules/parametrage/ui/InitialAddEtablissement"));


interface routeI {
    referenceModule: number;
    path: string;
    component: React.ComponentType;
}

export const routes: routeI[] = [
    {
        referenceModule: 0,
        path: "/",
        component: localStorage.getItem("connectedToken")? Home : Home
    },
    {
        referenceModule: 0,
        path: "/login",
        component: Login
    },
    {
        referenceModule: 0,
        path: Navigation.NEW_USER,
        component: AddUser,
    },
    {
        referenceModule: 0,
        path: Navigation.INITIAL_ETAB_ADD,
        component: InitETABView,
    },
    {
    referenceModule: 0,
    path: Navigation.DASHBOARD,
    component: MainDashboard
},
{
    referenceModule: 0,
    path: Navigation.EFFECTIF,
    component: EffectifReadView
},
{
    referenceModule: 0,
    path: Navigation.IMPORTATION_DATA,
    component: ImportationView
},
{
    referenceModule: 3,
    path: Navigation.PARAMETRAGE_ETAB,
    component: EtablissementReadView
},
{
    referenceModule: 3,
    path: Navigation.PARAMETRAGE_CYCLE,
    component: CycleEtudeReadView
},
{
    referenceModule: 3,
    path: Navigation.PARAMETRAGE_NIVEAU,
    component: NiveauEtudeReadView
},
{
    referenceModule: 3,
    path: Navigation.PARAMETRAGE_CLASSE,
    component: ClasseReadView
},

]
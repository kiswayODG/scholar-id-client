import { Navigation } from "@appConfigs/Navigation";
import Controls from "@components/controls";
import Layout from "@components/Layout"
import ChargementFichier from "@modules/importationDonnees/ChargementFichier";
import { ArrowBack } from "@mui/icons-material";

const ImportationView:React.FC = ()=> {
    return(
        <>
        <Layout>
            {/* <Controls.CancelButton 
            sx={{margin:2}}
            startIcon={<ArrowBack/>}
            title="retour"
            href={Navigation.EFFECTIF}/> */}

<ChargementFichier/>
        </Layout>
        </>
    )
}
export default ImportationView;
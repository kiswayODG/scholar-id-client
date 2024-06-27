import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { apiClient } from "app-api/api";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Controls from "@components/controls";
import AddUpdateEtablissement from "../components/AddUpdateEtablissement";
import FormDialog from "@components/modals/FormDialogComponent";
import useModal from "@hooks/useModal";

interface IViewFormData {
  id?: number;
  nom?: string;
  ville?: number;
  adresse?: string;
  numeroTel: number;
  numeroTelBis: number;
  selectedImage?: string;
  base64Image?: string;
}

interface IEtabViewState {
  etablissement?: EtablissementInterface;
  loading: boolean;
}

const EtablissementReadView: React.FC = () => {
  const [state, setState] = useState<IEtabViewState>({
    etablissement: {} as EtablissementInterface,
    loading: true,
  });

  const addUpdateEtabModal = useModal();

  const fetchEtablissement = () => {
    apiClient.parametrage
      .fetchActiveEtablissement()
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          etablissement: res.data as EtablissementInterface,
          loading: false,
        }));
      })
      .catch((reason) => console.error(reason));
  };

  useEffect(() => {
    fetchEtablissement();
  }, []);

  const handleUpdate = () => {
    addUpdateEtabModal.toggle();
  };

  return (
    <>
      <Layout>
        {state.loading ? (
          <Box className="flex justify-center items-center h-screen">
            {" "}
            <CircularProgress />{" "}
          </Box>
        ) : (
          <Grid
            style={{ paddingBottom: "20px" }}
            className="flex flex-col justify-center items-center "
          >
            <Grid container sx={{ marginTop: "5%", marginBottom:"5%" }}>
              <Grid item className="m-auto">
                <List>
                  <ListItem>
                    <ListItemText>Nom</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText>Téléphone</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText>Téléphone bis</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText>Ville</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText>Adresse</ListItemText>
                  </ListItem>
                  <Divider />
                </List>
              </Grid>
              <Grid item className="m-auto">
                <List>
                  <ListItem>
                    <ListItemText>
                      {state?.etablissement?.nomEtablissement}
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      {state?.etablissement?.numeroTel}
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      {state?.etablissement?.numeroTelBis}
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      {state?.etablissement?.villeEtablissement.nomVille}
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                    {state?.etablissement?.adresse}
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={3} sx={{ marginBottom: "5%" }}>
                <img
                  alt="preview image"
                  src={`data:image/png;base64,${state?.etablissement?.imageBase64}`}
                  style={{ width: "200px", height: "200px", marginTop: "5%" }}
                />
              </Grid>
            </Grid>
            <Controls.OnActionButton
              type="button"
              titre="Mettre à jour"
              icon={<BorderColorIcon fontSize="small" />}
              onAction={handleUpdate}
            />
          </Grid>
        )}

        <FormDialog
          isOpen={addUpdateEtabModal.isOpen}
          onClose={addUpdateEtabModal.toggle}
        >
          <AddUpdateEtablissement
            onClose={addUpdateEtabModal.toggle}
            etablissement={state?.etablissement}
            reload={fetchEtablissement}
          />
        </FormDialog>
      </Layout>
    </>
  );
};

export default EtablissementReadView;

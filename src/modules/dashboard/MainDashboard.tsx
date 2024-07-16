import Layout from "../../components/Layout";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Copyright from "components/Copyright";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { StatsInterface } from "./model/StatInterface";
import { useEffect, useState } from "react";
import { apiClient } from "app-api/api";
import { CoinIcon } from "@components/icons/CoinIcon";
import { useNavigate } from "react-router-dom";
import { EtablissementInterface } from "@modules/parametrage/model/EtablissementInterface";
import { Constante } from "@utils/Constantes";
import { Navigation } from "@appConfigs/Navigation";
import { CircularProgress } from "@mui/material";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

interface TitleProps {
  children?: React.ReactNode;
}

export function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export function Deposits() {
  return (
    <React.Fragment>
      <div className="flex space-x-4">
        <Title>Total crédit</Title> <CoinIcon size={30} />
      </div>
      <Typography color="text.secondary" >
        {format(new Date(), "dd MMMM, yyyy", { locale: fr })}
      </Typography>
      <Typography component="p" variant="h4" sx={{ flex: 1 }}>
        --
      </Typography>

      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Plus de détail
        </Link>
      </div>
    </React.Fragment>
  );
}

const defaultTheme = createTheme();

interface viewStateI {
  camembertGenreStats: StatsInterface[];
  loading: boolean;
}

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  let activeEtab: EtablissementInterface;

  useEffect(() => {
    apiClient.parametrage
      .fetchActiveEtablissement()
      .then((res) => {
        if (res.data != null) activeEtab = res.data as EtablissementInterface;
        else navigate(Navigation.INITIAL_ETAB_ADD);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [state, setState] = useState<viewStateI>({
    camembertGenreStats: [],
    loading: true,
  });

  const fetchPieData = async () => {
    await apiClient.dashboard
      .getGenreStatCamembert()
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          camembertGenreStats: res.data as StatsInterface[],
          loading: false,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchPieData();
  }, []);

  const pieGenreData = state.camembertGenreStats.map((item, index) => ({
    ...item,
    id: index,
  }));

  return (
    <Layout>
      {state.loading ? (
        <Box className="flex justify-center items-center h-screen">
          {" "}
          <CircularProgress />{" "}
        </Box>
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Chart */}
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                      className="flex flex-row justify-between"
                    >
                      <PieChart
                        series={[
                          {
                            arcLabel: (item) => ` (${item.value})`,
                            arcLabelMinAngle: 45,
                            data: pieGenreData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: "white",
                            fontWeight: "bold",
                          },
                        }}
                        width={400}
                        height={200}
                      />

                      <PieChart
                        series={[
                          {
                            data: [
                              { id: 0, value: 10, label: "series A" },
                              { id: 1, value: 15, label: "series B" },
                              { id: 2, value: 20, label: "series C" },
                            ],
                          },
                        ]}
                        width={400}
                        height={200}
                      />
                    </Paper>
                  </Grid>
                  {/* Recent Deposits */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <Deposits />
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    >
                      " "
                    </Paper>
                  </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </Layout>
  );
};

export default MainDashboard;

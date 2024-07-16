import { Link, useLocation, useNavigate } from "react-router-dom";
import { Section } from "./Section";
import { Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { AccountMenu } from "./AccountMenu";
import { Navigation } from "../../appConfigs/Navigation";
import { apiClient } from "app-api/api";
import { EtablissementInterface } from "@modules/parametrage/model/EtablissementInterface";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [etab, setEtab] = useState<EtablissementInterface|null>(null);

  useEffect(() => {
    apiClient.parametrage
      .fetchActiveEtablissement()
      .then((res) => {
        if (res.data != null) 
          setEtab(res.data as EtablissementInterface);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  
  return (
    <header className="sticky top-0 backdrop-blur-xl z-50 py-3 bg-blue-950 text-white">
      <Section className="flex items-baseline ">
        <h1 className="text-2xl font-bold text-primary">ScholarID</h1>
        <div className="flex-1" />

        {etab!=null? <ul className="flex items-center gap-2">
          <Link to={Navigation.DASHBOARD} className={location.pathname == Navigation.DASHBOARD ? "border-2 border-white rounded-lg" : ""}>
            <Button className="text-white text-lg"> Vue Générale</Button>
          </Link>
          <Link to={Navigation.EFFECTIF} className={location.pathname.includes(Navigation.EFFECTIF) ? "border-2 border-white rounded-lg":""} >
            <Button className="text-white text-lg"> Mes effectifs</Button>
          </Link>
          {/* <Button> <Link to={""}>Documents</Link></Button> */}
          <div             
          className={location.pathname.includes("parametrage") ?
            "border-2 border-white rounded-lg": ""}>

          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="text-white text-lg "
          >
            Paramétrages
          </Button>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link to={Navigation.PARAMETRAGE_ETAB}>
              <MenuItem>Etablissement</MenuItem>
            </Link>
            <Link to={Navigation.PARAMETRAGE_CYCLE}>
              <MenuItem>Cycle d'étude</MenuItem>
            </Link>
            <Link to={Navigation.PARAMETRAGE_NIVEAU}>
              <MenuItem>Niveau</MenuItem>
            </Link>
            <Link to={Navigation.PARAMETRAGE_CLASSE}>
              <MenuItem>Classe</MenuItem>
            </Link>
          </Menu>
          <AccountMenu />
        </ul>:null}

      </Section>
    </header>
  );
};

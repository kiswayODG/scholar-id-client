import { Link } from "react-router-dom";
import { Section } from "./Section";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { AccountMenu } from "./AccountMenu";
import { Navigation } from "../../appConfigs/Navigation";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="sticky top-0 backdrop-blur-xl z-50 py-4 bg-blue-950 text-white">
      <Section className="flex items-baseline ">
        <h1 className="text-lg font-bold text-primary">ScholarID</h1>
        <div className="flex-1" />
        <ul className="flex items-center gap-2">
          <Link to={Navigation.DASHBOARD} >
            <Button className="text-white"> Vue Générale</Button>
          </Link>
          <Link to={Navigation.EFFECTIF} >
            <Button className="text-white"> Mes effectifs</Button>
          </Link>
          {/* <Button> <Link to={""}>Documents</Link></Button> */}
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="text-white"
          >
            Paramétrages
          </Button>
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
        </ul>
      </Section>
    </header>
  );
};

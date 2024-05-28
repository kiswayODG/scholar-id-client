import { Link } from "react-router-dom";
import { Section } from "./Section";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { AccountMenu } from "./AccountMenu";


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
    <header className="sticky top-0 backdrop-blur-xl z-50 py-4">
      <Section className="flex items-baseline ">
      <h1 className="text-lg font-bold text-primary">
          ScholarID
        </h1>
        <div className="flex-1" />
        <ul className="flex items-center gap-2"> 
       
        <Button> <Link to={""}>test</Link></Button>
        <Button> <Link to={""}>test</Link></Button>
        <Button> <Link to={""}>test</Link></Button>
        <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem >Profile</MenuItem>
        <MenuItem >My account</MenuItem>
        <MenuItem >Logout</MenuItem>
      </Menu>
      <AccountMenu/>
        </ul>
      </Section>
    </header>
  );
};

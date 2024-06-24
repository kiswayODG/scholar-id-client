import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogProps } from './FullScreenDialog';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { colors } from '../../appConfigs/ColorPalette';
import CloseIcon from "@mui/icons-material/Close";
import "./fullScreenDialog.scss";


export default function FormDialog(props :DialogProps) {

  return (
    <React.Fragment>
    
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        className="mui-fixed"
      >
         <AppBar sx={{ background: colors.primary[100] }} className="relative flex flex-row justify-between items-center h-12">
          <Toolbar>
            <Typography className="textWrapper" variant="h6" component="div">
              {props.title}
            </Typography>
          </Toolbar>

          <IconButton onClick={props.onClose} className="cancel-btn-screen">
            <CloseIcon sx={{color:"white",  backgroundColor:"red"}}/>
          </IconButton>
        </AppBar>
        {props.children}
      </Dialog>
    </React.Fragment>
  );
}
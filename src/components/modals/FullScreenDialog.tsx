import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import "./fullScreenDialog.scss";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { colors } from "appConfigs/ColorPalette";

export interface DialogProps {
  contentText? : string;
  id?: string;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Composant générique
const FullScreenDialog: React.FC<DialogProps> = ({
  id,
  onClose,
  isOpen,
  title,
  children,
}: DialogProps) => {
  
  return (
    <div>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ background: colors.primary[100] }} className="appBar">
          <Toolbar>
            <Typography className="textWrapper" variant="h4" component="div">
              {title}
            </Typography>
          </Toolbar>

          <IconButton onClick={onClose} className="cancel-btn-screen">
            <CloseIcon sx={{color:"white",  backgroundColor:"red"}}/>
          </IconButton>
        </AppBar>
        {children}
      </Dialog>
    </div>
  );
};

export default FullScreenDialog;

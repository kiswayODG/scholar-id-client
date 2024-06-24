import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import './confirmComponent.scss'
import Controls from "components/controls";
interface UsersDetailComponentInterface {
  title?:string;
  message?: any;
  isOpen : boolean;
  onClose: () => void;
  onAction:()=>void;
}
const ConfirmComponent: React.FC<UsersDetailComponentInterface> = ({
  title,
  isOpen,
  message,
  onClose,
  onAction,
}) => {

  const handleConfirm = () => {
    onAction(); 
    onClose();
  };

  return (

    <Dialog
    open={isOpen}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
    <span className="title">  {title}</span>
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
       {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Controls.CancelButton  onCancel={onClose} title="Annuler"/>
      <Controls.OnActionButton type="button" titre="Confirmer" onAction={handleConfirm} autoFocus/>
    </DialogActions>
  </Dialog>

  );
};

export default ConfirmComponent;

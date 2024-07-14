import { CircularProgress, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import { Delete, Info } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BadgeIcon from "@mui/icons-material/Badge";

interface buttonInterface {
  toolTip?: string;
  disable?: boolean;
  onAction: (T?: any) => void;
  loading?: boolean;
}

const updateAction: React.FC<buttonInterface> = ({
  toolTip,
  disable,
  onAction,
}) => {
  return (
    <IconButton
      title={toolTip || "Editer"}
      disabled={disable}
      sx={{ color: "green" }}
      onClick={onAction}
      size="small"
    >
      <EditOutlinedIcon />
    </IconButton>
  );
};

const deleteAction: React.FC<buttonInterface> = ({
  toolTip,
  disable,
  onAction,
}) => {
  return (
    <IconButton
      title={toolTip || "Supprimer"}
      disabled={disable}
      sx={{ color: "red" }}
      onClick={onAction}
      size="small"
    >
      <Delete />
    </IconButton>
  );
};

const detailAction: React.FC<buttonInterface> = ({
  toolTip,
  disable,
  onAction,
}) => {
  return (
    <IconButton
      title={toolTip || "Détail"}
      disabled={disable}
      sx={{ color: "orange" }}
      onClick={onAction}
      size="small"
    >
      <Info />
    </IconButton>
  );
};

const printRowCardAction: React.FC<buttonInterface> = ({
  toolTip,
  disable,
  onAction,
  loading=false,
}) => {
  return (
    <IconButton
      title={toolTip || "Générer"}
      disabled={disable}
      sx={{ color: "royalblue" }}
      onClick={onAction}
      size="small"
    >
       {loading && (<CircularProgress
        size={30}
        style={{position:"absolute", color:"white"}}/>)
        }
      <BadgeIcon />
    </IconButton>
  );
};

const addAction: React.FC<buttonInterface> = ({
  toolTip,
  disable,
  onAction,
}) => {
  return (
    <IconButton
      title={toolTip || "Ajouter"}
      disabled={disable}
      sx={{ color: "green" }}
      onClick={onAction}
      size="small"
    >
      <AddCircleOutlineIcon />
    </IconButton>
  );
};

export const TableActions = {
  updateAction,
  deleteAction,
  detailAction,
  printRowCardAction
};

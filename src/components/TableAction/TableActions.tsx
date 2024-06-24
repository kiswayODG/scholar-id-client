import { Button, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import { Delete, Info } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface buttonInterface {
  toolTip?: string;
  disable?: boolean;
  onAction: (T?: any) => void;
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
    >
      <Info />
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
    >
      <AddCircleOutlineIcon />
    </IconButton>
  );
};

export const TableActions = {
  updateAction,
  deleteAction,
  detailAction,
};

import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import {DialogContent} from "@mui/material";
import Controls from "components/controls";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props : DialogTitleProps) {
    const {children, onClose, ...other} = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
               <Controls.CloseButton closeMeth={onClose}/>
            ) : null}
        </DialogTitle>
    );
}

interface ModalProps {
    isOpen: boolean,
    title?: string
    onClose: ()=> void;
    children: React.ReactNode
}

export function PersistentModalComponent (props:ModalProps) {
    const {isOpen, title, onClose, children} = props;
    return (
        <div >
            <BootstrapDialog
                open={isOpen}
                onClose={onClose}
                aria-labelledby="customized-dialog-title">
                <BootstrapDialogTitle  id="customized-dialog-title" onClose={onClose}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {children}
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}
import React from 'react';
import { DialogContent, Paper, PaperProps, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from "react-draggable";
import { colors } from 'appConfigs/ColorPalette';
import Controls from 'components/controls';

export interface DialogProps {
    id?: string;
    onClose: () => void;
    isOpen: boolean;
    title?: string;
    children: React.ReactNode
}

type DivProps = {
    bgColor: string;
};

const DialogTitleWrapper = styled(DialogTitle)<DivProps>(({ bgColor }) => ({
    backgroundColor : bgColor,
}));


const DialogWrapper = styled(Dialog)(({ theme }) => ({
    padding: theme.spacing(4),
    top: theme.spacing(5),
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} style={{ maxHeight: 1200, overflow: 'auto' }} />
        </Draggable>
    );
}





export function ModalComponent(props: DialogProps) {
    const { title, children, onClose, isOpen } = props;
    const [, setOpen] = React.useState(false);


    return (

        <DialogWrapper open={isOpen} onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title">
            <DialogTitleWrapper bgColor={colors.primary[100]} style={{ cursor: 'move' }} id="draggable-dialog-title">
                <div style={{ display: 'flex', fontFamily: "Roboto", color: "#ffffff" }}>

                    <Typography variant="h5" component="div" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Controls.CloseButton closeMeth={onClose} />
                </div>
            </DialogTitleWrapper>
            <DialogContent dividers>

                {children}
            </DialogContent>
        </DialogWrapper>
    )
}

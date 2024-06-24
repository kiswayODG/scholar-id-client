import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import './modalCloseButton.scss'

interface CloseButtonProps {
    closeMeth: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ closeMeth }) => {
    return (
        <IconButton
            aria-label="close"
            size='small'
            onClick={closeMeth}
            className='style'>
            <CloseIcon fontSize="small"/>
        </IconButton>
    );
};


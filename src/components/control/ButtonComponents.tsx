import { Button, CircularProgress, IconButton } from "@mui/material";
import { ReactNode } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { colors } from "appConfigs/ColorPalette";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";


export const SubmitButton=(props: CancelButtonProps)=> {
    return (
      <Button
        size="small"
        type="submit"
        variant="contained"
        className="submit-button"
      >
       {props.title? props.title:"Valider"}
      </Button>
    );
  }
  
  interface CancelButtonProps {
    title?: string;
    onCancel?: () => void;
    icon?: any;
    startIcon?: any;
    sx?: React.CSSProperties;
    href?: string;
  }
  
  export function CancelButton(props: CancelButtonProps) {
    const { icon, title,startIcon, onCancel, sx,href,...rest } = props;
  
    return (
      <Button
        size="small"
        type="button"
        variant="contained"
        className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white hover:border-transparent "
        onClick={onCancel}
        startIcon={startIcon}
        sx={sx}
        href={href}
        {...rest}
      >
        {title?title:"Annuler"}
      </Button>
    );
  }
  
  interface AddButtonProps {
    onClick: () => void;
    titre?: string;
    size?: 'small' | 'medium' | 'large';
  }
  
  export function AddButton(props: AddButtonProps) {
    const { onClick } = props;
  
    return (
      <div>
        <IconButton onClick={onClick}>
          <AddCircleOutlinedIcon  className="add-button-icon" />
        </IconButton>
      </div>
    );
  }
  
  export function PrintButton(props: AddButtonProps) {
    const { onClick, titre, size} = props;
  
    return (
      <div className="printBtn">
      <IconButton className="print-button" onClick={onClick} title={titre} size={size?size:"small"} >
        <PrintOutlinedIcon className="print-icon" />
      </IconButton>
      {titre}
      </div>
    );
  }
  
  interface onActionButtonProps {
    titre?: string;
    type : "button" |"submit"
    onAction?: (T?: any) => void;
    icon?: ReactNode;
    iconEnd?: ReactNode;
    [key: string]: any;
    style?:any;
    useTheme?: boolean;
    href?:string;
    loading?: boolean;
  }
  export function OnActionButton({titre,onAction, loading=false,icon,style,useTheme,type,iconEnd,href,...rest}: onActionButtonProps) {
  
  
    return (
      <Button
        size="small"
        className="onActionButton"
        type={type}
        onClick={onAction}
        variant="contained"
        {...rest}
        startIcon={icon}
        endIcon={iconEnd}
        sx={style}
        style={{
          
          backgroundColor: "green",
          color:"white"
        }}
        href={href}
      >
        {titre || "Valider"}
        {loading && (<CircularProgress
        size={30}
        
        style={{position:"absolute", color:"white"}}/>)
        }
      </Button>
    );
  }
  
  export function BackPrevPage(prop:CancelButtonProps) {
    return (
    <div className="backBtn">
    <IconButton onClick={prop.onCancel}>
        <ArrowBackIos/>
    </IconButton>{prop.title ? prop.title : "Retour"}
  </div>
  )
  }
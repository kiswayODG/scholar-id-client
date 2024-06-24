import { MenuItem, Select } from "@mui/material";
import { colors } from "appConfigs/ColorPalette";
import { useEffect, useState } from "react";
import "./selectComponent.scss"

interface SelectProps<T> {
    name?: string;
    label?: string;
    valeur: string | number | undefined;
    error?: string | null;
    onChange: (prop: any) => void;
    options: T[];
    width?: string | number;
    renderValue: (item: T) => any;
    renderLabel: (item: T) => any;
    className?: string;
  }
  
  export default function SelectComponent<T>(props: SelectProps<T>) {
    const {
      options,
      onChange,
      renderValue,
      renderLabel,
      label,
      valeur,
      name,
      width,
      className
    } = props;
    const [selectedValue, setSelectedValue] = useState<string | number>(valeur!);
  
    const handleSelectChange = (event: any) => {
      const value = event.target.value;
      setSelectedValue(value);
      onChange(value);
    };
    useEffect(() => {
      setSelectedValue(valeur!);
    }, [valeur]);
  
  
    return (
      <Select
        name={name}
        label={label}
        value={selectedValue+''}
        onChange={handleSelectChange}
        className={"select-component "+{className}}
        style={{ width: width?width:200 }}
        sx={{
          ".MuiSvgIcon-root ": {
            fill: colors.primary[100] + "!important",
          },
        }}
      >
        {options?.map((option, index) => (
          <MenuItem key={index} value={renderValue(option)}>
            {renderLabel(option)}
          </MenuItem>
        ))}
      </Select>
    );
  }
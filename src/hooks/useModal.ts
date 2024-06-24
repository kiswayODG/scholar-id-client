import { useState } from "react"

const useModal = ()=>{
    const [isOpen, setOpen] = useState<boolean>(false);
    const toggle = ()=>{
        setOpen(!isOpen);
    }
return{
    isOpen,
    toggle
}
};

export default useModal;
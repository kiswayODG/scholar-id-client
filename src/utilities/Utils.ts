import { UserInterface } from "@modules/users/model/UserInterface";
import { Constante } from "./Constantes";
import { parse, isValid } from 'date-fns';


export const removeDataFromLocalStorage = () => {
    localStorage.clear();
}

export const redirectRootUrl = () => {
    window.location.href = "/login"
}

export const setToken = (token: string) => {
    //localStorage.setItem(Constante.TOKEN, `Bearer ${token}`)
    localStorage.setItem(Constante.TOKEN, token)
}

export const setUserConnected = (user: UserInterface) => {
    localStorage.setItem(Constante.USERLOGGED, JSON.stringify(user));
}


export const parseDate = (dateString: string): Date | null => {
    const dateFormats = [
        'yyyy-MM-dd',
        'dd/MM/yyyy',
        'MM/dd/yyyy',
        'dd-MM-yyyy',
        'MM-dd-yyyy',
        'yyyy/MM/dd',
    ];

    for (const format of dateFormats) {
        const parsedDate = parse(dateString, format, new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
    }

    return null;
};


/**
 * Convertit une date série Excel en date JavaScript.
 * @param excelDate - La date série Excel (par exemple, 36806).
 * @returns La date JavaScript correspondante.
 */
export const convertExcelDateToJSDate = (excelDate: number): Date => {
    return new Date(Math.round((excelDate - 25569)*86400*1000));
};


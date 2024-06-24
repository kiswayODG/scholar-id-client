//import * as process from "process";

export function getAppConfigKey(){
    let env: string = 'mock'
    if (process.env && process.env.REACT_APP_CONFIG) {
      env = process.env.REACT_APP_CONFIG;
    }
    return env.trim();
}

export function getServerUrl() {
    if(process.env && process.env.REACT_APP_SERVER_URL){
        let url = process.env.REACT_APP_SERVER_URL;
        return url.trim();
    }
}
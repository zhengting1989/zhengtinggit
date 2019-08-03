//clear login infos
import {Constants} from './constants';

export function clearSessionStorage() {
    sessionStorage.clear();
    Constants.sideMenus = '';
    Constants.loginUser = 'loginUser'
}

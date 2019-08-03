export class Constants {

    static readonly AUTH_KEY = 'token';
    static SPIN_CACHE = 'openSpin';
    static sideMenus = '';
    static loginUser = 'loginUser';
    static access = true;
    static readonly BEARER_KEY = 'bearer';
    static readonly URL_PREFIX = 'web';
    static readonly WEBAPP_VERSION = 'v1';
    static OVERDUE_TIME: number= 30;//分钟

    /**
     * 匹配手机号
     */
    static readonly PHONE_MILITARY = /^((400|800)\d{7}|(0\d{2,3}-\d{7,8})|(1[0-9]{10}))$/g;

}

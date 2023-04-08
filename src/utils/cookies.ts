export function getCookie(name: string): string {
    if (document.cookie.length > 0) {
        const arr = document.cookie.split('; ');//注意：分号+空格
        for (let i = 0; i < arr.length; i++) {
            const index = arr[i].indexOf("=");
            if (arr[i].substring(0, index) === name) {
                return arr[i].substring(index + 1);
            }
        }
    }
    return "";
}

export function setCookie(name: string, value: string, exSeconds: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exSeconds * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}
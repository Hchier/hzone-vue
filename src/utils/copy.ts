//深复制，前提是tar得实例化
export function deepCopy(src: any, tar: any) {
    for (const key in src) {
        if (src[key] instanceof Object) {
            tar[key] = (src[key] instanceof Array) ? [] : {};
            deepCopy(src[key], tar[key]);
        } else {
            tar[key] = src[key];
        }
    }
}
function deleteCookies() {
    console.log(1)
    console.log(document.cookie)
    let cookies = document.cookie.split(";");
    console.log(cookies)

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export default deleteCookies
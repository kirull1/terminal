function isMobileUserAgent() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function isMobileSize() {
    return ( ( window.innerWidth <= 720 ) && ( window.innerHeight <= 600 ) );
}

function isMobile() {
    return isMobileSize() || isMobileUserAgent();
}

export {isMobileUserAgent, isMobileSize, isMobile};

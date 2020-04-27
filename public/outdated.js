// detects if user is using Internet Explorer (incl IE11)
function IEdetection() {
    var ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    var isIE = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return isIE;
}

var isOutdatedBrowser = IEdetection();

document.onreadystatechange = function () {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        var outdatedBrowserElement = document.getElementById('outdated-browser');

        // Show or remove it from the DOM
        if (outdatedBrowserElement) {
            if (isOutdatedBrowser) {
                outdatedBrowserElement.style.display = 'block';
            } else {
                outdatedBrowserElement.parentNode.removeChild(outdatedBrowserElement);
            }
        }
    }
};

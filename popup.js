document.addEventListener("DOMContentLoaded", function() {
    var copyButton = document.getElementById("copy-button");
    var UrlAndTitleTextDiv = document.getElementById("UrlAndTitleTextDiv");
    var url;
    var title;

    var fullWidthMap = {":": "\uFF1A", "[": "\uFF3B", "]": "\uFF3D", "|": "\uFF5C"};

    function isAmazon(hostname) {
        var h = hostname.replace(/^www\./, "").toLowerCase();
        return h === "amazon.co.jp" || h.endsWith(".amazon.co.jp") ||
               h === "amazon.com" || h.endsWith(".amazon.com") ||
               h.includes(".amazon.");
    }

    function sanitizeTitle(s, hostname) {
        var t = s.normalize("NFC")
                 .replace(/[\u0000-\u001F\u007F]/g, "")
                 .replace(/[:\[\]\|]/g, function(ch) { return fullWidthMap[ch] || ch; })
                 .trim();
        if (isAmazon(hostname)) {
            t = t.replace(/^Amazon(?:\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?)?[:\uFF1A]\s*/i, "Amazon\uFF1A ");
        }
        return t;
    }

    function cleanUrl(rawUrl) {
        var u;
        try {
            u = new URL(rawUrl);
        } catch (e) {
            return rawUrl;
        }

        // Remove fbclid and all utm_* params
        var toDelete = [];
        for (var pair of u.searchParams) {
            var kl = pair[0].toLowerCase();
            if (kl === "fbclid" || kl.startsWith("utm_")) {
                toDelete.push(pair[0]);
            }
        }
        toDelete.forEach(function(k) { u.searchParams.delete(k); });

        // Remove hash/fragment
        u.hash = "";

        var out = u.toString();

        // Amazon URL shortening
        try {
            var host = u.hostname.replace(/^www\./, "");
            if (host.startsWith("amazon.") || host.includes(".amazon.")) {
                var m = u.pathname.match(/\/(?:dp|gp\/product|o\/ASIN|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i) ||
                        u.pathname.match(/\/([A-Z0-9]{10})(?:[\/\?]|$)/i);
                if (m && m[1]) {
                    out = u.protocol + "//" + u.host + "/dp/" + m[1].toUpperCase();
                }
            }
        } catch (e) {}

        return out;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var rawUrl = tabs[0].url;
        var rawTitle = tabs[0].title;
        var hostname = "";
        try {
            hostname = new URL(rawUrl).hostname;
        } catch (e) {}

        url = cleanUrl(rawUrl);
        title = sanitizeTitle(rawTitle, hostname);
        UrlAndTitleTextDiv.innerText = title + "\n" + url;
    });

    copyButton.addEventListener("click", function() {
        var clipboardData = title + "\n" + url;
        navigator.clipboard.writeText(clipboardData);
        copyButton.innerText = "Copied";
    });
});

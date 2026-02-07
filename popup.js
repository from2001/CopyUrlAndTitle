document.addEventListener("DOMContentLoaded", function () {
  var copyButton = document.getElementById("copy-button");
  var UrlAndTitleTextDiv = document.getElementById("UrlAndTitleTextDiv");
  var url;
  var title;

  var charMap = { ":": "\uff1a", "[": "\uff3b", "]": "\uff3d", "|": "\uff5c" };

  function isAmazon(hostname) {
    var h = hostname.replace(/^www\./, "").toLowerCase();
    return (
      h === "amazon.co.jp" ||
      h.endsWith(".amazon.co.jp") ||
      h === "amazon.com" ||
      h.endsWith(".amazon.com") ||
      h.includes(".amazon.")
    );
  }

  function sanitizeTitle(s, hostname) {
    var t = s
      .normalize("NFC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[:\[\]|]/g, function (ch) {
        return charMap[ch] || ch;
      })
      .trim();
    if (isAmazon(hostname)) {
      t = t.replace(
        /^Amazon(?:\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?)?[:\uff1a]\s*/i,
        "Amazon\uff1a "
      );
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
    var del = [];
    for (var pair of u.searchParams) {
      var kl = pair[0].toLowerCase();
      if (kl === "fbclid" || kl.startsWith("utm_")) {
        del.push(pair[0]);
      }
    }
    del.forEach(function (k) {
      u.searchParams.delete(k);
    });
    u.hash = "";
    var out = u.toString();
    try {
      var host = u.hostname.replace(/^www\./, "");
      if (host.startsWith("amazon.") || host.includes(".amazon.")) {
        var m =
          u.pathname.match(
            /\/(?:dp|gp\/product|o\/ASIN|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i
          ) || u.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
        if (m) {
          out =
            u.protocol + "//" + u.hostname + "/dp/" + m[1].toUpperCase();
        }
      }
    } catch (e) {}
    return out;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

  copyButton.addEventListener("click", function () {
    var clipboardData = title + "\n" + url;
    navigator.clipboard.writeText(clipboardData).then(function () {
      copyButton.innerText = "Copied";
    });
  });
});

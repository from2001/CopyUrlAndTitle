document.addEventListener("DOMContentLoaded", function () {
  var copyButton = document.getElementById("copy-button");
  var buttonLabel = copyButton.querySelector(".button-label");
  var shortcut = copyButton.querySelector(".shortcut");
  var pageTitle = document.getElementById("page-title");
  var pageUrl = document.getElementById("page-url");
  var cleanBadge = document.getElementById("clean-badge");
  var statusMessage = document.getElementById("status-message");
  var statusDot = document.querySelector(".status-dot");
  var url;
  var title;
  var resetTimer;

  var charMap = { ":": "\uff1a", "[": "\uff3b", "]": "\uff3d", "|": "\uff5c" };

  shortcut.innerText = navigator.platform.toLowerCase().includes("mac") ? "⌘ C" : "Ctrl C";

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

  function sanitizeTitle(value, hostname) {
    var t = String(value || "Untitled page")
      .normalize("NFC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[:\[\]|]/g, function (character) {
        return charMap[character] || character;
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
    var parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch (error) {
      return rawUrl;
    }
    var parametersToDelete = [];
    for (var pair of parsedUrl.searchParams) {
      var key = pair[0].toLowerCase();
      if (key === "fbclid" || key.startsWith("utm_")) {
        parametersToDelete.push(pair[0]);
      }
    }
    parametersToDelete.forEach(function (key) {
      parsedUrl.searchParams.delete(key);
    });
    parsedUrl.hash = "";
    var output = parsedUrl.toString();
    try {
      var host = parsedUrl.hostname.replace(/^www\./, "");
      if (host.startsWith("amazon.") || host.includes(".amazon.")) {
        var match =
          parsedUrl.pathname.match(
            /\/(?:dp|gp\/product|o\/ASIN|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i
          ) || parsedUrl.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
        if (match) {
          output =
            parsedUrl.protocol +
            "//" +
            parsedUrl.hostname +
            "/dp/" +
            match[1].toUpperCase();
        }
      }
    } catch (error) {
      return output;
    }
    return output;
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function showCopiedState() {
    window.clearTimeout(resetTimer);
    copyButton.classList.add("is-copied");
    buttonLabel.innerText = "Copied to clipboard";
    statusMessage.innerText = "Ready to paste anywhere";
    resetTimer = window.setTimeout(function () {
      copyButton.classList.remove("is-copied");
      buttonLabel.innerText = "Copy to clipboard";
      statusMessage.innerText = "Tracking parameters are removed automatically";
    }, 1800);
  }

  function showError(message) {
    pageTitle.innerText = "Unable to read this page";
    pageUrl.innerText = "Open a regular webpage and try again";
    statusMessage.innerText = message;
    statusMessage.classList.add("is-error");
    statusDot.classList.add("is-error");
    statusDot.title = "Current tab unavailable";
    statusDot.setAttribute("aria-label", "Current tab unavailable");
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (chrome.runtime.lastError || !tabs || !tabs[0] || !tabs[0].url) {
      showError("The current tab is not available");
      return;
    }

    var rawUrl = tabs[0].url;
    var hostname = "";
    try {
      hostname = new URL(rawUrl).hostname;
    } catch (error) {
      hostname = "";
    }
    url = cleanUrl(rawUrl);
    title = sanitizeTitle(tabs[0].title, hostname);
    cleanBadge.hidden = url === rawUrl;
    pageTitle.innerText = title;
    pageTitle.title = title;
    pageUrl.innerText = url;
    pageUrl.title = url;
    copyButton.disabled = false;
  });

  copyButton.addEventListener("click", function () {
    if (!title || !url) {
      return;
    }

    var clipboardData = title + "\n" + url;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(clipboardData).then(showCopiedState).catch(function () {
        fallbackCopy(clipboardData);
        showCopiedState();
      });
    } else {
      fallbackCopy(clipboardData);
      showCopiedState();
    }
  });

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c") {
      event.preventDefault();
      copyButton.click();
    }
  });
});

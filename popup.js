document.addEventListener("DOMContentLoaded", function() {
    var copyButton = document.getElementById("copy-button");
    var UrlAndTitleTextDiv = document.getElementById("UrlAndTitleTextDiv");
    var url;
    var title;
    var UrlAndTitleText;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        url = tabs[0].url;
        title = tabs[0].title;
        url = url.replace(/[\?&](fbclid\=|utm_source\=|utm_medium\=|utm_campaign\=|utm_term\=|utm_content\=)[a-zA-Z0-9_\-]+/g, '').replace(/https?:\/\/(?:www\.)?amazon(.+?)\/(?:exec\/obidos\/ASIN|gp\/product|o\/ASIN|(?:.+?\/)?dp)\/(.+?)\/.*/g,"https://amazon$1/dp/$2");
        UrlAndTitleTextDiv.innerText = title + "\n" + url; 
    });


    copyButton.addEventListener("click", function() {
        var clipboardData = title + "\n" + url; 
        navigator.clipboard.writeText(clipboardData);

        copyButton.innerText = "Copied";
      });
    });

















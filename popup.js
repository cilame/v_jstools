document.querySelectorAll("input").forEach(function(v){
    chrome.storage.sync.get([v.dataset.key], function (result) {
        v.checked = result[v.dataset.key];
    })
    v.addEventListener("change", function (e) {
        chrome.storage.sync.set({
            [e.target.dataset.key]: e.target.checked
        })
    })
})
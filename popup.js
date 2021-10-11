document.querySelectorAll("input").forEach(function(v){
  chrome.storage.local.get([v.dataset.key], function (result) {
    if (v.type == 'checkbox'){
      v.checked = result[v.dataset.key];
    }
    if (v.type == 'text'){
      v.value = result[v.dataset.key] || '';
    }
  })
  v.addEventListener("change", function (e) {
    if (v.type == 'checkbox'){
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.checked
      })
    }
    if (v.type == 'text'){
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.value
      })
    }
  })
})
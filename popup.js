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

document.getElementById('showoptions').addEventListener('click', function(e){
  function closePopup() {
    window.close();
    document.body.style.opacity = 0;
    setTimeout(function() { history.go(0); }, 300);
  }
  closePopup()
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html')
  });
})

document.getElementById('addlistener').addEventListener('click', function(e){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: {type:'addlistener', info: 'addlistener'}}, function(response) {});
  });
})
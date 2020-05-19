(function() {
  'use strict';

  const [url, queryString] = window.location.href.split('?');
  if (url.endsWith('files') && !(queryString || '').includes("autowhitespace=false") && !(queryString || '').includes("w=")) {
    window.location.href = `${url}?${queryString || ''}${queryString ? "&" : ""}w=1`;
  }

  function updateLinks() {
    // if navigating from a regular PR, apply ?w=1
    const tabs = document.getElementsByClassName('tabnav-tab');
    for (let tab of tabs) {
        if (tab.href && tab.href.endsWith('files')) {
            tab.href += '?w=1';
        }
    }

    // if we manually reset whitespace to false, don't loop and ignore whitespace again
    const forms = document.getElementsByTagName('form');
    for (let form of forms) {
      if (form.action && form.action.endsWith('files') && form.method == 'get') {
        let node = document.createElement('input');
        node.type = 'hidden';
        node.name = 'autowhitespace';
        node.value = 'false';
        form.appendChild(node);
      }
    }
  }

  window.onload=(function() {
    const observerOptions = { childList: true, characterData: true, subtree: true };
    const observer = new MutationObserver(function() {
      // https://stackoverflow.com/a/39332340
      setTimeout(function() {
        updateLinks();
        observer.observe(document.querySelector("body"), observerOptions);
      }, 0);
      observer.disconnect();
    });
    observer.observe(document.querySelector("body"), observerOptions);
  })
})();
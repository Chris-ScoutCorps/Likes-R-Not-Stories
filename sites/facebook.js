'use strict';

console.log('Facebook ')

$(document).ready(() => {
  chrome.storage.sync.get('enable-facebook', function (settings) {
    if (settings['enable-facebook'] === false)
      return;

    console.log(' enabled')
  });

});

'use strict';
//I'm loaded when you click the extension icon in Chrome

//console.log('Hello Index');

$(document).ready(() => {
  const toggles = $('input.site-toggle[type=checkbox]');
  const settingKeys = toggles.toArray().map(x => $(x).attr('id'));

  chrome.storage.sync.get(settingKeys, function (settings) {
    Object.keys(settings).forEach(x => {
      $('#' + x).prop('checked', settings[x]);
    });
  });

  toggles.click(function () {
    chrome.storage.sync.set({[$(this).attr('id')]: $(this).is(':checked')});
  });
});

'use strict';

chrome.identity.getAuthToken({ 'interactive': true }, function(token) {

  $.ajax({
    url: 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/pbnfaaobfjjbjodongekibfbgdlmdbmh',
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
    success: function(license) {
      chrome.storage.sync.set({'license': license});
    }
  });

});
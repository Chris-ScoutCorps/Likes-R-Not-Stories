'use strict';

//console.log('Amazon.com specific logic');

const sellerLabelSelector = 'span.a-size-small.a-color-secondary';

$(document).ready(() => {
  chrome.storage.sync.get('enable-amazon', function (settings) {
    if (settings['enable-amazon'] === false)
      return;

    $(sellerLabelSelector)
      .toArray()
      .filter(x => $(x).html().trim() === 'by')
      .map(by => {
        var siblings = $(sellerLabelSelector, $(by).parent())
          .toArray()
          .filter(s => s !== by);

        $(siblings).css('border', '1px dashed red');
      });

  });
});
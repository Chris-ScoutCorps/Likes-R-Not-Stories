'use strict';

const postContainerSelector = 'div.fbUserPost';
const postHeadlineSelector = 'h5 .fwn.fcg>.fcg';

var aggregationKeys = {};
function aggregate(key, func, wait, maxWait) {
  if (maxWait == null) maxWait = wait * 3;

  function funcWithMark() {
    func();
    aggregationKeys[key].last = (new Date()).getTime();
  }

  const waitedTooLong = aggregationKeys[key]
    && aggregationKeys[key].last
    && (aggregationKeys[key].last + maxWait < (new Date()).getTime());

  if (waitedTooLong) {
    funcWithMark();
  }

  if (aggregationKeys[key]) {
    clearTimeout(aggregationKeys[key].id);
  }

  if (!waitedTooLong) { //because we'd have already ran it
    if (!aggregationKeys[key])
      aggregationKeys[key] = { last: null };

    aggregationKeys[key].id = setTimeout(funcWithMark, wait);
  }
}

function likesAreNotStories() {
  $(postContainerSelector).toArray().forEach(post => {
    if ($(post).data('likesAreNotStories-visited'))
      return;

    $(postHeadlineSelector, post[0]).toArray().forEach(headline => {
      const copy = $(headline).clone();
      $('.fwb', copy[0]).remove();
      $('a', copy[0]).remove();
      const nut = $(copy).html().replace(/\./g, '').trim();
      if (nut === 'liked this' || nut === 'likes') {
        const backup = $(headline).clone();
        $(post).css('padding', '2px');
        $(post).html('');
        $(post).append(backup);
      }
    });

    $(post).data('likesAreNotStories-visited', true);
  });
}

$(document).ready(() => {
  chrome.storage.sync.get('enable-facebook', function (settings) {
    if (settings['enable-facebook'] === false)
      return;

    aggregate('likesAreNotStories', likesAreNotStories, 100);
    $(document).scroll(() => aggregate('likesAreNotStories', likesAreNotStories, 100));

  });

});

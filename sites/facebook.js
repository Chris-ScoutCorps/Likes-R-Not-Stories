'use strict';

const postContainerSelector = 'div.fbUserPost';
const postHeadlineSelector = 'h5 .fwn.fcg>.fcg';

function likesAreNotStories() {
  $(postContainerSelector).toArray().forEach(post => {
    if ($(post).data('likesAreNotStories-visited'))
      return;

    $(postHeadlineSelector, post[0]).toArray().forEach(headline => {
      const copy = $(headline).clone();
      $('.fwb', copy[0]).remove();
      $('a', copy[0]).remove();
      const nut = $(copy).html().replace(/\./g, '').trim();
      if (nut === 'liked this' || nut === 'likes' || nut === 'reacted to this' || nut.startsWith('liked this post from')) {
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

    $.ScoutCorps.aggregate('likesAreNotStories', likesAreNotStories, 100);
    $(document).scroll(() => $.ScoutCorps.aggregate('likesAreNotStories', likesAreNotStories, 100));

  });

});

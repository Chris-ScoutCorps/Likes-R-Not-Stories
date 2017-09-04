'use strict';

const postContainerSelector = 'div.fbUserPost';
const postHeadlineSelector = 'h5 .fwn.fcg>.fcg';

function likesAreNotStories() {
  $(postContainerSelector).toArray().forEach(post => {
    if ($(post).data('likesAreNotStories-visited'))
      return;
    $(post).data('likesAreNotStories-visited', true);

    $(postHeadlineSelector, post).toArray().forEach(headline => {
      const copy = $(headline).clone();
      $('.fwb', copy[0]).remove();
      $('a', copy[0]).remove();
      $('i', copy[0]).remove();
      const nut = $(copy).html().replace(/\./g, '').trim();
      if (nut === 'liked this' || nut === 'likes' || nut === 'reacted to this' || nut.startsWith('liked this post from')) {
        const newPost = $(post).clone();
        $(newPost).html('').css('padding', '12px');
        $(newPost).data('likesAreNotStories-visited', true);

        const newHeadline = $(headline).clone();
        $(newPost).append(newHeadline);

        const show = $('<a href="javascript:void(0);">(show)</a>');
        $(newHeadline).append('<span> </span>').append(show);
        $(show).click(function () { $(post).show(); $(newPost).remove(); });

        $(post).after(newPost);
        $(post).hide();
      }
    });

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

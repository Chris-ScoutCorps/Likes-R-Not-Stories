'use strict';

const postContainerSelector = 'div.fbUserPost';
const postHeadlineSelector = 'h5 .fwn.fcg>.fcg';

function likesAreNotStories(enabled) {
  $(postContainerSelector).toArray().forEach(post => {
    if ($(post).data('likesAreNotStories-visited'))
      return;
    $(post).data('likesAreNotStories-visited', true);

    $(postHeadlineSelector, post).toArray().forEach(headline => {
      const copy = $(headline).clone();
      $('.fwb', copy[0]).remove();
      $('a', copy[0]).remove();
      $('i', copy[0]).remove();
      const nut = $(copy).html().replace(/\./g, '').replace(/\,/g, '').replace(/and/g, '').trim();
      if (nut === 'liked this' || nut === 'likes' || nut === 'like' || nut === 'reacted to this' || nut.startsWith('liked this post from')) {
        const newPost = $(post).clone();
        $(newPost).html('').css('padding', '12px');
        $(newPost).data('likesAreNotStories-visited', true);

        const newHeadline = $(headline).clone();
        $(newPost).append(newHeadline);

        const show = $('<a href="javascript:void(0);">(show)</a>');
        $(newHeadline).append('<span> </span>').append(show);
        $(show).click(function () { $(post).show(); $(newPost).remove(); });

        if (enabled) {
          $(post).after(newPost);
          $(post).hide();
        }
        else {
          const url = 'https://chrome.google.com/webstore/detail/pbnfaaobfjjbjodongekibfbgdlmdbmh';
          const expMsg = $('<h5 style="padding-bottom: 5px;">'
            + 'Likes are not Stories trial expired, <a href="' + url + '">head to the store to renew and hide this post.</a>'
            + '</h5>');
          $(headline).before(expMsg);
        }
      }
    });

  });
}

$(document).ready(() => {

  chrome.storage.sync.get('license', function (settings) {
    const license = settings.license;

    var enabled = false;
    if (license && license.accessLevel == "FULL") {
      enabled = true;
    } else if (license && license.accessLevel == "FREE_TRIAL") {
      var daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
      daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
      if (daysAgoLicenseIssued <= 7) {
        enabled = true;
      }
    }

    $.ScoutCorps.aggregate('likesAreNotStories', () => likesAreNotStories(enabled), 100);
    $(document).scroll(() => $.ScoutCorps.aggregate('likesAreNotStories', () => likesAreNotStories(enabled), 100));

  });

});

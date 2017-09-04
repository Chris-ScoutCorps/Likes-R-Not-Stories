'use strict';

(function () {
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

  $.ScoutCorps = $.ScoutCorps || {};
  $.ScoutCorps.aggregate = aggregate;
})();


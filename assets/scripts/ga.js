'use strict';

$(function () {
    var sendGoal = function sendGoal(a, b, c, d) {
        var tracker = ga.getAll()[0];
        tracker.send(a, b, c, d);
    };

    $('.ga-subscribe-up').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'showXChaingePopUp()');
        fbq('track', 'subscribe');
    });
    $('.ga-subscribe').on('click', function () {
        sendGoal('event', 'button', 'submit', 'subscribe');
        fbq('track', 'subscribe');
    });
    $('.ga-onepaper').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'onepaper');
    });
    $('.ga-whitepaper').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'whitepaper');
    });

    $('.contact').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'contact');
    });
    $('.clipboard.btn-copy').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'copyContarct');
    });
    $('.join-auction').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'join_auction');
    });
    $('.buy_token').on('click', function () {
        sendGoal('event', 'button', 'onclick', 'buy_token');
    });
});
//# sourceMappingURL=ga.js.map

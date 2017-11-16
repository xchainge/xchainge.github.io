$(function(){
    $(".ga-subscribe-up").on("click", function(){
        ga('send',  'event',  'button', 'onclick', 'showXChaingePopUp()');
    });    
    $(".ga-subscribe").on("click", function(){
        ga('send',  'event',  'button', 'submit', 'subscribe');
    });
    $(".ga-onepaper").on("click", function(){
        ga('send', 'event',  'button', 'onclick', 'onepaper');
    });
    $(".ga-whitepaper").on("click", function(){
        ga('send',  'event',  'button', 'onclick', 'whitepaper');
    });
});
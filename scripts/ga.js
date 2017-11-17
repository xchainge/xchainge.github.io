$(function(){
    var send = function(a,b,c,d){
        var tracker = ga.getAll()[0];
        tracker.send(a,b,c,d);
    } 
    $(".ga-subscribe-up").on("click", function(){
        send('event',  'button', 'onclick', 'showXChaingePopUp()');
    });    
    $(".ga-subscribe").on("click", function(){
        send('event',  'button', 'submit', 'subscribe');
    });
    $(".ga-onepaper").on("click", function(){
        send('event',  'button', 'onclick', 'onepaper');
    });
    $(".ga-whitepaper").on("click", function(){
        send('event',  'button', 'onclick', 'whitepaper');
    });
});
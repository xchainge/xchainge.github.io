$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        center: false,
        items:3,
        loop:false,
        margin:10,
        stagePadding: 50,
        nav: true,
        responsive:{
            600:{
                items:3
            },
            0:{
                nav: false,
                items:1
            }
        }
    });
    $('#part').owlCarousel({
        items:4,
        nav: true,
        responsive:{
            900:{
                items:4
            },
            600:{
                items:3
            },
            400:{
                items:2
            },
            0:{
                items:1
            }
        }
    });

    new WOW().init();
    // particlesJS.load('particles-js', 'scripts/particles.json', function() {
    //     console.log('callback - particles.js config loaded');
    // });
    var offset = 300;

    var navigationContainer = $('#cd-nav'),
        mainNavigation = navigationContainer.find('#cd-main-nav ul');

    //hide or show the "menu" link
checkMenu();
$(window).scroll(function(){
    checkMenu();
});

//open or close the menu clicking on the bottom "menu" link
$('.cd-nav-trigger').on('click', function(){
    $(this).toggleClass('menu-is-open');
    //we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)
    mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
});

function checkMenu() {
    if( $(window).scrollTop() > offset && !navigationContainer.hasClass('is-fixed')) {
        navigationContainer.addClass('is-fixed').find('.cd-nav-trigger').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
            mainNavigation.addClass('has-transitions');
        });
    } else if ($(window).scrollTop() <= offset) {
        //check if the menu is open when scrolling up
        if( mainNavigation.hasClass('is-visible')  && !$('html').hasClass('no-csstransitions') ) {
            //close the menu with animation
            mainNavigation.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                //wait for the menu to be closed and do the rest
                mainNavigation.removeClass('is-visible is-hidden has-transitions');
                navigationContainer.removeClass('is-fixed');
                $('.cd-nav-trigger').removeClass('menu-is-open');
            });
            //check if the menu is open when scrolling up - fallback if transitions are not supported
        } else if( mainNavigation.hasClass('is-visible')  && $('html').hasClass('no-csstransitions') ) {
            mainNavigation.removeClass('is-visible has-transitions');
            navigationContainer.removeClass('is-fixed');
            $('.cd-nav-trigger').removeClass('menu-is-open');
            //scrolling up with menu closed
        } else {
            navigationContainer.removeClass('is-fixed');
            mainNavigation.removeClass('has-transitions');
        }
    }
}


//////////// scroll to top
    var offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
        scroll_top_duration = 700,
        //grab the "back to top" link
        $back_to_top = $('.cd-top');

    //hide or show the "back to top" link
    $(window).scroll(function(){
        ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if( $(this).scrollTop() > offset_opacity ) {
            $back_to_top.addClass('cd-fade-out');
        }
    });

    //smooth scroll to top
    $back_to_top.on('click', function(event){
        event.preventDefault();
        $('body,html').animate({
                scrollTop: 0 ,
            }, scroll_top_duration
        );
    });

    //////////////// timer
    var timer;

    var compareDate = new Date(2017,11,5);
    // compareDate.setDate('2017-12-01'); //just for this demo today + 7 days

    timer = setInterval(function() {
        timeBetweenDates(compareDate);
    }, 1000);

    function timeBetweenDates(toDate) {
        var dateEntered = toDate;
        var now = new Date();
        var difference = dateEntered.getTime() - now.getTime();

        if (difference <= 0) {

            // Timer done
            clearInterval(timer);

        } else {

            var seconds = Math.floor(difference / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);

            hours %= 24;
            minutes %= 60;
            seconds %= 60;

            $("#days").text(days);
            $("#hours").text(hours);
            $("#minutes").text(minutes);
            $("#seconds").text(seconds);
        }
    }

    if($('body').hasClass('bounty')) {
        var stickyNavTop = $('.left-nav').offset().top;
        var stickyFooter = $('footer').offset().top - $('.left-nav').outerHeight() - 50;

        var stickyNav = function () {
            var scrollTop = $(window).scrollTop();

            if (scrollTop > stickyFooter)
                $('.left-nav').css("z-index", -1);
            else
                $('.left-nav').css("z-index", 0);
            // console.log(scrollTop, stickyFooter);

            if (scrollTop > stickyNavTop - 20) {
                $('.nav').addClass('sticky');

            } else {
                $('.nav').removeClass('sticky');
            }
        };

        stickyNav();

        $(window).scroll(function () {
            stickyNav();
        });
    }
});
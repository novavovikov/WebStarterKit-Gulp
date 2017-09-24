(function() {
    var header = $('.header'),
        headerHeight = $('.header').height(),
        scrollTop = $(window).scrollTop();

    $(window).scroll(function() {
        if ($(window).scrollTop() > scrollTop) {
            header.addClass('_hide');
        } else {
            header.removeClass('_hide');
        };

        if ($(window).scrollTop() > headerHeight) {
            header.addClass('_small');
        } else {
            header.removeClass('_small');
        };

        scrollTop = $(window).scrollTop();
    });
})();
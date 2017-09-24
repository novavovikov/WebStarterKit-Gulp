//sliders
$('.products-list').each(function () {
	var $wrap = $(this),
		$scrollbar = $wrap.find('.products-list__scrollbar'),
		$slider = $wrap.find('.products-items'),
		$prev = $wrap.find('.products-list__arrow._prev'),
		$next = $wrap.find('.products-list__arrow._next');

	var sly = new Sly($slider, {
		horizontal: 1,
		itemNav: 'basic',
		activateMiddle: 1,
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 10,
		scrollBar: $scrollbar,
		scrollBy: 1,
		activatePageOn: 'click',
		speed: 200,
		moveBy: 600,
		elasticBounds: 1,
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,

		// Buttons
		prev: $prev,
		next: $next,
	}).init();
});

$('.banner').each(function() {
	var banner = $(this),
		nextArrow, prevArrow;
	
	$('.banner').owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		smartSpeed: 600,
		autoplayHoverPause: true,
		nav: true,
		navText: ['', ''],
		onInitialized : function() {
			var prevSlide = banner.find('.owl-item.active').prev(),
				nextSlide = banner.find('.owl-item.active').next(),
				prevImg = prevSlide.find('img').attr('src'),
				nextImg = nextSlide.find('img').attr('src');


			banner.append('<div class="banner__preview _prev"></div>');
			banner.append('<div class="banner__preview _next"></div>');
			
			prevArrow = banner.children('.banner__preview._prev');
			nextArrow = banner.children('.banner__preview._next');
		
			prevArrow.click(function() {
				banner.trigger('prev.owl.carousel');
			});
		
			nextArrow.click(function() {
				banner.trigger('next.owl.carousel');
			});
			
			nextArrow.css({
				'background-image': `url(${nextImg})`
			});

			prevArrow.css({
				'background-image': `url(${prevImg})`
			});
		},
		onTranslated: function() {
			var prevSlide = banner.find('.owl-item.active').prev(),
				nextSlide = banner.find('.owl-item.active').next(),
				prevImg = prevSlide.find('img').attr('src'),
				nextImg = nextSlide.find('img').attr('src');

			if (nextArrow !== undefined) {
				nextArrow.css({
					'background-image': `url(${nextImg})`
				});
			}

			if (prevArrow !== undefined) {
				prevArrow.css({
					'background-image': `url(${prevImg})`
				});
			}
		}
	});
});

$('.reviews-list').owlCarousel({
	items: 2,
	autoWidth: true,
	loop: true,
	nav: true
});

// btn top
(function () {
	$('.footer__top').click(function () {
		$('body,html').animate({
			scrollTop: 0}, 400);
			return false;
		});
})();

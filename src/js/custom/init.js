//checker
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

console.log(123);
// btn top

$(function () {
	$('.footer__top').click(function () {
		$('body,html').animate({
			scrollTop: 0}, 400);
			return false;
		});
});

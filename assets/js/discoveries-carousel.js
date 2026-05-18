(function () {
	'use strict';

	var showcase = document.querySelector('.discoveries-showcase');
	if (!showcase)
		return;

	var carousel = showcase.querySelector('.discoveries-carousel');
	var viewport = showcase.querySelector('.discoveries-viewport');
	var track = showcase.querySelector('.discoveries-track');
	var prevButton = showcase.querySelector('.discoveries-nav.prev');
	var nextButton = showcase.querySelector('.discoveries-nav.next');
	var refreshButton = showcase.querySelector('.discoveries-refresh');

	if (!carousel || !viewport || !track || !prevButton || !nextButton || !refreshButton)
		return;

	var index = 0;
	var gap = 16;

	var getSlidesToShow = function () {
		if (window.matchMedia('(max-width: 480px)').matches)
			return 1;
		if (window.matchMedia('(max-width: 980px)').matches)
			return 2;
		return 3;
	};

	var getCards = function () {
		return Array.prototype.slice.call(track.querySelectorAll('.discovery-card'));
	};

	var getMaxIndex = function () {
		var cards = getCards();
		return Math.max(0, cards.length - getSlidesToShow());
	};

	var clampIndex = function () {
		index = Math.min(index, getMaxIndex());
		index = Math.max(index, 0);
	};

	var updateNav = function () {
		var maxIndex = getMaxIndex();
		prevButton.disabled = index <= 0;
		nextButton.disabled = index >= maxIndex;
	};

	var updateGap = function () {
		var style = window.getComputedStyle(track);
		var rawGap = parseFloat(style.columnGap || style.gap || '16');
		gap = Number.isNaN(rawGap) ? 16 : rawGap;
	};

	var updatePosition = function () {
		clampIndex();
		updateGap();
		var firstCard = track.querySelector('.discovery-card');
		if (!firstCard) {
			track.style.transform = 'translateX(0)';
			updateNav();
			return;
		}

		var cardWidth = firstCard.getBoundingClientRect().width;
		var offset = index * (cardWidth + gap);
		track.style.transform = 'translateX(' + (-offset) + 'px)';
		updateNav();
	};

	var next = function () {
		index += 1;
		updatePosition();
	};

	var prev = function () {
		index -= 1;
		updatePosition();
	};

	var shuffleCards = function () {
		var cards = getCards();
		for (var i = cards.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = cards[i];
			cards[i] = cards[j];
			cards[j] = temp;
		}

		cards.forEach(function (card) {
			track.appendChild(card);
		});

		index = 0;
		updatePosition();
	};

	prevButton.addEventListener('click', prev);
	nextButton.addEventListener('click', next);
	refreshButton.addEventListener('click', shuffleCards);
	window.addEventListener('resize', updatePosition);

	updatePosition();
})();

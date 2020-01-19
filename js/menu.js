window.addEventListener('load', function () {
	let MenuItems = document.getElementsByClassName('MenuItem');
	for (let i = 0; i < MenuItems.length; i++) {
		MenuItems[i].onmouseover = function () {
			this.style.background = 'lightblue';
		}
		MenuItems[i].onmouseleave = function () {
			this.style.background = 'none';
		}
	}
}


"use strict";
var lastItem = null, path = [];

function drawArrow(from, to) {
	var x1 = from.dataset.x | 0, x2 = to.dataset.x | 0,
			y1 = from.dataset.y | 0, y2 = to.dataset.y | 0;
	var arrow = document.createElement("div");
	arrow.classList.add("arrow");
	arrow.style.transform = "rotate(" + (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90) + "deg)";
	from.appendChild(arrow);
}

function drawLine(from, to) {
	var x1 = from.dataset.x | 0, x2 = to.dataset.x | 0,
			y1 = from.dataset.y | 0, y2 = to.dataset.y | 0,
			line;

	if (x1 < x2) {
		line = from.querySelector(".line." + "rR".charAt(x2 - x1 - 1) + "Uu_dD".charAt(y2 - y1 + 2));
	} else if (x1 == x2) {
		if (Math.abs(y1 - y2) <= 1) {
			line = (y1 < y2 ? from : to).querySelector(".line._d");
		}
	} else {
		return drawLine(to, from);
	}
	if (!line || line.classList.contains("active")) {
		console.warn("不支持");
		return false;
	}
	line.classList.add("active");
	return true;
}

Array.prototype.forEach.call($("div.row"), function (line, y) {
	Array.prototype.forEach.call(line.querySelectorAll(":scope > div"), function (div, x) {
		div.dataset.x = x;
		div.dataset.y = y;
	});
});


function reset() {
	if (!path.length) {
		return;
	}
	path = [];
	Array.prototype.forEach.call($("div.selected"), function (elem) {
		elem.classList.remove("selected");
		elem.classList.remove("current");
	});
	Array.prototype.forEach.call($("div.active"), function (elem) {
		elem.classList.remove("active");
	});
	Array.prototype.forEach.call($("div.arrow"), function (elem) {
		elem.parentElement.removeChild(elem);
	});
	Array.prototype.forEach.call($("div.nums > input"), function (elem) {
		elem.value = "";
	});
	document.body.classList.remove("error");
	document.body.classList.remove("ok");
}

function drawPassword(elem) {
	if (!elem.classList.contains("selected")) {
		if (path.length) {
			if (!drawLine(lastItem, elem)) {
				return;
			}
			drawArrow(lastItem, elem);
			lastItem.classList.remove("current");
		}
		elem.classList.add("selected");
		elem.classList.add("current");

		lastItem = elem;
		path.push((elem.dataset.x | 0) + (elem.dataset.y | 0) * 3);
	}
}

function judge() {
	if (!path.length) {
		return;
	}
	if ([0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (n, idx) {
		return n === path[idx];
	})) {
		document.body.classList.add("ok");
	} else {
		document.body.classList.add("error");
	}
}

document.addEventListener("mousedown", reset);

Array.prototype.forEach.call($("div.row > div"), function (elem) {
	elem.addEventListener("mousemove", function (evt) {
		var button = "buttons" in evt ? evt.buttons : evt.which;
		if (button === 1) {
			drawPassword(elem);
		}
	});
});

document.addEventListener("mouseup", judge);

Array.prototype.forEach.call($("div.row > div"), function (elem) {
	elem.addEventListener("touchstart", function () {
		reset();
		drawPassword(this);
	});
	elem.addEventListener("touchmove", function (evt) {
		var ts = evt.changedTouches[0];
		var elem = document.elementFromPoint(ts.pageX, ts.pageY);
		if (elem && elem.tagName == "DIV" && elem.classList.contains("column")) {
			drawPassword(elem);
		}
	});
	elem.addEventListener("touchend", judge);
});
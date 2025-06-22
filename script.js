/* 2. Dark Mode Toggle */
const themeBtn = document.getElementById("theme-toggle");
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
	document.body.classList.add("dark");
	themeBtn.textContent = "☀️";
}
themeBtn.onclick = () => {
	document.body.classList.toggle("dark");
	const isDark = document.body.classList.contains("dark");
	localStorage.setItem("theme", isDark ? "dark" : "light");
	themeBtn.textContent = isDark ? "☀️" : "🌙";
};

/* 3. Header Blur on Scroll */
addEventListener(
	"scroll",
	() => {
		document.querySelector("header").classList.toggle("scrolled", scrollY > 2);
	},
	{ passive: true }
);

/* 4. Scroll Reveal */
const revealObserver = new IntersectionObserver(
	(entries) =>
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add("in-view");
				revealObserver.unobserve(e.target);
			}
		}),
	{ threshold: 0.15 }
);
document
	.querySelectorAll("[data-animate]")
	.forEach((el) => revealObserver.observe(el));

// 支援多個 .timeline
document.querySelectorAll(".timeline").forEach((tl) => {
	// a) Scroll-Reveal & Toggle
	const items = tl.querySelectorAll(".tl-item");
	const obs = new IntersectionObserver(
		(entries, o) => {
			entries.forEach((en) => {
				if (en.isIntersecting) {
					en.target.classList.add("in-view");
					o.unobserve(en.target);
				}
			});
		},
		{ threshold: 0.25 }
	);
	items.forEach((i) => obs.observe(i));

	tl.querySelectorAll(".tl-toggle").forEach((btn) => {
		btn.addEventListener("click", () => {
			const item = btn.closest(".tl-item");
			const open = item.classList.toggle("open");
			btn.setAttribute("aria-expanded", open);
			btn.textContent = open ? "收合" : "更多";
		});
	});

	// b) Progress Line
	const fill = document.createElement("span");
	fill.className = "timeline-fill";
	tl.appendChild(fill);
	const paint = () => {
		const r = tl.getBoundingClientRect();
		if (r.top > window.innerHeight || r.bottom < 0) return;
		const total = tl.offsetHeight;
		const visible = Math.min(total, total - r.top);
		fill.style.height = `${Math.max(0, visible)}px`;
	};
	window.addEventListener("scroll", paint, { passive: true });
	paint();
});

/* 7. Project 3D Tilt */
document.querySelectorAll("[data-tilt]").forEach((card) => {
	const damp = 20;
	card.onmousemove = (e) => {
		const r = card.getBoundingClientRect();
		const dx = e.clientX - r.left - r.width / 2;
		const dy = e.clientY - r.top - r.height / 2;
		card.style.transform = `rotateX(${(dy / damp).toFixed(2)}deg) rotateY(${(
			-dx / damp
		).toFixed(2)}deg)`;
	};
	card.onmouseleave = () => (card.style.transform = "");
});

/* 8. Particle Background */
const cvs = document.getElementById("bg-stars");
if (cvs) {
	const ctx = cvs.getContext("2d");
	let w, h, stars;
	const NUM = 140;
	function initStars() {
		w = cvs.width = innerWidth;
		h = cvs.height = document.getElementById("hero").offsetHeight;
		stars = Array.from({ length: NUM }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			r: Math.random() * 1.3 + 0.5,
			s: Math.random() * 0.6 + 0.2
		}));
	}
	function draw() {
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "#fff";
		stars.forEach((p) => {
			p.x -= p.s;
			if (p.x < 0) p.x = w;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
			ctx.fill();
		});
		requestAnimationFrame(draw);
	}
	addEventListener("resize", initStars, { passive: true });
	initStars();
	draw();
}

/* 9. Cursor Bubble */
const dot = document.querySelector(".cursor-bubble");
addEventListener(
	"pointermove",
	(e) => {
		dot.style.left = e.clientX + "px";
		dot.style.top = e.clientY + "px";
	},
	{ passive: true }
);

/* 10. Back-to-Top */
const topBtn = document.getElementById("back-top");
addEventListener(
	"scroll",
	() => topBtn.classList.toggle("show", scrollY > 400),
	{ passive: true }
);
topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* 11. Certificates Filter */
const chips = document.querySelectorAll(".cert-filter .chip");

chips.forEach(
	(chip) =>
		(chip.onclick = () => {
			chips.forEach((c) => c.classList.toggle("active", c === chip));
			const tag = chip.dataset.tag;
			document.querySelectorAll(".cert-card").forEach((card) => {
				card.style.display =
					tag === "all" || card.dataset.tag === tag ? "block" : "none";
			});
			document.querySelectorAll(".cert-group-title").forEach((title) => {
				const cards = [...title.nextElementSibling.children];
				title.style.display = cards.some((c) => c.style.display !== "none")
					? "block"
					: "none";
			});
		})
);

// 在頁面載入時觸發 "All" 篩選，確保證書顯示
document.addEventListener("DOMContentLoaded", () => {
	const allChip = document.querySelector('.cert-filter .chip[data-tag="all"]');
	if (allChip) {
		allChip.click();
	}

	// 證書圖片放大功能
	const certImgs = document.querySelectorAll('.cert-img');
	const certModal = document.getElementById('cert-modal');
	const certModalImg = document.getElementById('cert-modal-img');
	const certModalBackdrop = document.querySelector('.cert-modal-backdrop');

	certImgs.forEach(img => {
		img.addEventListener('click', () => {
			certModalImg.src = img.src;
			certModal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
		});
	});

	function closeCertModal() {
		certModal.style.display = 'none';
		certModalImg.src = '';
		document.body.style.overflow = '';
	}

	certModalBackdrop.addEventListener('click', closeCertModal);
	certModalImg.addEventListener('click', closeCertModal);
	document.addEventListener('keydown', (e) => {
		if (certModal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
			closeCertModal();
		}
	});

	// 作品影片播放功能
	const videoLinks = document.querySelectorAll('.proj-video-link');
	const videoModal = document.getElementById('video-modal');
	const videoIframe = document.getElementById('video-iframe');
	const videoModalClose = document.getElementById('video-modal-close');
	const videoModalBackdrop = document.querySelector('.video-modal-backdrop');

	function openVideoModal(videoId) {
		videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
		videoModal.style.display = 'flex';
		document.body.style.overflow = 'hidden';
	}

	function closeVideoModal() {
		videoModal.style.display = 'none';
		videoIframe.src = '';
		document.body.style.overflow = '';
	}

	videoLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const videoId = link.dataset.videoId;
			openVideoModal(videoId);
		});
	});

	videoModalClose.addEventListener('click', closeVideoModal);
	videoModalBackdrop.addEventListener('click', closeVideoModal);
	document.addEventListener('keydown', (e) => {
		if (videoModal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
			closeVideoModal();
		}
	});
});

/* 12. Skills Filter */
const skillChips = document.querySelectorAll(".skill-filter .chip");
const skillItems = document.querySelectorAll(".skill-item");
skillChips.forEach((chip) => {
	chip.onclick = () => {
		skillChips.forEach((c) => c.classList.toggle("active", c === chip));
		const cat = chip.dataset.category;
		skillItems.forEach((item) => {
			item.style.display =
				cat === "all" || item.dataset.category === cat ? "block" : "none";
		});
	};
});

/* 13. Skills Focus Scale */
document.querySelectorAll(".skill-item").forEach((c) => {
	c.onfocus = () => (c.style.transform = "scale(1.04)");
	c.onblur = () => (c.style.transform = "");
});

// 綁定在整個 body（或你想要的容器 #hero）
VANTA.NET({
	el: "body",
	mouseControls: true,
	touchControls: true,
	gyroControls: false,
	minHeight: 200.0,
	minWidth: 200.0,
	scale: 1.0,
	scaleMobile: 1.0,
	color: 0xffffff, // 線條顏色：白
	backgroundColor: 0x000000, // 底層透明，實際底色由 CSS 提供
	points: 20.0, // 網格點數
	spacing: 18.0 // 網格間距
});
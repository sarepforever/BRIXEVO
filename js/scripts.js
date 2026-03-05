/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// ============================================================
// Portfolio Carousel + Lightbox
// ============================================================
(function () {
    /* ===== CAROUSEL ===== */
    var track = document.getElementById('portfolioTrack');
    if (!track) return;
    var slides = Array.from(track.querySelectorAll('.portfolio-carousel-slide'));
    var prevArrow = document.querySelector('.portfolio-carousel-prev');
    var nextArrow = document.querySelector('.portfolio-carousel-next');
    var dotsContainer = document.getElementById('portfolioDots');
    var currentPage = 0;

    function getPerPage() {
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function getGap() {
        return window.innerWidth < 768 ? 16 : 24;
    }

    function getTotalPages() {
        return Math.ceil(slides.length / getPerPage());
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        var total = getTotalPages();
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'portfolio-dot' + (i === currentPage ? ' active' : '');
            dot.setAttribute('aria-label', 'Página ' + (i + 1));
            dot.dataset.page = i;
            dot.addEventListener('click', function () {
                goToPage(parseInt(this.dataset.page));
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToPage(page) {
        var total = getTotalPages();
        var perPage = getPerPage();
        if (page < 0) page = total - 1;
        if (page >= total) page = 0;
        currentPage = page;
        var gapPx = getGap();
        var slideWidth = (track.parentElement.offsetWidth - gapPx * (perPage - 1)) / perPage;
        var offset = currentPage * perPage * (slideWidth + gapPx);
        track.style.transform = 'translateX(-' + offset + 'px)';
        updateDots();
        updateArrows();
    }

    function updateDots() {
        var dots = dotsContainer.querySelectorAll('.portfolio-dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === currentPage);
        });
    }

    function updateArrows() {
        var total = getTotalPages();
        prevArrow.style.opacity = total <= 1 ? '0.3' : '';
        nextArrow.style.opacity = total <= 1 ? '0.3' : '';
    }

    function initCarousel() {
        var perPage = getPerPage();
        var gapPx = getGap();
        var slideWidth = (track.parentElement.offsetWidth - gapPx * (perPage - 1)) / perPage;
        slides.forEach(function (s) {
            s.style.minWidth = slideWidth + 'px';
            s.style.maxWidth = slideWidth + 'px';
        });
        if (currentPage >= getTotalPages()) currentPage = getTotalPages() - 1;
        if (currentPage < 0) currentPage = 0;
        goToPage(currentPage);
        buildDots();
    }

    prevArrow.addEventListener('click', function () { goToPage(currentPage - 1); });
    nextArrow.addEventListener('click', function () { goToPage(currentPage + 1); });

    // Swipe on carousel
    var carouselTouchX = 0;
    track.addEventListener('touchstart', function (e) { carouselTouchX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var diff = e.changedTouches[0].screenX - carouselTouchX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToPage(currentPage - 1);
            else goToPage(currentPage + 1);
        }
    }, { passive: true });

    window.addEventListener('resize', initCarousel);
    initCarousel();

    /* ===== LIGHTBOX ===== */
    var modal = document.getElementById('lightboxModal');
    var modalImg = document.getElementById('lightboxImg');
    var closeBtn = modal.querySelector('.lightbox-close');
    var lbPrev = modal.querySelector('.lightbox-prev');
    var lbNext = modal.querySelector('.lightbox-next');
    var counter = document.getElementById('lightboxCounter');

    var wrappers = Array.from(document.querySelectorAll('.proyecto-img-wrapper'));
    var images = wrappers.map(function (w) { return w.querySelector('img').src; });
    var lbIndex = 0;

    function showImage(index) {
        lbIndex = (index + images.length) % images.length;
        modalImg.style.opacity = '0';
        modalImg.style.transform = 'scale(0.95)';
        setTimeout(function () {
            modalImg.src = images[lbIndex];
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        }, 180);
        counter.textContent = (lbIndex + 1) + ' / ' + images.length;
    }

    wrappers.forEach(function (wrapper, i) {
        wrapper.style.cursor = 'zoom-in';
        wrapper.addEventListener('click', function () {
            showImage(i);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); showImage(lbIndex - 1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); showImage(lbIndex + 1); });
    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
        if (e.key === 'ArrowRight') showImage(lbIndex + 1);
    });
    var lbTouchX = 0;
    modal.addEventListener('touchstart', function (e) { lbTouchX = e.changedTouches[0].screenX; }, { passive: true });
    modal.addEventListener('touchend', function (e) {
        var diff = e.changedTouches[0].screenX - lbTouchX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showImage(lbIndex - 1);
            else showImage(lbIndex + 1);
        }
    }, { passive: true });
})();

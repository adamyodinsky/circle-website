class ScreenshotCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.carousel = this.container.querySelector(".carousel");
    this.slides = this.container.querySelectorAll(".carousel-slide");
    this.prevBtn = this.container.querySelector(".carousel-prev");
    this.nextBtn = this.container.querySelector(".carousel-next");
    this.indicators = this.container.querySelector(".carousel-indicators");

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    this.createIndicators();
    this.bindEvents();
    this.preloadImages();
    this.updateCarousel();

    // Auto-play functionality
    this.startAutoPlay();
  }

  preloadImages() {
    // Ensure all images are loaded before starting carousel
    this.slides.forEach((slide) => {
      const img = slide.querySelector(".screenshot-image");
      if (img && !img.complete) {
        img.addEventListener("load", () => {
          // Image loaded, carousel will handle visibility
        });
        img.addEventListener("error", () => {
          console.warn("Failed to load carousel image:", img.src);
          slide.style.display = "none";
        });
      }
    });
  }

  createIndicators() {
    if (!this.indicators) return;

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      indicator.setAttribute("data-index", i);
      indicator.setAttribute("aria-label", `Go to screenshot ${i + 1}`);

      if (i === 0) indicator.classList.add("active");

      this.indicators.appendChild(indicator);
    }
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.goToPrevious());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.goToNext());
    }

    // Indicators
    if (this.indicators) {
      this.indicators.addEventListener("click", (e) => {
        if (e.target.classList.contains("carousel-indicator")) {
          const index = parseInt(e.target.getAttribute("data-index"));
          this.goToSlide(index);
        }
      });
    }

    // Touch/swipe support
    this.bindTouchEvents();

    // Keyboard navigation
    this.container.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.goToPrevious();
      if (e.key === "ArrowRight") this.goToNext();
    });

    // Pause auto-play on hover
    this.container.addEventListener("mouseenter", () => this.pauseAutoPlay());
    this.container.addEventListener("mouseleave", () => this.startAutoPlay());
  }

  bindTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.pauseAutoPlay();
    });

    this.carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      e.preventDefault();
    });

    this.carousel.addEventListener("touchend", () => {
      if (!isDragging) return;

      const deltaX = startX - currentX;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          this.goToNext();
        } else {
          this.goToPrevious();
        }
      }

      isDragging = false;
      this.startAutoPlay();
    });
  }

  goToNext() {
    if (this.isAnimating) return;

    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
  }

  goToPrevious() {
    if (this.isAnimating) return;

    this.currentIndex =
      this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;

    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    this.isAnimating = true;

    this.slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next");

      if (index === this.currentIndex) {
        slide.classList.add("active");
      } else if (index === this.getPrevIndex()) {
        slide.classList.add("prev");
      } else if (index === this.getNextIndex()) {
        slide.classList.add("next");
      }

      // Update slide position and effects
      const offset = index - this.currentIndex;
      const scale = index === this.currentIndex ? 1 : 0.65;
      const opacity =
        Math.abs(offset) <= 1 ? (index === this.currentIndex ? 1 : 0.5) : 0;
      const blur = index === this.currentIndex ? 0 : 6;

      // Position slides: center active, left/right for adjacent
      let translateX = -50; // Base center position
      let translateY = -50; // Base center position

      if (offset === 0) {
        // Active slide - center
        translateX = -50;
      } else if (offset === 1 || offset === -(this.totalSlides - 1)) {
        // Next slide - right side
        translateX = -20;
      } else if (offset === -1 || offset === this.totalSlides - 1) {
        // Previous slide - left side
        translateX = -80;
      }

      slide.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.filter = `blur(${blur}px)`;
      slide.style.zIndex =
        index === this.currentIndex ? 10 : Math.abs(offset) <= 1 ? 5 : 1;
    });

    // Update indicators
    this.updateIndicators();

    // Update navigation buttons state
    this.updateNavigationState();

    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  updateIndicators() {
    if (!this.indicators) return;

    const indicators = this.indicators.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }

  updateNavigationState() {
    // For infinite carousel, buttons are always enabled
    // You can modify this for finite carousel behavior
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }

  getPrevIndex() {
    return this.currentIndex === 0
      ? this.totalSlides - 1
      : this.currentIndex - 1;
  }

  getNextIndex() {
    return (this.currentIndex + 1) % this.totalSlides;
  }

  startAutoPlay() {
    this.pauseAutoPlay(); // Clear any existing interval

    this.autoPlayInterval = setInterval(() => {
      this.goToNext();
    }, 4000); // Change slide every 4 seconds
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  destroy() {
    this.pauseAutoPlay();
    // Remove event listeners if needed for cleanup
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const carouselContainer = document.querySelector(".screenshots-carousel");
  if (carouselContainer) {
    new ScreenshotCarousel(".screenshots-carousel");
  }
});

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScreenshotCarousel;
}

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Platform detection for app store links
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  // Get all app store links
  const androidLinks = document.querySelectorAll(".android-link");
  const iosLinks = document.querySelectorAll(".ios-link");

  // Show/hide platform-specific buttons based on device
  if (isAndroid) {
    iosLinks.forEach((link) => (link.style.display = "none"));
  } else if (isIOS) {
    androidLinks.forEach((link) => (link.style.display = "none"));
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation (excluding carousel elements)
  const animateElements = document.querySelectorAll(
    ".feature-item, .privacy-content, .final-cta"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .feature-item:nth-child(1) { transition-delay: 0.1s; }
    .feature-item:nth-child(2) { transition-delay: 0.2s; }
    .feature-item:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  // Add click tracking for analytics (optional)
  function trackClick(eventName, properties = {}) {
    // You can integrate with analytics services here
    console.log(`Track: ${eventName}`, properties);
  }

  // Track app store clicks
  document.querySelectorAll(".app-button").forEach((button) => {
    button.addEventListener("click", function () {
      const store = this.classList.contains("ios-link")
        ? "App Store"
        : "Google Play";
      trackClick("app_store_click", { store: store, location: "hero" });
    });
  });

  // Track final CTA clicks
  document.querySelectorAll(".final-cta .app-button").forEach((button) => {
    button.addEventListener("click", function () {
      const store = this.classList.contains("ios-link")
        ? "App Store"
        : "Google Play";
      trackClick("app_store_click", { store: store, location: "final_cta" });
    });
  });

  // Track privacy policy clicks
  document.querySelectorAll(".privacy-link").forEach((link) => {
    link.addEventListener("click", function () {
      trackClick("privacy_policy_click");
    });
  });

  // Image loading is now handled by the carousel component

  // Feature item hover effects are now handled by CSS

  // Lazy loading for images (if needed)
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});

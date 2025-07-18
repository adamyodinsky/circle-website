document.addEventListener("DOMContentLoaded", function () {
  // Get user ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId") || "default";
  const inviterName = urlParams.get("name") || "John Doe";

  // Update invite message
  const inviteMessage = document.getElementById("invite-message");
  inviteMessage.textContent = `${inviterName} wants to connect on Circle!`;

  // Get platform-specific elements
  const androidLink = document.getElementById("android-link");
  const iosLink = document.getElementById("ios-link");

  // Detect platform
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  // Show/hide platform-specific buttons
  if (isAndroid) {
    iosLink.style.display = "none";
  } else if (isIOS) {
    androidLink.style.display = "none";
  }

  // Handle connect button click
  const connectButton = document.getElementById("connect-button");
  connectButton.textContent = `Connect with ${inviterName}`;
  connectButton.addEventListener("click", function () {
    // Construct deep links
    const androidDeepLink = `com.circle://profile/${userId}`;
    const iosDeepLink = `com.circle://profile/${userId}`;

    // Fallback URLs (app store links)
    const androidStoreLink =
      "https://play.google.com/store/apps/details?id=com.adamsolutions.circle";
    const iosStoreLink = "https://apps.apple.com/app/id6747255364";

    // Try to open app with deep link, fall back to store if app not installed
    if (isAndroid) {
      window.location.href = androidDeepLink;
      // Fallback to Play Store after a short delay
      setTimeout(() => {
        window.location.href = androidStoreLink;
      }, 500);
    } else if (isIOS) {
      window.location.href = iosDeepLink;
      // Fallback to App Store after a short delay
      setTimeout(() => {
        window.location.href = iosStoreLink;
      }, 500);
    } else {
      // On desktop, show a modal or alert
      alert(
        "Please open this link on your mobile device to connect with Adam on Circle!"
      );
    }
  });
});

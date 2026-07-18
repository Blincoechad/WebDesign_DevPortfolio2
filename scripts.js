import { injectSpeedInsights } from "https://cdn.jsdelivr.net/npm/@vercel/speed-insights@latest/dist/index.mjs";

injectSpeedInsights();

//  the mobile hamburger menu

var hamburgerBtn = document.getElementById("hamburger");
var navMenu = document.getElementById("navLinks");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("is-open");
    hamburgerBtn.classList.toggle("is-open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // close menu when a nav link is clicked
  var navLinks = navMenu.querySelectorAll(".nav-link");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
      navMenu.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  }

  // close menu when clicking outside of it
  document.addEventListener("click", function (e) {
    var clickedInsideMenu = navMenu.contains(e.target);
    var clickedBtn = hamburgerBtn.contains(e.target);
    if (!clickedInsideMenu && !clickedBtn) {
      navMenu.classList.remove("is-open");
      hamburgerBtn.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// featured bike clip: muted preview on load, then play from start with sound
var bikeClipVideo = document.getElementById("bikeClipVideo");
var bikeClipPlayBtn = document.getElementById("bikeClipPlayBtn");

if (bikeClipVideo) {
  function startPreviewMode(videoEl) {
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.loop = true;
    videoEl.controls = false;
    videoEl.currentTime = 0;

    var previewPromise = videoEl.play();
    if (previewPromise && typeof previewPromise.catch === "function") {
      previewPromise.catch(function () {});
    }

    if (bikeClipPlayBtn) {
      bikeClipPlayBtn.textContent = "Play With Sound";
      bikeClipPlayBtn.setAttribute("data-state", "preview");
    }
  }

  function playWithSound(videoEl) {
    videoEl.muted = false;
    videoEl.defaultMuted = false;
    videoEl.loop = false;
    videoEl.controls = true;
    videoEl.currentTime = 0;
    videoEl.volume = 1;

    var playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }

    if (bikeClipPlayBtn) {
      bikeClipPlayBtn.textContent = "Stop Video";
      bikeClipPlayBtn.setAttribute("data-state", "playing");
    }
  }

  startPreviewMode(bikeClipVideo);

  if (bikeClipPlayBtn) {
    bikeClipPlayBtn.addEventListener("click", function () {
      var isPlayingWithSound =
        bikeClipPlayBtn.getAttribute("data-state") === "playing";

      if (isPlayingWithSound) {
        bikeClipVideo.pause();
        startPreviewMode(bikeClipVideo);
        return;
      }

      playWithSound(bikeClipVideo);
    });
  }
}

// contact form - formspree is whats handling the submissions

var contactForm = document.getElementById("contactForm");
var successMsg = document.getElementById("formSuccess");
var errorMsg = document.getElementById("formError");

if (contactForm) {
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorSpan = document.getElementById(fieldId + "-error");
    if (field) field.classList.add("error");
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearFieldError(fieldId) {
    var field = document.getElementById(fieldId);
    var errorSpan = document.getElementById(fieldId + "-error");
    if (field) field.classList.remove("error");
    if (errorSpan) errorSpan.textContent = "";
  }

  // show error on blur if field is empty
  var nameField = document.getElementById("name");
  var emailField = document.getElementById("email");
  var messageField = document.getElementById("message");

  nameField.addEventListener("blur", function () {
    if (!nameField.value.trim()) {
      showFieldError("name", "This field is required.");
    } else {
      clearFieldError("name");
    }
  });

  emailField.addEventListener("blur", function () {
    if (!emailField.value.trim()) {
      showFieldError("email", "This field is required.");
    } else if (!isValidEmail(emailField.value.trim())) {
      showFieldError("email", "Please enter a valid email address.");
    } else {
      clearFieldError("email");
    }
  });

  messageField.addEventListener("blur", function () {
    if (!messageField.value.trim()) {
      showFieldError("message", "This field is required.");
    } else {
      clearFieldError("message");
    }
  });

  // clear error while user is typing
  nameField.addEventListener("input", function () {
    if (nameField.value.trim()) clearFieldError("name");
  });

  emailField.addEventListener("input", function () {
    if (emailField.value.trim()) clearFieldError("email");
  });

  messageField.addEventListener("input", function () {
    if (messageField.value.trim()) clearFieldError("message");
  });

  // handle form submission validation
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var isValid = true;

    if (errorMsg) {
      errorMsg.hidden = true;
      errorMsg.textContent = "";
    }

    clearFieldError("name");
    clearFieldError("email");
    clearFieldError("message");

    var nameVal = nameField.value.trim();
    var emailVal = emailField.value.trim();
    var messageVal = messageField.value.trim();

    if (!nameVal) {
      showFieldError("name", "Please enter your full name.");
      isValid = false;
    }

    if (!emailVal) {
      showFieldError("email", "Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      showFieldError("email", "Please enter a valid email.");
      isValid = false;
    }

    if (!messageVal) {
      showFieldError("message", "Please enter a message.");
      isValid = false;
    }

    if (!isValid) {
      if (errorMsg) {
        errorMsg.textContent =
          "Please fill out the required fields marked with a red asterisk.";
        errorMsg.hidden = false;
      }
      return;
    }

    // send form data to formspree
    fetch("https://formspree.io/f/mnjoagqd", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    }).then(function (response) {
      if (response.ok) {
        contactForm.reset();
        if (successMsg) {
          successMsg.hidden = false;
          successMsg.focus();
          setTimeout(function () {
            successMsg.hidden = true;
          }, 6000);
        }
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Something went wrong. Please try again.";
          errorMsg.hidden = false;
        }
      }
    });
  });
}

// image slider on about page

var sliders = document.querySelectorAll(".image-slider");

for (var s = 0; s < sliders.length; s++) {
  var slider = sliders[s];
  var track = slider.querySelector(".slider-track");
  var slides = slider.querySelectorAll(".slide");
  var prevBtn = slider.querySelector(".slider-btn.prev");
  var nextBtn = slider.querySelector(".slider-btn.next");

  if (!track || !slides.length) continue;

  // I used a function to create scoped event listeners for each slider
  function setupSlider(track, slides, prevBtn, nextBtn, slider) {
    var index = 0;
    var timer = null;

    function update() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute("aria-hidden", i !== index);
      }
    }
    // I made a function that auto plays the slider with my certifacates and
    // set a time interval for how fast it will go through the images
    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(function () {
        // used the modulo operator to get the remainder, which is 1, and
        // causes a never ending loop
        index = (index + 1) % slides.length;
        update();
      }, 2500);
    }
    // this is an extra function i added that causes the slider to stop
    // moving when user hovers over image
    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        index = (index - 1 + slides.length) % slides.length;
        update();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        index = (index + 1) % slides.length;
        update();
        startAutoPlay();
      });
    }

    // this code causes the images to stop/contine when mouse moves on top
    // of them then when it moves away
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    update();
    startAutoPlay();
  }

  setupSlider(track, slides, prevBtn, nextBtn, slider);
}

// the gallery lighthouse effect on my images thought site

var galleryImages = document.querySelectorAll(
  ".gallery-grid img, .gallery-grid video, .card img, .redesign-preview img, .split-image img",
);

if (galleryImages.length > 0) {
  // the lightbox elements
  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image viewer");

  var lightboxContent = document.createElement("div");
  lightboxContent.className = "lightbox-content";

  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "lightbox-close";
  closeBtn.setAttribute("aria-label", "Close image viewer");
  closeBtn.textContent = "×";

  var largeImage = document.createElement("img");
  largeImage.alt = "";

  var largeVideo = document.createElement("video");
  largeVideo.loop = true;
  largeVideo.playsInline = true;
  largeVideo.controls = true;
  largeVideo.style.display = "none";
  // makes the sound play automatically when it gets opened
  largeVideo.muted = false;
  // volume was opening @ 100% so this line makes it open at 50%
  largeVideo.volume = 0.5;

  var splitContainer = document.createElement("div");
  splitContainer.className = "lightbox-split";
  splitContainer.style.display = "none";

  var splitImages = [];
  for (var j = 0; j < 4; j++) {
    var splitImage = document.createElement("img");
    splitImage.alt = "Menu redesign image " + (j + 1);
    splitImage.className = "lightbox-split-image";
    splitContainer.appendChild(splitImage);
    splitImages.push(splitImage);
  }

  var captionElem = document.createElement("p");
  captionElem.className = "lightbox-caption";

  lightboxContent.appendChild(closeBtn);
  lightboxContent.appendChild(largeImage);
  lightboxContent.appendChild(largeVideo);
  lightboxContent.appendChild(splitContainer);
  lightboxContent.appendChild(captionElem);
  overlay.appendChild(lightboxContent);
  document.body.appendChild(overlay);

  function openLightbox(src, alt, caption) {
    largeImage.src = src;
    largeImage.alt = alt || "";
    largeImage.style.display = "";
    largeVideo.style.display = "none";
    largeVideo.pause();
    splitContainer.style.display = "none";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function openVideoLightbox(src, caption) {
    largeVideo.src = src;
    largeVideo.style.display = "";
    largeVideo.muted = false;
    largeVideo.volume = 0.5;
    largeVideo.load();
    largeVideo.play();
    largeImage.style.display = "none";
    largeImage.src = "";
    splitContainer.style.display = "none";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function openSplitLightbox(srcs, captions, caption) {
    for (var k = 0; k < splitImages.length; k++) {
      splitImages[k].src = srcs[k] || "";
      splitImages[k].alt = captions[k] || "Menu redesign image " + (k + 1);
      splitImages[k].style.display = srcs[k] ? "block" : "none";
    }
    largeImage.src = "";
    largeImage.style.display = "none";
    largeVideo.style.display = "none";
    largeVideo.pause();
    splitContainer.style.display = "grid";
    splitContainer.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    splitContainer.style.gap = "0.75rem";
    captionElem.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    largeImage.src = "";
    largeVideo.pause();
    // starts the video with sound
    largeVideo.muted = true;
    largeVideo.src = "";
    for (var l = 0; l < splitImages.length; l++) {
      splitImages[l].src = "";
      splitImages[l].style.display = "none";
    }
  }

  // add click events to each gallery image
  for (var i = 0; i < galleryImages.length; i++) {
    var el = galleryImages[i];
    var splitImageParent = el.closest(".split-image");
    var figure = el.closest("figure");
    var caption = "";

    if (figure && figure.querySelector("figcaption")) {
      caption = figure.querySelector("figcaption").textContent;
    }

    el.setAttribute("tabindex", "0");
    el.style.cursor = "pointer";

    // split image handling
    if (splitImageParent) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parentFigure = this.closest("figure");
        var srcs = [];
        var imgCaptions = [];
        var captionText = "";

        if (parentFigure && parentFigure.querySelector("figcaption")) {
          captionText = parentFigure.querySelector("figcaption").textContent;
        }

        if (
          parentFigure &&
          (parentFigure.classList.contains("menu-redesign-preview") ||
            parentFigure.getAttribute("data-lightbox-set") ===
              "menu-redesign" ||
            parentFigure.classList.contains("split-image--featured") ||
            parentFigure.classList.contains("card"))
        ) {
          var isIndexMenuPreview =
            parentFigure &&
            parentFigure.classList.contains("menu-redesign-preview");

          srcs = [
            isIndexMenuPreview
              ? "media/graphicWork/menuRedesign1.png"
              : parentFigure.getAttribute("data-lightbox-set") ===
                  "menu-redesign"
                ? "media/graphicWork/menuRedesign1.png"
                : "media/menuRedesign1.png",
            isIndexMenuPreview
              ? "media/graphicWork/menuRedesign2.png"
              : parentFigure.getAttribute("data-lightbox-set") ===
                  "menu-redesign"
                ? "media/graphicWork/menuRedesign2.png"
                : "media/menuRedesign2.png",
            isIndexMenuPreview
              ? "media/graphicWork/menuRedesign3.png"
              : parentFigure.getAttribute("data-lightbox-set") ===
                  "menu-redesign"
                ? "media/graphicWork/menuRedesign3.png"
                : "media/menuRedesign3.png",
            isIndexMenuPreview
              ? "media/graphicWork/menuRedesign4.png"
              : parentFigure.getAttribute("data-lightbox-set") ===
                  "menu-redesign"
                ? "media/graphicWork/menuRedesign4.png"
                : "media/menuRedesign4.png",
          ];
          imgCaptions = [
            "Menu redesign concept one",
            "Menu redesign concept two",
            "Menu redesign concept three",
            "Menu redesign concept four",
          ];
        } else if (
          parentFigure &&
          parentFigure.getAttribute("data-lightbox-set") === "health-newsletter"
        ) {
          srcs = [
            "media/graphicWork/healthNewsletter1.png",
            "media/graphicWork/healthNewsletter2.png",
            "media/graphicWork/healthNewsletter3.png",
            "media/graphicWork/healthNewsletter4.png",
          ];
          imgCaptions = [
            "Health newsletter concept one",
            "Health newsletter concept two",
            "Health newsletter concept three",
            "Health newsletter concept four",
          ];
        } else {
          var imgs = parentFigure.querySelectorAll(".split-image__item img");
          for (var m = 0; m < imgs.length; m++) {
            srcs.push(imgs[m].src);
            imgCaptions.push(imgs[m].alt || "");
          }
        }

        if (srcs.length >= 2) {
          openSplitLightbox(srcs, imgCaptions, captionText);
        }
      });

      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          var parentFigure = this.closest("figure");
          var srcs = [];
          var imgCaptions = [];
          var captionText = "";

          if (parentFigure && parentFigure.querySelector("figcaption")) {
            captionText = parentFigure.querySelector("figcaption").textContent;
          }

          if (
            parentFigure &&
            (parentFigure.classList.contains("menu-redesign-preview") ||
              parentFigure.getAttribute("data-lightbox-set") ===
                "menu-redesign" ||
              parentFigure.classList.contains("split-image--featured") ||
              parentFigure.classList.contains("card"))
          ) {
            var isIndexMenuPreviewKeydown =
              parentFigure &&
              parentFigure.classList.contains("menu-redesign-preview");

            srcs = [
              isIndexMenuPreviewKeydown
                ? "media/graphicWork/menuRedesign1.png"
                : parentFigure.getAttribute("data-lightbox-set") ===
                    "menu-redesign"
                  ? "media/graphicWork/menuRedesign1.png"
                  : "media/menuRedesign1.png",
              isIndexMenuPreviewKeydown
                ? "media/graphicWork/menuRedesign2.png"
                : parentFigure.getAttribute("data-lightbox-set") ===
                    "menu-redesign"
                  ? "media/graphicWork/menuRedesign2.png"
                  : "media/menuRedesign2.png",
              isIndexMenuPreviewKeydown
                ? "media/graphicWork/menuRedesign3.png"
                : parentFigure.getAttribute("data-lightbox-set") ===
                    "menu-redesign"
                  ? "media/graphicWork/menuRedesign3.png"
                  : "media/menuRedesign3.png",
              isIndexMenuPreviewKeydown
                ? "media/graphicWork/menuRedesign4.png"
                : parentFigure.getAttribute("data-lightbox-set") ===
                    "menu-redesign"
                  ? "media/graphicWork/menuRedesign4.png"
                  : "media/menuRedesign4.png",
            ];
            imgCaptions = [
              "Menu redesign concept one",
              "Menu redesign concept two",
              "Menu redesign concept three",
              "Menu redesign concept four",
            ];
          } else if (
            parentFigure &&
            parentFigure.getAttribute("data-lightbox-set") ===
              "health-newsletter"
          ) {
            srcs = [
              "media/graphicWork/healthNewsletter1.png",
              "media/graphicWork/healthNewsletter2.png",
              "media/graphicWork/healthNewsletter3.png",
              "media/graphicWork/healthNewsletter4.png",
            ];
            imgCaptions = [
              "Health newsletter concept one",
              "Health newsletter concept two",
              "Health newsletter concept three",
              "Health newsletter concept four",
            ];
          } else {
            var imgs = parentFigure.querySelectorAll(".split-image__item img");
            for (var n = 0; n < imgs.length; n++) {
              srcs.push(imgs[n].src);
              imgCaptions.push(imgs[n].alt || "");
            }
          }

          if (srcs.length >= 2) {
            openSplitLightbox(srcs, imgCaptions, captionText);
          }
        }
      });
      continue;
    }

    // video handling
    if (el.tagName === "VIDEO") {
      el.addEventListener("click", function () {
        var src = this.querySelector("source")
          ? this.querySelector("source").src
          : this.src;
        openVideoLightbox(src, caption);
      });

      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var src = this.querySelector("source")
            ? this.querySelector("source").src
            : this.src;
          openVideoLightbox(src, caption);
        }
      });
      continue;
    }

    // regular image handling
    el.addEventListener("click", function () {
      openLightbox(this.src, this.alt, caption);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(this.src, this.alt, caption);
      }
    });
  }

  // close lightbox on button click
  closeBtn.addEventListener("click", closeLightbox);

  // close lightbox when clicking the dark background
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  // close lightbox with escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

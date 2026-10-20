/**
 * Juan Pablo Ortiz - Portfolio Landing Page
 * Interactive & Scroll-Driven Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Terracotta Asterisk & Skills Icon Micro-interactions
  const asterisk = document.getElementById('brand-asterisk');
  if (asterisk) {
    let currentRotation = 0;
    asterisk.addEventListener('click', () => {
      currentRotation += 45;
      asterisk.style.transform = `rotate(${currentRotation}deg) scale(1.15)`;
      setTimeout(() => {
        asterisk.style.transform = `rotate(${currentRotation}deg) scale(1)`;
      }, 300);
    });
  }

  const skillsBrand = document.querySelector('.skills-brand-wrapper');
  if (skillsBrand) {
    let skillsRotation = 0;
    skillsBrand.addEventListener('click', () => {
      skillsRotation += 90;
      skillsBrand.style.transform = `rotate(${skillsRotation}deg) scale(1.15)`;
      setTimeout(() => {
        skillsBrand.style.transform = `rotate(${skillsRotation}deg) scale(1)`;
      }, 350);
    });
  }

  const projectsAsterisk = document.querySelector('.projects-asterisk-wrapper');
  if (projectsAsterisk) {
    let projRotation = 0;
    projectsAsterisk.addEventListener('click', () => {
      projRotation += 45;
      projectsAsterisk.style.transform = `rotate(${projRotation}deg) scale(1.15)`;
      setTimeout(() => {
        projectsAsterisk.style.transform = `rotate(${projRotation}deg) scale(1)`;
      }, 300);
    });
  }

  // 2. Setup SVG Doodle Arrow Stroke Animation
  const arrowLine = document.querySelector('.arrow-line');
  if (arrowLine) {
    const pathLength = arrowLine.getTotalLength ? arrowLine.getTotalLength() : 400;
    arrowLine.style.strokeDasharray = `${pathLength}`;
    arrowLine.style.strokeDashoffset = `${pathLength}`;
  }

  // 3. Staggered Delays for Scroll Reveal Elements
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  // 4. Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px', // triggers when section is 12% inside the viewport
    threshold: 0.15
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Once revealed, keep it visible or unobserve if desired
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe the About section and any dynamic sections added in the future
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    sectionObserver.observe(aboutSection);
  }

  // Also observe individual sections dynamically
  document.querySelectorAll('section').forEach(sec => {
    if (sec.id !== 'hero') {
      sectionObserver.observe(sec);
    }
  });

  // 5. Smooth Scroll for Scroll Hint Link
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 6. Projects Horizontal Slider Controls (Infinite Loop: P1 -> P2 -> P3 -> P1...)
  const sliderTrack = document.getElementById('projects-slider-track');
  if (sliderTrack) {
    const realSlides = Array.from(sliderTrack.querySelectorAll('.project-slide'));
    const numRealSlides = realSlides.length;

    if (numRealSlides > 1) {
      // Clone last slide to prepend (smooth backward transition from P1 to P3)
      const cloneBefore = realSlides[numRealSlides - 1].cloneNode(true);
      cloneBefore.classList.add('project-slide-clone');
      cloneBefore.removeAttribute('id');
      cloneBefore.setAttribute('aria-hidden', 'true');
      cloneBefore.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

      // Clone first slide to append (smooth forward transition from P3 to P1)
      const cloneAfter = realSlides[0].cloneNode(true);
      cloneAfter.classList.add('project-slide-clone');
      cloneAfter.removeAttribute('id');
      cloneAfter.setAttribute('aria-hidden', 'true');
      cloneAfter.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

      sliderTrack.insertBefore(cloneBefore, realSlides[0]);
      sliderTrack.appendChild(cloneAfter);

      const allSlides = Array.from(sliderTrack.querySelectorAll('.project-slide'));
      const totalSlides = allSlides.length; // 5

      // Dynamically style slide widths and track width
      sliderTrack.style.width = `${totalSlides * 100}%`;
      allSlides.forEach(slide => {
        slide.style.width = `${100 / totalSlides}%`;
      });

      // Start at Real Slide 1 (index 1)
      let currentIndex = 1;
      let isTransitioning = false;
      let safetyTimer = null;

      function setTrackPosition(index, animate = true) {
        if (!animate) {
          sliderTrack.style.transition = 'none';
        } else {
          sliderTrack.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        const percentage = (index * 100) / totalSlides;
        sliderTrack.style.transform = `translateX(-${percentage}%)`;
      }

      function updateSlideInView(index) {
        const activeSlide = allSlides[index];
        if (activeSlide) {
          activeSlide.classList.add('in-view');
          activeSlide.querySelectorAll('.scroll-reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          });

          const p2Line = activeSlide.querySelector('.p2-doodle-arrow .arrow-line');
          if (p2Line) p2Line.style.strokeDashoffset = '0';

          const p3Line = activeSlide.querySelector('.p3-doodle-arrow .arrow-line');
          if (p3Line) p3Line.style.strokeDashoffset = '0';
        }
      }

      // Initial placement at Real Slide 1
      setTrackPosition(currentIndex, false);
      void sliderTrack.offsetWidth;
      setTrackPosition(currentIndex, true);
      updateSlideInView(currentIndex);

      function goToSlide(targetIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = targetIndex;
        setTrackPosition(currentIndex, true);
        updateSlideInView(currentIndex);

        clearTimeout(safetyTimer);
        safetyTimer = setTimeout(() => {
          isTransitioning = false;
        }, 950);
      }

      function goToNext() {
        goToSlide(currentIndex + 1);
      }

      function goToPrev() {
        goToSlide(currentIndex - 1);
      }

      // Handle transition end for seamless infinite loop snap
      sliderTrack.addEventListener('transitionend', (e) => {
        if (e.target !== sliderTrack || e.propertyName !== 'transform') return;
        clearTimeout(safetyTimer);

        // Cloned first slide at end reached -> silently snap to real first slide (index 1)
        if (currentIndex === totalSlides - 1) {
          currentIndex = 1;
          setTrackPosition(currentIndex, false);
          void sliderTrack.offsetWidth;
          setTrackPosition(currentIndex, true);
          updateSlideInView(currentIndex);
        }
        // Cloned last slide at start reached -> silently snap to real last slide (index totalSlides - 2)
        else if (currentIndex === 0) {
          currentIndex = totalSlides - 2;
          setTrackPosition(currentIndex, false);
          void sliderTrack.offsetWidth;
          setTrackPosition(currentIndex, true);
          updateSlideInView(currentIndex);
        }

        isTransitioning = false;
      });

      // Event Delegation: clicking any next or prev button triggers navigation
      sliderTrack.addEventListener('click', (e) => {
        const nextBtn = e.target.closest('.project-nav-arrow-btn.btn-next');
        if (nextBtn) {
          e.preventDefault();
          goToNext();
          return;
        }

        const prevBtn = e.target.closest('.project-nav-arrow-btn.btn-prev');
        if (prevBtn) {
          e.preventDefault();
          goToPrev();
          return;
        }
      });

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        const projSec = document.getElementById('proyectos-showcase');
        if (projSec) {
          const rect = projSec.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowRight') {
              goToNext();
            } else if (e.key === 'ArrowLeft') {
              goToPrev();
            }
          }
        }
      });

      // Touch swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;
      const projSec = document.getElementById('proyectos-showcase');
      if (projSec) {
        projSec.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        projSec.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const swipeDiff = touchStartX - touchEndX;
          if (Math.abs(swipeDiff) > 50) {
            if (swipeDiff > 0) {
              goToNext();
            } else {
              goToPrev();
            }
          }
        }, { passive: true });
      }
    }
  }

  // Setup stroke for P2 doodle arrows (all instances including clones)
  document.querySelectorAll('.p2-doodle-arrow .arrow-line').forEach(p2ArrowLine => {
    if (p2ArrowLine && p2ArrowLine.getTotalLength) {
      const p2Len = p2ArrowLine.getTotalLength();
      p2ArrowLine.style.strokeDasharray = `${p2Len}`;
      p2ArrowLine.style.strokeDashoffset = `${p2Len}`;
      p2ArrowLine.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.45, 0, 0.15, 1) 0.3s';
    }
  });

  // Setup stroke for P3 doodle arrows (all instances including clones)
  document.querySelectorAll('.p3-doodle-arrow .arrow-line').forEach(p3ArrowLine => {
    if (p3ArrowLine && p3ArrowLine.getTotalLength) {
      const p3Len = p3ArrowLine.getTotalLength();
      p3ArrowLine.style.strokeDasharray = `${p3Len}`;
      p3ArrowLine.style.strokeDashoffset = `${p3Len}`;
      p3ArrowLine.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.45, 0, 0.15, 1) 0.3s';
    }
  });

  // 7. Contact Diagonal Arrow Micro-interaction
  const contactArrow = document.querySelector('.contact-arrow-wrapper');
  if (contactArrow) {
    contactArrow.addEventListener('click', () => {
      contactArrow.style.transform = 'translate(10px, -10px) scale(1.15)';
      setTimeout(() => {
        contactArrow.style.transform = '';
      }, 350);
    });
  }

  console.log('Portfolio initialized: Infinite Loop Project Slider & Contact section active.');
});

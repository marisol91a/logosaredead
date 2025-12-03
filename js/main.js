/* ARCHIVO PRINCIPAL DE JAVASCRIPT */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  //GENERALES
  //Animación de lineas
  function animateLines() {
    const lines = document.querySelectorAll(".line:not(.no-animate)");

    lines.forEach((line) => {
      gsap.fromTo(
        line,
        {
          x: "-100%",
          opacity: 0,
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1,
          ease: "linear",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none reverse none",
          },
        }
      );
    });
  }

  animateLines();

  //Animación de borders
  function animateBorders() {
    const outlinedElements = document.querySelectorAll(
      ".block-wrapper.outlined"
    );

    outlinedElements.forEach((element) => {
      // Add animated class to enable pseudo-elements
      element.classList.add("animated");

      // Create timeline for sequenced animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
        },
      });

      // Set initial state and animate pseudo-elements
      gsap.set(element, { "--border-height": "0%" });

      tl.to(element, {
        "--border-height": "100%",
        duration: 0.8,
        ease: "power2.out",
      });
    });
  }

  animateBorders();

  //IMAGENES
  //Filtro SVG - Hover Effect
  const imageFilters = document.querySelectorAll(".image-filter");
  if (imageFilters.length > 0) {
    imageFilters.forEach((imageFilter) => {
      imageFilter.addEventListener("mouseenter", () => {
        // Obtener el ID del filtro asignado a esta imagen
        const filterId = imageFilter.getAttribute("data-filter");
        if (filterId) {
          const turbulence = document.querySelector(`#${filterId} .turbulence`);
          if (turbulence) {
            gsap.to(turbulence, {
              attr: { baseFrequency: "0.01 0.08" },
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      });

      imageFilter.addEventListener("mouseleave", () => {
        // Obtener el ID del filtro asignado a esta imagen
        const filterId = imageFilter.getAttribute("data-filter");
        if (filterId) {
          const turbulence = document.querySelector(`#${filterId} .turbulence`);
          if (turbulence) {
            gsap.to(turbulence, {
              attr: { baseFrequency: "0 0" },
              duration: 0.5,
              ease: "power2.out",
            });
          }
        }
      });
    });
  }

  //Animación de imagenes - Scroll Triggered
  const imgAnimation = document.querySelectorAll(
    ".logo img, .image-wrapper, .witness-image-wrapper"
  );

  imgAnimation.forEach((img) => {
    gsap.fromTo(
      img,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  //HEADER
  //Actualizar la fecha mes y año en el elemento con clase .date-info
  const dateInfo = document.querySelector(".date-info");
  if (dateInfo) {
    const now = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();
    dateInfo.textContent = `${currentMonth}, ${currentYear}`;
  }

  //HERO SECTION
  //Animación de caída de letras al hacer scroll
  function initializeAnimation() {
    const heroTitle = document.querySelector(".hero-title");
    const heroContainer = document.querySelector(".hero");
    if (!heroTitle || !heroContainer) return;

    const originalHTML = heroTitle.innerHTML;
    const lines = originalHTML.split("<br>");

    // Limpiar el contenido y crear spans directamente como elementos DOM
    heroTitle.innerHTML = "";

    lines.forEach((line, lineIndex) => {
      const text = line.trim();

      // Crear los spans como elementos DOM reales
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.position = "relative";
        span.style.fontSize = "inherit";
        span.style.fontFamily = "inherit";
        span.style.color = "inherit";
        heroTitle.appendChild(span);
      });

      // Agregar salto de línea si no es la última línea
      if (lineIndex < lines.length - 1) {
        const br = document.createElement("br");
        heroTitle.appendChild(br);
      }
    });
    const spanElements = heroTitle.querySelectorAll("span");

    gsap.set(spanElements, { y: 0, opacity: 1 });

    // Calcular la distancia máxima que pueden caer (hasta el final del hero)
    const heroRect = heroTitle.getBoundingClientRect();
    const heroContainerRect = heroContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Ajustar la posición objetivo según el tamaño de pantalla
    let targetPosition;
    if (window.innerWidth <= 320) {
      targetPosition = viewportHeight * 1.5; // 150vh para móviles pequeños
    } else {
      targetPosition = viewportHeight * 0.5; // 50vh para tablet y desktop
    }

    // Limitar la caída al contenedor hero
    const maxPossibleDistance = targetPosition - heroRect.top;
    const heroBottomLimit = heroContainerRect.bottom - heroRect.top;
    const maxFallDistance = Math.min(maxPossibleDistance, heroBottomLimit);

    let hasStarted = false;

    // Detectar el primer scroll del usuario
    function onFirstScroll() {
      if (!hasStarted) {
        hasStarted = true;

        spanElements.forEach((char, index) => {
          gsap.to(char, {
            y: maxFallDistance,
            opacity: 1,
            duration: 2 + Math.random() * 1,
            ease: "bounce.out",
            delay: index * 0.1,
            rotation: Math.random() * 90,
            onStart: function () {
              char.classList.add("animated");
            },
          });
        });

        // Remover el listener después de la primera ejecución
        window.removeEventListener("scroll", onFirstScroll);
        window.removeEventListener("touchstart", onFirstScroll);
      }
    }

    // Escuchar eventos de scroll y touch
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    window.addEventListener("touchstart", onFirstScroll, { passive: true });
  }

  initializeAnimation();

  //Animación Textos Banners - Scroll Triggered
  function animateTexts() {
    document.fonts.ready.then(() => {
      // Animar titulo banner
      const titleBanners = document.querySelectorAll(".title-banner-text");
      titleBanners.forEach((titleBanner) => {
        let split = SplitText.create(titleBanner, { type: "words" });

        gsap.set(split.words, {
          y: -25,
          autoAlpha: 0,
        });

        gsap.to(split.words, {
          duration: 1,
          y: 0,
          autoAlpha: 1,
          stagger: {
            each: 0.015,
            from: "random",
          },
          scrollTrigger: {
            trigger: titleBanner,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none none",
          },
        });
      });

      // Animar otros textos (h2, párrafos, etc.)
      const textElements = document.querySelectorAll(
        "h2, .highlighted-text, .large-text"
      );
      textElements.forEach((element) => {
        let split = SplitText.create(element, { type: "words" });

        gsap.set(split.words, {
          y: 30,
          autoAlpha: 0,
        });

        gsap.to(split.words, {
          duration: 0.8,
          y: 0,
          autoAlpha: 1,
          stagger: {
            each: 0.05,
            from: "start",
          },
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none none",
          },
        });
      });

      // Efecto maquina de escribir en headers
      const headerElements = document.querySelectorAll(".header-element");
      headerElements.forEach((element) => {
        let split = SplitText.create(element, {
          type: "chars, words",
          wordsClass: "word",
          charsClass: "char",
          smartWrap: true,
        });

        gsap.set(split.chars, {
          autoAlpha: 0,
        });

        gsap.to(split.chars, {
          duration: 0.02,
          autoAlpha: 1,
          stagger: {
            each: 0.06,
            from: "start",
          },
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });
    });
  }
  animateTexts();

  //LOGOS GRID SECTION
  //Particle Effect Initialization
  const targetElement = document.getElementById("target-element");
  const particleContainer = document.getElementById("particle-container");

  //1. Función para crear una sola partícula
  function createParticle(x, y) {
    const particle = document.createElement("span");
    particle.classList.add("particle");

    // Generar valores aleatorios para la animación
    const randomX = (Math.random() - 0.5) * 60; // -30px a +30px
    particle.style.setProperty("--random-x", `${randomX}px`);

    // Contenido: emojis aleatorios
    const emojis = ["✝︎"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    particle.textContent = randomEmoji;

    // Posición inicial usando coordenadas globales
    particle.style.left = `${x - 12}px`;
    particle.style.top = `${y - 12}px`;

    particleContainer.appendChild(particle);

    // Eliminar la partícula después de que termine la animación
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 1000);
  }

  //Variable para throttling
  let lastParticleTime = 0;
  const particleDelay = 100;

  //2. Función para manejar el hover
  function handleHover(event) {
    // Throttling para reducir la frecuencia de partículas
    const now = Date.now();
    if (now - lastParticleTime < particleDelay) {
      return;
    }
    lastParticleTime = now;

    // Usar coordenadas globales directamente
    const x = event.clientX;
    const y = event.clientY;

    // Genera menos partículas (solo 1 por evento)
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    createParticle(x + offsetX, y + offsetY);
  }

  //3. Añadir el escuchador de eventos
  if (targetElement && particleContainer) {
    targetElement.addEventListener("mousemove", handleHover);

    // También agregar evento para móvil
    targetElement.addEventListener("touchmove", function (event) {
      event.preventDefault();
      const touch = event.touches[0];
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
      handleHover(fakeEvent);
    });
  }

  //REASONS LOGOS DIED SECTION
  //Toggle Reasons Section
  const triggers = document.querySelectorAll(".toggle-trigger");
  const contents = document.querySelectorAll(".toggle-content");

  // Loop through each button trigger
  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      // Toggle the corresponding content based on the index
      contents[index].classList.toggle("content-hidden");
    });
  });

  //WITNESS SECTION
  //Enseñar tarjetas con botón
  const witnessCards = document.querySelectorAll(".witness-card");
  const totalCards = witnessCards.length;
  const nextButton = document.querySelector("#nextWitnessBtn");
  let currentIndex = 0;

  if (witnessCards.length > 0 && nextButton) {
    function showWitnessCard(index) {
      const isDesktop = window.innerWidth >= 1220;
      const isTablet = window.innerWidth >= 768;

      witnessCards.forEach((card) => {
        card.classList.remove("active", "active-tablet", "active-desktop");
      });

      if (isDesktop) {
        // En desktop, mostrar 4 cards
        for (let i = 0; i < 4; i++) {
          if (witnessCards[index + i] && index + i < totalCards) {
            witnessCards[index + i].classList.add("active-desktop");
          }
        }
      } else if (isTablet) {
        // En tablet, mostrar 2 cards
        if (witnessCards[index]) {
          witnessCards[index].classList.add("active-tablet");
        }
        if (witnessCards[index + 1] && index + 1 < totalCards) {
          witnessCards[index + 1].classList.add("active-tablet");
        }
      } else {
        // En móvil, mostrar 1 card
        if (witnessCards[index]) {
          witnessCards[index].classList.add("active");
        }
      }
    }

    nextButton.addEventListener("click", () => {
      const isDesktop = window.innerWidth >= 1220;
      const isTablet = window.innerWidth >= 768;

      let step;
      if (isDesktop) {
        step = 4;
      } else if (isTablet) {
        step = 2;
      } else {
        step = 1;
      }

      currentIndex = (currentIndex + step) % totalCards;
      showWitnessCard(currentIndex);
    });

    // Inicializar la vista
    showWitnessCard(currentIndex);

    // Reajustar cuando cambie el tamaño de pantalla
    window.addEventListener("resize", () => {
      showWitnessCard(currentIndex);
    });
  }

  //THE KILLER SECTION
  //Generador de Logo con fuentes aleatorias
  const inputElement = document.getElementById("userInput");
  const outputElement = document.getElementById("outputWord");
  const buttonElement = document.getElementById("randomFontBtn");

  if (inputElement && outputElement && buttonElement) {
    const fontClasses = [
      "font-1",
      "font-2",
      "font-3",
      "font-4",
      "font-5",
      "font-6",
      "font-7",
      "font-8",
      "font-9",
      "font-10",
      "font-11",
      "font-12",
      "font-13",
      "font-14",
      "font-15",
      "font-16",
      "font-17",
      "font-18",
      "font-19",
      "font-20",
    ];

    function getRandomFontClass() {
      const randomIndex = Math.floor(Math.random() * fontClasses.length);
      return fontClasses[randomIndex];
    }

    buttonElement.addEventListener("click", () => {
      const userWord = inputElement.value.trim();

      if (userWord) {
        outputElement.textContent = userWord;
      } else {
        outputElement.textContent = "Type your logo name";
      }

      outputElement.classList.remove(...fontClasses);
      const newFontClass = getRandomFontClass();
      outputElement.classList.add(newFontClass);
    });
  }

  //CONCLUSION SECTION
  //Adive Generator
  const adviceItems = document.querySelectorAll(".advice-item");
  const nextAdviceButton = document.getElementById("nextAdviceBtn");

  if (adviceItems.length > 0 && nextAdviceButton) {
    let currentAdviceIndex = 0;

    function showAdvice(index) {
      adviceItems.forEach((item) => {
        item.classList.remove("active");
      });

      if (adviceItems[index]) {
        adviceItems[index].classList.add("active");
      }
    }

    nextAdviceButton.addEventListener("click", () => {
      currentAdviceIndex = (currentAdviceIndex + 1) % adviceItems.length;
      showAdvice(currentAdviceIndex);
    });

    // Mostrar el primer consejo al cargar la página
    showAdvice(currentAdviceIndex);
  }

  //THE SUCCESOR SECTION
  //Diagram circles animation
  function animateDiagramCircles() {
    const circle3 = document.getElementById("circle-3");
    const circle2 = document.getElementById("circle-2");
    const circle1 = document.getElementById("circle-1");
    const circleDiagram = document.querySelector(".diagram-section");

    gsap.set([circle3, circle2, circle1], { drawSVG: "0%" });

    // Crear la animación de drawSVG100% activado con ScrollTrigger cuando circleDiagram entra a la pantalla. Creando un timeline primero circulo 1, luego 2, luego 3.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: circleDiagram,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
          // markers: true,
        },
      })
      .to(circle1, { drawSVG: "100%", duration: 1, ease: "power2.out" })
      .to(
        circle2,
        { drawSVG: "100%", duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      .to(
        circle3,
        { drawSVG: "100%", duration: 1, ease: "power2.out" },
        "-=0.5"
      );
  }

  animateDiagramCircles();

  //Diagram description wrappers
  const hoverSpans = document.querySelectorAll(".hover-span");
  const descriptionWrappers = document.querySelectorAll(
    ".diagram-description-wrapper"
  );

  if (hoverSpans.length > 0 && descriptionWrappers.length > 0) {
    hoverSpans.forEach((span, index) => {
      const relatedWrapper = descriptionWrappers[index];

      if (relatedWrapper) {
        const descriptionItem = relatedWrapper.querySelector(
          ".diagram-description-item"
        );

        // Configurar estado inicial
        gsap.set(descriptionItem, { opacity: 0, scale: 0.9 });

        // Eventos de hover
        span.addEventListener("mouseenter", () => {
          // Ocultar todos los wrappers primero
          descriptionWrappers.forEach((w) => w.classList.remove("active"));

          // Mostrar solo el wrapper relacionado
          relatedWrapper.classList.add("active");

          // Animar el item
          gsap.to(descriptionItem, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        });

        span.addEventListener("mouseleave", () => {
          // Animar el item a oculto
          gsap.to(descriptionItem, {
            opacity: 0,
            scale: 0.9,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
              // Ocultar el wrapper después de la animación
              relatedWrapper.classList.remove("active");
            },
          });
        });
      }
    });
  }

  //CONCLUSION SECTION
  //Toggle Credits Section
  const toggleText = document.getElementById("toggleText");
  const contentDiv = document.getElementById("hiddenContent");

  toggleText.addEventListener("click", () => {
    contentDiv.classList.toggle("is-hidden");
    contentDiv.classList.toggle("credits-info-visible");
  });

  //FOOTER
  //Copy URL Button
  const copyUrlButton = document.querySelector(".copy-url");
  if (copyUrlButton) {
    copyUrlButton.addEventListener("click", () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl);
    });

    // change button text to "Copied!" on click
    copyUrlButton.addEventListener("click", () => {
      const span = copyUrlButton.querySelector("span");
      if (span) {
        span.textContent = "Link copied! Now spread the news";
        setTimeout(() => {
          span.textContent = "Share with them the news";
        }, 2000);
      }
    });
  }
});

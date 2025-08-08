document.addEventListener('DOMContentLoaded', () => {
    const deck = document.querySelector('.pitch-deck');
    const slides = document.querySelectorAll('.slide');
    const introContainer = document.querySelector('.intro-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('nav-dots');

    let currentSlide = 0;
    let isAnimating = false;

    // --- Intro Animation ---
    function runIntro() {
        setTimeout(() => {
            introContainer.classList.add('visible');
        }, 200); // Tona in containern

        setTimeout(() => {
            introContainer.classList.remove('visible');
        }, 3500); // Tona ut containern

        setTimeout(() => {
            goToSlide(1, 'next'); // Gå till nästa slide
            deck.classList.add('watermark-visible'); // Visa vattenstämpel
            document.body.classList.add('nav-visible'); // Visa navigation
        }, 4200); // Starta övergången
    }

    // Skapa navigeringsprickar
    function createDots() {
        slides.forEach((slide, index) => {
            // Hoppa över introsliden
            if (slide.id === 'intro-slide') return;

            const dot = document.createElement('button');
            dot.classList.add('nav-dot');
            dot.setAttribute('aria-label', `Gå till slide ${index}`);
            dot.addEventListener('click', () => {
                if (index !== currentSlide) {
                    goToSlide(index);
                }
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Uppdatera aktiva prickar och pilar
    function updateNav() {
        // Dölj nav helt på introsliden
        if (currentSlide === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            // Justera index eftersom prickarna inte inkluderar introsliden
            dot.classList.toggle('active', index === currentSlide - 1);
        });

        prevBtn.style.display = currentSlide === 1 ? 'none' : 'block';
        nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'block';
    }

    // Huvudfunktion för att byta slide
    function goToSlide(slideIndex, direction) {
        if (isAnimating || slideIndex < 0 || slideIndex >= slides.length) return;
        
        isAnimating = true;
        const oldSlide = slides[currentSlide];
        const newSlide = slides[slideIndex];

        // Bestäm riktning om den inte är angiven
        if (!direction) {
            direction = slideIndex > currentSlide ? 'next' : 'prev';
        }

        if (direction === 'next') {
            newSlide.style.transform = 'translateX(100%)';
            oldSlide.style.transform = 'translateX(-100%)';
        } else {
            newSlide.style.transform = 'translateX(-100%)';
            oldSlide.style.transform = 'translateX(100%)';
        }
        
        requestAnimationFrame(() => {
            newSlide.classList.add('active');
            oldSlide.classList.remove('active');
            void newSlide.offsetWidth; 
            newSlide.style.transform = 'translateX(0)';
        });

        currentSlide = slideIndex;
        updateNav();

        setTimeout(() => {
            isAnimating = false;
        }, 700);
    }

    function showNextSlide() {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1, 'next');
        }
    }

    function showPrevSlide() {
        if (currentSlide > 1) { // Se till att man inte kan gå tillbaka till introt
            goToSlide(currentSlide - 1, 'prev');
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', showNextSlide);
    prevBtn.addEventListener('click', showPrevSlide);

    document.addEventListener('keydown', (e) => {
        if (currentSlide === 0) return; // Inaktivera piltangenter under intro
        if (e.key === 'ArrowRight') {
            showNextSlide();
        } else if (e.key === 'ArrowLeft') {
            showPrevSlide();
        }
    });

    // Initialisering
    createDots();
    updateNav();
    runIntro(); // Starta intro-sekvensen

    // --- Terminal Animation ---
    const terminalSlide = document.getElementById('terminal-slide');

    function typeLine(element, text, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                const prompt = '> ';
                element.innerHTML = prompt;
                const textNode = document.createTextNode('');
                element.appendChild(textNode);
                
                const cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                element.appendChild(cursor);

                const typingInterval = setInterval(() => {
                    if (i < text.length) {
                        textNode.nodeValue += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typingInterval);
                        // Låt sista cursorn blinka
                        if (element.id !== 'term-line-3') {
                           cursor.style.display = 'none';
                        }
                        resolve();
                    }
                }, 40); // Skrivhastighet
            }, delay);
        });
    }

    async function runTerminalAnimation() {
        const line1 = document.getElementById('term-line-1');
        const line2 = document.getElementById('term-line-2');
        const line3 = document.getElementById('term-line-3');

        const text1 = line1.getAttribute('data-text');
        const text2 = line2.getAttribute('data-text');
        const text3 = line3.getAttribute('data-text');

        // Rensa för om-animering
        line1.innerHTML = '';
        line2.innerHTML = '';
        line3.innerHTML = '';

        await typeLine(line1, text1, 500);
        await typeLine(line2, text2, 100);
        await typeLine(line3, text3, 100);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Kör animationen en gång
                runTerminalAnimation();
            }
        });
    }, { threshold: 0.6 });

    if (terminalSlide) {
        observer.observe(terminalSlide);
    }
});
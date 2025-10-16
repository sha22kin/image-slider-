// JavaScript for Different Types of Image Carousel Sliders

document.addEventListener('DOMContentLoaded', function() {
    
    // Universal carousel event binding utility
    function bindCarouselEvents(carouselInstance, containerElement) {
        const container = containerElement || carouselInstance.slider || carouselInstance.carousel;
        
        if (!container) return;
        
        // Add error handling for button clicks
        if (carouselInstance.prevBtn) {
            carouselInstance.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                carouselInstance.prevSlide();
            });
        }
        
        if (carouselInstance.nextBtn) {
            carouselInstance.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                carouselInstance.nextSlide();
            });
        }
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (container.matches(':hover') || container.matches(':focus-within')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    carouselInstance.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    carouselInstance.nextSlide();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    if (carouselInstance.toggleAutoSlide) {
                        carouselInstance.toggleAutoSlide();
                    }
                }
            }
        });
        
        // Pause auto-slide on hover
        container.addEventListener('mouseenter', () => carouselInstance.stopAutoSlide());
        container.addEventListener('mouseleave', () => carouselInstance.startAutoSlide());
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            
            if (diffY > diffX) {
                isScrolling = true;
            }
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            if (!startX || !startY || isScrolling) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    carouselInstance.nextSlide();
                } else {
                    carouselInstance.prevSlide();
                }
            }
            
            startX = 0;
            startY = 0;
            isScrolling = false;
        }, { passive: true });
        
        // Prevent context menu on long press
        container.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Add toggleAutoSlide method to all carousels
    function addToggleMethod(carouselInstance) {
        if (!carouselInstance.toggleAutoSlide) {
            carouselInstance.toggleAutoSlide = function() {
                if (this.autoSlideInterval) {
                    this.stopAutoSlide();
                } else {
                    this.startAutoSlide();
                }
            };
        }
    }
    
    // 1. Fade Image Carousel
    class FadeCarouselSlider {
        constructor() {
            this.slider = document.getElementById('carouselSlider');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.slide');
            this.dotsContainer = document.getElementById('carouselDots');
            this.prevBtn = document.getElementById('carouselPrev');
            this.nextBtn = document.getElementById('carouselNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            bindCarouselEvents(this);
            addToggleMethod(this);
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 2. 3D Cube Image Carousel
    class CubeCarouselSlider {
        constructor() {
            this.carousel = document.getElementById('cubeCarousel');
            if (!this.carousel) return;
            
            this.dotsContainer = document.getElementById('cubeDots');
            this.prevBtn = document.getElementById('cubePrev');
            this.nextBtn = document.getElementById('cubeNext');
            this.currentSlide = 0;
            this.totalSlides = 4;
            this.autoSlideInterval = null;
            this.isAnimating = false;
            
            this.init();
        }
        
        init() {
            this.createDots();
            bindCarouselEvents(this, this.carousel);
            addToggleMethod(this);
            this.startAutoSlide();
            this.updateCubeRotation();
        }
        
        createDots() {
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
        }
        
        
        updateCubeRotation() {
            const rotation = this.currentSlide * 90;
            this.carousel.style.setProperty('--rotation', `${rotation}deg`);
            this.carousel.style.transform = `rotateY(${rotation}deg)`;
        }
        
        goToSlide(index) {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            this.currentSlide = index;
            this.dotsContainer.children[this.currentSlide].classList.add('active');
            
            this.updateCubeRotation();
            
            // Reset animation flag after transition
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 3. Slide-in Image Carousel
    class SlideinCarouselSlider {
        constructor() {
            this.slider = document.getElementById('slideinCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.slidein-slide');
            this.dotsContainer = document.getElementById('slideinDots');
            this.prevBtn = document.getElementById('slideinPrev');
            this.nextBtn = document.getElementById('slideinNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            // Remove all classes from all slides
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
            });
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            // Add appropriate classes to new slide
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
            
            // Position adjacent slides
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            
            this.slides[prevIndex].classList.add('prev');
            this.slides[nextIndex].classList.add('next');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 4. Zoom Image Carousel
    class ZoomCarouselSlider {
        constructor() {
            this.slider = document.getElementById('zoomCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.zoom-slide');
            this.dotsContainer = document.getElementById('zoomDots');
            this.prevBtn = document.getElementById('zoomPrev');
            this.nextBtn = document.getElementById('zoomNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.slides[this.currentSlide].classList.remove('prev');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
            
            // Add prev class to previous slides
            this.slides.forEach((slide, i) => {
                if (i < this.currentSlide) {
                    slide.classList.add('prev');
                }
            });
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 5. Flip Image Carousel
    class FlipCarouselSlider {
        constructor() {
            this.slider = document.getElementById('flipCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.flip-slide');
            this.dotsContainer = document.getElementById('flipDots');
            this.prevBtn = document.getElementById('flipPrev');
            this.nextBtn = document.getElementById('flipNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 6. Parallax Image Carousel
    class ParallaxCarouselSlider {
        constructor() {
            this.slider = document.getElementById('parallaxCarousel');
            this.slides = this.slider.querySelectorAll('.parallax-slide');
            this.dotsContainer = document.getElementById('parallaxDots');
            this.prevBtn = document.getElementById('parallaxPrev');
            this.nextBtn = document.getElementById('parallaxNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 7. Spiral Image Carousel
    class SpiralCarouselSlider {
        constructor() {
            this.slider = document.getElementById('spiralCarousel');
            this.slides = this.slider.querySelectorAll('.spiral-slide');
            this.dotsContainer = document.getElementById('spiralDots');
            this.prevBtn = document.getElementById('spiralPrev');
            this.nextBtn = document.getElementById('spiralNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
            this.updateSpiralPositions();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        updateSpiralPositions() {
            this.slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (index === this.currentSlide) {
                    slide.classList.add('active');
                } else if (index === (this.currentSlide - 1 + this.slides.length) % this.slides.length) {
                    slide.classList.add('prev');
                } else if (index === (this.currentSlide + 1) % this.slides.length) {
                    slide.classList.add('next');
                } else {
                    slide.style.opacity = '0';
                }
            });
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
            
            this.updateSpiralPositions();
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 8. Accordion Image Carousel
    class AccordionCarouselSlider {
        constructor() {
            this.slider = document.getElementById('accordionCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.accordion-slide');
            this.dotsContainer = document.getElementById('accordionDots');
            this.prevBtn = document.getElementById('accordionPrev');
            this.nextBtn = document.getElementById('accordionNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
            this.updateAccordionLayout();
        }
        
        updateAccordionLayout() {
            this.slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === this.currentSlide) {
                    slide.classList.add('active');
                }
            });
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 9. Magnetic Image Carousel
    class MagneticCarouselSlider {
        constructor() {
            this.slider = document.getElementById('magneticCarousel');
            this.slides = this.slider.querySelectorAll('.magnetic-slide');
            this.dotsContainer = document.getElementById('magneticDots');
            this.prevBtn = document.getElementById('magneticPrev');
            this.nextBtn = document.getElementById('magneticNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.slides[this.currentSlide].classList.remove('prev');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
            
            // Add prev class to previous slides
            this.slides.forEach((slide, i) => {
                if (i < this.currentSlide) {
                    slide.classList.add('prev');
                }
            });
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 10. Particle Image Carousel
    class ParticleCarouselSlider {
        constructor() {
            this.slider = document.getElementById('particleCarousel');
            this.slides = this.slider.querySelectorAll('.particle-slide');
            this.dotsContainer = document.getElementById('particleDots');
            this.prevBtn = document.getElementById('particlePrev');
            this.nextBtn = document.getElementById('particleNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
            this.animateParticles();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        animateParticles() {
            this.slides.forEach(slide => {
                const particles = slide.querySelectorAll('.particle');
                particles.forEach((particle, index) => {
                    const randomDelay = Math.random() * 2;
                    const randomDuration = 4 + Math.random() * 4;
                    particle.style.animationDelay = `${randomDelay}s`;
                    particle.style.animationDuration = `${randomDuration}s`;
                });
            });
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 11. Morphing Image Carousel
    class MorphingCarouselSlider {
        constructor() {
            this.slider = document.getElementById('morphingCarousel');
            this.slides = this.slider.querySelectorAll('.morphing-slide');
            this.dotsContainer = document.getElementById('morphingDots');
            this.prevBtn = document.getElementById('morphingPrev');
            this.nextBtn = document.getElementById('morphingNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 12. Wave Image Carousel
    class WaveCarouselSlider {
        constructor() {
            this.slider = document.getElementById('waveCarousel');
            this.slides = this.slider.querySelectorAll('.wave-slide');
            this.dotsContainer = document.getElementById('waveDots');
            this.prevBtn = document.getElementById('wavePrev');
            this.nextBtn = document.getElementById('waveNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 13. Matrix Image Carousel
    class MatrixCarouselSlider {
        constructor() {
            this.slider = document.getElementById('matrixCarousel');
            this.slides = this.slider.querySelectorAll('.matrix-slide');
            this.dotsContainer = document.getElementById('matrixDots');
            this.prevBtn = document.getElementById('matrixPrev');
            this.nextBtn = document.getElementById('matrixNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 14. Kaleidoscope Image Carousel
    class KaleidoscopeCarouselSlider {
        constructor() {
            this.slider = document.getElementById('kaleidoscopeCarousel');
            this.slides = this.slider.querySelectorAll('.kaleidoscope-slide');
            this.dotsContainer = document.getElementById('kaleidoscopeDots');
            this.prevBtn = document.getElementById('kaleidoscopePrev');
            this.nextBtn = document.getElementById('kaleidoscopeNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 15. Holographic Image Carousel
    class HolographicCarouselSlider {
        constructor() {
            this.slider = document.getElementById('holographicCarousel');
            this.slides = this.slider.querySelectorAll('.holographic-slide');
            this.dotsContainer = document.getElementById('holographicDots');
            this.prevBtn = document.getElementById('holographicPrev');
            this.nextBtn = document.getElementById('holographicNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 16. Glitch Image Carousel
    class GlitchCarouselSlider {
        constructor() {
            this.slider = document.getElementById('glitchCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.glitch-slide');
            this.dotsContainer = document.getElementById('glitchDots');
            this.prevBtn = document.getElementById('glitchPrev');
            this.nextBtn = document.getElementById('glitchNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 17. Neon Image Carousel
    class NeonCarouselSlider {
        constructor() {
            this.slider = document.getElementById('neonCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.neon-slide');
            this.dotsContainer = document.getElementById('neonDots');
            this.prevBtn = document.getElementById('neonPrev');
            this.nextBtn = document.getElementById('neonNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 18. Liquid Image Carousel
    class LiquidCarouselSlider {
        constructor() {
            this.slider = document.getElementById('liquidCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.liquid-slide');
            this.dotsContainer = document.getElementById('liquidDots');
            this.prevBtn = document.getElementById('liquidPrev');
            this.nextBtn = document.getElementById('liquidNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 19. Glass Image Carousel
    class GlassCarouselSlider {
        constructor() {
            this.slider = document.getElementById('glassCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.glass-slide');
            this.dotsContainer = document.getElementById('glassDots');
            this.prevBtn = document.getElementById('glassPrev');
            this.nextBtn = document.getElementById('glassNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 20. Fire Image Carousel
    class FireCarouselSlider {
        constructor() {
            this.slider = document.getElementById('fireCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.fire-slide');
            this.dotsContainer = document.getElementById('fireDots');
            this.prevBtn = document.getElementById('firePrev');
            this.nextBtn = document.getElementById('fireNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 21. Ice Image Carousel
    class IceCarouselSlider {
        constructor() {
            this.slider = document.getElementById('iceCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.ice-slide');
            this.dotsContainer = document.getElementById('iceDots');
            this.prevBtn = document.getElementById('icePrev');
            this.nextBtn = document.getElementById('iceNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 22. Galaxy Image Carousel
    class GalaxyCarouselSlider {
        constructor() {
            this.slider = document.getElementById('galaxyCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.galaxy-slide');
            this.dotsContainer = document.getElementById('galaxyDots');
            this.prevBtn = document.getElementById('galaxyPrev');
            this.nextBtn = document.getElementById('galaxyNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // 23. Crystal Image Carousel
    class CrystalCarouselSlider {
        constructor() {
            this.slider = document.getElementById('crystalCarousel');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.crystal-slide');
            this.dotsContainer = document.getElementById('crystalDots');
            this.prevBtn = document.getElementById('crystalPrev');
            this.nextBtn = document.getElementById('crystalNext');
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoSlide();
        }
        
        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        bindEvents() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        goToSlide(index) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dotsContainer.children[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dotsContainer.children[this.currentSlide].classList.add('active');
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prevIndex);
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, 2000);
        }
        
        stopAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
    }
    
    // Initialize all carousel sliders with error handling
    const carouselInstances = [];
    
    try {
        const fadeCarouselSlider = new FadeCarouselSlider();
        if (fadeCarouselSlider.slider) carouselInstances.push(fadeCarouselSlider);
        
        const cubeCarouselSlider = new CubeCarouselSlider();
        if (cubeCarouselSlider.carousel) carouselInstances.push(cubeCarouselSlider);
        
        const slideinCarouselSlider = new SlideinCarouselSlider();
        if (slideinCarouselSlider.slider) carouselInstances.push(slideinCarouselSlider);
        
        const zoomCarouselSlider = new ZoomCarouselSlider();
        if (zoomCarouselSlider.slider) carouselInstances.push(zoomCarouselSlider);
        
        const flipCarouselSlider = new FlipCarouselSlider();
        if (flipCarouselSlider.slider) carouselInstances.push(flipCarouselSlider);
        
        const parallaxCarouselSlider = new ParallaxCarouselSlider();
        if (parallaxCarouselSlider.slider) carouselInstances.push(parallaxCarouselSlider);
        
        const spiralCarouselSlider = new SpiralCarouselSlider();
        if (spiralCarouselSlider.slider) carouselInstances.push(spiralCarouselSlider);
        
        const accordionCarouselSlider = new AccordionCarouselSlider();
        if (accordionCarouselSlider.slider) carouselInstances.push(accordionCarouselSlider);
        
        const magneticCarouselSlider = new MagneticCarouselSlider();
        if (magneticCarouselSlider.slider) carouselInstances.push(magneticCarouselSlider);
        
        const particleCarouselSlider = new ParticleCarouselSlider();
        if (particleCarouselSlider.slider) carouselInstances.push(particleCarouselSlider);
        
        const morphingCarouselSlider = new MorphingCarouselSlider();
        if (morphingCarouselSlider.slider) carouselInstances.push(morphingCarouselSlider);
        
        const waveCarouselSlider = new WaveCarouselSlider();
        if (waveCarouselSlider.slider) carouselInstances.push(waveCarouselSlider);
        
        const matrixCarouselSlider = new MatrixCarouselSlider();
        if (matrixCarouselSlider.slider) carouselInstances.push(matrixCarouselSlider);
        
        const kaleidoscopeCarouselSlider = new KaleidoscopeCarouselSlider();
        if (kaleidoscopeCarouselSlider.slider) carouselInstances.push(kaleidoscopeCarouselSlider);
        
        const holographicCarouselSlider = new HolographicCarouselSlider();
        if (holographicCarouselSlider.slider) carouselInstances.push(holographicCarouselSlider);
        
        const glitchCarouselSlider = new GlitchCarouselSlider();
        if (glitchCarouselSlider.slider) carouselInstances.push(glitchCarouselSlider);
        
        const neonCarouselSlider = new NeonCarouselSlider();
        if (neonCarouselSlider.slider) carouselInstances.push(neonCarouselSlider);
        
        const liquidCarouselSlider = new LiquidCarouselSlider();
        if (liquidCarouselSlider.slider) carouselInstances.push(liquidCarouselSlider);
        
        const glassCarouselSlider = new GlassCarouselSlider();
        if (glassCarouselSlider.slider) carouselInstances.push(glassCarouselSlider);
        
        const fireCarouselSlider = new FireCarouselSlider();
        if (fireCarouselSlider.slider) carouselInstances.push(fireCarouselSlider);
        
        const iceCarouselSlider = new IceCarouselSlider();
        if (iceCarouselSlider.slider) carouselInstances.push(iceCarouselSlider);
        
        const galaxyCarouselSlider = new GalaxyCarouselSlider();
        if (galaxyCarouselSlider.slider) carouselInstances.push(galaxyCarouselSlider);
        
        const crystalCarouselSlider = new CrystalCarouselSlider();
        if (crystalCarouselSlider.slider) carouselInstances.push(crystalCarouselSlider);
        
        console.log(`Successfully initialized ${carouselInstances.length} Image Carousel Sliders!`);
        
    } catch (error) {
        console.error('Error initializing carousels:', error);
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add fade-in animation to all sections
        const sections = document.querySelectorAll('.row');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('fade-in');
            }, index * 200);
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-left');
            }
        });
    }, observerOptions);
    
    // Observe all carousel containers
    document.querySelectorAll('.carousel-container, .cube-carousel-container, .slidein-carousel-container, .zoom-carousel-container, .flip-carousel-container, .parallax-carousel-container, .spiral-carousel-container, .accordion-carousel-container, .magnetic-carousel-container, .particle-carousel-container, .morphing-carousel-container, .wave-carousel-container, .matrix-carousel-container, .kaleidoscope-carousel-container, .holographic-carousel-container, .glitch-carousel-container, .neon-carousel-container, .liquid-carousel-container, .glass-carousel-container, .fire-carousel-container, .ice-carousel-container, .galaxy-carousel-container, .crystal-carousel-container').forEach(container => {
        observer.observe(container);
    });
    
    // Add hover effects for interactive elements
    document.querySelectorAll('.btn, .dot').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click ripple effect
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('All Image Carousel Sliders initialized successfully!');
});

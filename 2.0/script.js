const slider = document.querySelector('.slider-container'), slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false,
    currentIndex = 0,
    startPos = 0, // where we clicked or touched
    prevPos = 0, // where we last stopped slider movement
    currentTranslate = 0; // how much to move the slider

// Disable context menu
window.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img');
    slideImage.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchmove', touchMove);
    slide.addEventListener('touchend', touchEnd);
    
    // Mouse events
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mousemove', touchMove);
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
});

function touchStart(index) { // gets called first and 'sets the scene'
    return function(event) {
        isDragging = true;
        currentIndex = index;
        startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        
        animationID = requestAnimationFrame(animation);
        slider.classList.add('grabbing');
    }
}

function touchMove(event) {
    if (isDragging) {
        const currentPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX; //tracks progress of mouse/finger
        currentTranslate = prevPos + currentPos - startPos; //how much distance has passed since start
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID); // stops animation to only show current slide

    if (currentTranslate - prevPos < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }

    if (currentTranslate - prevPos > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    setPosByIndex();

    slider.classList.remove('grabbing');
}

function animation() {
    slider.style.transform = `translateX(${currentTranslate}px)`;

    if (isDragging) {
        requestAnimationFrame(animation);
    }
}

function setPosByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevPos = currentTranslate;
    //slider.style.transform = `translateX(${currentTranslate}px)`;
}
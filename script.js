const modal = document.getElementById("expanded-view");
const closeBtn = document.querySelector(".close-btn");

let currentSlide = 0;
let slideInterval;
let imagesArray = []; // To store current images

function showSlide(index) {
    const wrapper = document.getElementById('slider-wrapper');
    const totalSlides = wrapper.children.length;
    
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Function to start the 2-second timer
function startAutoSwipe() {
    stopAutoSwipe(); // Clear existing
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 2000);
}

function stopAutoSwipe() {
    clearInterval(slideInterval);
}

// Event Listeners for Arrows
document.querySelector('.next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoSwipe(); // Reset timer on manual click
});

document.querySelector('.prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoSwipe();
});

// Update the click listener for your sections
document.querySelectorAll('.split-section').forEach(section => {
    section.addEventListener('click', () => {
        const title = section.querySelector('h2').innerText;
        
        // Pull the detailed article from the HTML attribute
        const detailedText = section.getAttribute('data-full-text');
        
        // Pull the specific images for this section
        const imagesString = section.getAttribute('data-images');
        const sectionImages = imagesString ? imagesString.split(',') : [section.querySelector('img').src];

        document.getElementById('modal-title').innerText = title;
        
        // Inject the detailed text into the modal
        document.getElementById('modal-text').innerHTML = `<p class="long-article">${detailedText}</p>`;
        
        // Dynamically build the slider for this specific section
        const wrapper = document.getElementById('slider-wrapper');
        wrapper.innerHTML = sectionImages.map(src => `<img src="${src.trim()}">`).join('');
        
        // Reset and Show Modal
        currentSlide = 0;
        wrapper.style.transform = `translateX(0)`;
        document.getElementById("expanded-view").style.display = "flex";
        startAutoSwipe();
    });
});
// Close modal logic
closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}
// Add these elements to your HTML or create them via JS:
const overlay = document.createElement('div');
overlay.className = 'tutorial-overlay';
const hint = document.createElement('div');
hint.className = 'tutorial-hint';
hint.innerText = "Nhấp vào hình ảnh để xem thêm chi tiết";
document.body.appendChild(overlay);
document.body.appendChild(hint);

// Check if user has completed tutorial
let tutorialDone = localStorage.getItem('tutorialDone') === 'true';

if (!tutorialDone) {
    // 1. Enable tutorial mode
    document.body.classList.add('tutorial-active');
    
    // 2. Show hint and overlay when hovering a section
    document.querySelectorAll('.split-section').forEach(section => {
        section.addEventListener('mouseenter', () => {
            if (!tutorialDone) {
                overlay.style.display = 'block';
                hint.style.display = 'block';
                document.body.classList.add('no-scroll'); // Disable scroll
            }
        });

        section.addEventListener('mouseleave', () => {
            if (!tutorialDone) {
                overlay.style.display = 'none';
                hint.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });

        // 3. End tutorial when a section is clicked
        section.addEventListener('click', () => {
            if (!tutorialDone) {
                finishTutorial();
            }
        });
    });
}

function finishTutorial() {
    tutorialDone = true;
    localStorage.setItem('tutorialDone', 'true'); // Save to browser memory
    overlay.style.display = 'none';
    hint.style.display = 'none';
    document.body.classList.remove('no-scroll');
    document.body.classList.remove('tutorial-active');
}
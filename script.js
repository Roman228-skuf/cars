const brandsDiv = document.getElementById('brands');
const modelsDiv = document.getElementById('models');
const yearsDiv = document.getElementById('years');
const imagesDiv = document.getElementById('images');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const radioButtons = document.querySelectorAll('input[name="dataSource"]');

// Load JSON data
function loadJSON(file) {
    // Очищаємо всі блоки перед завантаженням нового JSON
    brandsDiv.innerHTML = '';
    modelsDiv.innerHTML = '';
    yearsDiv.innerHTML = '';
    imagesDiv.innerHTML = '';

    fetch(file)
        .then(response => response.json())
        .then(data => {
            const cars = parseCarData(data);
            displayBrands(cars); // Відображаємо бренди з нового JSON
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

// Event listener for radio buttons
radioButtons.forEach(radio => {
    radio.addEventListener('change', (event) => {
        const selectedFile = event.target.value;
        loadJSON(selectedFile); // Завантажуємо вибраний JSON
    });
});

// Initial load
loadJSON('sample.json');

// Parse JSON data into a structured format
function parseCarData(data) {
    const cars = {};
    for (const path in data) {
        const parts = path.split('/');
        if (parts.length < 4) {
            console.warn(`Invalid path format: ${path}`);
            continue; // Пропускаємо, якщо формат шляху неправильний
        }

        const [brand, model, year] = parts;
        if (!cars[brand]) cars[brand] = {};
        if (!cars[brand][model]) cars[brand][model] = {};
        if (!cars[brand][model][year]) cars[brand][model][year] = [];
        cars[brand][model][year].push(data[path]);
    }
    return cars;
}

// Display car brands
function displayBrands(cars) {
    brandsDiv.innerHTML = '';
    const sortedBrands = Object.keys(cars).sort(); // Сортуємо бренди за алфавітом
    sortedBrands.forEach(brand => {
        const button = document.createElement('button');
        button.textContent = brand;
        button.onclick = () => displayModels(cars[brand]);
        brandsDiv.appendChild(button);
    });
}

// Display car models
function displayModels(models) {
    modelsDiv.innerHTML = '';
    yearsDiv.innerHTML = '';
    imagesDiv.innerHTML = '';
    const sortedModels = Object.keys(models).sort(); // Сортуємо моделі за алфавітом
    sortedModels.forEach(model => {
        const button = document.createElement('button');
        button.textContent = model;
        button.onclick = () => displayYears(models[model]);
        modelsDiv.appendChild(button);
    });
}

// Display car years
function displayYears(years) {
    yearsDiv.innerHTML = '';
    imagesDiv.innerHTML = '';
    const sortedYears = Object.keys(years).sort(); // Сортуємо роки за зростанням
    sortedYears.forEach(year => {
        const button = document.createElement('button');
        button.textContent = year;
        button.onclick = () => displayImages(years[year]);
        yearsDiv.appendChild(button);
    });
}

// Display car images
function displayImages(images) {
    imagesDiv.innerHTML = '';
    images.forEach(image => {
        const img = new Image(); // Створюємо новий об'єкт зображення
        img.src = image;

        // Перевіряємо, чи зображення існує і чи його розмір не 1x1
        img.onload = () => {
            if (img.naturalWidth > 1 && img.naturalHeight > 1) {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                imgElement.onclick = () => openModal(image);
                imagesDiv.appendChild(imgElement);
            }
        };

        // Якщо зображення не завантажується, нічого не робимо
        img.onerror = () => {
            console.warn(`Image not found or invalid: ${image}`);
        };
    });
}

// Open modal
function openModal(imageSrc) {
    modal.style.display = 'block';
    modalImage.src = imageSrc;
}

// Close modal
closeModal.onclick = () => {
    modal.style.display = 'none';
};

// Close modal when clicking outside the image
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
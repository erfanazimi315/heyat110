// Sample data for maddahs and their nawhas with audio URLs
const maddahsData = [
    {
        id: 1,
        name: "متفرقه",
        image: "./img/1.jpg",
        nawhas: [
            {
                id: 1,
                title: "خسته نشدی انقدر حسین حسین کردی ؟",
                audioUrl: "./audio/1/heyat110-1-1.mp3"
            },
        ]
    },

];

// DOM Elements
const maddahsGrid = document.getElementById('maddahsGrid');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const searchResults = document.getElementById('searchResults');
const maddahModal = document.getElementById('maddahModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Helper function to find nawha by code
function findNawhaByCode(code) {
    for (const maddah of maddahsData) {
        const found = maddah.nawhas.find(n => n.id.toString() === code.toString());
        if (found) return { nawha: found, maddah };
    }
    return null;
}

// Function to trigger download
function downloadAudio(audioUrl, fileName) {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName || 'download.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load maddahs on page load
document.addEventListener('DOMContentLoaded', loadMaddahs);

// Load maddahs to the grid
function loadMaddahs() {
    maddahsGrid.innerHTML = '';
    maddahsData.forEach(maddah => {
        const maddahCard = document.createElement('div');
        maddahCard.className = 'maddah-card';
        maddahCard.innerHTML = `
            <img src="${maddah.image}" alt="${maddah.name}" class="maddah-image">
            <div class="maddah-info">
                <h3 class="maddah-name">${maddah.name}</h3>
                <p class="maddah-count">${maddah.nawhas.length} مداحی</p>
            </div>
        `;
        maddahCard.addEventListener('click', () => openMaddahModal(maddah));
        maddahsGrid.appendChild(maddahCard);
    });
}

// Open modal with maddah's nawhas
function openMaddahModal(maddah) {
    modalTitle.textContent = `مداحی های ${maddah.name}`;
    modalBody.innerHTML = '';

    const nawhasGrid = document.createElement('div');
    nawhasGrid.className = 'nawhas-grid';

    maddah.nawhas.forEach(nawha => {
        const nawhaCard = document.createElement('div');
        nawhaCard.className = 'nawha-card';
        nawhaCard.innerHTML = `
            <div class="nawha-info">
                <h4 class="nawha-title">${nawha.title}</h4>
                <p class="nawha-code">کد: ${nawha.id}</p>
                <button class="download-button" data-code="${nawha.id}">دانلود</button>
            </div>
        `;
        nawhasGrid.appendChild(nawhaCard);
    });

    modalBody.appendChild(nawhasGrid);
    maddahModal.style.display = 'block';

    // Add click event to download buttons
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', function () {
            const code = this.getAttribute('data-code');
            const result = findNawhaByCode(code);
            if (result) {
                const fileName = `${result.maddah.name} - ${result.nawha.title}.mp3`;
                downloadAudio(result.nawha.audioUrl, fileName);
            }
        });
    });
}

// Close modal
closeModal.addEventListener('click', () => maddahModal.style.display = 'none');

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === maddahModal) {
        maddahModal.style.display = 'none';
    }
});

// Search functionality
searchButton.addEventListener('click', searchNawha);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchNawha();
});

function searchNawha() {
    const searchTerm = searchInput.value.trim();
    searchResults.innerHTML = '';

    if (!searchTerm) {
        alert('لطفا کد مداحی را وارد کنید');
        return;
    }

    const result = findNawhaByCode(searchTerm);

    if (result) {
        searchResults.innerHTML = `
            <div class="result-card">
                <h3 class="result-title">${result.nawha.title}</h3>
                <p class="result-maddah">مداح: ${result.maddah.name}</p>
                <p class="result-code">کد: ${result.nawha.id}</p>
                <button class="download-button" data-code="${result.nawha.id}">دانلود مداحی</button>
            </div>
        `;

        document.querySelector('.result-card .download-button').addEventListener('click', () => {
            const fileName = `${result.maddah.name} - ${result.nawha.title}.mp3`;
            downloadAudio(result.nawha.audioUrl, fileName);
        });
    } else {
        searchResults.innerHTML = `
            <div class="result-card">
                <h3 class="result-title">مداحی یافت نشد</h3>
                <p>مداحی با کد ${searchTerm} پیدا نشد. لطفا کد دیگری را امتحان کنید.</p>
            </div>
        `;
    }

    searchResults.style.display = 'block';
}
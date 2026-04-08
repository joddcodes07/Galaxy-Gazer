const apiKey = 'HNVeCZmgoEnD4nlUQdX72iiRTQXQVrf3EtU2A7tw';
const gallery = document.getElementById('gallery-container');
const loader = document.getElementById('loading-message');
const searchInput = document.getElementById('search-input');
const dateInput = document.getElementById('date-input');

let allSpaceData = [];
// async function getSpaceData() {
//     loader.style.display = 'block';
//     try {
//         const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=15`);
//         const data = await response.json();

//         renderGallery(data);
//     }catch (error) {
//         console.error("fetch failed:", error);
//     }finally {
//         loader.style.display = 'none';
//     }
// }
async function getInitialGallery() {
    showLoader(true);
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=15`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        allSpaceData = data; 
        renderGallery(allSpaceData);
    } catch (error) {
        handleError("Failed to fetch the cosmos. Check your connection.");
    } finally {
        showLoader(false);
    }
}
async function getSpaceByDate(selectedDate) {
    showLoader(true);
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`);
        if (!response.ok) throw new Error("Invalid date or API error");
        
        const data = await response.json();
        renderGallery([data]);
    } catch (error) {
        handleError("Could not find data for that specific date.");
    } finally {
        showLoader(false);
    }
}
function renderGallery(dataArray) {
    galleryContainer.innerHTML = ''; 
    
    if (dataArray.length === 0) {
        galleryContainer.innerHTML = '<p class="no-results">No celestial matches found.</p>';
        return;
    }

    dataArray.forEach(item => {
        if (item.media_type === 'image') {
            const cardHtml = `
                <div class="card">
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                    <div class="card-info">
                        <h3>${item.title}</h3>
                        <p class="date">${item.date}</p>
                    </div>
                </div>
            `;
            galleryContainer.innerHTML += cardHtml;
        }
    });
}
function showLoader(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
}

function handleError(message) {
    galleryContainer.innerHTML = `<p class="error-msg">${message}</p>`;
}
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    const filteredResults = allSpaceData.filter(item => {
        return item.title.toLowerCase().includes(term);
    });
    
    renderGallery(filteredResults);
});
dateInput.addEventListener('change', (e) => {
    if (e.target.value) {
        getSpaceByDate(e.target.value);
    }
});

getInitialGallery();


// function renderGallery(dataArray) {
//     dataArray.forEach(item => {
//         const cardHtml = `
//             <div class="card">
//                 <img src="${item.url}" alt="${item.title}">
//                 <h3>${item.title}</h3>
//                 <p>${item.date}</p>
//             </div>
//         `;
//         gallery.innerHTML += cardHtml;
//     });
// }
// getSpaceData();
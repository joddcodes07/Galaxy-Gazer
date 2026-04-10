let apiKey = 'HNVeCZmgoEnD4nlUQdX72iiRTQXQVrf3EtU2A7tw'
let monthSelect = document.getElementById('month-select')
let daySelect = document.getElementById('day-select')
let yearSelect = document.getElementById('year-select')
let fetchBtn = document.getElementById('fetch-btn')
let galleryGrid = document.getElementById('gallery-grid')
let bdayContainer = document.getElementById('birthday-result-container')
let modal = document.getElementById('detail-modal')
let closeModal = document.getElementById('close-modal')
let modalImg = document.getElementById('modal-img')
let modalTitle = document.getElementById('modal-title')
let modalDate = document.getElementById('modal-date')
let modalDesc = document.getElementById('modal-desc')
let loader = document.getElementById('loader')
let bdayLoader = document.getElementById('birthday-loader')
let navHome = document.getElementById('nav-home')
let navFavs = document.getElementById('nav-favs')
let panelTitle = document.getElementById('panel-title')

let currentGridData = []
let favourites = JSON.parse(localStorage.getItem('galaxy_favs')) || []

let months = [
    {val:'01', name:'January'}, {val:'02', name:'February'}, {val:'03', name:'March'},
    {val:'04', name:'April'}, {val:'05', name:'May'}, {val:'06', name:'June'},
    {val:'07', name:'July'}, {val:'08', name:'August'}, {val:'09', name:'September'},
    {val:'10', name:'October'}, {val:'11', name:'November'}, {val:'12', name:'December'}
]

months.forEach((m)=>{
    let opt = document.createElement('option')
    opt.value = m.val
    opt.innerText = m.name
    monthSelect.appendChild(opt)
})

for(let i=1; i<=31; i++){
    let d = i < 10 ? `0${i}` : `${i}`
    let opt = document.createElement('option')
    opt.value = d
    opt.innerText = d
    daySelect.appendChild(opt)
}

for(let x=2026; x>=1995; x--){
    let opt = document.createElement('option')
    opt.value = x
    opt.innerText = x
    yearSelect.appendChild(opt)
}

function saveFavourites(){
    localStorage.setItem('galaxy_favs', JSON.stringify(favourites))
}

function isFav(url){
    let found = favourites.find((x)=>{
        return x.url === url
    })
    return found !== undefined
}

function handleFavClick(item, btnElement){
    if(isFav(item.url)){
        favourites = favourites.filter((f)=>{
            return f.url !== item.url
        })
        btnElement.classList.remove('active')
        btnElement.innerText = 'Add to Favourites'
        if(navFavs.classList.contains('active')){
            renderGrid(favourites)
        }
    }else{
        favourites.push(item)
        btnElement.classList.add('active')
        btnElement.innerText = 'Favourited'
    }
    saveFavourites()
}

async function getInitialGrid() {
    loader.classList.remove('hidden')
    galleryGrid.classList.add('hidden')
    try{
        let res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=6`)
        let data = await res.json()
        currentGridData = data
        renderGrid(currentGridData)
    }
    catch(error){
        return error
    }
    finally{
        loader.classList.add('hidden')
        galleryGrid.classList.remove('hidden')
    }
}

async function getSpaceByDate(selectedDate) {
    bdayContainer.innerHTML = ''
    bdayLoader.classList.remove('hidden')
    try{
        let res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`)
        let data = await res.json()
        renderBirthdayCard(data)
    }
    catch(error){
        return error
    }
    finally{
        bdayLoader.classList.add('hidden')
    }
}

function renderBirthdayCard(dataObj){
    if(dataObj.media_type==='image'){
        let favText = isFav(dataObj.url) ? 'Favourited' : 'Add to Favourites'
        let favClass = isFav(dataObj.url) ? 'active' : ''
        
        let html = `
            <div class="birthday-card glass-card">
                <img src="${dataObj.url}" alt="${dataObj.title}">
                <div class="birthday-info">
                    <h3>${dataObj.title}</h3>
                    <div class="action-row">
                        <p>${dataObj.date}</p>
                        <button class="fav-btn ${favClass}">${favText}</button>
                    </div>
                </div>
            </div>
        `
        bdayContainer.innerHTML = html
        
        let favBtn = bdayContainer.querySelector('.fav-btn')
        favBtn.addEventListener('click', ()=>{
            handleFavClick(dataObj, favBtn)
        })
    }
}

function renderGrid(dataArray) {
    galleryGrid.innerHTML = ''
    if(dataArray.length===0){
        galleryGrid.innerHTML = '<p>No items found.</p>'
        return
    }
    dataArray.forEach((n)=>{
        if(n.media_type==='image'){
            let wrapper = document.createElement('div')
            wrapper.className = 'grid-item'
            
            let favText = isFav(n.url) ? 'Favourited' : 'Add to Favourites'
            let favClass = isFav(n.url) ? 'active' : ''
            
            let html = `
                <img src="${n.url}" alt="${n.title}" loading="lazy">
                <div class="item-overlay">
                    <h4>${n.title}</h4>
                    <div class="action-row">
                        <button class="read-btn">Read More</button>
                        <button class="fav-btn ${favClass}">${favText}</button>
                    </div>
                </div>
            `
            wrapper.innerHTML = html
            
            let readBtn = wrapper.querySelector('.read-btn')
            let favBtn = wrapper.querySelector('.fav-btn')
            
            readBtn.addEventListener('click', ()=>{
                openModal(n)
            })
            
            favBtn.addEventListener('click', ()=>{
                handleFavClick(n, favBtn)
            })
            
            galleryGrid.appendChild(wrapper)
        }
    })
}

function openModal(dataObj) {
    modalImg.src = dataObj.url
    modalTitle.innerText = dataObj.title
    modalDate.innerText = dataObj.date
    modalDesc.innerText = dataObj.explanation
    modal.classList.remove('hidden')
}

closeModal.addEventListener('click', ()=>{
    modal.classList.add('hidden')
})

fetchBtn.addEventListener('click', ()=>{
    let m = monthSelect.value
    let d = daySelect.value
    let y = yearSelect.value
    
    if(m && d && y){
        let dateStr = `${y}-${m}-${d}`
        getSpaceByDate(dateStr)
    }
})

navHome.addEventListener('click', ()=>{
    navHome.classList.add('active')
    navFavs.classList.remove('active')
    panelTitle.innerText = 'Cosmic Discoveries'
    renderGrid(currentGridData)
})

navFavs.addEventListener('click', ()=>{
    navFavs.classList.add('active')
    navHome.classList.remove('active')
    panelTitle.innerText = 'Your Favourites'
    renderGrid(favourites)
})

getInitialGrid()
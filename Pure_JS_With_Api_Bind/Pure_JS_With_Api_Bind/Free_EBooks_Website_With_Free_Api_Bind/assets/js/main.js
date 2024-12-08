/*=============== SEARCH ===============*/
const searchButton = document.getElementById('search-button'),
      searchClose = document.getElementById('search-close'),
      searchContent = document.getElementById('search-content')

if(searchButton){
    searchButton.addEventListener('click', ()=>{
        searchContent.classList.add('show-search')
    })
}

if(searchClose){
    searchClose.addEventListener('click', ()=>{
        searchContent.classList.remove('show-search')
    })
}


/*=============== LOGIN ===============*/
const loginButton = document.getElementById('login-button'),
      loginClose = document.getElementById('login-close'),
      loginContent = document.getElementById('login-content')

if(loginButton){
    loginButton.addEventListener('click', ()=>{
        loginContent.classList.add('show-login')
    })
}

if(loginClose){
    loginClose.addEventListener('click', ()=>{
        loginContent.classList.remove('show-login')
    })
}


/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                        :header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >=350 ? scrollUp.classList.add('show-scroll')
                      : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'


if(selectedTheme){
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


/*=============== NEW BOOKS LIST API ===============*/
const container = document.getElementById('bookContainer');
const paginationContainer = document.getElementById('paginationContainer');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

const API_URL = 'https://www.googleapis.com/books/v1/volumes';
const MAX_RESULTS_LARGE_SCREEN = 8;
const MAX_RESULTS_SMALL_SCREEN = 12;
const MAX_PAGES = 5;
let currentPage = 1;

function getMaxResults() {
    return window.innerWidth <= 480 ? MAX_RESULTS_SMALL_SCREEN : MAX_RESULTS_LARGE_SCREEN;
}

async function fetchBooks(page) {
    const startIndex = (page - 1) * getMaxResults();
    const fields = 'items(volumeInfo(title,authors,imageLinks/thumbnail,averageRating,pageCount,publisher,publishedDate,description),accessInfo(webReaderLink))';
    const response = await fetch(`${API_URL}?q=subject:nonfiction&orderBy=newest&startIndex=${startIndex}&maxResults=${getMaxResults()}&fields=${fields}`);
    if (!response.ok) {
        console.error('Failed to fetch books:', response.status, response.statusText);
        return [];
    }
    const data = await response.json();
    return data.items || [];
}

async function renderBooks(page) {
    const books = await fetchBooks(page);
    container.innerHTML = ''; 

    books.forEach((book, index) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const rating = book.volumeInfo.averageRating ? getStarRating(book.volumeInfo.averageRating) : getDefaultStarRating();
        const imageURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'No Image';
        const pageCount = book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'Page count not available';
        const downloadLink = book.accessInfo && book.accessInfo.webReaderLink ? `<a href="${book.accessInfo.webReaderLink}" target="_blank" class="button">Read</a>` : 'No download link available';

        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <img src="${imageURL}" alt="${title}">
            <div class="book-details">
                <h2>${title}</h2>
                <p>Author: ${authors}</p>
                <p>Page: ${pageCount}</p>
                <div class="rating">${rating}</div>
                ${downloadLink}
                ${window.innerWidth <= 480 ? `
                <button class="book-arrow left" onclick="navigateCard(${index}, -1)"><i class="fas fa-chevron-left"></i></button>
                <button class="book-arrow right" onclick="navigateCard(${index}, 1)"><i class="fas fa-chevron-right"></i></button>` : ''}
            </div>
        `;
        card.addEventListener('click', () => showBookDetails(book));
        container.appendChild(card);
    });

    renderPagination(page);
}

function getStarRating(averageRating) {
    const rating = Math.round(averageRating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>'; // Filled star icon
        } else {
            stars += '<i class="far fa-star"></i>'; // Empty star icon
        }
    }
    return stars;
}

function getDefaultStarRating() {
    return '<i class="fas fa-star"></i>'.repeat(5); // Five filled star icons
}

function renderPagination(currentPage) {
    paginationContainer.querySelectorAll('.pagination-button').forEach(button => button.remove());

    for (let i = 1; i <= MAX_PAGES; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            renderBooks(i).then(addCategoryBookCardEventListeners); ;
            currentPage = i;
        });
        nextPageButton.before(button);
    }

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === MAX_PAGES;
}

function navigateCard(currentIndex, direction) {
    const cards = Array.from(container.querySelectorAll('.book-card'));
    const newIndex = (currentIndex + direction + cards.length) % cards.length;
    const nextCard = cards[newIndex];
    const containerRect = container.getBoundingClientRect();
    const cardRect = nextCard.getBoundingClientRect();
    const scrollX = cardRect.left - containerRect.left + container.scrollLeft;
    container.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderBooks(currentPage).then(addCategoryBookCardEventListeners) ;
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < MAX_PAGES) {
        currentPage++;
        renderBooks(currentPage).then(addCategoryBookCardEventListeners) ;
    }
});

window.addEventListener('resize', () => {
    renderBooks(currentPage).then(addCategoryBookCardEventListeners); ;
});

renderBooks(currentPage).then(addCategoryBookCardEventListeners); // Initial render

/*=============== FEATURED BOOKS LIST API ===============*/
const featuredContainer = document.getElementById('featuredContainer');
const paginationContainerFeatured = document.getElementById('paginationContainerFeatured');
const prevPageButtonFeatured = document.getElementById('prevPageFeatured');
const nextPageButtonFeatured = document.getElementById('nextPageFeatured');

let currentPageFeatured = 1;

async function fetchFeaturedBooks(page) {
    const startIndex = (page - 1) * getMaxResults();
    const fields = 'items(volumeInfo(title,authors,imageLinks/thumbnail,averageRating,pageCount,publisher,publishedDate,description),accessInfo(webReaderLink))';
    const response = await fetch(`${API_URL}?q=subject:nonfiction&orderBy=relevance&startIndex=${startIndex}&maxResults=${getMaxResults()}&fields=${fields}`);
    if (!response.ok) {
        console.error('Failed to fetch books:', response.status, response.statusText);
        return [];
    }
    const data = await response.json();
    return data.items || [];
}

async function renderFeaturedBooks(page) {
    const books = await fetchFeaturedBooks(page);
    featuredContainer.innerHTML = ''; // Clear previous content

    books.forEach((book, index) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const rating = book.volumeInfo.averageRating ? getStarRating(book.volumeInfo.averageRating) : getDefaultStarRating();
        const imageURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'No Image';
        const pageCount = book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'Page count not available';
        const downloadLink = book.accessInfo && book.accessInfo.webReaderLink ? `<a href="${book.accessInfo.webReaderLink}" target="_blank" class="button">Read</a>` : 'No download link available';

        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <img src="${imageURL}" alt="${title}">
            <div class="book-details">
                <h2>${title}</h2>
                <p>Author: ${authors}</p>
                <p>Page: ${pageCount}</p>
                <div class="rating">${rating}</div>
                ${downloadLink}
                ${window.innerWidth <= 480 ? `
                <button class="book-arrow left" onclick="navigateFeaturedCard(${index}, -1)"><i class="fas fa-chevron-left"></i></button>
                <button class="book-arrow right" onclick="navigateFeaturedCard(${index}, 1)"><i class="fas fa-chevron-right"></i></button>` : ''}
            </div>
        `;
        card.addEventListener('click', () => showBookDetails(book));
        featuredContainer.appendChild(card);
    });

    renderPaginationFeatured(page);
}

function renderPaginationFeatured(currentPage) {
    paginationContainerFeatured.querySelectorAll('.pagination-button').forEach(button => button.remove());

    for (let i = 1; i <= MAX_PAGES; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            renderFeaturedBooks(i).then(addCategoryBookCardEventListeners);;
            currentPageFeatured = i;
        });
        nextPageButtonFeatured.before(button);
    }

    prevPageButtonFeatured.disabled = currentPage === 1;
    nextPageButtonFeatured.disabled = currentPage === MAX_PAGES;
}

function navigateFeaturedCard(currentIndex, direction) {
    const cards = Array.from(featuredContainer.querySelectorAll('.book-card'));
    const newIndex = (currentIndex + direction + cards.length) % cards.length;
    const nextCard = cards[newIndex];
    const containerRect = featuredContainer.getBoundingClientRect();
    const cardRect = nextCard.getBoundingClientRect();
    const scrollX = cardRect.left - containerRect.left + featuredContainer.scrollLeft;
    featuredContainer.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

prevPageButtonFeatured.addEventListener('click', () => {
    if (currentPageFeatured > 1) {
        currentPageFeatured--;
        renderFeaturedBooks(currentPageFeatured).then(addCategoryBookCardEventListeners);;
    }
});

nextPageButtonFeatured.addEventListener('click', () => {
    if (currentPageFeatured < MAX_PAGES) {
        currentPageFeatured++;
        renderFeaturedBooks(currentPageFeatured).then(addCategoryBookCardEventListeners);;
    }
});

window.addEventListener('resize', () => {
    renderFeaturedBooks(currentPageFeatured).then(addCategoryBookCardEventListeners);;
});

renderFeaturedBooks(currentPageFeatured); // Initial render


/*=============== SEARCH BOOK BY BOOK TITLE SECTION API ===============*/
const containerSearch = document.getElementById('bookSearchContainer');
const paginationSearchContainer = document.getElementById('paginationSearchContainer');
const prevPageSearchButton = document.getElementById('prevPageSearch');
const nextPageSearchButton = document.getElementById('nextPageSearch');
const searchInput = document.getElementById('searchInput');
const searchBooksButton = document.getElementById('searchBooksButton');

let currentSearchPage = 1;
let currentSearchBooks = [];
let searchQuery = 'subject:fiction';

function getMaxResults() {
    return window.innerWidth <= 480 ? MAX_RESULTS_SMALL_SCREEN : MAX_RESULTS_LARGE_SCREEN;
}

async function fetchSearchBooks(page) {
    const startIndex = (page - 1) * getMaxResults();
    const fields = 'items(volumeInfo(title,authors,imageLinks/thumbnail,averageRating,pageCount,publisher,publishedDate,description),accessInfo(webReaderLink))';
    const response = await fetch(`${API_URL}?q=${searchQuery}&orderBy=newest&startIndex=${startIndex}&maxResults=${getMaxResults()}&fields=${fields}`);
    if (!response.ok) {
        console.error('Failed to fetch books:', response.status, response.statusText);
        return [];
    }
    const data = await response.json();
    currentSearchBooks = data.items || [];
    return currentSearchBooks;
}

async function renderSearchBooks(page) {
    const books = await fetchSearchBooks(page);
    containerSearch.innerHTML = '';

    books.forEach((book, index) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const rating = book.volumeInfo.averageRating ? getStarRating(book.volumeInfo.averageRating) : getDefaultStarRating();
        const imageURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'No Image';
        const pageCount = book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'Page count not available';
        const downloadLink = book.accessInfo && book.accessInfo.webReaderLink ? `<a href="${book.accessInfo.webReaderLink}" target="_blank" class="button">Read</a>` : 'No download link available';

        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <img src="${imageURL}" alt="${title}">
            <div class="book-details">
                <h2>${title}</h2>
                <p>Author: ${authors}</p>
                <p>${pageCount}</p>
                <div class="rating">${rating}</div>
                ${downloadLink}
                ${window.innerWidth <= 480 ? `
                <button class="book-arrow left" onclick="navigateSearchCard(${index}, -1)"><i class="fas fa-chevron-left"></i></button>
                <button class="book-arrow right" onclick="navigateSearchCard(${index}, 1)"><i class="fas fa-chevron-right"></i></button>` : ''}
            </div>
        `;
        card.addEventListener('click', ()=> showBookDetails(book));
        containerSearch.appendChild(card);
    });

    renderPaginationSearch(page);
}

function getStarRating(averageRating) {
    const rating = Math.round(averageRating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>'; 
        } else {
            stars += '<i class="far fa-star"></i>'; 
        }
    }
    return stars;
}

function getDefaultStarRating() {
    return '<i class="fas fa-star"></i>'.repeat(5); 
}

function renderPaginationSearch(currentSearchPage) {
    paginationSearchContainer.querySelectorAll('.pagination-button').forEach(button => button.remove());

    for (let i = 1; i <= MAX_PAGES; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        if (i === currentSearchPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            renderSearchBooks(i).then(addSearchBookCardEventListener);
            currentSearchPage = i;
        });
        nextPageSearchButton.before(button);
    }

    prevPageSearchButton.disabled = currentSearchPage === 1;
    nextPageSearchButton.disabled = currentSearchPage === MAX_PAGES;
}

function navigateSearchCard(currentIndex, direction) {
    const cards = Array.from(containerSearch.querySelectorAll('.book-card'));
    const newIndex = (currentIndex + direction + cards.length) % cards.length;
    const nextCard = cards[newIndex];
    const containerRect = containerSearch.getBoundingClientRect();
    const cardRect = nextCard.getBoundingClientRect();
    const scrollX = cardRect.left - containerRect.left + containerSearch.scrollLeft;
    containerSearch.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

function searchBooks(query) {
    searchQuery = query ? `intitle:${query}` : 'subject:fiction';
    renderSearchBooks(1).then(addSearchBookCardEventListener);
}

prevPageSearchButton.addEventListener('click', () => {
    if (currentSearchPage > 1) {
        currentSearchPage--;
        renderSearchBooks(currentSearchPage).then(addSearchBookCardEventListener);
    }
});

nextPageSearchButton.addEventListener('click', () => {
    if (currentSearchPage < MAX_PAGES) {
        currentSearchPage++;
        renderSearchBooks(currentSearchPage).then(addSearchBookCardEventListener);
    }
});

searchBooksButton.addEventListener('click', () => {
    searchBooks(searchInput.value);
});

window.addEventListener('resize', () => {
    renderSearchBooks(currentSearchPage).then(addSearchBookCardEventListener);
});

renderSearchBooks();
renderSearchBooks(currentSearchPage); 

/*=============== SEARCH BOOKS BY CATEGORY SECTION API ===============*/
const containerCategory = document.getElementById('bookCategoryContainer');
const paginationCategoryContainer = document.getElementById('paginationCategoryContainer');
const prevPageCategoryButton = document.getElementById('prevPageCategory');
const nextPageCategoryButton = document.getElementById('nextPageCategory');
const categoryListContainer = document.getElementById('category-list');

let currentCategoryPage = 1;
let currentCategoryBooks = [];
let categoryQuery = 'subject:fiction';
let selectedCategory = '';

const categories = [
    { name: 'Poetry', id: 'poetry' },
    { name: 'Mystery', id: 'mystery' },
    { name: 'Classics', id: 'classics' },
    { name: 'Crime', id: 'crime' },
    { name: 'Religion', id: 'religion' },
    { name: 'Fantasy', id: 'fantasy' },
    { name: 'Horror', id: 'horror' },
    { name: 'History', id: 'history' },
    { name: 'Thriller', id: 'thriller' },
    { name: 'Martial Art', id: 'martial-art' },
    { name: 'Comedy', id: 'comedy' },
    { name: 'Health', id: 'health' },
    { name: 'Business', id: 'business' },
    { name: 'Detective', id: 'detective' },
    { name: 'War', id: 'war' },
    { name: 'Romance', id: 'romance' },
    { name: 'Plays', id: 'plays' },
    { name: 'Novel', id: 'novel' },
    { name: 'Science fiction', id: 'science fiction' }
];

function getMaxResults() {
    return window.innerWidth <= 480 ? MAX_RESULTS_SMALL_SCREEN : MAX_RESULTS_LARGE_SCREEN;
}

async function fetchCategoryBooks(page) {
    const startIndex = (page - 1) * getMaxResults();
    const cquery = `${categoryQuery}${selectedCategory ? `+subject:${selectedCategory}` : ''}`;
    const fields = 'items(volumeInfo(title,authors,imageLinks/thumbnail,averageRating,pageCount,publisher,publishedDate,description),accessInfo(webReaderLink))';
    const response = await fetch(`${API_URL}?q=${cquery}&orderBy=newest&startIndex=${startIndex}&maxResults=${getMaxResults()}&fields=${fields}`);
    if (!response.ok) {
        console.error('Failed to fetch books:', response.status, response.statusText);
        return [];
    }
    const data = await response.json();
    currentCategoryBooks = data.items || [];
    return currentCategoryBooks;
}

async function renderCategoryBooks(page) {
    const books = await fetchCategoryBooks(page);
    containerCategory.innerHTML = ''; 

    books.forEach((book, index) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const rating = book.volumeInfo.averageRating ? getStarRating(book.volumeInfo.averageRating) : getDefaultStarRating();
        const imageURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'No Image';
        const pageCount = book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'Page count not available';
        const downloadLink = book.accessInfo && book.accessInfo.webReaderLink ? `<a href="${book.accessInfo.webReaderLink}" target="_blank" class="button">Read</a>` : 'No download link available';
        

        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <img src="${imageURL}" alt="${title}">
            <div class="book-details">
                <h2>${title}</h2>
                <p>Author: ${authors}</p>
                <p>${pageCount}</p>
                <div class="rating">${rating}</div>
                ${downloadLink}
                ${window.innerWidth <= 480 ? `
                <button class="book-arrow left" onclick="navigateCategoryCard(${index}, -1)"><i class="fas fa-chevron-left"></i></button>
                <button class="book-arrow right" onclick="navigateCategoryCard(${index}, 1)"><i class="fas fa-chevron-right"></i></button>` : ''}
            </div>
        `;
        card.addEventListener('click', () => showBookDetails(book)); 
        containerCategory.appendChild(card);
    });

    renderPaginationCategory(page);
}

function getStarRating(averageRating) {
    const rating = Math.round(averageRating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>'; 
        } else {
            stars += '<i class="far fa-star"></i>'; 
        }
    }
    return stars;
}

function getDefaultStarRating() {
    return '<i class="fas fa-star"></i>'.repeat(5); 
}

function renderPaginationCategory(currentCategoryPage) {
    paginationCategoryContainer.querySelectorAll('.pagination-button').forEach(button => button.remove());

    for (let i = 1; i <= MAX_PAGES; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        if (i === currentCategoryPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            renderCategoryBooks(i).then(addCategoryBookCardEventListeners); 
            currentCategoryPage = i;
        });
        nextPageCategoryButton.before(button);
    }

    prevPageCategoryButton.disabled = currentCategoryPage === 1;
    nextPageCategoryButton.disabled = currentCategoryPage === MAX_PAGES;
}

function navigateCategoryCard(currentIndex, direction) {
    const cards = Array.from(containerCategory.querySelectorAll('.book-card'));
    const newIndex = (currentIndex + direction + cards.length) % cards.length;
    const nextCard = cards[newIndex];
    const containerRect = containerCategory.getBoundingClientRect();
    const cardRect = nextCard.getBoundingClientRect();
    const scrollX = cardRect.left - containerRect.left + containerCategory.scrollLeft;
    containerCategory.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

function categoryBooks() {
    renderCategoryBooks(1).then(addCategoryBookCardEventListeners); 
}

function renderCategories() {
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.innerText = category.name;
        categoryElement.addEventListener('click', () => {
            selectedCategory = category.id;
            categoryBooks();
        });
        categoryListContainer.appendChild(categoryElement);
    });
}

prevPageCategoryButton.addEventListener('click', () => {
    if (currentCategoryPage > 1) {
        currentCategoryPage--;
        renderCategoryBooks(currentCategoryPage).then(addCategoryBookCardEventListeners); 
    }
});

nextPageCategoryButton.addEventListener('click', () => {
    if (currentCategoryPage < MAX_PAGES) {
        currentCategoryPage++;
        renderCategoryBooks(currentCategoryPage).then(addCategoryBookCardEventListeners); 
    }
});

window.addEventListener('resize', () => {
    renderCategoryBooks(currentCategoryPage).then(addCategoryBookCardEventListeners); 
});

renderCategories();
renderCategoryBooks(currentCategoryPage).then(addCategoryBookCardEventListeners); 

/*=============== BOOK DETAILS MODAL ===============*/
const modal = document.getElementById('bookModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show-modal');
    });
}

function showBookDetails(book) {
    const title = book.volumeInfo.title;
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
    const description = book.volumeInfo.description || 'No description available';
    const publisher = book.volumeInfo.publisher || 'Unknown publisher';
    const publishedDate = book.volumeInfo.publishedDate || 'Unknown published date';
    const imageURL = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'No Image';
    const pageCount = book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'Page count not available';
    const rating = book.volumeInfo.averageRating ? getStarRating(book.volumeInfo.averageRating) : getDefaultStarRating();
    const downloadLink = book.accessInfo && book.accessInfo.webReaderLink ? `<a href="${book.accessInfo.webReaderLink}" target="_blank" class="button">Read</a>` : 'No download link available';

    modalContent.innerHTML = `
        <span class="modal-close" id="modalClose">&times;</span>
        <div class="modal-book-card">
            <img src="${imageURL}" alt="${title}">
            <div class="modal-book-details">
                <h2>${title}</h2>
                <p><strong>Author:</strong> ${authors}</p>
                <p><strong>Publisher:</strong> ${publisher}</p>
                <p><strong>Published Date:</strong> ${publishedDate}</p>
                <p><strong>Page Count:</strong> ${pageCount}</p>
                <p><strong>Description:</strong> ${description}</p>
                <div class="rating">${rating}</div>
                ${downloadLink}
            </div>
        </div>
    `;

    document.getElementById('modalClose').addEventListener('click', () => {
        modal.classList.remove('show-modal');
    });

    modal.classList.add('show-modal');
}

function addCategoryBookCardEventListeners() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showBookDetails(currentCategoryBooks[index]);
        });
    });
}

function addSearchBookCardEventListeners() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showBookDetails(currentSearchBooks[index]);
        });
    });
}

function addFeaturedBookCardEventListeners() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showBookDetails(currentSearchBooks[index]);
        });
    });
}

function addNewBookCardEventListeners() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showBookDetails(currentSearchBooks[index]);
        });
    });
}

renderCategoryBooks(currentCategoryPage).then(addCategoryBookCardEventListeners);
renderSearchBooks(currentSearchPage).then(addSearchBookCardEventListeners);
renderFeaturedBooks(currentPageFeatured).then(addFeaturedBookCardEventListeners);
renderBooks(currentPage).then(addNewBookCardEventListeners);





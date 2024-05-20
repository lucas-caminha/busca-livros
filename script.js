document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('bookQuery').value;
    searchBooks(query);
});

function searchBooks(query) {
    searchGoogleBooks(query);
    //searchAmazonBooks(query);
}

function searchGoogleBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items, 'Google Books');
        })
        .catch(error => {
            console.error('Erro ao buscar livros no Google:', error);
        });
}

function searchAmazonBooks(query) {
    const url = `https://webservices.amazon.com/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&SearchIndex=Books&Keywords=${encodeURIComponent(query)}&ResponseGroup=Images,ItemAttributes,Offers&AssociateTag=YOUR_ASSOCIATE_TAG&AWSAccessKeyId=YOUR_ACCESS_KEY&Timestamp=${encodeURIComponent(new Date().toISOString())}&Signature=YOUR_SIGNATURE`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const items = xmlDoc.getElementsByTagName('Item');
            displayAmazonResults(items);
        })
        .catch(error => {
            console.error('Erro ao buscar livros na Amazon:', error);
        });
}

function displayResults(books, source) {
    const resultsDiv = document.getElementById('results');

    if (books && books.length > 0) {
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book row';

            const title = book.volumeInfo.title || 'Título não disponível';
            const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autores não disponíveis';
            const description = book.volumeInfo.description || 'Descrição não disponível';
            const infoLink = book.volumeInfo.infoLink || '#';

            let price = 'Preço não disponível';
            if (book.saleInfo && book.saleInfo.listPrice) {
                price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}`;
            }

            const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x193?text=Sem+Imagem';

            bookDiv.innerHTML = `
                <div class="col-md-2">
                    <img src="${thumbnail}" class="img-fluid" alt="${title}">
                </div>
                <div class="col-md-10">
                    <h2>${title}</h2>
                    <p><strong>Autores:</strong> ${authors}</p>
                    <p><strong>Preço:</strong> ${price}</p>
                    <p>${description}</p>
                    <p><a href="${infoLink}" class="btn btn-primary" target="_blank">Mais informações</a></p>
                    <p><em>Fonte: ${source}</em></p>
                </div>
            `;

            resultsDiv.appendChild(bookDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>Nenhum livro encontrado.</p>';
    }
}

function displayAmazonResults(items) {
    const resultsDiv = document.getElementById('results');

    if (items && items.length > 0) {
        Array.from(items).forEach(item => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book row';

            const title = item.getElementsByTagName('Title')[0].textContent || 'Título não disponível';
            const authors = item.getElementsByTagName('Author')[0] ? item.getElementsByTagName('Author')[0].textContent : 'Autores não disponíveis';
            const price = item.getElementsByTagName('FormattedPrice')[0] ? item.getElementsByTagName('FormattedPrice')[0].textContent : 'Preço não disponível';
            const infoLink = item.getElementsByTagName('DetailPageURL')[0] ? item.getElementsByTagName('DetailPageURL')[0].textContent : '#';
            const thumbnail = item.getElementsByTagName('MediumImage')[0] ? item.getElementsByTagName('MediumImage')[0].getElementsByTagName('URL')[0].textContent : 'https://via.placeholder.com/128x193?text=Sem+Imagem';

            bookDiv.innerHTML = `
                <div class="col-md-2">
                    <img src="${thumbnail}" class="img-fluid" alt="${title}">
                </div>
                <div class="col-md-10">
                    <h2>${title}</h2>
                    <p><strong>Autores:</strong> ${authors}</p>
                    <p><strong>Preço:</strong> ${price}</p>
                    <p><a href="${infoLink}" class="btn btn-primary" target="_blank">Mais informações</a></p>
                    <p><em>Fonte: Amazon</em></p>
                </div>
            `;

            resultsDiv.appendChild(bookDiv);
        });
    } else {
        resultsDiv.innerHTML += '<p>Nenhum livro encontrado na Amazon.</p>';
    }
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('bookQuery').value;
    searchBooks(query);
});

function searchBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
        });
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Limpa resultados anteriores

    if (books && books.length > 0) {
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            const title = book.volumeInfo.title || 'Título não disponível';
            const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autores não disponíveis';
            const description = book.volumeInfo.description || 'Descrição não disponível';
            const infoLink = book.volumeInfo.infoLink || '#';

            let price = 'Preço não disponível';
            if (book.saleInfo && book.saleInfo.listPrice) {
                price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}`;
            }

            bookDiv.innerHTML = `
                <h2>${title}</h2>
                <p><strong>Autores:</strong> ${authors}</p>
                <p><strong>Preço:</strong> ${price}</p>
                <p>${description}</p>
                <p><a href="${infoLink}" class="btn btn-primary" target="_blank">Mais informações</a></p>
            `;

            resultsDiv.appendChild(bookDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>Nenhum livro encontrado.</p>';
    }
}

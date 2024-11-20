
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('createAccountForm').classList.add('hidden');
    document.getElementById('auth').classList.add('hidden');
});

document.getElementById('createAccountBtn').addEventListener('click', function() {
    document.getElementById('createAccountForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('auth').classList.add('hidden');
});

document.getElementById('guestBtn').addEventListener('click', function() {
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('search').classList.remove('hidden');
    document.getElementById('auth').classList.add('hidden');
});

document.getElementById('submitLogin').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple client-side validation
    if (email && password) {
        alert('Login successful!');
        document.getElementById('quiz').classList.remove('hidden');
        document.getElementById('search').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    } else {
        alert('Please enter both email and password.');
    }
});

document.getElementById('submitCreateAccount').addEventListener('click', function() {
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;

    // Simple client-side validation
    if (email && password) {
        alert('Account created successfully!');
        document.getElementById('quiz').classList.remove('hidden');
        document.getElementById('search').classList.remove('hidden');
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('createAccountForm').classList.add('hidden');
    } else {
        alert('Please enter both email and password.');
    }
});

document.getElementById('quiz').querySelector('button').addEventListener('click', function() {
    document.getElementById('quizForm').classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');
});

document.getElementById('submitQuiz').addEventListener('click', function() {
    const favoriteArtist = document.getElementById('favoriteArtist').value;
    const favoriteGenre = document.getElementById('favoriteGenre').value;
    const lastArtist = document.getElementById('lastArtist').value;

    if (favoriteArtist && favoriteGenre && lastArtist) {
        const recommendedSongs = recommendSongs(favoriteArtist, favoriteGenre, lastArtist);
        displayRecommendations(recommendedSongs);
        document.getElementById('quizForm').classList.add('hidden');
    } else {
        alert('Please answer all the questions.');
    }
});

function recommendSongs(artist, genre, lastArtist) {
    const songs = [
        { title: "Song 1", artist: "Artist A", genre: "Genre A" },
        { title: "Song 2", artist: "Artist B", genre: "Genre B" },
        { title: "Song 3", artist: "Artist C", genre: "Genre C" },
        { title: "Song 4", artist: "Artist D", genre: "Genre D" },
    ];

    return songs.filter(song => 
        song.artist.toLowerCase().includes(artist.toLowerCase()) || 
        song.genre.toLowerCase().includes(genre.toLowerCase()) ||
        song.artist.toLowerCase().includes(lastArtist.toLowerCase())
    );
}

function displayRecommendations(songs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = `${song.title} by ${song.artist} [${song.genre}]`;
        songList.appendChild(li);
    });

    document.getElementById('recommendations').classList.remove('hidden');
}

// Search Functions (Jaskomal) -----------------------------------------------------------------------
document.getElementById('search').querySelector('button').addEventListener('click', function() {
    document.getElementById('searchForm').classList.remove('hidden');
    document.getElementById('search').classList.add('hidden');
    document.getElementById('quiz').classList.add('hidden');
});

function searchCSV() {
    const query = document.getElementById('query').value;

    if (query) {
        document.getElementById('results').classList.remove('hidden');
        // Make a GET request to the server-side (server.js) with the query as a URL parameter
    fetch(`/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Clear any previous results

        if (data.length > 0) {
            data.forEach(row => {
                // Create a card for each result
                const card = document.createElement('div');
                card.className = 'result-card';

                // Add a title for the result cards (the track name)
                const title = document.createElement('h3');
                //title.textContent = row.name || 'Result';
                title.textContent = row.track_name || 'Result';
                card.appendChild(title);

                // Add each key-value pair in the row as a paragraph in the card
                Object.entries(row).forEach(([key, value]) => {
                    if (key == 'artists') {
                        const info = document.createElement('p');
                        info.innerHTML = `<strong>Artist/s</strong>: ${value}`;
                        card.appendChild(info);
                    }
                    else if (key == 'album_name') {
                        const info = document.createElement('p');
                        info.innerHTML = `<strong>Album</strong>: ${value}`;
                        card.appendChild(info);
                    }
                    else if (key == 'track_genre') {
                        const info = document.createElement('p');
                        info.innerHTML = `<strong>Genre</strong>: ${value}`;
                        card.appendChild(info);
                    }
                });

                // Add the card to the results container
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = '<p>No matches found. Try entering something else</p>';

        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    }
    else {
        window.alert("Please enter a search query");
    }
}

// Search Functions (Jaskomal) end -----------------------------------------------------------------------
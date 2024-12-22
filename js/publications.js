document.addEventListener("DOMContentLoaded", function() {
    // Replace 'xyz' with your DBLP author ID
    const authorId = "286/4095"; // Replace with actual DBLP author ID
    
    // Fetch publications in JSON format from DBLP API
    fetch(`https://dblp.uni-trier.de/pid/${authorId}/publications.json`)
        .then(response => response.json())
        .then(data => {
            const publicationsList = document.getElementById('publications-list');
            
            // Check if publications exist
            if (data.result && data.result.hits && data.result.hits.hit.length > 0) {
                data.result.hits.hit.forEach(publication => {
                    const li = document.createElement('li');
                    const title = publication.info.title;
                    const year = publication.info.year;
                    const journal = publication.info.journal || 'N/A'; // Some publications might not have journal info
                    
                    li.innerHTML = `<a href="${publication.info.url}" target="_blank"><strong>${title}</strong> (${year}) - ${journal}</a>`;
                    publicationsList.appendChild(li);
                });
            } else {
                // If no publications are found, display a message
                publicationsList.innerHTML = "<p>No publications found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching data from DBLP: ", error);
            const publicationsList = document.getElementById('publications-list');
            publicationsList.innerHTML = "<p>Error fetching publications.</p>";
        });
});

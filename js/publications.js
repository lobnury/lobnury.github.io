document.addEventListener("DOMContentLoaded", function() {
    // Replace '389/4542' with your actual DBLP author ID
    const authorId = "286/4095";  // Example author ID
    
    // Fetch the XML data for the author
    fetch(`https://dblp.org/pid/${authorId}.xml`)
        .then(response => response.text())  // Get the raw XML response as text
        .then(xmlString => {
            const parser = new DOMParser();  // Create a new DOMParser to parse the XML
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Extract publications ('r' tags) from the XML
            const publicationsList = document.getElementById('publications-list');
            const publications = xmlDoc.getElementsByTagName('r');

            // Check if there are any publications
            if (publications.length > 0) {
                Array.from(publications).forEach(pub => {
                    // Handle 'inproceedings' (or 'article' if present)
                    const inproceedings = pub.getElementsByTagName('inproceedings')[0];

                    if (inproceedings) {
                        const title = inproceedings.getElementsByTagName('title')[0]?.textContent || 'No title available';
                        const year = inproceedings.getElementsByTagName('year')[0]?.textContent || 'No year available';
                        const booktitle = inproceedings.getElementsByTagName('booktitle')[0]?.textContent || 'N/A';
                        const url = inproceedings.getElementsByTagName('url')[0]?.textContent || '#';

                        // Create a new list item for each publication
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="${url}" target="_blank"><strong>${title}</strong> (${year}) - ${booktitle}</a>`;
                        publicationsList.appendChild(li);
                    }
                });
            } else {
                // If no publications found, display a message
                publicationsList.innerHTML = "<p>No publications found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching or parsing data from DBLP: ", error);
            document.getElementById('publications-list').innerHTML = "<p>Error fetching publications.</p>";
        });
});

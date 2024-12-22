document.addEventListener("DOMContentLoaded", function() {
    // Replace '389/4542' with your actual DBLP author ID
    const authorId = "286/4095";  // Example author ID
    
    // Fetch the XML data for the author
    fetch(`https://dblp.org/pid/${authorId}.xml`)
        .then(response => response.text())  // Get the raw XML response as text
        .then(xmlString => {
            const parser = new DOMParser();  // Create a new DOMParser to parse the XML
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Extract the author information (name, pid, number of publications)
            const dblpPerson = xmlDoc.getElementsByTagName('dblpperson')[0];
            const authorName = dblpPerson.getAttribute('name') || 'Unknown Author';
            const authorPid = dblpPerson.getAttribute('pid');
            const numPublications = dblpPerson.getAttribute('n');

            // Display author name and number of publications
            document.getElementById('author-name').textContent = authorName;
            document.getElementById('author-pid').textContent = `DBLP ID: ${authorPid}`;
            document.getElementById('num-publications').textContent = `Number of Publications: ${numPublications}`;

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

            // Extract and display co-authors (from 'coauthors' tag)
            const coauthorsList = document.getElementById('coauthors-list');
            const coauthors = dblpPerson.getElementsByTagName('coauthors');
            if (coauthors.length > 0) {
                const coauthorsData = coauthors[0].getElementsByTagName('co');
                if (coauthorsData.length > 0) {
                    Array.from(coauthorsData).forEach(coauthor => {
                        const coauthorName = coauthor.getElementsByTagName('na')[0]?.textContent || 'No name available';
                        const coauthorPid = coauthor.getAttribute('pid') || 'N/A';
                        const coauthorLink = `https://dblp.org/pid/${coauthorPid}`;
                        
                        const coauthorItem = document.createElement('li');
                        coauthorItem.innerHTML = `<a href="${coauthorLink}" target="_blank">${coauthorName}</a>`;
                        coauthorsList.appendChild(coauthorItem);
                    });
                } else {
                    coauthorsList.innerHTML = "<p>No co-authors found.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Error fetching or parsing data from DBLP: ", error);
            document.getElementById('publications-list').innerHTML = "<p>Error fetching publications.</p>";
            document.getElementById('coauthors-list').innerHTML = "<p>Error fetching co-authors.</p>";
        });
});

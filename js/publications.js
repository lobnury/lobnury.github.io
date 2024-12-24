document.addEventListener("DOMContentLoaded", function() {
    // Replace '389/4542' with your actual DBLP author ID
    const authorId = "389/4542";  // Example author ID
    
    // Fetch the XML data for the author from DBLP
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
                // Create table structure
                const table = document.createElement('table');
                table.setAttribute('class', 'publications-table');

                // Add table headers
                const headerRow = table.insertRow();
                headerRow.innerHTML = `
                    <th>Title</th>
                    <th>Booktitle</th>
                    <th>Cite</th>
                `;

                Array.from(publications).forEach(pub => {
                    // Handle 'inproceedings' (or 'article' if present)
                    const inproceedings = pub.getElementsByTagName('inproceedings')[0];
                    const article = pub.getElementsByTagName('article')[0];

                    let title, booktitle, key, doiUrl;

                    if (inproceedings) {
                        // If it's an inproceedings publication
                        title = inproceedings.getElementsByTagName('title')[0]?.textContent || 'No title available';
                        booktitle = inproceedings.getElementsByTagName('booktitle')[0]?.textContent || 'N/A';
                        key = inproceedings.getAttribute('key');
                        // Try to extract the DOI URL from the 'ee' or 'url' field
                        doiUrl = inproceedings.getElementsByTagName('ee')[0]?.textContent || '';
                    } else if (article) {
                        // If it's an article publication
                        title = article.getElementsByTagName('title')[0]?.textContent || 'No title available';
                        booktitle = article.getElementsByTagName('journal')[0]?.textContent || 'N/A';
                        key = article.getAttribute('key');
                        // Try to extract the DOI URL from the 'ee' or 'url' field
                        doiUrl = article.getElementsByTagName('ee')[0]?.textContent || '';
                    }

                    // Create a new row for each publication
                    const row = table.insertRow();
                    row.innerHTML = `
                        <td><a href="${doiUrl}" target="_blank">${title}</a></td>
                        <td>${booktitle}</td>
                        <td><a href="https://dblp.org/rec/${key}.xml" download>Download BibTeX</a></td>
                    `;
                });

                // Append the table to the publications section
                publicationsList.appendChild(table);
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

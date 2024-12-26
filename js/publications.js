document.addEventListener("DOMContentLoaded", function () {
    //const authorId = "389/4542"; // Replace with your DBLP Author ID
    const authorId = "286/4095"; // Replace with your DBLP Author ID
    const dblpUrl = `https://dblp.org/pid/${authorId}.xml`;

    // Fetch and parse DBLP XML
    fetch(dblpUrl)
        .then(response => response.text())  // Get the raw XML response as text
        .then(xmlString => {
            const parser = new DOMParser();  // Create a new DOMParser to parse the XML
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const dblpPerson = xmlDoc.getElementsByTagName("dblpperson")[0];

            const publications = dblpPerson.getElementsByTagName("r");
            const publicationsTable = document.querySelector("#publications-table tbody");

            // Check if there are any publications
            if (publications.length > 0) {
                Array.from(publications).forEach(pub => {

                    // Handle 'inproceedings' (or 'article' if present)
                    const inproceedings = pub.getElementsByTagName('inproceedings')[0];
                    const article = pub.getElementsByTagName('article')[0];

                    let title, booktitle, key, doiUrl, year;

                    if (inproceedings) {
                        // If it's an inproceedings publication
                        title = inproceedings.getElementsByTagName('title')[0]?.textContent || 'No title available';
                        booktitle = inproceedings.getElementsByTagName('booktitle')[0]?.textContent || 'N/A';
                        key = inproceedings.getAttribute('key');
                        year = inproceedings.getElementsByTagName('year')[0]?.textContent || 'N/A';
                        // Try to extract the DOI URL from the 'ee' or 'url' field
                        doiUrl = inproceedings.getElementsByTagName('ee')[0]?.textContent || '';
                    } else if (article) {
                        // If it's an article publication
                        title = article.getElementsByTagName('title')[0]?.textContent || 'No title available';
                        booktitle = article.getElementsByTagName('journal')[0]?.textContent || 'N/A';
                        key = article.getAttribute('key');
                        year = article.getElementsByTagName('year')[0]?.textContent || 'N/A';
                        // Try to extract the DOI URL from the 'ee' or 'url' field
                        doiUrl = article.getElementsByTagName('ee')[0]?.textContent || '';
                    }

                    if(booktitle.toLowerCase() == "corr"){
                        booktitle = "arXiv"
                    }

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><a href="${doiUrl}" download>${title}</a></td>
                        <td>${booktitle}</td>
                        <td>${year}</td>
                        <td><a href="https://dblp.org/rec/${key}.bib" download><img class="bibtex-icon" src="assets/icons/bibtex-1.png" alt="Download BibTeX"></a></td>
                    `;
                    publicationsTable.appendChild(row);
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

    // Add more dynamic sections like Teaching & Supervision if needed
    //----------------------------------------------------------------//
});

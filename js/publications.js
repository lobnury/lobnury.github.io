document.addEventListener("DOMContentLoaded", function() {
    // Replace '286/4095' with your actual DBLP author ID
    const authorId = "286/4095";  // Example ID from DBLP
    
    // Fetch publications in XML format from DBLP API
    fetch(`https://dblp.org/pid/${authorId}.xml`)
        .then(response => response.text())  // Get the raw XML response as text
        .then(xmlString => {
            const parser = new DOMParser();  // Create a new DOMParser to parse the XML
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Extract all publication entries from the XML document
            const publicationsList = document.getElementById('publications-list');
            const publications = xmlDoc.getElementsByTagName('publication');
            
            // Check if publications exist
            if (publications.length > 0) {
                Array.from(publications).forEach(pub => {
                    // Extract the title, year, and type of publication
                    const title = pub.getElementsByTagName('title')[0]?.textContent || 'No title available';
                    const year = pub.getElementsByTagName('year')[0]?.textContent || 'No year available';
                    const type = pub.getElementsByTagName('type')[0]?.textContent || 'Unknown type';
                    
                    // Extract the journal or booktitle based on the type of publication
                    let publicationSource = '';
                    if (type === 'article') {
                        publicationSource = pub.getElementsByTagName('journal')[0]?.textContent || 'N/A';
                    } else if (type === 'inproceedings') {
                        publicationSource = pub.getElementsByTagName('booktitle')[0]?.textContent || 'N/A';
                    }

                    // Extract the URL
                    const url = pub.getElementsByTagName('url')[0]?.textContent || '#'; // Fallback URL if missing

                    // Create a new list item for each publication
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${url}" target="_blank"><strong>${title}</strong> (${year}) - ${publicationSource}</a>`;
                    publicationsList.appendChild(li);
                });
            } else {
                // If no publications found, display a message
                publicationsList.innerHTML = "<p>No publications found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching or parsing data from DBLP: ", error);
            const publicationsList = document.getElementById('publications-list');
            publicationsList.innerHTML = "<p>Error fetching publications.</p>";
        });
});

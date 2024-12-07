document.getElementById('submitBtn').addEventListener('click', async () => {
    const service = document.getElementById('serviceSelect').value;
    const address = document.getElementById('addressInput').value;

    if (!address) {
        alert('Please enter an address.');
        return;
    }

    try {
        // Make a request to the backend to get the sorted addresses and distances
        const response = await fetch(`http://174.129.26.14:8000/getSortedAddresses?address=${encodeURIComponent(address)}`);
        const data = await response.json();

        // Populate the results table
        const tableBody = document.getElementById('table_body');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.service}</td>
                <td>${result.address}, ${result.city}, ${result.zipcode}</td>
                <td>${result.distance.toFixed(2)} km</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred. Please try again later.');
    }
});
   
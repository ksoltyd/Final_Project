// Initialize Google Maps Auto-Complete
function initAutocomplete() {
    // Get the input element for address (AutoComplete)
    const input = document.getElementById('autocomplete');
    
    // Initialize Google Maps Autocomplete with the input element
    const autocomplete = new google.maps.places.Autocomplete(input);

    // Event listener when a place is selected
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();

        // Check if the returned place contains geometry data
        if (!place.geometry) {
            console.error('Returned place contains no geometry');
            return;
        }
        
        // Get the selected address and its latitude and longitude
        const address = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Optionally, display the selected address and coordinates
        console.log(`Address: ${address}`);
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        // Now, when the user selects an address, we will fetch sorted results
        fetchSortedAddresses(address);
    });
}

// Function to fetch sorted addresses and display them in the table
async function fetchSortedAddresses(address) {
    const service = document.getElementById('serviceSelect').value;

    if (!address) {
        alert('Please select a valid address.');
        return;
    }

    try {
        // Make a request to the backend to get the sorted addresses and distances
        const response = await fetch(`https://github.com/ksoltyd/Final_Project/blob/main/app.js?address=${encodeURIComponent(address)}&service=${encodeURIComponent(service)}`);
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
}

// Event listener for the submit button
document.getElementById('submitBtn').addEventListener('click', async () => {
    // Get the address from the Auto-Complete input field (now it's `autocomplete` instead of `addressInput`)
    const address = document.getElementById('autocomplete').value;

    if (!address) {
        alert('Please enter an address.');
        return;
    }

    // Trigger fetching sorted addresses
    await fetchSortedAddresses(address);
});

// Initialize Auto-Complete on page load
window.onload = initAutocomplete;

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
   

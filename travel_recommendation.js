let searchTerm = '';
const btnClear = document.getElementById('btnClear');
const btnSearch = document.getElementById('btnSearch');
const resultDiv = document.getElementById('result');
const body = document.querySelectorAll('.home-page-body')[0];

const timezones = {
    'Sydney, Australia': 'Australia/Sydney',
    'Melbourne, Australia': 'Australia/Melbourne',
    'Tokyo, Japan': 'Asia/Tokyo',
    'Kyoto, Japan': 'Asia/Tokyo',
    'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
    'São Paulo, Brazil': 'America/Sao_Paulo',
    'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
    'Taj Mahal, India': 'Asia/Kolkata',
    'Bora Bora, French Polynesia': 'Pacific/Tahiti',
    'Copacabana Beach, Brazil': 'America/Sao_Paulo',
};

const destinationCard = (destination) => `
    <div class="destination-item" id="destination-item--${destination.id}">
        <div class="destination-item-image"><img src=${destination.imageUrl} /></div>
        <div class="destination-item-title"><h3>${destination.name}</h3></div>
        <div class="destination-item-summary"><p>${destination.description}</p></div>
        <div class="destination-item-time">
            <p>Current time in ${destination.name.split(',')[0].trim()}: 
            ${new Date().toLocaleTimeString('en-US', { timeZone: timezones[destination.name], hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' })}
            </p>
        </div>
    </div> 
`;

function clearDestinations() {
    document.getElementById('keywordInput').value = '';
    resultDiv.innerHTML = '';
    resultDiv.classList.add('hidden');
    body.classList.remove('hidden');
}

function searchDestinations() {
    const input = document.getElementById('keywordInput').value.toLowerCase().trim();

    if (!input) {
        clearDestinations();
        searchTerm = '';
        return;
    }

    searchTerm = pluralize.isPlural(input) ? input : pluralize(input, 2);
    resultDiv.classList.remove('hidden');
    body.classList.add('hidden');
    resultDiv.innerHTML = '<h2>Searching...</h2>';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const destinations = data[searchTerm];

            if (destinations?.length > 0) {
                if (searchTerm === 'countries') {
                  resultDiv.innerHTML = '';
                    destinations.forEach(country => {
                        resultDiv.innerHTML += country.cities.map(destinationCard).join('');
                      });
                } else {
                  items = destinations;
                  resultDiv.innerHTML = items.map(destinationCard).join('');
                }
            } else {
                const match = data['countries'].filter(d => d.name.toLowerCase() === pluralize(searchTerm, 1));
                resultDiv.innerHTML = match?.length > 0
                    ? match[0].cities.map(destinationCard).join('')
                    : '<h2>No destinations found</h2>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<h2>An error occurred while fetching data.</h2>';
        });
}

btnClear.addEventListener('click', clearDestinations);
btnSearch.addEventListener('click', searchDestinations);
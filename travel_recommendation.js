let searchTerm = '';
const btnClear = document.getElementById('btnClear');
const btnSearch = document.getElementById('btnSearch');
const resultDiv = document.getElementById('result');
const body = document.querySelectorAll('.home-page-body')[0];

const destinationCard = (destination) => `
    <div class="destination-item" id="destination-item--${destination.id}">
        <div class="destination-item-image"><img src=${destination.imageUrl} /></div>
        <div class="destination-item-title"><h3>${destination.name}</h3></div>
        <div class="destination-item-summary"><p>${destination.description}</p></div>
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
                const items = searchTerm === 'countries'
                    ? destinations.cities
                    : destinations;
                resultDiv.innerHTML = items.map(destinationCard).join('');
            } else {
                const match = destinations['countries']['cities'].filter(d => d.name === searchTerm);
                resultDiv.innerHTML = match?.length > 0
                    ? match.map(destinationCard).join('')
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
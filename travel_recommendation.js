btnSearch
btnClear
keywordInput

function clearDestinations() {
    document.getElementById('keywordInput').value = "";
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
}

function searchDestinations() {
    const input = document.getElementById('keywordInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {

        const destinations = data[input];

        

        if (destinations.length() > 0) {
            destinations.forEach(destination => {
                resultDiv.innerHTML += `
                    <div class="destination-item">
                        <div class="destination-item-image">
                        </div>
                        <div class="destination-item-title">
                        </div>
                        <div class="destination-item-summary">
                        </div>
                    </div>                
                `;
            });
        } else {
          resultDiv.innerHTML = 'No destinations found';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
  }

btnClear.addEventListener('click', clearDestinations);
btnSearch.addEventListener('click', searchDestinations);
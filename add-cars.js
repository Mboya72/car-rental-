const carForm = document.getElementById('car-form');
const availableCarsDiv = document.getElementById('available-cars');

// Fetch cars from the JSON server
async function fetchCars() {
    const response = await fetch('http://localhost:3000/add-cars');
    const data = await response.json();
    displayCars(data);
}

// Display cars in the UI
function displayCars(cars) {
    availableCarsDiv.innerHTML = ''; // Clear existing cars

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.make} ${car.model}">
            <h3>${car.make} ${car.model} (${car.year})</h3>
            <p>Price: $${car.price} per day</p>
            <button class="delete-button" data-id="${car.id}">Delete</button>
        `;
        availableCarsDiv.appendChild(carItem);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const carId = button.getAttribute('data-id');
            await deleteCar(carId);
        });
    });
}

// Handle car form submission
carForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value;

    const newCar = { make, model, year: Number(year), price: Number(price), image };

    // Send POST request to add a new car
    await fetch('http://localhost:3000/add-cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
    });

    // Reset the form
    carForm.reset();

    // Fetch the updated car list
    fetchCars();
});

// Function to delete a car
async function deleteCar(carId) {
    // Send DELETE request to remove the car
    await fetch(`http://localhost:3000/add-cars/${carId}`, {
        method: 'DELETE'
    });

    // Fetch the updated car list
    fetchCars();
}

// Fetch cars on page load
fetchCars();
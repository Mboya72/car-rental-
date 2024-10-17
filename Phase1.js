let cars = [];
let rentedCars = []; // Store rented cars

// Fetch car data from json file
async function fetchCars() {
    const response = await fetch('http://localhost:4000/cars');
    const data = await response.json();
    cars = data;
    displayCars();
}

// Function to display available cars
function displayCars() {
    const carList = document.getElementById('car-list');

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.make} ${car.model}">
            <h3>${car.make} ${car.model} (${car.year})</h3>
            <p>Price: $${car.price} per day</p>
        `;
        carList.appendChild(carItem);
    });

    populateCarSelect();
}

// Function to populate the car selection dropdown
function populateCarSelect() {
    const carSelect = document.getElementById('car-select');
    carSelect.innerHTML = '<option value="">Select a car</option>'; // Reset options

    cars.forEach(car => {
        // Checks if the car is already rented
        const isRented = rentedCars.some(rental => rental.car.id === car.id);
        if (!isRented) {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.make} ${car.model} (${car.year}) - $${car.price} per day`;
            carSelect.appendChild(option);
        }
    });
}

// Function to handle car rental
document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const carId = document.getElementById('car-select').value;

    const selectedCar = cars.find(car => car.id == carId);

    // Prevent renting an already rented car
    if (rentedCars.some(rental => rental.car.id === selectedCar.id)) {
        alert(`Sorry, the ${selectedCar.make} ${selectedCar.model} is already rented.`);
        return;
    }

    const rentalInfo = {
        car: selectedCar,
        location: location,
        startDate: startDate,
        endDate: endDate
    };

    rentedCars.push(rentalInfo); // Store rental info
    alert(`You have rented a ${selectedCar.make} ${selectedCar.model} from ${startDate} to ${endDate} at ${location}.`);
    document.getElementById('rental-form').reset(); // Reset form
    displayRentedCars(); // Update rented cars display
});

// Function to display currently rented cars
function displayRentedCars() {
    const rentedCarList = document.getElementById('rented-car-list');
    rentedCarList.innerHTML = ''; // Clear existing rentals

    rentedCars.forEach(rental => {
        const rentalItem = document.createElement('div');
        rentalItem.className = 'rental-item';
        rentalItem.innerHTML = `
            <h4>${rental.car.make} ${rental.car.model}</h4>
            <p>Rented at: ${rental.location}</p>
            <p>From: ${rental.startDate} To: ${rental.endDate}</p>
        `;
        rentedCarList.appendChild(rentalItem);
    });
}

// Fetch cars on page load
fetchCars();
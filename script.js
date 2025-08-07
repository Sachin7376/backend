function bookService(serviceName) {
    // Collect user input from the form
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const serviceSelect = document.getElementById('service');

    // Check if all fields are filled
    if (!name || !phone || !date || !time || !serviceSelect.value) {
        alert("Please fill out all fields before booking.");
        return;
    }

    // Prepare the booking data
    const bookingData = {
        name: name,
        phone: phone,
        service: serviceName,
        date: date,
        time: time
    };

    // Send booking data to the backend
    fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(`You have successfully booked the ${data.service} service!`);
        // Optionally, you can display the confirmation message or redirect the user
        document.getElementById('confirmationMessage').innerHTML = 
            `Thank you ${data.name}! Your ${data.service} appointment is confirmed for ${data.date} at ${data.time}.`;
        document.getElementById('appointmentForm').reset(); // Reset the form after booking
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error booking your appointment. Please try again later.');
    });
}
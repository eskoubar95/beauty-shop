# Beauty Shop

A simple beauty shop management system for managing services and appointments.

## Features

- Add and manage beauty services (haircut, manicure, facial, etc.)
- Book appointments for customers
- View all appointments
- Cancel appointments

## Installation

```bash
npm install
```

## Usage

```javascript
const BeautyShop = require('./index');

// Create a new beauty shop
const shop = new BeautyShop('Glamour Beauty Salon');

// Add services
shop.addService('Haircut', 50, 60);
shop.addService('Manicure', 30, 45);
shop.addService('Facial', 80, 90);

// Book an appointment
const appointment = shop.bookAppointment(
  'Jane Doe',
  'Haircut',
  new Date('2025-10-25T10:00:00')
);

// View all appointments
console.log(shop.getAppointments());

// Cancel an appointment
shop.cancelAppointment(appointment.id);
```

## API

### `new BeautyShop(name)`
Creates a new beauty shop instance.

### `addService(serviceName, price, duration)`
Adds a new service to the shop.

### `getServices()`
Returns all available services.

### `bookAppointment(customerName, serviceName, dateTime)`
Books an appointment for a customer.

### `getAppointments()`
Returns all appointments.

### `cancelAppointment(appointmentId)`
Cancels an appointment by ID.

## License

ISC

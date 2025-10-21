/**
 * Example usage of Beauty Shop
 */

const BeautyShop = require('./index');

// Create a new beauty shop
const shop = new BeautyShop('Glamour Beauty Salon');

console.log(`Welcome to ${shop.name}!\n`);

// Add services
console.log('Adding services...');
shop.addService('Haircut', 50, 60);
shop.addService('Manicure', 30, 45);
shop.addService('Pedicure', 35, 45);
shop.addService('Facial', 80, 90);
shop.addService('Hair Coloring', 120, 120);

// Display all services
console.log('\nAvailable Services:');
shop.getServices().forEach(service => {
  console.log(`- ${service.name}: $${service.price} (${service.duration} minutes)`);
});

// Book some appointments
console.log('\n\nBooking appointments...');
const apt1 = shop.bookAppointment('Jane Doe', 'Haircut', new Date('2025-10-25T10:00:00'));
console.log(`✓ Booked appointment #${apt1.id} for ${apt1.customerName} - ${apt1.service.name}`);

const apt2 = shop.bookAppointment('Alice Smith', 'Facial', new Date('2025-10-25T14:00:00'));
console.log(`✓ Booked appointment #${apt2.id} for ${apt2.customerName} - ${apt2.service.name}`);

const apt3 = shop.bookAppointment('Bob Johnson', 'Manicure', new Date('2025-10-26T11:00:00'));
console.log(`✓ Booked appointment #${apt3.id} for ${apt3.customerName} - ${apt3.service.name}`);

// Display all appointments
console.log('\n\nScheduled Appointments:');
shop.getAppointments().forEach(apt => {
  console.log(`#${apt.id}: ${apt.customerName} - ${apt.service.name} at ${apt.dateTime.toLocaleString()} [${apt.status}]`);
});

// Cancel an appointment
console.log('\n\nCancelling appointment #2...');
shop.cancelAppointment(2);
console.log('✓ Appointment cancelled');

// Display updated appointments
console.log('\nUpdated Appointments:');
shop.getAppointments().forEach(apt => {
  console.log(`#${apt.id}: ${apt.customerName} - ${apt.service.name} at ${apt.dateTime.toLocaleString()} [${apt.status}]`);
});

console.log('\n\nThank you for using Beauty Shop!');

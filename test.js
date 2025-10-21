/**
 * Simple tests for Beauty Shop
 */

const BeautyShop = require('./index');

function testAddService() {
  const shop = new BeautyShop('Test Shop');
  const service = shop.addService('Haircut', 50, 60);
  
  if (service.name !== 'Haircut') {
    throw new Error('Service name mismatch');
  }
  if (service.price !== 50) {
    throw new Error('Service price mismatch');
  }
  if (service.duration !== 60) {
    throw new Error('Service duration mismatch');
  }
  
  const services = shop.getServices();
  if (services.length !== 1) {
    throw new Error('Services count mismatch');
  }
  
  console.log('✓ testAddService passed');
}

function testBookAppointment() {
  const shop = new BeautyShop('Test Shop');
  shop.addService('Manicure', 30, 45);
  
  const appointment = shop.bookAppointment(
    'Jane Doe',
    'Manicure',
    new Date('2025-10-25T14:00:00')
  );
  
  if (appointment.customerName !== 'Jane Doe') {
    throw new Error('Customer name mismatch');
  }
  if (appointment.service.name !== 'Manicure') {
    throw new Error('Service name mismatch');
  }
  if (appointment.status !== 'scheduled') {
    throw new Error('Appointment status mismatch');
  }
  
  const appointments = shop.getAppointments();
  if (appointments.length !== 1) {
    throw new Error('Appointments count mismatch');
  }
  
  console.log('✓ testBookAppointment passed');
}

function testBookAppointmentServiceNotFound() {
  const shop = new BeautyShop('Test Shop');
  
  try {
    shop.bookAppointment('John Doe', 'Nonexistent Service', new Date());
    throw new Error('Should have thrown error for nonexistent service');
  } catch (error) {
    if (!error.message.includes('not found')) {
      throw error;
    }
  }
  
  console.log('✓ testBookAppointmentServiceNotFound passed');
}

function testCancelAppointment() {
  const shop = new BeautyShop('Test Shop');
  shop.addService('Facial', 80, 90);
  
  const appointment = shop.bookAppointment(
    'Alice Smith',
    'Facial',
    new Date('2025-10-26T11:00:00')
  );
  
  const cancelled = shop.cancelAppointment(appointment.id);
  
  if (cancelled.status !== 'cancelled') {
    throw new Error('Appointment should be cancelled');
  }
  
  console.log('✓ testCancelAppointment passed');
}

function testCancelAppointmentNotFound() {
  const shop = new BeautyShop('Test Shop');
  
  try {
    shop.cancelAppointment(999);
    throw new Error('Should have thrown error for nonexistent appointment');
  } catch (error) {
    if (!error.message.includes('not found')) {
      throw error;
    }
  }
  
  console.log('✓ testCancelAppointmentNotFound passed');
}

// Run all tests
console.log('Running Beauty Shop tests...\n');

try {
  testAddService();
  testBookAppointment();
  testBookAppointmentServiceNotFound();
  testCancelAppointment();
  testCancelAppointmentNotFound();
  
  console.log('\n✓ All tests passed!');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

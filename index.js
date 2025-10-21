/**
 * Beauty Shop - A simple beauty shop management system
 */

class BeautyShop {
  constructor(name) {
    this.name = name;
    this.services = [];
    this.appointments = [];
  }

  /**
   * Add a service to the beauty shop
   * @param {string} serviceName - Name of the service
   * @param {number} price - Price of the service
   * @param {number} duration - Duration in minutes
   */
  addService(serviceName, price, duration) {
    const service = {
      name: serviceName,
      price: price,
      duration: duration
    };
    this.services.push(service);
    return service;
  }

  /**
   * Get all available services
   * @returns {Array} List of services
   */
  getServices() {
    return this.services;
  }

  /**
   * Book an appointment
   * @param {string} customerName - Name of the customer
   * @param {string} serviceName - Name of the service
   * @param {Date} dateTime - Date and time of appointment
   */
  bookAppointment(customerName, serviceName, dateTime) {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    const appointment = {
      id: this.appointments.length + 1,
      customerName: customerName,
      service: service,
      dateTime: dateTime,
      status: 'scheduled'
    };

    this.appointments.push(appointment);
    return appointment;
  }

  /**
   * Get all appointments
   * @returns {Array} List of appointments
   */
  getAppointments() {
    return this.appointments;
  }

  /**
   * Cancel an appointment
   * @param {number} appointmentId - ID of the appointment to cancel
   */
  cancelAppointment(appointmentId) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      throw new Error(`Appointment with ID ${appointmentId} not found`);
    }
    appointment.status = 'cancelled';
    return appointment;
  }
}

module.exports = BeautyShop;

import { model } from "@medusajs/framework/utils"

const Supplier = model.define("supplier", {
  id: model.id().primaryKey(),
  company_name: model.text(),
  contact_name: model.text(),
  email: model.text(),
  phone: model.text(),
  address_line_1: model.text(),
  address_line_2: model.text(),
  postal_code: model.text(),
  city: model.text(),
  region: model.text(),
  country_code: model.text(), // ISO 3166-1 alpha-2
  notes: model.text(),
})

export default Supplier


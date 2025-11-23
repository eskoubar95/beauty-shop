import { model } from "@medusajs/framework/utils"

const PurchaseOrder = model.define("purchase_order", {
  id: model.id().primaryKey(),
  order_number: model.text(),
  supplier_id: model.text(), // FK to supplier
  location_id: model.text(), // FK to stock_location
  status: model.text(), // draft, ordered, partial, received, closed, cancelled
  payment_terms: model.text(), // none, prepayment, cash_on_delivery, net_30, net_60
  supplier_currency: model.text(), // ISO 4217
  expected_arrival_date: model.dateTime(),
  shipping_company: model.text(),
  tracking_number: model.text(),
  reference_number: model.text(),
  notes_to_supplier: model.text(),
  tags: model.json(), // string[]
  subtotal: model.number(), // øre
  tax_total: model.number(), // øre
  shipping_total: model.number(), // øre
  total_amount: model.number(), // øre
  created_by: model.text(), // FK to user
  ordered_by: model.text(), // FK to user
  ordered_at: model.dateTime(),
  closed_by: model.text(), // FK to user
  closed_at: model.dateTime(),
})

export default PurchaseOrder


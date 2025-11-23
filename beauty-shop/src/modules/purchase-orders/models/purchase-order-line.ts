import { model } from "@medusajs/framework/utils"

const PurchaseOrderLine = model.define("purchase_order_line", {
  id: model.id().primaryKey(),
  purchase_order_id: model.text(), // FK to purchase_order
  product_id: model.text(), // FK to product
  variant_id: model.text(), // FK to product_variant
  supplier_sku: model.text(),
  quantity: model.number(), // > 0
  received_quantity: model.number(), // 0 <= received <= quantity
  rejected_quantity: model.number(), // 0 <= rejected <= quantity
  unit_price: model.number(), // øre, >= 0
  tax_rate: model.number(), // 0-100
  line_total: model.number(), // calculated: quantity × unit_price × (1 + tax_rate/100)
})

export default PurchaseOrderLine


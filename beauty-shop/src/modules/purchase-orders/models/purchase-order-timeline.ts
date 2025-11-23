import { model } from "@medusajs/framework/utils"

const PurchaseOrderTimeline = model.define("purchase_order_timeline", {
  id: model.id().primaryKey(),
  purchase_order_id: model.text(), // FK to purchase_order
  user_id: model.text(), // FK to user (nullable)
  action: model.text(), // created, ordered, received, closed, cancelled, comment, edited
  message: model.text(),
  metadata: model.json(), // optional JSONB for additional data
})

export default PurchaseOrderTimeline


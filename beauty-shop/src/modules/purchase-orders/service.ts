import { MedusaService } from "@medusajs/framework/utils"
import Supplier from "./models/supplier"
import PurchaseOrder from "./models/purchase-order"
import PurchaseOrderLine from "./models/purchase-order-line"
import PurchaseOrderTimeline from "./models/purchase-order-timeline"

class PurchaseOrderModuleService extends MedusaService({
  Supplier,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderTimeline,
}) {
  // Service methods will be added in Phase 2
}

export default PurchaseOrderModuleService


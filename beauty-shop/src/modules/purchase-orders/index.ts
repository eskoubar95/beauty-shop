import PurchaseOrderModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PURCHASE_ORDER_MODULE = "purchaseOrder"

export default Module(PURCHASE_ORDER_MODULE, {
  service: PurchaseOrderModuleService,
})


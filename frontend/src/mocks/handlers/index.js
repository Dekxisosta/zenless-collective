import { authHandlers }          from "./auth"
import { categoryHandlers }      from "./categories"
import { productHandlers }       from "./products"
import { orderHandlers }         from "./orders"
import { cartHandlers }          from "./cart"
import { paymentHandlers }       from "./payments"
import { userHandlers }          from "./users"
import {
  statsHandlers,
  orderHandlers      as adminOrderHandlers,
  paymentHandlers    as adminPaymentHandlers,
  inventoryHandlers,
  customerHandlers,
  reportHandlers,
  adminProductHandlers,
  adminCartHandlers
} from "./admin"

export const handlers = [
  ...statsHandlers,
  ...adminOrderHandlers,
  ...adminPaymentHandlers,
  ...inventoryHandlers,
  ...customerHandlers,
  ...reportHandlers,
  ...adminProductHandlers,
  ...adminCartHandlers,
  ...authHandlers,
  ...categoryHandlers,
  ...productHandlers,
  ...orderHandlers,
  ...cartHandlers,
  ...paymentHandlers,
  ...userHandlers,
]
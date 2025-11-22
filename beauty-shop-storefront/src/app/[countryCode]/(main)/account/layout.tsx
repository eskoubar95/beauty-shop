import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { redirect } from "next/navigation"

export default async function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  // If not authenticated, redirect to login page
  // The login page will handle showing the login form
  if (!customer) {
    // Don't redirect if already on login page to avoid redirect loop
    // This will be handled by the login page itself
  }

  return (
    <AccountLayout customer={customer}>
      {children}
      <Toaster />
    </AccountLayout>
  )
}

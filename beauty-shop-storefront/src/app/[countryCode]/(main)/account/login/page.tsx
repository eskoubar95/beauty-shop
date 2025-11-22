import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Medusa Store account.",
}

export default async function Login() {
  // If already logged in, redirect to account page
  const customer = await retrieveCustomer().catch(() => null)
  
  if (customer) {
    redirect("/account")
  }

  return <LoginTemplate />
}


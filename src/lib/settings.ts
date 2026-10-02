import { fetchSiteSettings } from '@/lib/api'
import { collectionAccount } from '@/lib/bank'
import { contactDefaults } from '@/lib/catalog'

export type AcademySettings = {
  email: string
  whatsappDisplay: string
  whatsappLink: string
  bankName: string
  accountName: string
  accountNumber: string
}

const fallback: AcademySettings = {
  email: contactDefaults.email,
  whatsappDisplay: contactDefaults.whatsappDisplay,
  whatsappLink: contactDefaults.whatsappLink,
  bankName: collectionAccount.bankName,
  accountName: collectionAccount.accountName,
  accountNumber: collectionAccount.accountNumber,
}

export async function fetchAcademySettings(): Promise<AcademySettings> {
  try {
    const rows = await fetchSiteSettings()
    return {
      email: rows.contact_email || fallback.email,
      whatsappDisplay: rows.whatsapp_display || fallback.whatsappDisplay,
      whatsappLink: rows.whatsapp_link || fallback.whatsappLink,
      bankName: rows.bank_name || fallback.bankName,
      accountName: rows.account_name || fallback.accountName,
      accountNumber: rows.account_number || fallback.accountNumber,
    }
  } catch {
    return fallback
  }
}

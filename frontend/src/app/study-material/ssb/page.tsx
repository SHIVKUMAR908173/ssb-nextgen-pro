'use client'

import { redirect } from 'next/navigation'

// Redirect to the unified study material system
export default function SSBStudyMaterialPage() {
    redirect('/study-material/ssb')
}
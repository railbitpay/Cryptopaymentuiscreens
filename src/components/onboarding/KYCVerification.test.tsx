import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KYCVerification } from './KYCVerification'
import { api } from '../../services/api'

vi.mock('../../services/api', () => ({
  api: {
    getKycDocuments: vi.fn(),
    uploadKycDocument: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

mockedApi.getKycDocuments.mockResolvedValue([])

describe('KYCVerification', () => {
  const onNext = vi.fn()
  const onBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads documents and disables Continue when not uploaded', async () => {
    mockedApi.getKycDocuments.mockResolvedValue([])

    render(<KYCVerification onNext={onNext} onBack={onBack} />)

    await waitFor(() => {
      expect(api.getKycDocuments).toHaveBeenCalled()
    })

    expect(screen.getByText('NOT STARTED')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeDisabled()
  })

  it('enables Continue when all documents are uploaded', async () => {
    mockedApi.getKycDocuments.mockResolvedValue([
      { id: '1', document_type: 'incorporation', status: 'uploaded', name: 'inc.pdf', upload_date: new Date().toISOString() },
      { id: '2', document_type: 'owner_id', status: 'uploaded', name: 'id.pdf', upload_date: new Date().toISOString() },
      { id: '3', document_type: 'proof_of_address', status: 'uploaded', name: 'bill.pdf', upload_date: new Date().toISOString() },
    ])

    render(<KYCVerification onNext={onNext} onBack={onBack} />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /continue/i })
      ).toBeEnabled()
    })
  })

  it('calls onNext when Continue is clicked', async () => {
    mockedApi.getKycDocuments.mockResolvedValue([
      { id: '1', document_type: 'incorporation', status: 'uploaded', name: 'inc.pdf', upload_date: new Date().toISOString() },
      { id: '2', document_type: 'owner_id', status: 'uploaded', name: 'id.pdf', upload_date: new Date().toISOString() },
      { id: '3', document_type: 'proof_of_address', status: 'uploaded', name: 'bill.pdf', upload_date: new Date().toISOString() },
    ])

    render(<KYCVerification onNext={onNext} onBack={onBack} />)

    const btn = await screen.findByRole('button', { name: /continue/i })
    await userEvent.click(btn)

    expect(onNext).toHaveBeenCalled()
  })
})

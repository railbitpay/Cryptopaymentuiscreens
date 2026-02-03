import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SettlementPreferences } from './SettlementPreferences'

describe('SettlementPreferences Component', () => {
    const setup = () => {
        const user = userEvent.setup()
        const onNext = vi.fn()
        const onBack = vi.fn()
        render(<SettlementPreferences onNext={onNext} onBack={onBack} />)
        return {user, onNext, onBack}
    }
    it('submits CAD settlement with bank details and selected assets', async () => {
        const {user, onNext, onBack} = setup()
        // Default mode is CAD → bank fields should be visible
        await user.type(
          screen.getByLabelText(/bank name/i),
          'TD Canada Trust'
        )
        await user.type(
          screen.getByLabelText(/transit number/i),
          '12345'
        )
        await user.type(
          screen.getByLabelText(/institution/i),
          '004'
        )
        await user.type(
          screen.getByLabelText(/account number/i),
          '1234567'
        )
    
        await user.click(
          screen.getByRole('button', { name: /complete setup/i })
        )
    
        expect(onNext).toHaveBeenCalledOnce()
        expect(onNext).toHaveBeenCalledWith({
          settlementMode: 'cad',
          settlementAssets: ['btc', 'eth', 'sol'],
          bankName: 'TD Canada Trust',
          bankTransit: '12345',
          bankInstitution: '004',
          bankAccount: '1234567',
        })
    })

    it('submits CAD settlement with bank details and assets', async () => {
        const {user, onNext, onBack} = setup()

        // Switch to crypto mode
        await user.click(
            screen.getByRole('button', {name: /crypto settlement/i})
        )

        // Bank fields should not exist
        expect(screen.queryByLabelText(/bank name/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/transit number/i)).not.toBeInTheDocument()

        await user.click(screen.getByText(/solana/i).closest('label')!)

        await user.click(
            screen.getByRole('button', {name: /complete setup/i})
        )

        expect(onNext).toHaveBeenCalledOnce()
        expect(onNext).toHaveBeenCalledWith({
            settlementMode: 'crypto',
            settlementAssets: ['btc', 'eth'],
            bankName: undefined,
            bankTransit: undefined,
            bankInstitution: undefined,
            bankAccount: undefined,
        })
    })

    it('calls onBack when Back is clicked', async () => {
        const {user, onBack} = setup()

        await user.click(
            screen.getByRole('button', {name: /back/i})
        )

        expect(onBack).toHaveBeenCalledOnce()
    })
})
import React from 'react';
import { render, screen, waitFor, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {describe, it, expect, vi, beforeEach} from "vitest"
import { CreateAccount } from "./CreateAccount.tsx"

describe('CreateAccount Component', () => {
  const setup = () => {
    const onNext = vi.fn()
    const user = userEvent.setup()
    render(<CreateAccount onNext={onNext} />)
    return { onNext, user }
  }

  it('renders all form fields', () => {
    setup()

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('shows password requirements when typing password', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/^password$/i), 'Weakpass')

    expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument()
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument()
    expect(screen.getByText(/one number/i)).toBeInTheDocument()
    expect(screen.getByText(/one symbol/i)).toBeInTheDocument()
  })

  it('disables submit button when password requirements are not met', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/^password$/i), 'Weakpass')
    await user.type(screen.getByLabelText(/confirm password/i), 'Weakpass')

    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeDisabled()
  })

  it('shows error when passwords do not match', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass123!')
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!!'
    )

    expect(
      screen.getByText(/passwords do not match/i)
    ).toBeInTheDocument()
  })

//   it('shows validation error for weak password on submit', async () => {
//     const { user } = setup()

//     await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
//     await user.type(screen.getByLabelText(/^password$/i), 'weakpass')
//     await user.type(screen.getByLabelText(/confirm password/i), 'weakpass')

//     await user.click(
//       screen.getByRole('button', { name: /create account/i })
//     )

//     expect(
//       await screen.findByText(/Password must be at least 12 characters/i)
//     ).toBeInTheDocument()
//   })
it('does not submit and disables button for weak password', async () => {
    const { user, onNext } = setup()
  
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'weakpass')
    await user.type(screen.getByLabelText(/confirm password/i), 'weakpass')
  
    const submitButton = screen.getByRole('button', {
      name: /create account/i
    })
  
    expect(submitButton).toBeDisabled()
    expect(onNext).not.toHaveBeenCalled()
  })  

  it('submits form with valid data and calls onNext', async () => {
    const { user, onNext } = setup()

    await user.type(
      screen.getByLabelText(/email address/i),
      'merchant@business.com'
    )
    await user.type(
      screen.getByLabelText(/^password$/i),
      'StrongPass123!'
    )
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!'
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create account/i })
      ).toBeEnabled()
    })

    await user.click(
      screen.getByRole('button', { name: /create account/i })
    )

    await waitFor(() => {
      expect(onNext).toHaveBeenCalledTimes(1)
      expect(onNext).toHaveBeenCalledWith({
        email: 'merchant@business.com',
        password: 'StrongPass123!',
        enable2FA: true
      })
    })
  })

  it('allows disabling 2FA', async () => {
    const { user, onNext } = setup()

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()

    await user.type(
      screen.getByLabelText(/email address/i),
      'merchant@business.com'
    )
    await user.type(
      screen.getByLabelText(/^password$/i),
      'StrongPass123!'
    )
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!'
    )

    await user.click(
      screen.getByRole('button', { name: /create account/i })
    )

    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith({
        email: 'merchant@business.com',
        password: 'StrongPass123!',
        enable2FA: false
      })
    })
  })
})

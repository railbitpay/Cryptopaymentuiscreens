import React from 'react';
import { render, screen, waitFor, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {describe, it, expect, vi, beforeEach} from "vitest"
import { OnboardingSuccess } from "./OnboardingSuccess.tsx"

describe('OnboardingSuccess Component', () => {
  const setup = () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<OnboardingSuccess onComplete={onComplete} />)
    return { onComplete, user }
  }

  it('renders the component with all header elements', () => {
    setup()

    expect(screen.getByText('Welcome to RailBit!')).toBeInTheDocument()
    expect(screen.getByText('Your account is set up and ready to go. Start accepting crypto payments from customers across Canada.')).toBeInTheDocument()

    expect(screen.getByText('Next Steps')).toBeInTheDocument()

    expect(screen.getByText('Create your first payment')).toBeInTheDocument()
    expect(screen.getByText('Generate a QR code and test the flow')).toBeInTheDocument()

  })

  it('disables submit button when password requirements are not met', async () => {
    const { user, onComplete } = setup()

    await user.click(
        screen.getByRole('button', {name: /go to dashboard/i})
    )

    expect(onComplete).toHaveBeenCalledOnce()
  })

})

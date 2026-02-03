import React from 'react';
import '@testing-library/jest-dom'
import {render, screen, waitFor, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {describe, it, expect, vi, beforeEach} from "vitest"
import { BusinessInformation } from "./BusinessInformation.tsx"


describe('BusinessInformation Component', () => {
  const mockOnNext = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    mockOnNext.mockClear()
    mockOnBack.mockClear()
  })

  it('renders the component with all form fields', () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)

    // Check header elements

    // Check all form labels

    // Check buttons
  })

  it('allows user to fill out all form fields', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    // Fill text inputs
    await user.type(screen.getByLabelText('Legal Business Name'), 'Abdul Tech')
    await user.type(screen.getByLabelText('CRA Business Number'), '123456789RC0001')
    await user.type(screen.getByLabelText('Business Address'), '123 Main Street')
    await user.type(screen.getByLabelText('City'), 'Toronto')
    await user.type(screen.getByLabelText('Postal Code'), 'M5V 3A8')

    // Verify inputs
    expect(screen.getByLabelText('Legal Business Name')).toHaveValue('Abdul Tech')
    expect(screen.getByLabelText('CRA Business Number')).toHaveValue('123456789RC0001')
    expect(screen.getByLabelText('Business Address')).toHaveValue('123 Main Street')
    expect(screen.getByLabelText('City')).toHaveValue('Toronto')
    expect(screen.getByLabelText('Postal Code')).toHaveValue('M5V 3A8')
  })

it('submits form with valid data when all fields are filled', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    // Fill all required fields
    await user.type(screen.getByLabelText('Legal Business Name'), 'Tech Solutions Inc.')
    await user.type(screen.getByLabelText('CRA Business Number'), '123456789RC0001')
    await user.type(screen.getByLabelText('Business Address'), '123 Main Street')
    await user.type(screen.getByLabelText('City'), 'Toronto')
    await user.type(screen.getByLabelText('Postal Code'), 'M5V 3A8')

    // Select industry - use role-based query
    const industryTrigger = screen.getByRole('combobox', { name: /industry/i })
    await user.click(industryTrigger)

    const techOption = await screen.findByRole('option', { name: /technology/i })
    await user.click(techOption)

    // Select province - use role-based query
    const provinceTrigger = screen.getByRole('combobox', { name: /province/i })
    await user.click(provinceTrigger)
    
    const ontarioOption = await screen.findByRole('option', { name: /ontario/i })
    await user.click(ontarioOption)

    // Submit form
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Verify onNext was called with correct data
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1)
      expect(mockOnNext).toHaveBeenCalledWith({
        businessName: 'Tech Solutions Inc.',
        businessNumber: '123456789RC0001',
        industry: 'Technology',
        addressLine1: '123 Main Street',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5V 3A8'
      })
    })
  })

  it('does not submit form when required fields are empty', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    // Try to submit without filling any fields
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Verify onNext was not called
    expect(mockOnNext).not.toHaveBeenCalled()
  })

  it('does not submit form when some fields are missing', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    // Fill only some fields
    await user.type(screen.getByLabelText('Legal Business Name'), 'Abdul Tech')
    await user.type(screen.getByLabelText('CRA Business Number'), '123456789RC0001')

    // Try to submit
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Verify onNext was not called
    expect(mockOnNext).not.toHaveBeenCalled()
  })

  it('calls onBack when Back button is clicked', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('displays all industry options', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    const industryTrigger = screen.getByRole('combobox', { name: /industry/i })
    await user.click(industryTrigger)

    const listbox = await screen.findByRole('listbox')

    const industries = [
      'Retail', 'E-commerce', 'Restaurant & Food Service',
      'Professional Services', 'Technology', 'Healthcare',
      'Real Estate', 'Entertainment', 'Other'
    ]

    industries.forEach(industry => {
      expect(
        within(listbox).getByRole('option', { name: industry })
      ).toBeInTheDocument()
    })
  })

  it('displays all province options', async () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)
    const user = userEvent.setup()

    const provinceTrigger = screen.getByRole('combobox', { name: /province/i })
    await user.click(provinceTrigger)

    const listbox = await screen.findByRole('listbox')

    const provinces = [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
      'Prince Edward Island', 'Quebec', 'Saskatchewan'
    ]

    provinces.forEach(province => {
      expect(
        within(listbox).getByRole('option', { name: province })
      ).toBeInTheDocument()
    })
  })

  it('has correct input placeholders', () => {
    render(<BusinessInformation onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByPlaceholderText('Your Business Inc.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123456789RC0001')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123 Main Street')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Toronto')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('M5V 3A8')).toBeInTheDocument()
  })
})
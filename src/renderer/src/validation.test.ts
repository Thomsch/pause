import { describe, it, expect } from 'vitest'
import { isValidDuration } from './validation'

describe('isValidDuration', () => {
  it('rejects empty string', () => {
    expect(isValidDuration('')).toBe(false)
  })

  it('rejects "0"', () => {
    expect(isValidDuration('0')).toBe(false)
  })

  it('rejects non-numeric input', () => {
    expect(isValidDuration('abc')).toBe(false)
    expect(isValidDuration('12a')).toBe(false)
    expect(isValidDuration('a12')).toBe(false)
  })

  it('rejects negative numbers', () => {
    expect(isValidDuration('-1')).toBe(false)
  })

  it('rejects decimal numbers', () => {
    expect(isValidDuration('1.5')).toBe(false)
  })

  it('rejects whitespace', () => {
    expect(isValidDuration(' ')).toBe(false)
    expect(isValidDuration(' 30 ')).toBe(false)
  })

  it('accepts valid positive integers', () => {
    expect(isValidDuration('1')).toBe(true)
    expect(isValidDuration('30')).toBe(true)
    expect(isValidDuration('120')).toBe(true)
    expect(isValidDuration('1440')).toBe(true)
  })

  it('accepts leading zeros as valid (regex allows digits)', () => {
    expect(isValidDuration('01')).toBe(true)
    expect(isValidDuration('030')).toBe(true)
  })

  it('rejects "00"', () => {
    expect(isValidDuration('00')).toBe(false)
  })
})

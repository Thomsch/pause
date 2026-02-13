import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import App from './App.vue'

const { mockInvoke, mockListen, mockOpen } = vi.hoisted(() => ({
  mockInvoke: vi.fn(),
  mockListen: vi.fn(() => Promise.resolve(vi.fn())),
  mockOpen: vi.fn()
}))

vi.mock('@tauri-apps/api/core', () => ({ invoke: mockInvoke }))
vi.mock('@tauri-apps/api/event', () => ({ listen: mockListen }))
vi.mock('@tauri-apps/plugin-shell', () => ({ open: mockOpen }))

describe('App.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders with default state', () => {
    wrapper = mount(App)
    const input = wrapper.find('.duration-input')
    const button = wrapper.find('.toggle-btn')

    expect((input.element as HTMLInputElement).value).toBe('30')
    expect((input.element as HTMLInputElement).disabled).toBe(false)
    expect(button.text()).toBe('Start')
  })

  it('disables start button when input is invalid', async () => {
    wrapper = mount(App)
    const input = wrapper.find('.duration-input')

    await input.setValue('0')
    expect(wrapper.find('.toggle-btn').attributes('disabled')).toBeDefined()

    await input.setValue('abc')
    expect(wrapper.find('.toggle-btn').attributes('disabled')).toBeDefined()

    await input.setValue('')
    expect(wrapper.find('.toggle-btn').attributes('disabled')).toBeDefined()
  })

  it('enables start button when input is valid', async () => {
    wrapper = mount(App)
    const input = wrapper.find('.duration-input')

    await input.setValue('30')
    expect(wrapper.find('.toggle-btn').attributes('disabled')).toBeUndefined()
  })

  it('clicking Start calls invoke and shows Stop', async () => {
    wrapper = mount(App)
    await wrapper.find('.toggle-btn').trigger('click')

    expect(mockInvoke).toHaveBeenCalledWith('start_timer', { duration: 30 })
    expect(wrapper.find('.toggle-btn').text()).toBe('Stop')
  })

  it('clicking Stop calls invoke and shows Start', async () => {
    wrapper = mount(App)
    // Start first
    await wrapper.find('.toggle-btn').trigger('click')
    mockInvoke.mockClear()

    // Stop
    await wrapper.find('.toggle-btn').trigger('click')
    expect(mockInvoke).toHaveBeenCalledWith('stop_timer')
    expect(wrapper.find('.toggle-btn').text()).toBe('Start')
  })

  it('input is disabled while running', async () => {
    wrapper = mount(App)
    await wrapper.find('.toggle-btn').trigger('click')

    expect((wrapper.find('.duration-input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('Enter key triggers toggle', async () => {
    wrapper = mount(App)
    await wrapper.find('.duration-input').setValue('30')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()

    expect(mockInvoke).toHaveBeenCalledWith('start_timer', { duration: 30 })
  })

  it('Enter key does nothing with invalid input', async () => {
    wrapper = mount(App)
    await wrapper.find('.duration-input').setValue('0')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()

    expect(mockInvoke).not.toHaveBeenCalled()
  })
})

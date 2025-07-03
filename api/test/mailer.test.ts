import { describe, it, expect, vi } from 'vitest'
import * as mailer from '../src/lib/mailer'


describe('sendAdminOrderNotification', () => {
  it('formats and sends admin notification', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = vi.spyOn(mailer, 'sendMail').mockResolvedValue({} as any)
    const order = {
      id: 'o1',
      items: [{ productId: 'p1', quantity: 2, price: 3 }],
      firstName: 'A',
      lastName: 'B',
      phone: '111',
      secondaryPhone: '222',
      address1: 'addr1',
      address2: 'addr2',
      city: 'City',
      state: 'ST',
      postalCode: '12345',
      country: 'US',
      instructions: 'none',
    }

    await mailer.sendAdminOrderNotification(order, 'admin@example.com')

    expect(spy).toHaveBeenCalledTimes(1)
    const args = spy.mock.calls[0][0]
    expect(args.to).toBe('admin@example.com')
    expect(args.subject).toContain(order.id)
    expect(args.html).toContain('addr1')
    expect(args.html).toContain('p1')

    spy.mockRestore()
  })
})

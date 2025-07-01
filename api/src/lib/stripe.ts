import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '../env'

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-08-16',
})

export default stripe

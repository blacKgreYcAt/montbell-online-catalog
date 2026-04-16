#!/bin/bash

# Set Montbell CDN environment variables on Vercel

echo "Setting environment variables on Vercel..."

# Note: These would need to be set via Vercel Dashboard or API
# Since vercel env add requires specific syntax, we'll document the needed variables

cat << 'VARS'
The following environment variables need to be set in Vercel Dashboard:

1. NEXT_PUBLIC_MONTBELL_CDN_URL
   Value: https://www.montbell.com/storage/products/images/origin
   Scope: Production, Preview, Development

2. NEXT_PUBLIC_MONTBELL_URL_PATTERN
   Value: {model}_{color}.webp
   Scope: Production, Preview, Development

3. NEXT_PUBLIC_MONTBELL_CDN_ENABLED
   Value: true
   Scope: Production, Preview, Development

These variables are already configured in .env.local for local development.
For production deployment on Vercel, please set them in:
  Vercel Dashboard → Project Settings → Environment Variables
VARS


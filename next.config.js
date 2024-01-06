/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost:3000',
                'test.payu.in',
                'testtxncdn.payubiz.in',
            ]
        }
    },
}

module.exports = nextConfig

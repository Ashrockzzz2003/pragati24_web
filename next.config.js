/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'http://localhost:3000',
                'https://test.payu.in'
            ]
        }
    }
}

module.exports = nextConfig

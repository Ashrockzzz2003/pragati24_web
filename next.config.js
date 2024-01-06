/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost',
                'test.payu.in',
                'testtxncdn.payubiz.in'
            ]
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.gravatar.com',
                port: '',
                pathname: '/avatar/**',
            },
        ],
        domains: [
            'www.gravatar.com',
        ]
    },
}

module.exports = nextConfig

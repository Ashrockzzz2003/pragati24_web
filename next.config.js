/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                '*localhost',
                '*.payu.in',
            ]
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.gravatar.com',
            },
        ],
    },
}

module.exports = nextConfig

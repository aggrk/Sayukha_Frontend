const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sayukhaconstruction.co.tz" }],
        destination: "https://sayukhaconstruction.co.tz/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

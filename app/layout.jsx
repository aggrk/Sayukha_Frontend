import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "../context/AuthContext";
import QueryProvider from "../providers/QueryProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Sayukha Construction | Tanzania Civil Engineering & Infrastructure",
  description:
    "Tanzania's leading civil engineering company. Road construction, building works, infrastructure development, and large-scale project management across all regions.",
  keywords: [
    "civil engineering Tanzania",
    "construction company Tanzania",
    "road construction Tanzania",
    "infrastructure Tanzania",
    "building contractor Tanzania",
  ],
  openGraph: {
    title: "Sayukha Construction | Tanzania Civil Engineering",
    description:
      "Building Tanzania's infrastructure with precision and reliability.",
    url: "https://sayukhaconstruction.co.tz",
    siteName: "Sayukha Construction",
    locale: "en_TZ",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} font-inter`}
    >
      <body className="bg-black text-white-soft overflow-x-hidden font-body antialiased">
        <QueryProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

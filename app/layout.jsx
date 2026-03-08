import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "../context/AuthContext";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";

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
    "Tanzania's leading civil engineering company specializing in road construction, building works, infrastructure development, and large-scale project management across all regions of Tanzania.",
  keywords: [
    "civil engineering Tanzania",
    "construction company Tanzania",
    "road construction Tanzania",
    "infrastructure development Tanzania",
    "building contractor Tanzania",
    "civil works Tanzania",
    "Sayukha Construction",
    "Tanzania contractor",
    "bridge construction Tanzania",
    "commercial construction Tanzania",
  ],
  metadataBase: new URL("https://sayukhaconstruction.co.tz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sayukha Construction | Tanzania Civil Engineering & Infrastructure",
    description:
      "Tanzania's fastest-growing civil engineering company specializing in road construction, building works, and infrastructure development across all regions.",
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
      <body className="text-white-soft font-body overflow-x-hidden bg-black antialiased">
        <QueryProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
          <Toaster
            position="top-center"
            toastOptions={{ duration: 5000, style: { width: "400px" } }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}

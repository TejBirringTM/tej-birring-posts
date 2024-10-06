import { Rubik, Overpass } from "next/font/google";
import "./global-style.css";
import TheFooter from "./_ui/the-footer";
import TheHeader from "./_ui/the-header";
import { Provider } from 'jotai'

const rubik = Rubik({ subsets: ["latin"] });
const overpass = Overpass({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TheHeader />
          <Provider>
            {children}
          </Provider>
        <TheFooter />
      </body>
    </html>
  );
}

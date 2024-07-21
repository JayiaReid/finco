import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import {Toaster} from '../components/ui/toaster'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinCo Expenses",
  description: "Expense tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#3577DF', colorBackground:'#020817', fontSize:'1rem', spacingUnit:'1.2rem' }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

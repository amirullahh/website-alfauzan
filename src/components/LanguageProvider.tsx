"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { t as i18nTranslate, Locale } from "@/lib/i18n";

type Language = Locale;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "id",
  setLanguage: () => {},
  t: (key: string) => key,
});

const STORAGE_KEY = "alfauzan-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
    
    if (lang === "id") {
      // Clear Google Translate cookie
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      // Set Google Translate cookie
      document.cookie = `googtrans=/id/${lang}; path=/`;
      document.cookie = `googtrans=/id/${lang}; domain=${window.location.hostname}; path=/`;
    }
    
    window.location.reload();
  }, []);

  const t = useCallback((key: string) => {
    return i18nTranslate(key, language);
  }, [language]);

  // Don't render translation content until client side mounts
  // to avoid hydration mismatch, or just return children directly.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

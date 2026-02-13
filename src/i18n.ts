import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "vault_access": "Restricted Access",
      "enter_code": "Enter Archive Credentials",
      "init_session": "Initialize Session",
      "scanning": "Scanning Archives...",
      "no_records": "No records found in this sector",
      "order_by": "Order by",
      "default": "Archival",
      "release": "Release Date",
      "score": "IMDb Score",
      "essentials": "I. The Essentials",
      "scifi": "II. Sci-Fi Masterpieces",
      "crime": "III. Crime & Drama",
      "mystery": "IV. Mystery & Thrills",
      "animation": "V. Animation & World",
      "search": "Search"
    }
  },
  es: {
    translation: {
      "vault_access": "Acceso Restringido",
      "enter_code": "Ingrese Credenciales de Archivo",
      "init_session": "Iniciar Sesión",
      "scanning": "Escaneando Archivos...",
      "no_records": "No se encontraron registros",
      "order_by": "Orden por",
      "default": "Archivo",
      "release": "Fecha de Estreno",
      "score": "Puntuación IMDb",
      "essentials": "I. Los Esenciales",
      "scifi": "II. Obras Maestras de Ciencia Ficción",
      "crime": "III. Crimen y Drama",
      "mystery": "IV. Misterio y Suspenso",
      "animation": "V. Animación y Mundo",
      "search": "Buscar"
    }
  },
  // --- ADDED LANGUAGES ---
  fr: {
    translation: {
      "vault_access": "Accès Restreint",
      "enter_code": "Entrez les identifiants d'archive",
      "init_session": "Initialiser la session",
      "scanning": "Analyse des archives...",
      "no_records": "Aucun enregistrement trouvé",
      "order_by": "Trier par",
      "default": "Archive",
      "release": "Date de sortie",
      "score": "Score IMDb",
      "essentials": "I. Les Essentiels",
      "scifi": "II. Chefs-d'œuvre de SF",
      "crime": "III. Crime et Drame",
      "mystery": "IV. Mystère et Thriller",
      "animation": "V. Animation et Monde",
      "search": "Rechercher"
    }
  },
  de: {
    translation: {
      "vault_access": "Eingeschränkter Zugriff",
      "enter_code": "Archivdaten eingeben",
      "init_session": "Sitzung initialisieren",
      "scanning": "Archive werden gescannt...",
      "no_records": "Keine Datensätze gefunden",
      "order_by": "Sortieren nach",
      "default": "Archiv",
      "release": "Veröffentlichungsdatum",
      "score": "IMDb-Bewertung",
      "essentials": "I. Das Wesentliche",
      "scifi": "II. Sci-Fi-Meisterwerke",
      "crime": "III. Krimi & Drama",
      "mystery": "IV. Mystery & Thriller",
      "animation": "V. Animation & Welt",
      "search": "Suchen"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Language to use if translation is missing
  interpolation: { escapeValue: false }
});

export default i18n;
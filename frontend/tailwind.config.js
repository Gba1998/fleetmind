/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mining: {
          dark: '#08111F',       // Fond principal
          graphite: '#111820',   // Surfaces primaires, sidebar, header
          surface: '#172231',    // Surface secondaire (cartes, modales, tables)
          orange: '#FF8A00',     // Accent d'action minier
          white: '#F4F6F8',      // Typographie principale
          steel: '#8995A3',      // Gris acier, bordures, libellés secondaires
          green: '#10B981',      // Statut opérationnel positif
          red: '#EF4444',        // Alerte critique
          amber: '#F59E0B'       // Avertissement doux
        }
      }
    },
  },
  plugins: [],
}

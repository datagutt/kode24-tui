export const translations: Record<string, string> = {
  // Frontpage
  sections: "📑 Seksjoner",
  upcomingEvents: "📅 Kommende arrangementer",
  recentComments: "💬 Nylige kommentarer",
  latestArticles: "📰 Siste artikler",
  quickActions: "📑 Hurtighandlinger",
  recentJobs: "💼 Nylige jobber",
  viewAllJobs: "Se alle jobber",

  // Listings
  loadingJobs: "Laster jobbannonser...",
  jobListings: "💼 Jobbannonser",
  foundJobs: "Fant {count} jobber",
  search: "🔍 Søk: ",
  filters: "Filtre: ",
  allTypes: "Alle typer",
  allLocations: "Alle steder",
  allCompanies: "Alle selskaper",
  noJobsFound: "Ingen jobber funnet",
  tryAdjustingSearch: "Prøv å justere søket eller filtrene",
  navJobs: "Navigasjon: ↑↓ Bla gjennom jobber | Enter Se detaljer | s Søk | f Filtrer",

  // Tags
  categoriesTags: "🏷️ Kategorier & Tags",
  categoriesAvailable: "{count} kategorier tilgjengelig",
  selectTag: "🏷️ Velg en tag",
  chooseCategory: "Velg en kategori til venstre for å se relaterte artikler",
   popularCategories: "Populære kategorier:",
   frontend: "• Frontend-utvikling",
   backend: "• Backend-utvikling",
   devops: "• DevOps",
   maskinlaering: "• Maskinlæring",
  articlesTaggedWith: "📰 Artikler tagget med \"{name}\"",
  loadingArticles: "Laster artikler...",
  noArticlesFound: "Ingen artikler funnet for denne taggen",
  demoLimitation: "Dette kan være en demo-begrensning",

   // Article
   loadingArticle: "Laster artikkel...",
   byAuthorDate: "Av {name} - {date}",
   unknownAuthor: "Ukjent forfatter",
   dateUnknown: "Dato ukjent",
   views: "visninger",
   likes: "likes",
   articleNumber: "Artikkel {number}",
   reactionsComments: "❤️ {reactions} reaksjoner | 💬 {comments} kommentarer",
   tags: "🏷️ Tags",
   noTags: "Ingen tags tilgjengelig",
   navArticle: "Navigasjon: ↑↓ Rull | Esc Tilbake | q Avslutt",

  // General
  pressEnter: "Trykk Enter for å se detaljer",
  pressEnterViewArticles: "Trykk Enter for å se artikler",

   // General UI
   loadingFrontpage: "Laster kode24.no forside...",
   pressQToQuit: "Trykk 'q' for å avslutte",
   noDataAvailable: "Ingen data tilgjengelig",
   noArticleSelected: "Ingen artikkel valgt",
   pressEscToGoBack: "Trykk Esc for å gå tilbake",
   eventsComingSoon: "Arrangementer-side (Kommer snart)",
   unknownPage: "Ukjent side",
   viewsIcon: "👁️ ",
   likesIcon: "❤️ ",
   articleNotFound: "Artikkel ikke funnet eller ugyldige data",
   articleContentNotLoaded: "Artikkelinnhold kunne ikke lastes",
   missingTitleAndContent: "Mangler tittel og innholdsdata",
   articleTitleUnavailable: "Artikkeltittel utilgjengelig",
   articleContent: "📰 Artikkelinnhold",
   articleContentUnavailable: "⚠️ Artikkelinnhold er ikke tilgjengelig",
   paywallOrFormatting: "Dette kan skyldes betalingsmur eller formateringsproblemer",
   articleUrl: "🔗 Artikkel-URL:",
   developmentInfo: "🔧 Utviklingsinfo:",
   headerTitle: "🖥️  kode24.no - Terminal-utgave",
   footerHelp: "q=Avslutt | Esc=Tilbake | ↑↓←→=Naviger | Enter=Velg | l=Jobber | t=Tags | e=Arrangementer",

   // Help
   keyboardShortcuts: "Tastatursnarveier",
   navigation: "Navigasjon:",
   navUpDown: "  ↑/↓ - Naviger opp/ned",
   navLeftRight: "  ←/→ - Naviger venstre/høyre (seksjoner)",
   navEnter: "  Enter - Velg element",
   navEsc: "  Esc - Gå tilbake",
   pages: "Sider:",
   pageListings: "  l - Stillingsutlysninger",
   pageTags: "  t - Tags",
   pageEvents: "  e - Arrangementer",
   general: "Generelt:",
   helpToggle: "  h - Vis/skjul denne hjelpen",
   quit: "  q - Avslutt applikasjonen",
   pressAnyKey: "Trykk en tast for å lukke",
};

export const t = (key: string, params?: Record<string, any>): string => {
  let trans = translations[key];
  if (!trans) return key;
  if (params) {
    trans = trans.replace(/{(\w+)}/g, (match, p) => params[p]?.toString() || match);
  }
  return trans;
};
const translations = {
  en: {
    'pd-attribution-hint': 'marked as public domain',
    'check-details': 'more details on',
    anonymous: 'anonymous',
    by: 'by',
    edited: 'modified',
  },
  es: {
    'pd-attribution-hint': 'marcado como dominio público',
    'check-details': 'para más detalles véase',
    anonymous: 'anónimo',
    by: 'por',
    edited: 'modificado',
  },
  pt: {
    'pd-attribution-hint': 'marcado como domínio público',
    'check-details': 'para mais detalhes, veja',
    anonymous: 'anónimo',
    by: 'por',
    edited: 'modificado',
  },
  de: {
    'pd-attribution-hint': 'als gemeinfrei gekennzeichnet',
    'check-details': 'Details auf',
    anonymous: 'anonym',
    by: 'von',
    edited: 'bearbeitet',
  },
  uk: {
    'pd-attribution-hint': 'позначено як суспільне надбання',
    'check-details': 'більше деталей на',
    anonymous: 'анонім',
    by: 'автор',
    edited: 'модифіковано',
  },
};

function translate(lang, key) {
  return translations[lang][key];
}

module.exports = translate;

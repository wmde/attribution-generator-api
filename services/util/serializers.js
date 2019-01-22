function license(licenseObject) {
  const { id: code, name, url, groups } = licenseObject;
  return { code, name, url, groups };
}

function attribution(attributionObject) {
  const { id: licenseId, url: licenseUrl } = attributionObject.license || {};
  return {
    licenseId,
    licenseUrl,
    attributionHtml: attributionObject.html ? attributionObject.html() : undefined,
    attributionPlain: attributionObject.plainText ? attributionObject.plainText() : undefined,
  };
}

function fileinfo({ artistHtml, attributionHtml, mediaType }, licenseParam) {
  return {
    license: license(licenseParam),
    author_html: artistHtml,
    attribution_html: attributionHtml,
    media_type: mediaType,
  };
}

module.exports = {
  license,
  attribution,
  fileinfo,
};

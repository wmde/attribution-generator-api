function license(licenseObject) {
  const { id: code, name, url, groups } = licenseObject;
  return { code, name, url, groups };
}

module.exports = { license };

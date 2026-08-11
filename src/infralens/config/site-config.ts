/** Single source of truth for brand/domain-dependent strings (branding plan §6) — nothing else should hardcode these. */
export const siteConfig = {
  name: "InfraLens",
  parentBrand: "Randy Code",
  parentBrandUrl: "https://randy-code.dev",
  canonicalUrl: "https://randy-code.dev/tools/infralens",
  repositoryUrl: "https://github.com/Randy-R-code/infralens",
  licenseUrl: "https://github.com/Randy-R-code/infralens/blob/main/LICENSE",
} as const;

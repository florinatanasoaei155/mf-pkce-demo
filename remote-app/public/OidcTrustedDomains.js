// Trusted domains for OIDC authentication
const trustedDomains = {
  default: [
    "http://localhost:9000", // Mock OIDC Provider
    "http://localhost:5173", // Parent App
  ],
};

// Ensure the mock OIDC provider is trusted
trustedDomains.config_mock_oidc = {
  domains: [
    "http://localhost:9000", // OIDC Token Server
    "http://localhost:5173", // Parent App
  ],
  showAccessToken: true, // Allows token to be accessed
};

// Allow OIDC tokens to be used for API requests
trustedDomains.config_allow_api_access = {
  oidcDomains: ["http://localhost:9000"], // Mock OIDC Provider
  accessTokenDomains: [
    "http://localhost:5173", // Parent App
  ],
};

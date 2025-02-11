import { OidcConfiguration, TokenAutomaticRenewMode } from "@axa-fr/react-oidc";

export const oidcConfiguration: OidcConfiguration = {
  client_id: "local-oidc-client",
  redirect_uri: "http://localhost:5173/authentication/callback",
  scope: "openid profile email",
  authority: "http://localhost:9000",
  service_worker_relative_url: "/OidcServiceWorker.js",
  service_worker_only: false,
  silent_redirect_uri: "",
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticOnlyWhenFetchExecuted,
};

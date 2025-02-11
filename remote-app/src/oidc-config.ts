import { OidcConfiguration, TokenAutomaticRenewMode } from "@axa-fr/react-oidc";

export const oidcConfiguration: OidcConfiguration = {
  client_id: "local-oidc-client",
  redirect_uri: window.location.origin + "/authentication/callback",
  silent_redirect_uri:
    window.location.origin + "/authentication/silent-callback",
  scope: "openid profile email offline_access",
  authority: "http://localhost:9000",
  service_worker_relative_url: "/OidcServiceWorker.js",
  service_worker_keep_alive_path: "/",
  service_worker_only: false,
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticOnlyWhenFetchExecuted,
  logout_tokens_to_invalidate: ["access_token", "refresh_token"],
};

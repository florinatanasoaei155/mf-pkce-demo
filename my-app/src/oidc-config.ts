import { OidcConfiguration, TokenAutomaticRenewMode } from "@axa-fr/react-oidc";

export const oidcConfiguration: OidcConfiguration = {
  client_id: "local-oidc-client",
  redirect_uri: "http://localhost:5173/authentication/callback",
  silent_redirect_uri: "http://localhost:5173/authentication/silent-callback",
  scope: "openid profile email",
  authority: "http://localhost:9000",
  service_worker_relative_url: "/OidcServiceWorker.js",
  service_worker_only: false,
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticBeforeTokenExpiration,
  refresh_time_before_tokens_expiration_in_second: 60, // ✅ Refresh tokens 60 seconds before expiration
  monitor_session: true, // ✅ Enable session monitoring
  preload_user_info: true, // ✅ Fetch user info when logging in
};

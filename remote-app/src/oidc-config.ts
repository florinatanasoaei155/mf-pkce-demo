import { OidcConfiguration, TokenAutomaticRenewMode } from "@axa-fr/react-oidc";

export const oidcConfiguration: OidcConfiguration = {
  client_id: "local-oidc-client",
  redirect_uri: "http://localhost:5173/authentication/callback",
  silent_redirect_uri: "http://localhost:5173/authentication/silent-callback",
  scope: "openid profile email api offline_access",
  authority: "http://localhost:9000",
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticOnlyWhenFetchExecuted,
  refresh_time_before_tokens_expiration_in_second: 60,
  service_worker_relative_url: "/OidcServiceWorker.js",
  service_worker_only: false,
  monitor_session: true,
  preload_user_info: true,
};

import { OidcConfiguration } from "@axa-fr/react-oidc";

export const oidcConfiguration: OidcConfiguration = {
  client_id: "local-oidc-client",
  redirect_uri: "http://localhost:5173/authentication/callback",
  authority: "http://localhost:9000", // Identity Server
  scope: "openid profile email",
};

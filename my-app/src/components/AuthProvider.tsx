import { OidcProvider, useOidc } from "@axa-fr/react-oidc";
import { oidcConfiguration } from "../oidc-config";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <OidcProvider configuration={oidcConfiguration}>{children}</OidcProvider>
);

export const useAuth = () => {
  const { login, logout, isAuthenticated } = useOidc();
  return { login, logout, isAuthenticated };
};

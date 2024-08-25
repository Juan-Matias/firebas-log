/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/carrito` | `/(app)/home` | `/(app)/pedidos` | `/(app)/perfil` | `/(app)/productos` | `/_sitemap` | `/carrito` | `/home` | `/homeScreen` | `/pedidos` | `/perfil` | `/productos` | `/signIn` | `/signUp`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

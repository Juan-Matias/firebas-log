/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/home` | `/(app)/layout` | `/_sitemap` | `/home` | `/layout` | `/signIn` | `/signUp`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

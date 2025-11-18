/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

declare namespace Deno {
  export namespace env {
    export function get(key: string): string | undefined;
  }
}

// Global types available in Deno runtime
declare const console: Console;
declare const fetch: typeof globalThis.fetch;
declare const Response: typeof globalThis.Response;
declare const JSON: typeof globalThis.JSON;
declare const Date: typeof globalThis.Date;
declare const Error: typeof globalThis.Error;
declare const String: typeof globalThis.String;

// Request type is available from Web API
// Using globalThis to access the Request type
type Request = globalThis.Request;

// Module declarations for Deno URL imports
declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(
    url: string,
    key: string
  ): {
    from: (table: string) => {
      select: (columns?: string) => {
        eq: (column: string, value: unknown) => {
          eq: (column: string, value: unknown) => {
            eq: (column: string, value: unknown) => {
              maybeSingle: () => Promise<{ data: { id: number } | null; error: { message: string } | null }>;
            };
            maybeSingle: () => Promise<{ data: { id: number } | null; error: { message: string } | null }>;
          };
          maybeSingle: () => Promise<{ data: { id: number } | null; error: { message: string } | null }>;
        };
        maybeSingle: () => Promise<{ data: { id: number } | null; error: { message: string } | null }>;
      };
      insert: (
        data: Record<string, unknown> | Record<string, unknown>[]
      ) => Promise<{ error: { message: string } | null }>;
      upsert: (
        data: Record<string, unknown>,
        options?: { onConflict?: string }
      ) => Promise<{ error: { message: string } | null }>;
    };
  };
}


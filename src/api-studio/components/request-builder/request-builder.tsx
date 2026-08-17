"use client";

import { ALLOWED_METHODS } from "@/api-studio/config/constants";
import type { AuthConfig } from "@/api-studio/lib/auth";
import type { KeyValueRow } from "@/api-studio/lib/serialize";
import type { BodyMode, HttpMethod } from "@/api-studio/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send, X } from "lucide-react";
import { AuthEditor } from "./auth-editor";
import { BodyEditor } from "./body-editor";
import { KeyValueEditor } from "./key-value-editor";

interface RequestBuilderProps {
  method: HttpMethod;
  url: string;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  auth: AuthConfig;
  bodyMode: BodyMode;
  bodyValue: string;
  pending: boolean;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onParamsChange: (rows: KeyValueRow[]) => void;
  onHeadersChange: (rows: KeyValueRow[]) => void;
  onAuthChange: (auth: AuthConfig) => void;
  onBodyModeChange: (mode: BodyMode) => void;
  onBodyValueChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

export function RequestBuilder({
  method,
  url,
  params,
  headers,
  auth,
  bodyMode,
  bodyValue,
  pending,
  onMethodChange,
  onUrlChange,
  onParamsChange,
  onHeadersChange,
  onAuthChange,
  onBodyModeChange,
  onBodyValueChange,
  onSend,
  onCancel,
}: RequestBuilderProps) {
  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="api-studio-method" className="sr-only">
          HTTP method
        </label>
        <select
          id="api-studio-method"
          value={method}
          onChange={(event) => onMethodChange(event.target.value as HttpMethod)}
          className="h-9 rounded-md border border-border bg-background px-2.5 text-sm font-medium text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:w-32"
        >
          {ALLOWED_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label htmlFor="api-studio-url" className="sr-only">
          Request URL
        </label>
        <Input
          id="api-studio-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="https://api.example.com/users"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          className="flex-1"
        />

        {pending ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="sm:w-28"
          >
            <X className="size-4" />
            Cancel
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={!url.trim()}
            className="border border-brand-accent/40 bg-brand-accent/10 text-brand-accent-hover hover:bg-brand-accent/20 sm:w-28"
          >
            <Send className="size-4" />
            Send
          </Button>
        )}
      </form>

      {pending && (
        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Loader2 className="size-3.5 animate-spin" />
          Sending request…
        </p>
      )}

      <Tabs defaultValue="params">
        <TabsList>
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params">
          <KeyValueEditor
            rows={params}
            onChange={onParamsChange}
            addLabel="Add param"
          />
        </TabsContent>

        <TabsContent value="headers">
          <KeyValueEditor
            rows={headers}
            onChange={onHeadersChange}
            addLabel="Add header"
          />
        </TabsContent>

        <TabsContent value="auth">
          <AuthEditor auth={auth} onChange={onAuthChange} />
        </TabsContent>

        <TabsContent value="body">
          <BodyEditor
            mode={bodyMode}
            value={bodyValue}
            onModeChange={onBodyModeChange}
            onValueChange={onBodyValueChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

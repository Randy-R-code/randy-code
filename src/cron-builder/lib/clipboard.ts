/** Best-effort — the Clipboard API can be unavailable (insecure context, permissions) and callers should stay usable either way. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

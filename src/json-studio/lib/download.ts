/** Triggers a browser download of `content` as a JSON file. No network involved. */
export function downloadJson(content: string, filename: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Give the browser a tick to pick up the URL before revoking it.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

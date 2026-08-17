const TEXT_LIKE_CONTENT_TYPE =
  /^(text\/|application\/(json|xml|javascript|x-www-form-urlencoded)|[^;]+\+(json|xml))/i;

/** Shared between the outbound proxy's response reader and the webhook ingestion route — both decide UTF-8 vs base64 the same way. */
export function isTextLikeContentType(contentType: string): boolean {
  return TEXT_LIKE_CONTENT_TYPE.test(contentType);
}

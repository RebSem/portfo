/**
 * A compound word such as "AI-агентов" or "B2B-звонков" must not break at its
 * hyphen: a balanced or long line happily does, and "B2B-" then "звонков" reads
 * as two words. Callers split the text with chunks() and wrap every token that
 * passes HYPHENATED in a `<span class="nb">` (white-space: nowrap in
 * global.css). The characters stay the same, so copy-paste and the page text
 * are unchanged. Pure, so the rule is unit-tested.
 */
export const HYPHENATED = /[\p{L}\p{N}]-[\p{L}\p{N}]/u;

// Words and the whitespace between them as separate tokens: joining the result
// gives back the original string.
export const chunks = (value: string): string[] => value.split(/(\s+)/);

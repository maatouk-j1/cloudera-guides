import {
  createHighlighter,
  type BundledHighlighterOptions,
  type Highlighter,
} from "shiki";

// A `transcript` fence records a real session — prompt, command and output
// interleaved — and shiki cannot colour one. The shell grammar only opens a
// command at the start of a line or straight after `;`, `|`, `&`, `!`, `(`, `{`
// or a backtick, and a consumed prompt leaves a space in front of the command,
// so the rule never fires and the whole line falls through to the plain colour.
//
// So we split each line ourselves and hand only the command to the `bash`
// grammar, where it starts a fresh string and tokenises normally. The prompt is
// coloured as chrome and the output is left plain.

const TRANSCRIPT_LANG = "transcript";

// `[root@host ~]#` or `user@host:~$`, then the sigil, then at least one space.
// Requiring that space keeps a commented-out command such as
// `#/opt/cloudera/installer/uninstall-cloudera-manager.sh` out of the match.
const PROMPT = /^(\s*)((?:\[[^\]\n]*\]|[\w.-]+@[\w.-]+:\S*)\s*[$#%>])([ \t]+)(.*)$/;

// one-dark-pro's comment grey. The prompt is not the command, and must not
// compete with it.
const PROMPT_COLOR = "#7F848E";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTranscript(
  highlighter: Highlighter,
  code: string,
  theme: string,
) {
  const { bg, fg } = highlighter.getTheme(theme);

  const lines = code.split("\n").map((line) => {
    const match = PROMPT.exec(line);

    // Output, and file contents pasted into the session, carry no grammar.
    if (!match) return line === "" ? [] : [{ content: line, color: fg }];

    const [, indent, prompt, gap, command] = match;
    const tokens =
      highlighter.codeToTokens(command, { lang: "bash", theme }).tokens[0] ?? [];

    return [
      { content: indent + prompt, color: PROMPT_COLOR },
      { content: gap, color: fg },
      ...tokens.map((token) => ({
        content: token.content,
        color: token.color ?? fg,
      })),
    ];
  });

  // Mirrors shiki's own markup, so `rehype-pretty-code` parses it back and
  // applies grid, line numbers and `onVisitLine` exactly as for any other fence.
  const body = lines
    .map(
      (tokens) =>
        `<span class="line">${tokens
          .map(
            (token) =>
              `<span style="color:${token.color}">${escapeHtml(token.content)}</span>`,
          )
          .join("")}</span>`,
    )
    .join("\n");

  return `<pre class="shiki" style="background-color:${bg};color:${fg}" tabindex="0"><code>${body}</code></pre>`;
}

export async function getTranscriptHighlighter(
  options: BundledHighlighterOptions<any, any>,
): Promise<Highlighter> {
  const highlighter = await createHighlighter({
    ...options,
    langs: [...((options.langs as string[]) ?? []), "bash"],
  } as any);

  return new Proxy(highlighter, {
    get(target, property) {
      if (property === "codeToHtml") {
        return (code: string, codeOptions: any) =>
          codeOptions?.lang === TRANSCRIPT_LANG
            ? renderTranscript(target, code, codeOptions.theme)
            : target.codeToHtml(code, codeOptions);
      }

      // `transcript` is not a real grammar, so keep it away from the loader.
      if (property === "loadLanguage") {
        return (...langs: any[]) => {
          const rest = langs.filter((lang) => lang !== TRANSCRIPT_LANG);
          return rest.length ? target.loadLanguage(...rest) : Promise.resolve();
        };
      }

      const value = Reflect.get(target, property);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public check-in mock fixtures and first-name-only result logic isolated from the CRM directory in a browser-safe module, so public screens cannot accidentally expose contact records.
- Use an un-nested event QR route and hide shared navigation for QR/public arrival paths; this keeps the door poster printable and the mobile arrival flow independent of the CRM shell.
- Encode the current site's public check-in URL in QR codes and display that same URL as fallback text; no unconfigured short-domain redirects.

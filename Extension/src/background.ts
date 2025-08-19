// extension/background.ts
function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  (
    details: chrome.webRequest.OnBeforeRequestDetails
  ): chrome.webRequest.BlockingResponse | undefined => {
    const url = details.url;

    // 1) Skip any requests to your local backend
    if (url.startsWith("http://localhost:3001")) {
      return;
    }

    const domain = getDomain(url);
    const firstParty = (details.initiator ?? "").includes(domain);

    // 2) Send to your server, but don’t let errors bubble up
    try {
      fetch("http://localhost:3001/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, firstParty }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Server responded", res.status, res.statusText);
          }
        })
        .catch((err) => {
          console.error("Fetch failed:", err, "→", url);
        });
    } catch (err) {
      console.error("Unexpected error in fetch call:", err);
    }

    // 3) Return undefined so we don’t block/modify the request
    return;
  },
  { urls: ["<all_urls>"] }
);

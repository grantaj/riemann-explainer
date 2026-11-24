# Riemann — the hidden order of primes

An interactive journey from prime numbers to the Riemann hypothesis, with a source-linked proof explorer. The site is static HTML, CSS and ES modules; all numerical visualisations run locally.

## Run locally

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000/ (ES modules require HTTP rather than file://).

## Development roadmap

- [Phase 1: interactive foundations](https://github.com/grantaj/riemann-explainer/issues/1)
- [Phase 2: bridge to the proof](https://github.com/grantaj/riemann-explainer/issues/2)
- [Phase 3: proof explorer](https://github.com/grantaj/riemann-explainer/issues/3)

## Files

- `index.html`: six foundation chapters, accessible controls, links to sources
- `proof.html`, `proof.mjs`: Phase 2 bridge, ten experiments, dated verification record and source-linked map
- `style.css`: responsive dark visual system
- `math.mjs`: pure numerical kernels and first 30 positive zero ordinates (standard values, see [LMFDB](https://www.lmfdb.org/zeros/zeta/))
- `app.mjs`: SVG plots and canvas domain colouring
- `tests/`: numerical regression tests and desktop/mobile Chromium smoke tests

Run numerical tests with `node --test tests/*.test.mjs`. To run the browser smoke test, install Playwright (`npm install --no-save --package-lock=false playwright@1.56.1` and `npx playwright install chromium`), start the HTTP server, then run `node tests/browser.mjs`.

The domain colouring uses Euler–Maclaurin summation with N=max(40,ceil(0.55|Im(s)|)) and eight corrections, over the displayed domains only. The pole is handled separately; the arithmetic uses double precision, not certified intervals. The explicit formula uses finite conjugate-pair sums and the exact prime-power staircase. At jumps the infinite explicit formula converges to the midpoint. The hypothetical off-line experiment compares single-pair envelopes, not a proof or a numerical model of all zeros.

## GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. The Test and publish workflow runs mathematical and browser checks on PRs and deploys only after the checks pass on main. Expected project URL: https://grantaj.github.io/riemann-explainer/

The repository is public. CI uses the Chrome already installed on the GitHub-hosted runner, avoiding browser downloads and system dependency installation. Locally, set `CHROME_PATH` to an installed Chrome/Chromium executable to skip the Playwright browser download. Superseded runs are cancelled automatically.

## Sources

The site links NIST DLMF §§25.2, 25.4, 25.10, 25.16, John Baez's explicit formula exposition, and LMFDB. Phase 2 links the original Alpöge announcement, the 21 November Lean community certification, independent verification logs and mathematical reading projects. It distinguishes the verified formal result from gaps in our exposition and from the separate Masullo draft. Phase 3 gives a backward dependency walkthrough with source links, the classical analytic argument, the four-term error bracket, a computed residue-table example and clearly marked conditional arithmetic reconstructions. It does not claim a complete independent prose proof. Masullo is mentioned only in one sentence.


- `argument.html`, `argument.mjs`: Phase 3, focused on the certified Alpöge–Claude proof. Original declaration links are pinned at 40e56bab026552e089d7afcfeff08d2defb9c005; named-declaration status is attributed to the Naskręcki atlas, not our own replay.

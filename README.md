# Metabolic Mind: Four GLP-1 claims. Myth or fact?

A 60-second, no-login, mobile-first myth-or-fact game for Steer (Problem Statement 1).
Plain HTML, CSS and JavaScript. No framework, no build step, no tracking.

## The three one-liners

- **Trigger:** "Four things you've heard about GLP-1 medicines. Which are true?" A challenge on the first screen, one tap to start.
- **Value:** The player picks their loudest worry and their week, then calls four claims myth or fact. Each call reveals the answer with a source. The readout answers their own worry first, lists all four claims with links, and gives three questions to take to a doctor.
- **Next step:** "See if the programme fits you" opens steerclub.com with the worry, routine and score in the link. "Copy my summary" lets the player share the same details with a doctor themselves. Nothing is collected by this page.

## Flow

intro -> loudest worry -> normal week -> 4 myth-or-fact claims (the player's worry comes first) -> readout and handoff

## Claims, answers and sources

| Claim shown | Answer | Source |
|---|---|---|
| GLP-1 medicines are only for people with diabetes | Myth | STEP 1 trial extension (Wilding et al., Diabetes, Obesity and Metabolism, 2022): enrolled adults without diabetes, BMI 30+ or 27+ with a weight-related condition. STAT News opinion essay (17 Mar 2026) for lower-BMI risk in South Asian bodies |
| Most side effects are in the stomach and often ease | Fact | Patient handout on lifestylemedicine.org |
| You lose only fat, never any lean mass | Myth | STEP 1 body-composition (DEXA) exploratory analysis: lean mass fell about 9.7%, its share of body weight rose about 3 points |
| Once the weight is off, it stays off by itself | Myth | STEP 1 trial extension: about two-thirds of lost weight regained within a year of stopping |

## Needs a Steer doctor's sign-off before this goes live

I checked the numbers against the search excerpts and the handout. The PubMed Central pages blocked automated access, so the two trial papers were **not** opened in full by me. Please have a clinician check:

1. The two trial results come from studies of **one** GLP-1 medicine. The page says "one trial" and the footer says other medicines can differ. Confirm that wording is acceptable.
2. The South Asian BMI line cites an **opinion essay**, not a guideline. Swap in a WHO or Indian guideline link if you have one.
3. "Less common problems exist" and "symptoms that don't settle need a call to your care team" come from the handout.
4. The Steer lines (tests first, DEXA, protect muscle, planned exit) come from the hackathon brief.

## Brand pack

Cream base, rust and maroon, serif headlines with italic accents, DM Sans body, a handwritten accent for small asides, sentence case, lowercase "steer", sign-off steerclub.com. One deliberate deviation: the brand clay is only 2.66:1 on cream, so captions use a darker clay (`#7A5547`, 5.5:1). Clay itself is kept for borders.

## Privacy and the handoff

No cookies, storage, analytics or requests from the script. The only third-party request is Google Fonts. The handoff link adds `utm_content=worry-<worry>_routine-<routine>_score-<n>`. I have not checked whether steerclub.com reads these, so confirm with the Steer team.

## What was tested

Automated, in a simulated DOM (jsdom), plus static checks: scoring, ordering, URL building, a full run, wrong answers, Back, clipboard success and failure, broken-markup fallback, palette, font sizes, uppercase, contrast ratios. 34 checks pass.

**Not tested:** a real browser, real phones, Lighthouse, a screen reader, or Meta's playable-ad packaging. Please try it on your phone before you submit.

## Run it

Open `index.html`. To deploy, replace `index.html`, `style.css` and `script.js` in the repo and let Netlify redeploy.

## Tools

Built with Claude (Anthropic) with the brand pack and problem statement as input. Sources found through web search.

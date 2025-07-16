# michielo.com frontend

This is the frontend repository for michielo.com. The frontend landing/portfolio is based on a basic react app with the aim being a simplistic/minimalistic, sleek and easy-to-read design that is able to showcase my projects and give a basic introduction.

Visit the site [here](https://michielo.com).

I tried to make the site quite strong performance wise using standard UX/UI practices such as placeholders/skeletons, preferring loading static content rather than whatever needs to be fetched from the backend etc.
Both the front and backend use standard caching practices with the focus on having required information ready when possible (and of course avoiding getting rate limited when fetching projects from external api


This repo also includes the documentation for my projects. I used docsify for this to automatically convert markdown into documentation bootstrapped with a Tailwind CDN and some custom CSS. This allows me to easily update & create documentation whilst retaining the style that I'm aiming for the main site.

## Ratings

- [PageSpeed insights - desktop](https://pagespeed.web.dev/analysis/https-michielo-com/3no2uguk0p?form_factor=desktop) <br>
  The scores from PageSpeed insights gives the desktop version performance 100/100, accessibility 100/100, best practices 100/100, SEO 100/100
- [PageSpeed insights - mobile](https://pagespeed.web.dev/analysis/https-michielo-com/3no2uguk0p?form_factor=mobile) <br>
  The scores from PageSpeed insights gives the mobile version performance 99/100, accessibility 100/100, best practices 100/100, SEO 100/100
- [Pingdom Website Speed Test](https://tools.pingdom.com/#65fd8ca49a000000) <br>
  Performance grade 98 (A)
- [DebugBear](https://www.debugbear.com/test/website-speed/J9kVO7Kc/overview#) <br>
  Lab score 94%

This all reveals that the mobile compatibility needs some more work (pagespeed mobile, debugbear) and that the desktop is pretty stable (pagespeed desktop, pingdom). It goes without mention that these rating are defintely influenced by the type of site and as the landing page contains no images etc. it is faster than a website that would include images in their landing page. I personally just like minimalistic sleek designs so this worked out pretty well.

## Sources
- Papers - statically loaded as this changes very rarely & wanting to use differing sources.
- Plugins - Server & player statistics from [bstats](https://bstats.org). Plugin names, downloads, ratings from [spigotmc.org](https://www.spigotmc.org).
- Discord bots - Currently static, this will be using a W.I.P. backend API for the auditlogger bots.
- AI models - All information from [HuggingFace](https://huggingface.co).
- Websites - All information from [Cloudflare](https://www.cloudflare.com).
- Mods - All information from [Steam](https://store.steampowered.com).

## Credits
Boilerplate from [react.dev](https://react.dev/community/acknowledgements)
Documentation with [docsify](https://docsify.js.org/#/)

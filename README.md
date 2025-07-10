# michielo.com frontend

This is the frontend repository for michielo.com. The frontend is based on a basic react app with the aim being a simplistic/minimalistic, sleek and easy-to-read design that is able to showcase my projects and give a basic introduction.

Visit the site [here](https://michielo.com).

## PageSpeed ratings
- [PageSpeed insights - desktop](https://pagespeed.web.dev/analysis/https-www-michielo-com/l6tfwt1zpr?form_factor=desktop) <br>
  The scores from PageSpeed insights gives the desktop version performance 100/100, accessibility 96/100, best practices 100/100, SEO 100/100
- [PageSpeed insights - mobile](https://pagespeed.web.dev/analysis/https-www-michielo-com/l6tfwt1zpr?form_factor=mobile) <br>
  The scores from PageSpeed insights gives the mobile version performance 98/100, accessibility 96/100, best practices 100/100, SEO 100/100

I tried to make the site quite strong performance wise using standard UX/UI practices such as placeholders/skeletons, preferring loading static content rather than whatever needs to be fetched from the backend etc.
Both the front and backend use standard caching practices with the focus on having required information ready when possible (and of course avoiding getting rate limited when fetching projects from external api's)

## Sources
- Papers - statically loaded as this changes very rarely & wanting to use differing sources.
- Plugins - Server & player statistics from [bstats](https://bstats.org). Plugin names, downloads, ratings from [spigotmc.org](https://www.spigotmc.org).
- Discord bots - Currently static, this will be using a W.I.P. backend API for the auditlogger bots.
- AI models - All information from [HuggingFace](https://huggingface.co).
- Websites - All information from [Cloudflare](https://www.cloudflare.com).
- Mods - All information from [Steam](https://store.steampowered.com).

## Credits
Boilerplate from [react.dev](https://react.dev/community/acknowledgements)

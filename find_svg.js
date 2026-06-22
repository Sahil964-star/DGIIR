const fs = require('fs');

fetch('https://en.wikipedia.org/wiki/Districts_of_Delhi')
  .then(r => r.text())
  .then(html => {
    const matches = html.match(/upload\.wikimedia\.org\/wikipedia\/commons\/[^"']+\.svg/gi);
    if (matches) {
      console.log(Array.from(new Set(matches)));
    } else {
      console.log("No SVG found.");
    }
  })
  .catch(err => console.error(err));

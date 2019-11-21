# Vraic-ts
This is a Web Components Library written in TypeScript with one dependency (TypeScript). It requires use of TypeScript since it makes use of class/property decorators (in theory it could also be ported to Babel, or vanilla JavaScript when decorators get implemented). For end-to-end testing it uses Courgette style tests (similar to NUnit) and Puppeteer, but this could be replaced with any other testing system.

## Features
* No npm dependencies, can use without Webpack
* Simple and lightweight, core code is approx 5KB (Brotli compressed)
* includes Router class
* Uses @Component syntax for declaring component
* Uses @Attrib decorator for mapping custom HTML attributes to TypeScript properties
* Uses @Output decorator for mapping HTML handlerbars {{output}} fields to TypeScript properties (this is likely to be renamed to avoid confusion with Angular @Input and @Output decorators)

## Issues/Limitations/To Do List
- [ ] Needs to be packaged for Nuget
- [ ] HTML template parsing code needs to be refactored/simplified
- [ ] Event handling needs to be rewritten to use single event handler per component
- [ ] Unit tests need to be added to core code, but this will be done after the HTML parsing and event handling changes
- [ ] e2e testing highlighted problem with Puppeteer's date serialisation which needs further investigation (example component PersonForm DTO fails e2e test)
- [ ] Should rename @Output decorator to something else.

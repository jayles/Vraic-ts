# Vraic-ts
This is a Web Components Library written in TypeScript with one dependency (TypeScript). It requires use of TypeScript since it makes use of class/property decorators (in theory it could also be ported to Babel, or vanilla JavaScript when decorators get implemented). For end-to-end testing it uses Courgette style tests (similar to NUnit) and Puppeteer, but this could be replaced with any other testing system.

There are example components in the Components subfolder.

## Features
* No npm dependencies, can be used without Webpack
* Simple and lightweight, core code is approx 5KB (Brotli compressed)
* Uses {{handlerbars}} syntax to denote output fields in HTML templates
* Uses @\<event name> to attach DOM events to HTML elements, e.g. @click, @change
* Includes Router class
* Includes BaseInputForm\<T> class which automates copying data from a DTO (of type T) into a HTML form, and also copying back to the DTO when the Submit button is clicked.
* Uses @Component syntax for declaring component, e.g. @Component('my-header')
* Uses @Attrib decorator for mapping custom HTML attributes to TypeScript properties
* Uses @Output decorator for mapping HTML handlerbars {{output}} fields to TypeScript properties (this is likely to be renamed to avoid confusion with Angular @Input and @Output decorators)
* Separation of Concerns - components are written using three separate files: .html, .ts and .css

## Issues/Limitations/To Do List
- [ ] Needs to be packaged for Nuget
- [ ] HTML template parsing code needs to be refactored/simplified
- [ ] Event handling needs to be rewritten to use single event handler per component
- [ ] Unit tests need to be added to core code, but this will be done after the HTML parsing and event handling changes
- [ ] Should rename @Output decorator to something else
- [ ] e2e testing highlighted problem with Puppeteer's date serialisation which needs further investigation (example component PersonForm DTO fails e2e test)
- [ ] e2e testing with Puppeteer uses long paths to target HTML elements due to the shadow DOM piercing problem. There used to be a '>>>' shadow DOM piercing CSS selector, but this has been removed from Chromium/Chrome. This will be an issue for all web component libraries that are using Puppeteer for e2e testing. Best solution for now will be to add a façade class to Vraic that simplifies the frequently used tests. [See this Puppeteer issue for more info](https://github.com/GoogleChrome/puppeteer/issues/858)

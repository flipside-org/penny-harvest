#Website
========
Website for the penny harvest.

## Installation
To set up the development environment for this website, you'll need to install the following on your system:

- Npm
- compass & sass
- Grunt ( $ npm install -g grunt-cli )
- Bower ($ npm install -g bower)


After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install

```
```
$ bower install
```
Bower will create a vendor directory in the src with all the sass and js needed for foundation. Nothing needs to be done there.

You might have to run these as sudo.

## Getting started

```
$ grunt watch
```
Compiles the compass files, javascripts and generates the website.
The system will watch files and execute tasks whenever one of them changes.


### Other commands
Clean the compiled sass and javascript:
```
$ grunt clean
```

Compile the compass files, javascripts and generate the website. Use this instead of ```grunt watch``` if you just want to render it once:
```
$ grunt
```

Compile the compass files and javascripts prepared for production (minified, uglyfied). Every time changes will be pushed to production, this command needs to be run:
```
$ grunt prod
```

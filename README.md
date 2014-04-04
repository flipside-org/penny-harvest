#Website
========
Website for penny harvest

## Installation
To set up the development environment for this website, you'll need to install the following on your system:

- Npm
- compass & sass
- Grunt ( $ npm install -g grunt-cli )
- Bower ($ npm install -g bower)
- jekyll ( $ gem install jekyll )


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
To set up your development environment, you'll have to run the following two commands in seperate terminals.

```
$ grunt
```
Compiles the compass files, javascripts and generates the website.
The system will watch files and execute tasks whenever one of them changes.

```
$ grunt jk
```
Spans a jekyll server, the website will be accesible on localhost:4000.

### Other commands
Clean the compiled sass, javascript, and _/site:
```
$ grunt clean
```

Compile the compass files, javascripts and generate the website. Use this instead of ```grunt``` if you just want to render it once:
```
$ grunt build
```

Compile the compass files and javascripts prepared for production (minified, uglyfied). Every time changes will be pushed to production, this command needs to be run:
```
$ grunt prod
```
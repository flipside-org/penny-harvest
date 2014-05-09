#PH Organization Finder
========
The Organization Finder allows kids that participate in the [Penny Harvest](http://www.commoncents.org/go/penny-harvest) to find organizations in their neighbourhood. The first prototype focuses on the New York area and is built using [Jekyll](http://jekyllrb.com/), [Foundation](http://foundation.zurb.com/) and [Leaflet](http://leafletjs.com/).

The data for the Organization Finder is wrangled in: https://github.com/flipside-org/ph-data/

__Current status:__ this prototype is a work in progress and has not been officially launched yet.

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Npm
- compass & sass
- Sassy Strings ( $ gem install sassy-strings )
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

### Getting started
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

## Team

Daniel da Silva - [Github](https://github.com/danielfdsilva)  
Ricardo Mestre - [Github](https://github.com/ricardomestre)  
Olaf Veerman - [Github](https://github.com/olafveerman)
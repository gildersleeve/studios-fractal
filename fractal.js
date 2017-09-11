'use strict';

/*
* Require the path module
*/
const path = require('path');

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Uberpage 3.0 Fractal');
fractal.set('project.version', '3.0.0');

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.set('default.preview', '@preview');



/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));
fractal.web.set('static.mount', '/public');
fractal.web.set('builder.dest', __dirname + '/build');
fractal.web.set('server.sync', true);

const hbs = require('@frctl/handlebars')({
    helpers: {

        stripSpaces: function(str) {
            return str.replace(/\s+/g, '');
        },

        newSection: function(options){
          if (typeof options.data.root.pageSection === 'undefined') {
            options.data.root.pageSection = -1;
          }
          return ++options.data.root.pageSection + 1;
        },
        getSection: function(options){
          return options.data.root.pageSection + 1;
        },
        get: function(str, options){
          if (typeof options.data.root.pageSection === 'undefined') {
            return options.data.root[0][str].value;
          } else {
            return options.data.root[options.data.root.pageSection][str].value;
          }
        },
        getCurrent: function (ptr, options) {
          if (typeof options.data.root.pageSection === 'undefined') {
            return options.data.root[0].ptr;
          } else {
            return options.data.root[options.data.root.pageSection][ptr];
          }
        },
        setVariable: function(varName, varValue, options){
          options.data.root[varName] = varValue;
          /*

          {{setVariable "thisVar" "1"}}
          {{thisVar}}

          */
        },

/*
        // replace this with the native call to move out of admin
        returnAttrText: function(d) {
          var l = d.attr.replace(/\s+/g, '');
          var s = '<exp:attr type="text"  name="' + l + '" title="' + d.attr + '" ></exp:attr>';
          //s += '${' + d.attr + '}';
          s += d.value;
          return s;
        },
        returnAttrImage: function(d) {
          var l = d.attr.replace(/\s+/g, '');
          var s = '<exp:attr type="image"  name="' + l + '" title="' + d.attr + '" ></exp:attr>';
          //s += '${' + d.attr + '}';
          return s;
        },
        returnAttrTextValue: function(d) {
          return d.value;
        },
        */
        returnAttrImagePath: function(d) {
          return contents.d.value;
        }
    }
    /* other configuration options here */
});

const instance = fractal.components.engine(hbs); /* set as the default template engine for components */
fractal.docs.engine(hbs); /* you can also use the same instance for documentation, if you like! */


// setup/import etc...

const fs = require('fs');

/*
 * Fractal export command.
 *
 * Exports all view templates into a directory in the root of the project.
 * Templates are exported in a flat structure with the filenames in the format of {handle}.{ext}
 *
 * Any @handle references in the templates (for partial includes etc) are re-written
 * to reference the appropriate template path.
 *
 * Run by using the command `fractal export` in the root of the project directory.
 */
function exportTemplates(args, done) {

    const app = this.fractal;
    const items = app.components.flattenDeep().toArray();
    const jobs = [];

    for (const item of items) {

        const exportPath = path.join('./', args.options.output || 'exported', `${item.alias || item.handle}${app.get('components.ext')}`);
        const job = item.getContent().then(str => {
            return str.replace(/\@([0-9a-zA-Z\-\_]*)/g, function(match, handle){
                return `${handle}${app.get('components.ext')}`;
            });
        }).then(str => {
            return fs.writeFileSync(exportPath, str);
        });

        jobs.push(job);
    }

    return Promise.all(jobs);
}

fractal.cli.command('export', exportTemplates,  {
    description: 'Export all component templates',
    options: [
        ['-o, --output <output-dir>', 'The directory to export components into, relative to the CWD.'],
    ]
});

// compile exported .hbs files into templates.js
//handlebars -m /Users/zach.gildersleeve/fractal/studios-fractal/exported/ -e 'hbs' > /Users/zach.gildersleeve/fractal/studios-fractal/exported/templates.js

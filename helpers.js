(function(root, factory) {
  if (typeof exports !== 'undefined') {
    // Node.js
    module.exports = factory(root);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
      return factory(root);
    });
  } else {
    // Browser globals
    root.BasbosaHelpers = factory(root);
  }
}(this, function(root) {

  var htmlInstance, textInstance, utilInstance, formInstance;

  var Html = function() {
    // Try to load default config from Basbosa config
    if (typeof Basbosa !== 'undefined' && typeof Basbosa('Config') !== 'undefined') {
      this.options({
        webRoot : Basbosa('Config').get('webRoot')
      });
    }
  };
  
  Html.prototype = {
    settings : {
      webRoot : 'http://localhost:3000',
    }, 
    
    options : function(options) {
      if (typeof options === 'undefined') return this.settings;
      
      for (var key in this.settings) {
        if (typeof options[key] !== 'undefined') this.settings[key] = options[key];
      }
    },
    
    htmlOptions : function (options) {
      var res = '';
      if (typeof options !== 'object') return '';
      for (var k in options) {
        res += ' ' + k + '="' + options[k] + '"';
      }
      return res;
    },

    parseGetParams : function(getOptions) {
      var optionsArr = [];

      for (var k in getOptions) {
        optionsArr.push(k + '=' + encodeURIComponent(getOptions[k]));
      }

      if (optionsArr.length) {
        return '?' + optionsArr.join('&');
      }
      return '';
    },

    link : function(link, title, options) { 
      var getOptions = '';
      options = options || {};

      // Handle if this is should be an absolute link
      if (options.full && link.indexOf('://') === -1) link = this.options().webRoot + link;

      // Handle get parameters
      if (options.get) {
        link += this.parseGetParams(options.get);
      }
      return '<a href="' + link +  '"' + this.htmlOptions(options) + ' >' + title + '</a>';
    },
    
    img : function(src, options) { 
      return '<img src="' + src + '"' + this.htmlOptions(options) + ' >';
    }
  };
  
   
  if (typeof htmlInstance === 'undefined') htmlInstance = new Html;
  if (typeof Basbosa !== 'undefined') {
    Basbosa.add('HtmlHelper', htmlInstance);
  }
  
  var Text = function() {};
  
  Text.prototype = {
    truncate : function(str, length) {
      length = length || 200;
      str = str.replace(/<(?:.|\n)*?>/gm, '');
      if (str.length > length)
      return str.substring(0, length) + '...';
      return str;
    },
    
    date : function(date) {
      var m_names = new Array("Jan", "Feb", "Mar", 
          "Apr", "May", "Jun", "Jul", "Aug", "Sept", 
          "Oct", "Nov", "Dec");

      var d = new Date(date);
      var curr_date = d.getDate();
      var curr_month = d.getMonth();
      var curr_year = d.getFullYear();
      return m_names[curr_month] + ' ' + curr_date + ', ' + curr_year;
    }
    
  };
  
  if (typeof textInstance === 'undefined') textInstance = new Text;
  if (typeof Basbosa !== 'undefined') {
    Basbosa.add('TextHelper', textInstance);
  }

  var Util = function() {};

  Util.prototype = {
    extend : function(obj) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    }
  };

  if (typeof utilInstance === 'undefined') utilInstance = new Util;
  if (typeof Basbosa !== 'undefined') {
    Basbosa.add('UtilHelper', utilInstance);
  }

  var Form = function() {};

  Form.prototype = {
    currentModel : false,

    setModel : function(modelName) {
      this.currentModel = modelName;
    },

    input : function(fieldName, options) {
      var currentModel = (fieldName.indexOf('.') > -1) ? fieldName.exlode('.')[0] : this.currentModel;
      var inputId = B('_').classify(fieldName.replace('.', ''));

      options = utilInstance.extend({
        label : B('_').humanize(fieldName),
        type : 'text',
        name : 'data[' + this.currentModel + '][' + fieldName + ']',
        id : inputId
      }, options);



      return '<div class="input">'
        + '<label for="' + inputId + '">' + options.label + '</label>'
        + '<input type="' + options.type + '" name="' + options.name +'" id="' + options.id + '"/>'
        + '</div>';
    }
  };

  if (typeof formInstance === 'undefined') formInstance = new Form;
  if (typeof Basbosa !== 'undefined') {
    Basbosa.add('FormHelper', formInstance);
  }


  return {
    Html : htmlInstance,
    HtmlClass : Html,
    Text : textInstance,
    TextClass : Text,
    Util : utilInstance,
    UtilClass : Util,
    Form : formInstance,
    FormClass : Form

  };
}));
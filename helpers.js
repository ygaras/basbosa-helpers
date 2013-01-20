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

  var htmlInstance, textInstance;

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
    
    link : function(link, title, options) { 
      options = options || {};
      if (options.full && link.indexOf('://') === -1) link = this.options.webRoot + link;
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
    excerpt : function(str, length) {
      length |= 200;
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
  
  return {
    Html : htmlInstance,
    HtmlClass : Html,
    Text : textInstance,
    TextClass : Text,
  };
}));
require=function e(t,r,n){function o(s,a){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var f=r[s]={exports:{}};t[s][0].call(f.exports,function(e){var r=t[s][1][e];return o(r?r:e)},f,f.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e){(function(t){YUI.add("flickr-router",function(t,r){"use strict";function n(e,r,n){var o,i=this;return n.redirect?(window.location=n.redirect,t.Promise.resolve()):(document.title=n.title,t.loaderBar.progress(),e.appContext.getView(n.view,n.params,n.layout).then(function(r){return t.loaderBar.progress(),o=r,o._params&&(o._params.keyEventScope=o.name+o._yuid),e.appContext.getKeyboardManager().setCurrentKeyEventScope(o.name+o._yuid),o.set("isRootView",!0),o.initialize()}).then(function(){var r,s;t.loaderBar.progress(),r=t.one("html"),s=r.get("className").trim(),s=s.replace(/html-[\S]+-view/,"html-"+n.view),s=s.replace(/[\S]+-layout/,n.layout+"-layout"),s=s.replace("fluid",""),s+=n.fluid?" fluid":"",r.set("className",s),e.transactionId===i.currentTransactionId&&i.app.showView(o,null,{render:!0,callback:function(){t.loaderBar.finish(),"popstate"!==e.src&&window.scroll(0,0)}})}).then(null,function(e){throw s.error("Render had an error",{err:e}),e}))}var o,i,s=e("lib/flog")(r);i="scrolling",t.FlickrRouter=function(e,t){return this.app=e,this.route=e.route.bind(e),this.render=n.bind(this),this.setupRoutes(t),this},t.FlickrRouter.prototype={setupRoutes:function(e){var t,r,n,o,i;for(n in e.patterns)this.registerParam(n,new RegExp(e.patterns[n]));for(t=0;t<e.routes.length;t++)if(o=e.routes[t],o.path instanceof Array)for(r=0;r<o.path.length;r++){i={};for(n in o)"path"!==n&&(i[n]=o[n]);i.path=o.path[r],this.registerRoute(i)}else this.registerRoute(o)},registerParam:function(e,t){this.app.param(e,t)},registerRoute:function(r){var n=this;this.route(r.path,function(e,r,n){"appContext"in window?e.appContext=window.appContext:t.config.win&&t.config.win.beaconError&&t.config.win.beaconError("[flickr-router] No appcontext.",t.config.win.location.href),n()},t.Middleware.MobileRedirect(r),e("lib/middleware/normalize-params-hash")(),e("lib/middleware/normalize-param")("nsid_or_path_alias"),e("lib/middleware/normalize-path-params")(),e("lib/middleware/set-route-config")(r),function(e,t,i){return o.bounceRoute(e,t,i,r,n)},function(e,t,n){return o.checkOptIn(e,t,n,r)},function(e,t,n){return o.checkAndKick(e,t,n,r)},function(e,t,n){return o.mixInServerRequest(e,t,n,r)},function(e,t,i){return o.checkAndInterstitial(e,t,i,r,n)},function(e,t,o){n._processRequest(r,e,t,o)})},_processRequest:function(e,r,n,o){var i=this;r.transactionId=t.guid(),this.currentTransactionId=r.transactionId,r.appContext.startTime=Date.now(),r.appContext.getRoute(e.module).then(function(e){var o,s;return i.executingRoute=e,o=t.when(null),s={id:r.id,isInsecureGod:r.isInsecureGod,cookies:r.cookies,headers:r.headers,params:r.params,url:r.url.toString(),query:r.query,buckets:r.buckets,lang:r.lang,probableUser:r.probableUser,UA:r.UA},r.isGod&&(s.isGod=r.isGod),r.routeTimingStart=Date.now(),t.Promise.all([o,e.run(s,n)])}).then(function(e){return e.length>=2&&(r.appContext.initialView=e[1].view),e[1].isMobile?(s.log("route is being processed as mobile"),e[1].params||(e[1].params={}),e[1].params.isMobile=!0):s.log("route is being processed as desktop"),i._renderView(e,r,n,o)}).then(null,function(e){return i._throwError.call(i,e,r,n,o)})},_renderView:function(e,r,n){var o,a=e.length>0?e[0]:null,u=e.length>1?e[1]:null;if(!u)throw new Error("Invalid viewConfig");if(a){if(a.signedIn&&a.user&&a.user.username?s.info("user is signed in",{nsid:a.user.nsid,username:a.user.username._content}):s.info("user is signed out"),a.signedIn&&a.user)for(o in a.user)"undefined"==typeof YUI.Env.config.auth.whitelisted_keys[o]&&delete a.user[o];a.isInsecureGod=r.isInsecureGod,r.appContext.auth=a,r.appContext.initCuratorTools()}return u&&"undefined"!=typeof u.params&&(u.params.isOwner=r.appContext.getViewer().signedIn&&r.appContext.getViewer().nsid===u.params.nsid),u.redirect?this.render(r,n,u):(u.layout=u.layout||i,u.title=t.pageTitleHelper(u.title),r.appContext.routeTiming=Date.now()-r.routeTimingStart,this.render(r,n,u))},_throwError:function(e,r,n,o){var i,a,u=r&&r.UA&&(r.UA.isBot||r.UA.isSharingBot),c=u?t.fletrics.getBotString():"",f=this;if(n.headersSent)return s.info("server render called but headers have already been sent",{timeout:r.timeout}),void 0;if(e.is404)return i=f.executingRoute.display404Error(r,e),a=f.render(r,n,i);if(r&&r.appContext&&e&&e.message&&e.message.indexOf("Not enough storage is available to complete this operation")>-1)return t.config.win&&t.config.win.beaconError&&t.config.win.beaconError("[flickr-router] IE Memory Issue:"+e.message,t.config.win.location.href,e),r.appContext.mitigateClientPanda("common.IE_STORAGE_ISSUE");try{if(t.fletrics.increment("page.failures"+c),s.error("Reboot page failure",{err:e,req:r}),e.fatal?e.timeout||e.clientTimeout?(t.fletrics.increment("api.timeouts"+c),s.error("Unexpected error",{err:e,metric:"api.timeouts"+c})):"Site Auth Failed"===e.message?(t.fletrics.increment("siteauth.failures"),e.type="SiteAuth",e.redirect=!0):"Session Failed"===e.message?(t.fletrics.increment("sessioncookie.failures"),e.type="SiteAuth",e.redirect=!0):(t.fletrics.increment("api.other"+c),s.error("Unexpected error",{err:e,metric:"api.other"+c})):(t.fletrics.increment("page.failures.other"+c),s.error("Unexpected error",{err:e,metric:"page.failures.other",isBot:u}),t.config.win&&t.config.win.beaconError&&t.config.win.beaconError("[flickr-router] Unexpected page failure:"+e.message+" UA:"+(navigator&&navigator.userAgent||"").toString(),t.config.win.location.href,e)),t.config.win&&t.config.win.beaconError&&(!e.redirect||"SiteAuth"!==e.type)){e.panda=!0;var l="";r&&r.UA&&(l=" unsupported:"+r.UA.isUnsupportedBrowser+" "),t.config.win.beaconError("[flickr-router] "+e.message,t.config.win.location.href,e)}}catch(p){var d=p;"undefined"==typeof f.executingRoute&&(d=e),s.info({err:e});try{t.config.win&&t.config.win.beaconError&&(e.panda=!0,t.config.win.beaconError("[flickr-router] _throwError failed: "+e.message,t.config.win.location.href,e),d!==e&&t.config.win.beaconError(d.message,t.config.win.location.href,d))}catch(e){s.info("Failed trying to beacon client error",{err:e})}}return i=f.executingRoute.display500Error(r,e),a=f.render(r,n,i)}},o={checkAndKick:function(e,t,r,n){r()},checkAndInterstitial:function(e,t,r){r()},bounceRoute:function(e,t,r,n,o){r()},checkOptIn:function(e,t,r,n){r()},mixInServerRequest:function(e,r,n){t.mix(e,t.namespace("config.flickr.request")),n()}}},"0.0.1",{requires:["fletrics","oop","page-title-helper","moment","flickr-route","localizable","url","mobile-redirect"],langBundles:["misc"]})}).call(this,e("_process"))},{_process:7,"lib/flog":"lib/flog","lib/middleware/normalize-param":2,"lib/middleware/normalize-params-hash":3,"lib/middleware/normalize-path-params":4,"lib/middleware/set-route-config":5}],2:[function(e,t){var r=e("lib/helpers/type-validator");t.exports=function(e){return function(t,n,o){var i=t.params[e];return i&&"string"==typeof i?(r.nsid(i)||(t.params[e]=String(i).toLowerCase()),o(),void 0):o()}}},{"lib/helpers/type-validator":"lib/helpers/type-validator"}],3:[function(e,t){t.exports=function(){return function(e,t,r){var n;for(n in e.params)e.params[n]=e.params[n][0];r()}}},{}],4:[function(e,t){t.exports=function(){return function(e,t,r){e.params instanceof Array&&e.params.shift(),r()}}},{}],5:[function(e,t){t.exports=function(e){return function(t,r,n){"object"==typeof t.appContext?(t.appContext.routeConfig=e,n()):n(new Error("appContext is undefined"))}}},{}],6:[function(){},{}],7:[function(e,t){function r(){c=!1,s.length?u=s.concat(u):f=-1,u.length&&n()}function n(){if(!c){var e=setTimeout(r);c=!0;for(var t=u.length;t;){for(s=u,u=[];++f<t;)s&&s[f].run();f=-1,t=u.length}s=null,c=!1,clearTimeout(e)}}function o(e,t){this.fun=e,this.array=t}function i(){}var s,a=t.exports={},u=[],c=!1,f=-1;a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new o(e,t)),1!==u.length||c||setTimeout(n,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=i,a.addListener=i,a.once=i,a.off=i,a.removeListener=i,a.removeAllListeners=i,a.emit=i,a.binding=function(){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},{}],8:[function(e,t){var r=e("./index");t.exports=function(e,t){"undefined"!=typeof console&&(r.LEVELS[t]in console?console[r.LEVELS[t]](e):console.log(e))}},{"./index":10}],9:[function(e,t){t.exports=function(e){var t=Object.prototype.toString.call(e);switch(t){case"[object Number]":return function(t){return t.lvl>=e?t:void 0};case"[object String]":return function(t){return t.topic===e?t:void 0};case"[object Array]":return function(t){return~e.indexOf(t.topic)?t:void 0};case"[object RegExp]":return function(t){return e.test(t.topic)?t:void 0};case"[object Function]":return function(t){return e.call(null,t)?t:void 0};case"[object Boolean]":return function(t){return e?t:void 0};default:throw new Error("Unsupported filter type "+t+": "+e)}}},{}],10:[function(e,t,r){function n(e){this.topic=e}function o(e){for(var t=e.lvl,n=0;n<r._stack.length;n++)if(!(e=r._stack[n].call(null,e,t)))return;r._write(e,t)}function i(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}function s(e){return function(t,r){var n={time:new Date,topic:this.topic,lvl:e};"string"==typeof t&&(n.msg=t),"object"==typeof t&&i(n,t),"object"==typeof r&&i(n,r);try{o(n)}catch(s){}}}r=t.exports=function(e){return new n(e)},r.LOG=10,r.INFO=20,r.WARN=30,r.ERROR=40,r.LEVELS={},r.LEVELS[r.LOG]="log",r.LEVELS[r.INFO]="info",r.LEVELS[r.WARN]="warn",r.LEVELS[r.ERROR]="error",r._stack=[],r._write=e("./server"),r.use=function(e){return r._stack.push(e),r},n.prototype={log:s(r.LOG),info:s(r.INFO),warn:s(r.WARN),error:s(r.ERROR)},i(r,n.prototype)},{"./server":8}],11:[function(e,t,r){function n(){}function o(e){return function(){return new e}}function i(){}function s(){}function a(){}i.prototype={start:n,stop:n},s.prototype={increment:n,decrement:n,set:n,createStopwatch:o(i)},a.prototype={open:n,close:n,sync:n,metric:o(s)},r.TYPE_NUMBER=r.TYPE_STATS=r.TYPE_HISTOGRAM=r.TYPE_FORCE=r.AGG_RATE=r.AGG_MIN=r.AGG_MAX=r.AGG_SUM=r.AGG_COUNT=r.AGG_AVERAGE=r.AGG_FIRST=r.AGG_LAST=r.AGG_DELTA=r.AGG_MEDIAN=r.AGG_75PCT=r.AGG_95PCT=r.AGG_98PCT=r.AGG_99PCT=0,r.setConfiguration=n,r.getConfiguration=o(Object),r.openScoreboard=o(a)},{}],12:[function(e,t){(function(r){"use strict";var n,o={hash:1,query:1};t.exports=function(t){t=t||r.location||{},n=n||e("./");var i,s={},a=typeof t;if("blob:"===t.protocol)s=new n(unescape(t.pathname),{});else if("string"===a){s=new n(t,{});for(i in o)delete s[i]}else if("object"===a)for(i in t)i in o||(s[i]=t[i]);return s}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./":"url-parse"}],13:[function(e,t,r){"use strict";function n(e){for(var t,r=/([^=?&]+)=([^&]*)/g,n={};t=r.exec(e);n[decodeURIComponent(t[1])]=decodeURIComponent(t[2]));return n}function o(e,t){t=t||"";var r=[];"string"!=typeof t&&(t="?");for(var n in e)i.call(e,n)&&r.push(encodeURIComponent(n)+"="+encodeURIComponent(e[n]));return r.length?t+r.join("&"):""}var i=Object.prototype.hasOwnProperty;r.stringify=o,r.parse=n},{}],14:[function(e,t){"use strict";t.exports=function(e,t){if(t=t.split(":")[0],e=+e,!e)return!1;switch(t){case"http":case"ws":return 80!==e;case"https":case"wss":return 443!==e;case"ftp":return 21!==e;case"gopher":return 70!==e;case"file":return!1}return 0!==e}},{}],"int":[function(e,t){function r(e){return e instanceof o?e:o(e)}function n(e){for(;e._d.length&&0===e._d[0];)e._d.shift();return e}var o=function(e){if(!(this instanceof o))return new o(e);var t=this;if(e instanceof o)return t._s=e._s,t._d=e._d.slice(),void 0;t._s="-"===(e+="").charAt(0)?1:0,t._d=[],e=e.replace(/[^\d]/g,"");for(var r=e.length,i=0;r>i;++i)t._d.push(+e[i]);n(t),0===t._d.length&&(t._s=0)};o.prototype.add=function(e){var t=this,e=r(e);if(t._s!=e._s){e._s^=1;var n=t.sub(e);return e._s^=1,n}if(t._d.length<e._d.length)var i=t._d,s=e._d,a=o(e);else var i=e._d,s=t._d,a=o(t);for(var u=i.length,c=s.length,n=a._d,f=0,l=c-1,p=u-1;p>=0;--l,--p)n[l]+=f+i[p],f=0,n[l]>=10&&(n[l]-=10,f=1);for(;l>=0&&(n[l]+=f,f=0,n[l]>=10&&(n[l]-=10,f=1),0!==f);--l);return f>0&&n.unshift(1),a},o.prototype.sub=function(e){var t=this,e=o(e);if(t._s!=e._s){e._s^=1;var r=this.add(e);return e._s^=1,r}var i=t._s,s=e._s;t._s=e._s=0;var a=t.lt(e),u=a?t._d:e._d,c=a?e._d:t._d;t._s=i,e._s=s;var f=u.length,l=c.length,p=o(a?e:t);p._s=e._s&t._s;for(var r=p._d,d=0,h=l-1,g=f-1;g>=0;--h,--g)r[h]-=u[g]+d,d=0,r[h]<0&&(r[h]+=10,d=1);for(;h>=0&&(r[h]-=d,d=0,r[h]<0&&(r[h]+=10,d=1),0!==d);--h);return a&&(p._s^=1),n(p),0===p._d.length&&(p._s=0),p},o.prototype.mul=function(e){for(var t=this,r=t._d.length>=(e=o(e))._d.length,n=(r?t:e)._d,i=(r?e:t)._d,s=n.length,a=i.length,u=o(),c=[],f=a-1;f>=0;--f){for(var l=o(),p=l._d=l._d.concat(c),d=0,h=s-1;h>=0;--h){var g=i[f]*n[h]+d,m=g%10;d=Math.floor(g/10),p.unshift(m)}d&&p.unshift(d),u=u.add(l),c.push(0)}return u._s=t._s^e._s,u},o.prototype.div=function(e){var t=this,e=o(e);if("0"==e)throw new Error("Division by 0");if("0"==t)return o();var r=t._d.slice(),i=o();i._s=t._s^e._s;var s=e._s;e._s=0;for(var a=o();r.length;){for(var u=0;r.length&&a.lt(e);)u++>0&&i._d.push(0),a._d.push(r.shift()),n(a);for(var c=0;a.gte(e)&&++c;)a=a.sub(e);if(0===c){i._d.push(0);break}i._d.push(c)}var f=a._d.length;return(f>1||i._s&&f>0)&&(a=a.add(5)),i._s&&(f!==a._d.length||a._d[0]>=5)&&(i=i.sub(1)),e._s=s,n(i)},o.prototype.mod=function(e){return this.sub(this.div(e).mul(e))},o.prototype.pow=function(e){var t=o(this);if(0==(e=o(e)))return t.set(1);for(var r=Math.abs(e);--r;t.set(t.mul(this)));return 0>e?t.set(o(1).div(t)):t},o.prototype.set=function(e){return this.constructor(e),this},o.prototype.cmp=function(e){var t=this,e=r(e);if(t._s!=e._s)return t._s?-1:1;var n=t._d,o=e._d,i=n.length,s=o.length;if(i!=s)return i>s^t._s?1:-1;for(var a=0;i>a;++a)if(n[a]!=o[a])return n[a]>o[a]^t._s?1:-1;return 0},o.prototype.neg=function(){var e=o(this);return e._s^=1,e},o.prototype.abs=function(){var e=o(this);return e._s=0,e};o.prototype.valueOf=o.prototype.toString=function(e){var t=this;if(!e||10===e)return(t._s&&t._d.length?"-":"")+(t._d.length?t._d.join(""):"0");if(2>e||e>36)throw RangeError("radix out of range: "+e);for(var r=Math.pow(e,6),n=t,o="";;){var i=n.div(r),s=n.sub(i.mul(r)),a=(+s.toString()).toString(e);if(n=i,n.eq(0))return a+o;for(;a.length<6;)a="0"+a;o=""+a+o}},o.prototype.gt=function(e){return this.cmp(e)>0},o.prototype.gte=function(e){return this.cmp(e)>=0},o.prototype.eq=function(e){return 0===this.cmp(e)},o.prototype.ne=function(e){return 0!==this.cmp(e)},o.prototype.lt=function(e){return this.cmp(e)<0},o.prototype.lte=function(e){return this.cmp(e)<=0},t.exports=o},{}],"lib/fletrics":[function(e,t,r){function n(e,t){return s.metric(t,e,i[e])}var o=e("metric-noop"),i=e("config/fletrics"),s=o.openScoreboard();r.sync=function(){s.sync()},r.increment=function(e,t){n(e,t).increment()},r.decrement=function(e,t){n(e,t).decrement()},r.set=function(e,t,r){n(e,r).set(t)},r.createStopwatch=function(e,t){return n(e,t).createStopwatch()}},{"config/fletrics":6,"metric-noop":11}],"lib/flog":[function(e,t){var r=t.exports=e("flog");r.use(e("flog/filter")(YUI_config.flickr.log_level.browser)),r.use(function(e){var t="["+e.topic+"] "+e.msg,n=e.lvl;return delete e.msg,delete e.topic,delete e.lvl,r.LEVELS[n]in console?console[r.LEVELS[n]](t,e):console.log(t,e),!1})},{flog:10,"flog/filter":9}],"lib/helpers/type-validator":[function(e,t,r){function n(e){return function(t){return e.test(t)}}r.nsid=n(/^[0-9]+@N[0-9]+$/),r.pathAlias=n(/^[0-9a-zA-Z-_]+$/),r.photoId=n(/^[0-9]+$/),r.bookId=n(/^[0-9]+$/),r.orderId=n(/^[0-9]+$/)},{}],"url-parse":[function(e,t){"use strict";function r(e,t,u){if(!(this instanceof r))return new r(e,t,u);var c,f,l,p,d=s.test(e),h=typeof t,g=this,m=0;for("object"!==h&&"string"!==h&&(u=t,t=null),u&&"function"!=typeof u&&(u=i.parse),t=o(t);m<a.length;m++)f=a[m],c=f[0],p=f[1],c!==c?g[p]=e:"string"==typeof c?~(l=e.indexOf(c))&&("number"==typeof f[2]?(g[p]=e.slice(0,l),e=e.slice(l+f[2])):(g[p]=e.slice(l),e=e.slice(0,l))):(l=c.exec(e))&&(g[p]=l[1],e=e.slice(0,e.length-l[0].length)),g[p]=g[p]||(f[3]||"port"===p&&d?t[p]||"":""),f[4]&&(g[p]=g[p].toLowerCase());u&&(g.query=u(g.query)),n(g.port,g.protocol)||(g.host=g.hostname,g.port=""),g.username=g.password="",g.auth&&(f=g.auth.split(":"),g.username=f[0]||"",g.password=f[1]||""),g.href=g.toString()}var n=e("requires-port"),o=e("./lolcation"),i=e("querystringify"),s=/^\/(?!\/)/,a=[["#","hash"],["?","query"],["//","protocol",2,1,1],["/","pathname"],["@","auth",1],[0/0,"host",void 0,1,1],[/\:(\d+)$/,"port"],[0/0,"hostname",void 0,1,1]];r.prototype.set=function(e,t,r){var o=this;return"query"===e?("string"==typeof t&&t.length&&(t=(r||i.parse)(t)),o[e]=t):"port"===e?(o[e]=t,n(t,o.protocol)?t&&(o.host=o.hostname+":"+t):(o.host=o.hostname,o[e]="")):"hostname"===e?(o[e]=t,o.port&&(t+=":"+o.port),o.host=t):"host"===e?(o[e]=t,/\:\d+/.test(t)&&(t=t.split(":"),o.hostname=t[0],o.port=t[1])):o[e]=t,o.href=o.toString(),o},r.prototype.toString=function(e){e&&"function"==typeof e||(e=i.stringify);var t,r=this,n=r.protocol+"//";return r.username&&(n+=r.username,r.password&&(n+=":"+r.password),n+="@"),n+=r.hostname,r.port&&(n+=":"+r.port),n+=r.pathname,t="object"==typeof r.query?e(r.query):r.query,t&&(n+="?"!==t.charAt(0)?"?"+t:t),r.hash&&(n+=r.hash),n},r.qs=i,r.location=o,t.exports=r},{"./lolcation":12,querystringify:13,"requires-port":14}]},{},[1]);
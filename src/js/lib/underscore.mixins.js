/* attach deepExtend to underscore */
(function(){
  _.mixin({deepExtend: underscoreDeepExtend(_)});
})();
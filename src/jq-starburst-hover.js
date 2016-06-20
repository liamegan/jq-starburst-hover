/*
    $.StarburstHover
    =======================================
    Author          liamegan
    email           liam@wethecollective.com
    Created         2015-09-11 10:21:32
    namespace       jquery
    Requirements    jquery, modernizr
    Description     This is a JQ plugin that adds a starburst hover to all supplied link elements
    Edited by       liamegan
    Edited          2015-09-13 09:57:45
    Version         0.7
*/
; 'use strict';

var _base;
window.wtc || (window.wtc = {});
(_base = window.wtc).jq || (_base.jq = {});
(function($, NS) {

  var noModernizer;
  noModernizer = true;
  if (Modernizr) {
    Modernizr.addTest('pointerevents', function() {
      return document.documentElement.style.pointerEvents === '';
    });
    noModernizer = false;
  }

  NS.Particle = (function() {
    Particle.prototype.momentumfactor = 7;
    Particle.prototype.gravityfactor = .3;
    Particle.prototype.friction = .98;
    Particle.prototype.removeAt = 0.15;
    Particle.elapsed = 0;
    Particle.last = null;
    Particle.FPS = {
      current: 0,
      low: 60,
      averageOverall: 60,
      average60: 60,
      ticks: 0
    };
    Particle.FPSRunning = false;
    Particle.runFPS = function() {
      if (!this.FPSRunning) {
        requestAnimationFrame(function() {
          return NS.Particle.calculateFPS();
        });
        this.FPSRunning = true;
      }
    };
    Particle.calculateFPS = function(now) {
      var tick60;
      this.elapsed = (now - (this.last || now)) / 1000;
      this.last = now;
      this.FPS.ticks += 1;
      this.FPS.current = 1 / this.elapsed;
      if (this.FPS.current < this.FPS.low) {
        this.FPS.low = this.FPS.current;
      }
      if (!isNaN(parseInt(this.FPS.current))) {
        this.FPS.averageOverall = (this.FPS.ticks * this.FPS.averageOverall + this.FPS.current) / (this.FPS.ticks + 1);
        if (this.FPS.ticks % 60 === 0) {
          this.FPS.average60 = 60;
        }
        tick60 = (this.FPS.ticks % 60) + 1;
        this.FPS.average60 = (tick60 * this.FPS.average60 + this.FPS.current) / (tick60 + 1);
      }
      requestAnimationFrame(function(now) {
        return NS.Particle.calculateFPS(now);
      });
    };
    function Particle($parent, momentumFactor, gravityFactor, friction, scaleInitial, scaleFactor, removeAt) {
      var randomFactorX;
      this.$parent = $parent;
      if (typeof momentumFactor === 'number') {
        this.momentumfactor = momentumFactor;
      }
      if (typeof gravityFactor === 'number') {
        this.gravityfactor = gravityFactor;
      }
      if (typeof friction === 'number') {
        this.friction = friction;
      }
      if (typeof scaleInitial !== 'number') {
        scaleInitial = 0.5;
      }
      if (typeof scaleFactor !== 'number') {
        scaleFactor = 0.8;
      }
      if (typeof removeAt === 'number') {
        this.removeAt = removeAt;
      }
      this.$element = $("<span class=\"SBParticle particle" + (Math.ceil(Math.random() * 25)) + "\"></span>").appendTo(this.$parent.parent());
      randomFactorX = Math.random();
      this.momentum = new NS.math.Vector2d((this.momentumfactor * -1) + (randomFactorX * (this.momentumfactor * 2)), (this.momentumfactor * -1) + Math.random() * (this.momentumfactor * (-1 - this.gravityfactor)));
      this.position = this.momentum.clone().scale(10);
      this.position.y += 40;
      this.position.x -= 30;
      this.scale = scaleInitial + Math.random() * scaleFactor;
      this.opacity = 1;
      this.gravity = new NS.math.Vector2d(0, this.gravityfactor);
      this.rotation = this.momentum.x;
      this.run();
      NS.Particle.runFPS();
    }
    Particle.prototype.run = function() {
      var pos, t;
      t = this;
      pos = this.position.clone();
      this.momentum.scale(this.friction).add(this.gravity);
      pos.add(this.momentum);
      this.rotation += this.momentum.x;
      this.scale *= 0.975;
      this.opacity *= 0.992;
      this.position = pos;
      this.$element.css({
        transform: "translate(" + this.position.x + "px, " + this.position.y + "px) scale(" + this.scale + ") rotate(" + this.rotation + "deg)",
        opacity: this.opacity
      });
      if (window.wtc.Particle.FPS.average60 < 5) {
        this.$element.remove();
        this.$element = null;
        return;
      }
      if (this.scale > this.removeAt) {
        requestAnimationFrame(function() {
          return t.run();
        });
      } else {
        this.$element.remove();
        this.$element = null;
      }
    };
    return Particle;
  })();
  return $.fn.StarburstHover = function(doOn) {
    var isTouch;
    if (doOn == null) {
      doOn = 'hover';
    }
    isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return this.each(function() {
      var $op, $op_p, $stars, addIEListener, additionalClasses, friction, gravityfactor, momentumfactor, particles, removeAt, resizeTimeout, scaleFactor, scaleInitial, _friction, _gravityfactor, _momentumfactor, _particles, _removeAt, _scaleFactor, _scaleInitial;
      $op = $(this);
      $stars = $('<div class="stars"></div>');
      momentumfactor = null;
      gravityfactor = null;
      friction = null;
      particles = 20;
      scaleInitial = null;
      scaleFactor = null;
      removeAt = null;
      _momentumfactor = Number($op.data('momentumfactor'));
      _gravityfactor = Number($op.data('gravityfactor'));
      _friction = Number($op.data('friction'));
      _particles = Number($op.data('particlerate'));
      _scaleInitial = Number($op.data('scaleinitial'));
      _scaleFactor = Number($op.data('scalefactor'));
      _removeAt = Number($op.data('removeat'));
      if (!isNaN(_momentumfactor)) {
        momentumfactor = _momentumfactor;
      }
      if (!isNaN(_gravityfactor)) {
        gravityfactor = _gravityfactor;
      }
      if (!isNaN(_friction)) {
        friction = _friction;
      }
      if (!isNaN(_particles)) {
        particles = _particles;
      }
      if (!isNaN(_scaleInitial)) {
        scaleInitial = _scaleInitial;
      }
      if (!isNaN(_scaleFactor)) {
        scaleFactor = _scaleFactor;
      }
      if (!isNaN(_removeAt)) {
        removeAt = _removeAt;
      }
      resizeTimeout = null;
      $(window).on('resize', function() {
        $op.attr('style', '');
        $stars.attr('style', '');
        clearTimeout(resizeTimeout);
        return resizeTimeout = setTimeout(function() {
          $stars.css({
            display: $op.css('display'),
            position: $op.css('position'),
            width: $op.css('width'),
            height: $op.css('height'),
            top: 'inherit',
            right: $op.css('right'),
            bottom: $op.css('bottom'),
            left: $op.css('left'),
            marginRight: $op.css('marginRight'),
            'pointer-events': 'none'
          });
          return $op.css({
            position: 'relative',
            top: 'auto',
            right: 'auto',
            bottom: 'auto',
            left: 'auto',
            marginRight: 'auto',
            'pointer-events': 'all'
          });
        }, 300);
      });
      if (!$op.data('starvomit') === true) {
        $op.data('starvomit', true);
        additionalClasses = '';
        if ($op.hasClass('mobile-show')) {
          additionalClasses += 'mobile-show ';
          $op.removeClass('mobile-show');
        }
        if ($op.hasClass('mobile-hide')) {
          additionalClasses += 'mobile-hide ';
          $op.removeClass('mobile-hide');
        }
        $stars = $op.wrap($stars).parent();
        $stars.css({
          display: $op.css('display'),
          position: $op.css('position'),
          width: $op.css('width'),
          height: $op.css('height'),
          top: 'inherit',
          right: $op.css('right'),
          bottom: $op.css('bottom'),
          left: $op.css('left'),
          marginRight: $op.css('marginRight'),
          'pointer-events': 'none'
        }).addClass(additionalClasses);
        $op.css({
          position: 'relative',
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto',
          marginRight: 'auto',
          'pointer-events': 'all'
        });
        if (doOn === 'onStarburst') {
          document.addEventListener('onStarburst', function() {
            var t, _results;
            if ($op.hasClass('noStarVomit')) {
              return;
            }
            if (window.wtc.Particle.FPS.average60 > 30) {
              _results = [];
              for (t = 0; 0 <= particles ? t <= particles : t >= particles; 0 <= particles ? t++ : t--) {
                _results.push(new NS.Particle($op, momentumfactor, gravityfactor, friction, scaleInitial, scaleFactor, removeAt));
              }
              return _results;
            }
          });
        }
        if (doOn === 'click') {
          $op.click(function() {
            var t, _results;
            if ($(this).hasClass('noStarVomit')) {
              return;
            }
            if (window.wtc.Particle.FPS.average60 > 30) {
              _results = [];
              for (t = 0; 0 <= particles ? t <= particles : t >= particles; 0 <= particles ? t++ : t--) {
                _results.push(new NS.Particle($op, momentumfactor, gravityfactor, friction, scaleInitial, scaleFactor, removeAt));
              }
              return _results;
            }
          });
        }
        if (doOn === 'hover') {
          $op.mouseenter(function() {
            var t, _results;
            if ($(this).hasClass('noStarVomit')) {
              return;
            }
            if (!isTouch && window.wtc.Particle.FPS.average60 > 30) {
              _results = [];
              for (t = 0; 0 <= particles ? t <= particles : t >= particles; 0 <= particles ? t++ : t--) {
                _results.push(new NS.Particle($op, momentumfactor, gravityfactor, friction, scaleInitial, scaleFactor, removeAt));
              }
              return _results;
            }
          });
          if (!Modernizr.pointerevents && noModernizer == false)
          {
            $op_p = $op.parent();
            addIEListener = function() {
              return $op_p.css({
                cursor: 'pointer'
              }).click(function(e) {
                $op_p.unbind('click');
                setTimeout(addIEListener, 1000);
                $op.click();
                e.stopPropagation();
                e.preventDefault();
                return false;
              });
            };
            return addIEListener();
          }
        }
      }
    });
  };
})(jQuery, window.wtc);
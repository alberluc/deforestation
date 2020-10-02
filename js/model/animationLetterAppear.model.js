var CLASS_LETTER = "anim_letter";

var AnimationLetterAppear = function (params) {
    this.el = params.el;
    this.animationLetterDuration = params.animationLetterDuration;
    this.distanceAppear = params.distanceAppear;
    this.separatorsWordEnabled = params.separatorsWordEnabled;
    this.lettersEl = [];
    this.Timeline = new TimelineMax();
};

AnimationLetterAppear.prototype.init = function () {
    this.lettersEl = WordSplicer.splice(this.el, "span", this.separatorsWordEnabled, CLASS_LETTER);
    for(var i = 0; i < this.lettersEl.length; i++){
        TweenMax.set(this.lettersEl[i], {
            opacity: 0,
            y: this.distanceAppear
        });
    }
};

AnimationLetterAppear.prototype.animate = function () {
    for(var i = 0; i < this.lettersEl.length; i++){
        TweenMax.to(this.lettersEl[i], this.animationLetterDuration, {
            opacity: 1,
            y: 30,
            delay: 0.2
        });
    }
};
const makeShadow = require('shadow-callbag').default;

const flatten = source => (start, sink) => {
  if (start !== 0) return;
  let outerEnded = false;
  let outerTalkback;
  let innerTalkback;
  let innerShadow;
  let shadow;
  function talkback(t, d) {
    if (t === 1) (innerTalkback || outerTalkback)(1, d);
    if (t === 2) {
      innerTalkback && innerTalkback(2);
      innerShadow && innerShadow(2);
      outerTalkback(2);
    }
  }
  source(0, (T, D, S) => {
    if (T === 0) {
      outerTalkback = D;
      shadow = makeShadow('flatten', S);
      sink(0, talkback, shadow);
    } else if (T === 1) {
      const innerSource = D;
      innerTalkback && innerTalkback(2);
      innerShadow && innerShadow(2);
      innerSource(0, (t, d, s) => {
        if (t === 0) {
          innerTalkback = d;
          innerTalkback(1);
          innerShadow = s;
          innerShadow(0, (_t, _d) => {
            if (_t === 0) _d(1);
            if (_t === 1) shadow(1, _d);
          });
        } else if (t === 1) sink(1, d);
        else if (t === 2 && d) {
          outerTalkback(2);
          sink(2, d);
        } else if (t === 2) {
          if (outerEnded) sink(2);
          else {
            innerTalkback = void 0;
            innerShadow = void 0;
            outerTalkback(1);
          }
        }
      });
    } else if (T === 2 && D) {
      innerTalkback && innerTalkback(2);
      innerShadow && innerShadow(2);
      sink(2, D);
    } else if (T === 2) {
      if (!innerTalkback) sink(2);
      else outerEnded = true;
    }
  });
};

export default flatten;

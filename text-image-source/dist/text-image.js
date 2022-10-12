var x = Object.defineProperty;
var g = (t, e, s) => e in t ? x(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var h = (t, e, s) => (g(t, typeof e != "symbol" ? e + "" : e, s), s);
class l {
  constructor(e, s, i) {
    h(this, "width");
    h(this, "height");
    h(this, "pixels");
    this.width = e, this.height = s, this.pixels = i;
  }
  getPixelAt(e, s) {
    const i = s * this.width * 4 + e * 4;
    return [
      this.pixels[i],
      this.pixels[i + 1],
      this.pixels[i + 2],
      +(this.pixels[i + 3] / 255).toFixed(2)
    ];
  }
}
class d {
  constructor() {
    h(this, "canvas");
    h(this, "ctx");
    h(this, "isInit");
    this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.isInit = !1;
  }
  init() {
    this.isInit || (this.initCanvas(), this.isInit = !0);
  }
  getBitmap() {
    this.init(), this.draw();
    const { width: e, height: s } = this.canvas, i = this.ctx.getImageData(0, 0, e, s).data;
    return new l(e, s, i);
  }
}
class w extends d {
  constructor(s) {
    super();
    h(this, "img");
    h(this, "width");
    h(this, "height");
    this.img = s.img, this.width = s.width, this.height = s.height;
  }
  initCanvas() {
    this.canvas.width = this.width, this.canvas.height = this.height;
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      0,
      0,
      this.width,
      this.height
    );
  }
}
class v extends d {
  constructor(s) {
    super();
    h(this, "option");
    this.option = s;
  }
  initCanvas() {
    this.canvas.width = this.option.text.length * this.option.fontSize, this.canvas.height = this.option.fontSize, this.ctx.font = `bold ${this.option.fontSize}px ${this.option.fontFamily}`, this.ctx.fillStyle = "#000", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle";
  }
  draw() {
    this.ctx.fillText(
      this.option.text,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
}
class f extends d {
  constructor(s) {
    super();
    h(this, "video");
    h(this, "width");
    h(this, "height");
    this.video = s.video, this.width = s.width, this.height = s.height, this.video.muted = this.video.loop = !0, this.video.play();
  }
  initCanvas() {
    this.canvas.width = this.width, this.canvas.height = this.height;
  }
  draw() {
    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
      0,
      0,
      this.width,
      this.height
    );
  }
}
function n(t) {
  if (t.text)
    return new v(t);
  if (t.img)
    return new w(t);
  if (t.video)
    return new f(t);
  throw new TypeError("invalid source options");
}
class m {
  constructor(e) {
    h(this, "replaceText");
    h(this, "raduis");
    h(this, "source");
    h(this, "isDynamic");
    h(this, "canvas");
    h(this, "ctx");
    h(this, "textIndex");
    h(this, "isGray");
    h(this, "raqId");
    this.replaceText = e.replaceText, this.raduis = e.raduis, this.source = e.source, this.isGray = e.isGray, this.isDynamic = e.isDynamic, this.canvas = e.canvas, this.ctx = this.canvas.getContext("2d"), this.textIndex = 0, this.raqId = 0, this.initContext();
  }
  fps() {
    this.isDynamic ? this.raqId = requestAnimationFrame(() => {
      this.draw(), this.fps();
    }) : this.draw();
  }
  stop() {
    cancelAnimationFrame(this.raqId), this.raqId = 0;
  }
  initContext() {
    this.ctx.font = "bold 12px 'Roboto Mono' 'Microsoft YaHei' '\u5FAE\u8F6F\u96C5\u9ED1' 'sans-serif'", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle";
  }
  drawText(e, s, i) {
    let [r, a, c, o] = i;
    if (!o)
      return;
    this.isGray && (r = a = c = 0.2126 * r + 0.7152 * a + 0.0722 * c), this.ctx.fillStyle = `rgba(${r},${a},${c},${o})`;
    const u = this.replaceText[this.textIndex];
    this.textIndex = (this.textIndex + 1) % this.replaceText.length, this.ctx.fillText(u, e, s);
  }
  draw() {
    const e = this.source.getBitmap();
    this.canvas.width = e.width, this.canvas.height = e.height, this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let s = 0; s < e.height; s += this.raduis)
      for (let i = 0; i < e.width; i += this.raduis) {
        const r = e.getPixelAt(i, s);
        this.drawText(i, s, r);
      }
  }
}
function y(t) {
  if (!t)
    throw new Error("require options");
  if (!t.canvas)
    throw new Error('require "canvas" option');
  if (t.replaceText = t.replaceText || "6", t.raduis = t.raduis || 10, t.isDynamic = !!t.isDynamic, t.isGray = !!t.isGray, !t.source)
    throw new Error('require "source" option');
}
function I(t) {
  return new Promise((e, s) => {
    const i = new Image();
    i.crossOrigin = "", i.onload = function() {
      e(i);
    }, i.onerror = function(r) {
      s(r);
    }, i.src = t;
  });
}
function T(t) {
  return new Promise((e, s) => {
    const i = document.createElement("video");
    i.crossOrigin = "", i.oncanplay = function() {
      e(i);
    }, i.onerror = function(r) {
      s(r);
    }, i.src = t;
  });
}
async function q(t) {
  y(t);
  let e, s = { ...t };
  if (t.source.text)
    s.source = n({
      fontFamily: t.source.fontFamily || "Microsoft YaHei",
      text: t.source.text,
      fontSize: t.source.fontSize || 200
    });
  else if (t.source.img) {
    const i = await I(t.source.img);
    let r = t.source.width || i.width, a = t.source.height || i.height;
    t.source.width && !t.source.height ? a = r / i.width * i.height : t.source.height && !t.source.width && (r = a / i.height * i.width), s.source = n({
      img: i,
      width: r,
      height: a
    });
  } else if (t.source.video) {
    const i = await T(t.source.video);
    let r = t.source.width || i.videoWidth, a = t.source.height || i.videoHeight;
    t.source.width && !t.source.height ? a = r / i.videoWidth * i.videoHeight : t.source.height && !t.source.width && (r = a / i.videoHeight * i.videoWidth), s.source = n({
      video: i,
      width: r,
      height: a
    }), s.isDynamic = !0;
  }
  return e = new m(s), e.fps(), {
    start() {
      e.fps();
    },
    stop() {
      e.stop();
    }
  };
}
export {
  q as createTextImage
};

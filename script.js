import { langs, modCount, subscribe } from './wikipedia/script.js';

var w = window.innerWidth;
var h = window.innerHeight;
var grid = d3.select("#grid")
  .attr("width", w)
  .attr("height", h);

var width = 300;
var height = 300;

const sound = new buzz.sound("./sound/heartbeat", {
  formats: ["mp3"]
});

var svgs = {}

for(let lang in langs) {
  let svg = d3.select("#grid")
    .append("svg")
    .attr("id", lang)
    .attr("width", width)
    .attr("height", height);

  langs[lang].push(svg);
}

//svg.append("circle")
  //.attr("cx", 200)
  //.attr("cy", 50)
  //.attr("r", 20)
  //.attr("fill", "green");
//svg.append("circle")
  //.attr("cx", 50)
  //.attr("cy", 200)
  //.attr("r", 20)
  //.attr("fill", "green")
  //.transition()
  //.duration(2000)
  //.attr("fill", "lightblue");

//size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);
var starting_opacity = 1

function randomColor() {
  let colors = [
    "red",
    "blue",
    "lightblue",
    "green",
    "yellow",
    "purple",
    "orange",
    "grey",
  ]

  let i = Math.floor(Math.abs(Math.random() * 100) % colors.length);
  return colors[i]
}

class LangListener {

  constructor(svg, language, color) {
    this.svg = svg;
    this.language = language;
    this.color = color;
    this.socket = new WebSocket(langs[language][1]);
    this.mute = true;
    this.beating = false;
    this.heart = svg.append('circle')
      .attr('id', 'heart-' + language)
      .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')')
      .style('opacity', 0.1)
      .attr("r", 80)
      .attr("stroke", 'none')
      .attr('fill', 'black')
      //.transition()
      //.attr('r', 30)
      //.style('opacity', 1)
      //.ease(Math.sqrt)
      //.duration(5000)
  }

  subscribe() {
    var self = this
    const stop = setInterval(() => {
      var opacity = $('#heart-' + self.language).css('opacity')
      if(self.beating) {
        if (parseFloat(opacity) > 0.1) {
          self.heart
            .transition()
            .duration(1000)
            .style('opacity', parseFloat(opacity) - 0.2)
        }
      } else {
        self.heart
          .transition()
          .duration(1000)
          .style('opacity', parseFloat(opacity) + 0.1)
      }
    }, 3000);

    $('#' + self.language).mouseout(function (event) {
      self.mute = true;
    })

    $('#' + self.language).mouseover(function (event) {
      console.log('hoge')
      self.mute = false;
    })

    this.socket.addEventListener('open', function (event) {
      self.socket.send('Hello Server!');
    });

    this.socket.addEventListener('message', function (event) {
      let change_size = JSON.parse(event.data)["change_size"];
      self.beating = true;
      if (!self.mute) {
        sound.play();
      }
      self.renderCircle(change_size);
    });
  }

  renderCircle(csize) {
    var self = this;
    let size = Math.abs(csize);
    if(size > 100) {
      size = 100;
    }
    let svg = this.svg;
    let x = width/2; 
    let y = height/2;

    let circle_group = svg.append('g')
      .attr('transform', 'translate(' + x + ', ' + y + ')')

    circle_group.append('circle')
      .style('opacity', starting_opacity)
      .attr("r", size + 20)
      .attr("stroke", 'none')
      .attr('fill', this.color)
      .transition()
      .attr('r', size + 40)
      .style('opacity', 0.1)
      .ease(Math.sqrt)
      .duration(2500)
      .remove()
      .on("end", () => {
        self.beating = false;
      });

    circle_group.append('text')
      .text(langs[this.language][0])
      .attr('fill', this.color)
      .classed('article-label', true)
      .attr('text-anchor', 'middle')
      .transition()
      .duration(2500)
      .remove();
  }
}

const English = new LangListener(langs['en'][2], 'en', 'red');
const Japanese = new LangListener(langs['ja'][2], 'ja', 'blue');
const Russian = new LangListener(langs['ru'][2], 'ru', 'green');
const Spanish = new LangListener(langs['es'][2], 'es', 'grey');
const Chinese = new LangListener(langs['zh'][2], 'zh', 'yellow');
const French = new LangListener(langs['fr'][2], 'fr', 'purple');
const Arabic = new LangListener(langs['ar'][2], 'ar', 'pink');
                                       
English.subscribe();                   
Japanese.subscribe();
Russian.subscribe();
Spanish.subscribe();
Chinese.subscribe();
French.subscribe();
Arabic.subscribe();

//var circle_container = circle_group.append('a')
//.attr('xlink:href', "hoge")
//.attr('target', '_blank')
//.attr('fill', "black");

//var circle = circle_container.append('circle')
//.attr('r', size)
//.transition()
//.duration(2000)
//.style('opacity', 0)
//.remove();
//.each('end', function() {
//  circle_group.remove();
//})

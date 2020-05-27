import VueKonva from 'vue-konva';
import { resolveComponent, openBlock, createBlock, createVNode, withCtx, createCommentVNode, Fragment, renderList, createTextVNode, toDisplayString } from 'vue';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  data: function data () {
    return {
      ready: false,
      game: {
        x: -1,
        y: -1,
        direction: 0,
        visited: [],
        trace: [],
        tracePath: '',
        score: 0,
        totalScore: 0
      },
      dx: [0, 1, 0, -1],
      dy: [-1, 0, 1, 0],
      configKonva: {
        width: 325,
        height: 325
      },
    }
  },
  props: {
    problem: {
      default: function () { return ({
        //0123456789012345678901234
        map: 'o.......................o' +
        '.xxxxxxxxxxxxxxxxxxxxx*..' +
        'o.....................o*.' +
        '.xxxxxxxxxxxxxxxxxxx*..x.' +
        'o...................o*.x.' +
        '.xxxxxxxxxxxxxxxxx*..x.x.' +
        'o.................o*.x.x.' +
        '.xxxxxxxxxxxxxxx*..x.x.x.' +
        'o...............o*.x.x.x.' +
        '.xxxxxxxxxxxxx*..x.x.x.x.' +
        'o.............o*.x.x.x.x.' +
        '.xxxxxxxxxxx*..x.x.x.x.x.' +
        'o...........o*.x.x.x.x.x.' +
        '.xxxxxxxxx*..x.x.x.x.x.x.' +
        'o.........o*.x.x.x.x.x.x.' +
        '.xxxxxxx*..x.x.x.x.x.x.x.' +
        'o.......o*.x.x.x.x.x.x.x.' +
        '.xxxxx*..x.x.x.x.x.x.x.x.' +
        'o.....o*.x.x.x.x.x.x.x.x.' +
        '.xxx*..x.x.x.x.x.x.x.x.x.' +
        'o...o*.x.x.x.x.x.x.x.x.x.' +
        '..*..x.x.x.x.x.x.x.x.x.x.' +
        'o.o*.x.x.x.x.x.x.x.x.x.x.' +
        '.....x.x.x.x.x.x.x.x.x.x.' +
        'u.o.o.o.o.o.o.o.o.o.o.o.o',
        limit: 16
      }); }
    }
  },
  mounted: async function mounted () {
    var vm = this;
    await vm.init();
  },
  methods: {
    init: async function init () {
      var vm = this;
      var pos = vm.problem.map.indexOf('u');
      vm.game.totalScore = vm.problem.map.replace(/[^o]/g, '').length;
      vm.game.y = Math.floor(pos / 25);
      vm.game.x = pos % 25;
      vm.game.trace = [pos];
      vm.game.tracePath = "M" + (vm.game.x * 12 + 18) + "," + (vm.game.y * 12 + 18);
      vm.game.visited = Array.from({ length: 625 }, function () { return false; });
    },
    enqueue: async function enqueue (cmds) {
      var vm = this;
      if (!cmds) { return }
      Array.from(cmds).forEach(function (cmd) {
        // debugger
        // Complete exit point
        if (vm.game.score >= vm.game.totalScore) { return; }
        // Deal with commands
        if (cmd === 's') {
          var x = vm.game.x + vm.dx[vm.game.direction];
          var y = vm.game.y + vm.dy[vm.game.direction];
          var pos = y * 25 + x;
          var mapPoint = vm.problem.map[pos];
          // Invalid position
          if (x >= 25 || x < 0 || y >= 25 || y < 0 || mapPoint === 'x') { return }
          // Reset point, clear trace
          if (mapPoint === '*') {
            vm.game.score = 0;
            vm.game.trace = [];
            vm.game.tracePath = '';
            vm.game.visited = Array.from({ length: 625 }, function () { return false; });
          }
          // Score point
          if (!vm.game.visited[pos] && mapPoint === 'o') {
            vm.game.score += 1;
          }
          // Mark visited
          vm.game.visited.splice(pos, 1, true);
          // Set trace and position
          vm.game.trace.push(pos);
          vm.game.tracePath += "L" + (x * 12 + 18) + "," + (y * 12 + 18);
          vm.game.x = x;
          vm.game.y = y;
        } else if (cmd === 'l') {
          vm.game.direction = (vm.game.direction + 3) % 4;
        } else if (cmd === 'r') {
          vm.game.direction = (vm.game.direction + 1) % 4;
        } else {
          alert('Invalid command character');
        }
      });
    }
  }
};

var _hoisted_1 = /*#__PURE__*/createVNode("strong", null, "Score:", -1 /* HOISTED */);
var _hoisted_2 = /*#__PURE__*/createVNode("strong", null, "Direction:", -1 /* HOISTED */);

function render(_ctx, _cache) {
  var _component_v_rect = resolveComponent("v-rect");
  var _component_v_layer = resolveComponent("v-layer");
  var _component_v_circle = resolveComponent("v-circle");
  var _component_v_path = resolveComponent("v-path");
  var _component_v_stage = resolveComponent("v-stage");

  return (openBlock(), createBlock("div", null, [
    createVNode(_component_v_stage, { config: _ctx.configKonva }, {
      default: withCtx(function () { return [
        createCommentVNode(" chessBoard layer "),
        createVNode(_component_v_layer, null, {
          default: withCtx(function () { return [
            createVNode(_component_v_rect, { config: {x:4,y:4,width:316,height:316,fill:'white',stroke:'black',strokeWidth:1} })
          ]; }),
          _: 1
        }),
        createCommentVNode(" map layer "),
        createVNode(_component_v_layer, null, {
          default: withCtx(function () { return [
            (openBlock(true), createBlock(Fragment, null, renderList(25, function (i) {
              return (openBlock(), createBlock(Fragment, null, [
                (openBlock(true), createBlock(Fragment, null, renderList(25, function (j) {
                  return (openBlock(), createBlock(Fragment, null, [
                    (_ctx.problem.map[i*25+j-26]==='o')
                      ? createVNode(_component_v_circle, {
                          key: 0,
                          config: {x:j*12+6,y:i*12+6,radius:4,stroke:'black',strokeWidth:1,fill:_ctx.game.visited[i*25+j-26]?'black':'white'}
                        }, null, 8 /* PROPS */, ["config"])
                      : createCommentVNode("v-if", true),
                    (_ctx.problem.map[i*25+j-26]==='*')
                      ? createVNode(_component_v_circle, {
                          key: 0,
                          config: { x:j*12+6, y:i*12+6, radius: 4, fill: 'grey', stroke: 'black', strokeWidth: 1 }
                        }, null, 8 /* PROPS */, ["config"])
                      : createCommentVNode("v-if", true),
                    (_ctx.problem.map[i*25+j-26]==='.'||_ctx.problem.map[i*25+j-26]==='u')
                      ? createVNode(_component_v_circle, {
                          key: 0,
                          config: { x:j*12+6, y:i*12+6, radius: 1, stroke: 'grey', strokeWidth: 1 }
                        }, null, 8 /* PROPS */, ["config"])
                      : createCommentVNode("v-if", true),
                    (_ctx.problem.map[i*25+j-26]==='x')
                      ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode(_component_v_rect, {
                            config: { x:j*12+3, y:i*12+3, width: 6, height: 6, fill: 'black' }
                          }, null, 8 /* PROPS */, ["config"]),
                          (i<24&&_ctx.problem.map[i*25+j-1]==='x')
                            ? createVNode(_component_v_rect, {
                                key: 0,
                                config: { x:j*12+3, y:i*12+9, width: 6, height: 6, fill: 'black' }
                              }, null, 8 /* PROPS */, ["config"])
                            : createCommentVNode("v-if", true),
                          (j<24&&_ctx.problem.map[i*25+j-25]==='x')
                            ? createVNode(_component_v_rect, {
                                key: 0,
                                config: { x:j*12+9, y:i*12+3, width: 6, height: 6, fill: 'black' }
                              }, null, 8 /* PROPS */, ["config"])
                            : createCommentVNode("v-if", true)
                        ], 64 /* STABLE_FRAGMENT */))
                      : createCommentVNode("v-if", true)
                  ], 64 /* STABLE_FRAGMENT */))
                }), 256 /* UNKEYED_FRAGMENT */))
              ], 64 /* STABLE_FRAGMENT */))
            }), 256 /* UNKEYED_FRAGMENT */))
          ]; }),
          _: 1
        }),
        createCommentVNode(" trace layer "),
        createVNode(_component_v_layer, null, {
          default: withCtx(function () { return [
            createVNode(_component_v_path, {
              config: {x:0,y:0,stroke:'black',strokeWidth:2,data:_ctx.game.tracePath}
            }, null, 8 /* PROPS */, ["config"])
          ]; }),
          _: 1
        }),
        createCommentVNode(" herbert layer "),
        createVNode(_component_v_layer, null, {
          default: withCtx(function () { return [
            createVNode(_component_v_rect, {
              config: {x:_ctx.game.x*12+14,y:_ctx.game.y*12+14,width:8,height:8,fill:'darkred'}
            }, null, 8 /* PROPS */, ["config"]),
            createVNode(_component_v_rect, {
              config: {x:_ctx.game.x*12+15+_ctx.dx[_ctx.game.direction]*4,y:_ctx.game.y*12+15+_ctx.dy[_ctx.game.direction]*4,width:6,height:6,fill:'darkred'}
            }, null, 8 /* PROPS */, ["config"])
          ]; }),
          _: 1
        })
      ]; }),
      _: 1
    }, 8 /* PROPS */, ["config"]),
    createVNode("p", null, [
      _hoisted_1,
      createTextVNode(" " + toDisplayString(_ctx.game.score) + "/" + toDisplayString(_ctx.game.totalScore), 1 /* TEXT */)
    ]),
    createVNode("p", null, [
      _hoisted_2,
      createTextVNode(" " + toDisplayString(['Up','Right','Down','Left'][_ctx.game.direction]), 1 /* TEXT */)
    ])
  ]))
}

script.render = render;
script.__file = "src/HerbertChessboard.vue";

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.use(VueKonva);
	Vue.component('HerbertChessboard', script);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export default script;
export { install };

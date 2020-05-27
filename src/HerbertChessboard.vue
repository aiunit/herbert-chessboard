<template>
  <div>
    <v-stage :config="configKonva">
      <!-- chessBoard layer -->
      <v-layer>
        <v-rect :config="{x:4,y:4,width:316,height:316,fill:'white',stroke:'black',strokeWidth:1}"></v-rect>
      </v-layer>
      <!-- map layer -->
      <v-layer>
        <template v-for="i in 25">
          <template v-for="j in 25">
            <v-circle v-if="problem.map[i*25+j-26]==='o'"
                      :config="{x:j*12+6,y:i*12+6,radius:4,stroke:'black',strokeWidth:1,fill:game.visited[i*25+j-26]?'black':'white'}"></v-circle>
            <v-circle v-if="problem.map[i*25+j-26]==='*'"
                      :config="{ x:j*12+6, y:i*12+6, radius: 4, fill: 'grey', stroke: 'black', strokeWidth: 1 }"></v-circle>
            <v-circle v-if="problem.map[i*25+j-26]==='.'||problem.map[i*25+j-26]==='u'"
                      :config="{ x:j*12+6, y:i*12+6, radius: 1, stroke: 'grey', strokeWidth: 1 }"></v-circle>
            <template v-if="problem.map[i*25+j-26]==='x'">
              <v-rect :config="{ x:j*12+3, y:i*12+3, width: 6, height: 6, fill: 'black' }"></v-rect>
              <v-rect v-if="i<24&&problem.map[i*25+j-1]==='x'"
                      :config="{ x:j*12+3, y:i*12+9, width: 6, height: 6, fill: 'black' }"></v-rect>
              <v-rect v-if="j<24&&problem.map[i*25+j-25]==='x'"
                      :config="{ x:j*12+9, y:i*12+3, width: 6, height: 6, fill: 'black' }"></v-rect>
            </template>
          </template>
        </template>
      </v-layer>
      <!-- trace layer -->
      <v-layer>
        <v-path :config="{x:0,y:0,stroke:'black',strokeWidth:2,data:game.tracePath}"></v-path>
      </v-layer>
      <!-- herbert layer -->
      <v-layer>
        <v-rect :config="{x:game.x*12+14,y:game.y*12+14,width:8,height:8,fill:'darkred'}"></v-rect>
        <v-rect
          :config="{x:game.x*12+15+dx[game.direction]*4,y:game.y*12+15+dy[game.direction]*4,width:6,height:6,fill:'darkred'}"></v-rect>
      </v-layer>
    </v-stage>
    <p><strong>Score:</strong> {{game.score}}/{{game.totalScore}}</p>
    <p><strong>Direction:</strong> {{['Up','Right','Down','Left'][game.direction]}}</p>
  </div>
</template>

<script>
export default {
  data () {
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
      default: () => ({
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
      })
    }
  },
  async mounted () {
    const vm = this
    await vm.init()
  },
  methods: {
    async init () {
      const vm = this
      const pos = vm.problem.map.indexOf('u')
      vm.game.totalScore = vm.problem.map.replace(/[^o]/g, '').length
      vm.game.y = Math.floor(pos / 25)
      vm.game.x = pos % 25
      vm.game.trace = [pos]
      vm.game.tracePath = `M${vm.game.x * 12 + 18},${vm.game.y * 12 + 18}`
      vm.game.visited = Array.from({ length: 625 }, () => false)
    },
    async enqueue (cmds) {
      const vm = this
      if (!cmds) return
      Array.from(cmds).forEach(cmd => {
        // debugger
        // Complete exit point
        if (vm.game.score >= vm.game.totalScore) return;
        // Deal with commands
        if (cmd === 's') {
          let x = vm.game.x + vm.dx[vm.game.direction]
          let y = vm.game.y + vm.dy[vm.game.direction]
          let pos = y * 25 + x
          const mapPoint = vm.problem.map[pos]
          // Invalid position
          if (x >= 25 || x < 0 || y >= 25 || y < 0 || mapPoint === 'x') return
          // Reset point, clear trace
          if (mapPoint === '*') {
            vm.game.score = 0
            vm.game.trace = []
            vm.game.tracePath = ''
            vm.game.visited = Array.from({ length: 625 }, () => false)
          }
          // Score point
          if (!vm.game.visited[pos] && mapPoint === 'o') {
            vm.game.score += 1
          }
          // Mark visited
          vm.game.visited.splice(pos, 1, true)
          // Set trace and position
          vm.game.trace.push(pos)
          vm.game.tracePath += `L${x * 12 + 18},${y * 12 + 18}`
          vm.game.x = x
          vm.game.y = y
        } else if (cmd === 'l') {
          vm.game.direction = (vm.game.direction + 3) % 4;
        } else if (cmd === 'r') {
          vm.game.direction = (vm.game.direction + 1) % 4;
        } else {
          alert('Invalid command character')
        }
      })
    }
  }
}
</script>


let GameField = require('../dist/gamefield');

let game = new GameField(20, 40);

let App = new Vue({
    template:
        `<table class="game-table">
            <tbody>
                <tr v-for="row in shape.body">
                    <td v-for="cell in row"
                        v-bind:class="{ figure: cell.val == 1, empty: cell.val == 0 }">
                    </td>
                </tr>
            </tbody>
        </table>`,
    el: '#app',
    data() {
        
        return {
            shape: new GameField(20, 30)
        }
    },
    methods: {
        render() {
            this.shape =  new GameField(20, 30);
        }
    },
    beforeMount() {
        setInterval(()=>{
            this.render()
        }, 1000)
    }
});


//let shapeSet = require('../dist/shapes/tetra-shapes');
//let Shape = require('../dist/shape').Shape;


//let shape = new Shape(shapeSet);

// let App = new Vue({
//     template:
//         `<table class="figure-show-table">
//             <tbody>
//                 <tr v-for="row in shape.body">
//                     <td v-for="cell in row"
//                         v-bind:class="{ figure: cell == 1, empty: cell.val == 0 }">
//                     </td>
//                 </tr>
//             </tbody>
//         </table>`,
//     el: '#app',
//     data() {
        
//         return {
//             shape: new Shape(shapeSet)
//         }
//     },
//     methods: {
//         render() {
//             this.shape =  new Shape(shapeSet);
//         }
//     },
//     beforeMount() {
//         setInterval(()=>{
//             this.render()
//         }, 1000)
//     }
// });

<template>
    <div class="game-container-wrapper">
        <div class="score">Score: <span>{{ score }}</span></div>
        <div class="game-container">
            <div
                class="game-row"
                v-for="(row, rowIndex) in board"
                :key="rowIndex"
            >
                <div
                    class="title"
                    v-for="(title, colIndex) in row"
                    :key="colIndex"
                    :class="getTitleClass(title)"
                >
                    {{ title === 0 ? '' : title }}
                </div>
            </div>
        </div>
        <div class="controls">
            <button @click="move('left')">左</button>
            <button @click="move('right')">右</button>
            <button @click="move('up')">上</button>
            <button @click="move('down')">下</button>
        </div>

    </div>
</template>

<script setup>
import {ref} from 'vue';

const score = ref(0);
const board = ref(createEmptyBoard());

// 创建空的面板并随机赋予2个表格的值等于2
function createEmptyBoard() {
    const board = Array.from({length: 4}, () => Array(4).fill(0));
    let positions = new Set();
    while (positions.size < 2) {
        const row = Math.floor(Math.random() * 4);
        const col = Math.floor(Math.random() * 4);
        positions.add(`${row},${col}`);
    }
    positions.forEach(pos => {
        const [row, col] = pos.split(',').map(Number);
        board[row][col] = 2;
    });

    return board;
}

function addRandomTitle() {

    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board.value[row][col] === 0) {
                emptyCells.push({row, col});
            }
        }
    }

    if (emptyCells.length > 0) {
        const {row, col} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board.value[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function mergeRow(row) {
    const nonZeroTiles = row.filter(value => value !== 0);
    let merged = [];
    let i = 0;
    while (i < nonZeroTiles.length) {
        if (i < nonZeroTiles.length - 1 && nonZeroTiles[i] === nonZeroTiles[i + 1]) {
            merged.push(nonZeroTiles[i] * 2);
            score.value += nonZeroTiles[i] * 2;
            i += 2;
        } else {
            merged.push(nonZeroTiles[i]);
            i++;
        }
    }
    while (merged.length < 4) {
        merged.push(0);
    }
    for (let j = 0; j < 4; j++) {
        row[j] = merged[j];
    }
}

// 行列互换
function transposeBoard() {
    for (let row = 0; row < 4; row++) {
        for (let col = row + 1; col < 4; col++) {
            [board.value[row][col], board.value[col][row]] = [board.value[col][row], board.value[row][col]];
        }
    }
}

// 反转行
function reverseBoard() {
    for (let row = 0; row < 4; row++) {
        board.value[row].reverse();
    }
}

function move(direction) {
    let moved = false;
    if (direction === 'up' || direction === 'down') {
        transposeBoard();
    }
    if (direction === 'right' || direction === 'down') {
        reverseBoard();
    }

    for (let row = 0; row < 4; row++) {
        const originalRow = board.value[row].slice();
        mergeRow(board.value[row]);
        if (board.value[row].some((value, idx) => value !== originalRow[idx])) {
            moved = true;
        }
    }

    if (direction === 'right' || direction === 'down') {
        reverseBoard();
    }
    if (direction === 'up' || direction === 'down') {
        transposeBoard();
    }

    if (moved) addRandomTitle();
}

// 判断title的类名
function getTitleClass(tile) {
    if (tile === 0) return 'title-empty';
    return `title-${tile}`;
}
</script>

<style scoped>
.game-container-wrapper {
    font-family: Arial, sans-serif;
    background-color: #faf8ef;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 10px;
    flex-direction: column;
}

.score {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
}

.game-container {
    display: flex;
    grid-template-columns: repeat(4, 100px);
    grid-gap: 10px;
    background-color: #bbada0;
    padding: 10px;
    border-radius: 10px;
    flex-direction: column;

}

.game-row {
    display: flex;
}

.title {
    width: 100px;
    height: 100px;
    background-color: #cdc1b4;
    color: #776e65;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    border-radius: 15px;
    margin: 5px;

}

.title-empty {
    background-color: #cdc1b4;
}

.title-2 {
    background-color: #eee4da;
}

.title-4 {
    background-color: #ede0c8;
}

.title-8 {
    background-color: #f2b179;
}

.title-16 {
    background-color: #f59563;
}

.title-32 {
    background-color: #f67c5f;
}

.tile-64 {
    background-color: #f65e3b;
}

.tile-128 {
    background-color: #edcf72;
}

.tile-256 {
    background-color: #edcc61;
}

.tile-512 {
    background-color: #edc850;
}

.tile-1024 {
    background-color: #edc53f;
}

.tile-2048 {
    background-color: #edc22e;
}

.tile-4096 {
    background-color: #f5512c;
}

.controls {
    margin-top: 20px;
}

.controls button {
    font-size: 18px;
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;

}
</style>

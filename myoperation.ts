@customNode()
export class CustomNodeTS extends BasicScriptNode {

    @input()
    dirup: boolean;

    @input()
    dirdown: boolean;

    @input()
    dirright: boolean;

    @input()
    dirleft: boolean;

    @input()
    t1: number;
    @input()
    t2: number;
    @input()
    t3: number;
    @input()
    t4: number;
    @input()
    t5: number;
    @input()
    t6: number;
    @input()
    t7: number;
    @input()
    t8: number;
    @input()
    t9: number;
    @input()
    t10: number;
    @input()
    t11: number;
    @input()
    t12: number;
    @input()
    t13: number;
    @input()
    t14: number;
    @input()
    t15: number;
    @input()
    t16: number;

    @output()
    k1: number;
    @output()
    k2: number;
    @output()
    k3: number;
    @output()
    k4: number;
    @output()
    k5: number;
    @output()
    k6: number;
    @output()
    k7: number;
    @output()
    k8: number;
    @output()
    k9: number;
    @output()
    k10: number;
    @output()
    k11: number;
    @output()
    k12: number;
    @output()
    k13: number;
    @output()
    k14: number;
    @output()
    k15: number;
    @output()
    k16: number;

    @output()
    score: number;

    private direction: string = '';
    private board: number[][] = [];
    private isInitialized: boolean = false;


    execute() {

        if (!this.isInitialized) {
            this.initializeBoard();
            this.isInitialized = true;
        }
        // 1. 将输入的 t1-t16 转换为二维数组
        this.syncInputToBoard();

        // 2. 获取滑动方向
        this.direction = this.getDirection();

        // 3. 处理移动逻辑
        if (this.direction) {
            this.move(this.direction);
        }

        // 4. 将更新后的棋盘同步到输出 t1-t16
        this.syncBoardToOutput();

        // 5. 清空方向状态（可选）
        this.dirup = this.dirdown = this.dirright = this.dirleft = false;

    }

    private initializeBoard() {
        // 将所有格子设为0
        for (let i = 1; i <= 16; i++) {
            (this as any)[`t${i}`] = 0; // 使用类型断言解决TS类型检查
        }

        // 随机生成两个不同的位置
        const positions = new Set<number>();
        while (positions.size < 2) {
            positions.add(Math.floor(Math.random() * 16) + 1); // 生成1-16的随机数
        }

        // 设置这两个位置为2
        positions.forEach(pos => {
            (this as any)[`t${pos}`] = 2;
        });
    }

    // 将输入的 t1-t16 转换为二维数组
    private syncInputToBoard() {
        this.board = [
            [this.t1, this.t2, this.t3, this.t4],   // 第一行（原第一列）
            [this.t5, this.t6, this.t7, this.t8],     // 第二行（原第二列）
            [this.t9, this.t10, this.t11, this.t12],  // 第三行（原第三列）
            [this.t13, this.t14, this.t15, this.t16], // 第四行（原第四列）
        ];
    }

    // 将棋盘数据同步到输出 t1-t16
    private syncBoardToOutput() {
        this.t1 = this.board[0][0];
        this.t2 = this.board[0][1];
        this.t3 = this.board[0][2];
        this.t4 = this.board[0][3];
        this.t5 = this.board[1][0];
        this.t6 = this.board[1][1];
        this.t7 = this.board[1][2];
        this.t8 = this.board[1][3];
        this.t9 = this.board[2][0];
        this.t10 = this.board[2][1];
        this.t11 = this.board[2][2];
        this.t12 = this.board[2][3];
        this.t13 = this.board[3][0];
        this.t14 = this.board[3][1];
        this.t15 = this.board[3][2];
        this.t16 = this.board[3][3];
    }

    // 获取滑动方向
    private getDirection(): string {
        if (this.dirup) return 'up';
        if (this.dirdown) return 'down';
        if (this.dirleft) return 'left';
        if (this.dirright) return 'right';
        return '';
    }

    // --- 以下是2048核心逻辑 ---
    private addRandomTile() {
        const emptyCells: { row: number, col: number }[] = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push({row, col});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {row, col} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    private mergeRow(row: number[]) {
        const nonZeroTiles = row.filter(value => value !== 0);
        let merged: number[] = [];
        let i = 0;
        while (i < nonZeroTiles.length) {
            if (i < nonZeroTiles.length - 1 && nonZeroTiles[i] === nonZeroTiles[i + 1]) {
                merged.push(nonZeroTiles[i] * 2);
                this.score += nonZeroTiles[i] * 2; // 更新分数
                i += 2;
            } else {
                merged.push(nonZeroTiles[i]);
                i++;
            }
        }
        while (merged.length < 4) merged.push(0);
        for (let i = 0; i < 4; i++) row[i] = merged[i];
    }

    private reverseBoard() {
        for (let row of this.board) row.reverse();
    }

    private transposeBoard() {
        for (let row = 0; row < 4; row++) {
            for (let col = row + 1; col < 4; col++) {
                [this.board[row][col], this.board[col][row]] =
                    [this.board[col][row], this.board[row][col]];
            }
        }
    }

    private move(direction: string) {
        let moved = false;

        // 方向预处理
        if (direction === 'up' || direction === 'down') this.transposeBoard();
        if (direction === 'right' || direction === 'down') this.reverseBoard();

        // 合并行
        for (let row of this.board) {
            const original = [...row];
            this.mergeRow(row);
            if (row.some((v, i) => v !== original[i])) moved = true;
        }

        // 方向后处理
        if (direction === 'right' || direction === 'down') this.reverseBoard();
        if (direction === 'up' || direction === 'down') this.transposeBoard();

        // 添加新方块
        if (moved) this.addRandomTile();
    }

}

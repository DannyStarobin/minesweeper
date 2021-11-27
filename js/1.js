'use strict'

// not a good file name

var gBoard

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'


var gLevel = {
    size: 8,
    mines: 12
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gSafeClickCount
var gHintCount
var gHint = false
var gTimeInterval
var gStartTime
var gLifeCount
var gCells
var gFlags = gLevel.mines
var gClickCount
var gHeight = 30 // always the same
var gWidth = 30
var gFontSize = 1.2

init()

function init() {
    gGame.isOn = true
    if (gTimeInterval) clearInterval(gTimeInterval)
    gCells = getCells()
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
    gGame.shownCount = 0
    gGame.markedCount = 0
    gLifeCount = 3
    gHintCount = 3
    gSafeClickCount = 3
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😀'
    var elTime = document.querySelector('.time')
    elTime.innerText = 0
    var elHintBtn = document.querySelector('.hints-left')
    elHintBtn.innerText = gHintCount
    var elSafeBtn = document.querySelector('.safe-clicks-left')
    elSafeBtn.innerText = gSafeClickCount

    gFlags = gLevel.mines
    gClickCount = 0
    flagsCount()
    livesCount()
}
console.table(gBoard)
var minesPos

function buildBoard(length) {
    var board = [];
    minesPos = []
    for (var i = 0; i < length; i++) {
        board[i] = [];
        for (var j = 0; j < length; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }

    for (var i = 0; i < gLevel.mines; i++) {
        var minePos = drawCell()
        minesPos.push(minePos)
        board[minePos.i][minePos.j].isMine = true
    }
    return board;

}
console.table(gBoard)


function setMinesNegsCount(pos) {
    for (var k = 0; k < gCells.length; k++) {
        var mineNegs = 0
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue;

                if (gBoard[i][j].isMine) mineNegs++

            }
        }
        return mineNegs

    }

}

console.table(gBoard)

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gBoard[0].length; j++) {

            if (gBoard[i][j].isMine) {
                var cell = MINE
                var className = `cell cell${i}-${j} mine`
            } else {
                var cell =
                    gBoard[i][j].minesAroundCount = setMinesNegsCount({ i: i, j: j })
                var className = `cell cell${i}-${j}`
            }

            strHTML += `\t<td style="width:${gWidth}px;height:${gHeight}px;font-size:${gFontSize}em;" 
            class="${className}" onclick="onClickSwitch(this, ${i}, ${j})" onmousedown="cellMarked(this,${i},${j},event)" > 
                             </td>\n`
        }
        strHTML += `</tr>\n`
    }

    var elCells = document.querySelector('.mine-cells');
    elCells.innerHTML = strHTML;
}



console.table(gBoard)


function renderMIne() {
    for (var i = 0; i < minesPos.length; i++) {
        var pos = minesPos[i]
        var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'lightgrey'
        gBoard[pos.i][pos.j].isShown = true
    }
}

function onClickSwitch(elCell, i, j) {
    if (gHint) {
        showHint(elCell, i, j)
    } else {
        cellClicked(elCell, i, j)
    }

}

function showHintSwitch() {
    if (gHintCount > 0) gHint = true
}

function showHint(elCell, x, y) {
    if (!gHint) return
    var hintNegs = []
    if (gBoard[x][y].isMarked || !gGame.isOn || gBoard[x][y].isShown) return

    gHintCount--
    var elBtn = document.querySelector('.hints-left')
    elBtn.innerText = gHintCount

    for (var i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMarked || gBoard[i][j].isShown) continue
            hintNegs.push({ i: i, j: j })
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.style.backgroundColor = 'lightGrey'
            if (gBoard[i][j].minesAroundCount) elCell.innerText = gBoard[i][j].minesAroundCount
            if (gBoard[i][j].isMine) elCell.innerText = MINE


            gHint = false
            setTimeout(() => {

                closeHint(hintNegs)
            }, 1000)


        }
    }

}


function closeHint(hintNegs) {
    for (var i = 0; i < hintNegs.length; i++) {
        var pos = hintNegs[i]
        if (gBoard[pos.i][pos.j].isMarked || gBoard[pos.i][pos.j].isShown) continue
        var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`);
        elCell.innerText = ' '
        elCell.style.backgroundColor = 'yellow'

    }
}


function getSafeCell(elBtn) {
    if (gSafeClickCount < 1) return
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMarked || gBoard[i][j].isShown || gBoard[i][j].isMine) continue
            var cell = { i: i, j: j }
            safeCells.push(cell)
        }
    }
    console.log(safeCell);

    gSafeClickCount--
    var elSafeBtn = elBtn.querySelector('.safe-clicks-left')
    elSafeBtn.innerText = gSafeClickCount

    var safeCell = safeCells[getRandomInt(0, safeCells.length)]
    var elCell = document.querySelector(`.cell${safeCell.i}-${safeCell.j}`);
    elCell.style.backgroundColor = 'blue'

    setTimeout(() => {
        if (elCell.style.backgroundColor === 'blue') elCell.style.backgroundColor = 'yellow'
    }, 2000)


}

function cellClicked(elCell, i, j) {

    if (gBoard[i][j].isMarked || !gGame.isOn || gBoard[i][j].isShown || gHint) return
    if (gClickCount === 0) startTimeInterval()
    gClickCount++


    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        gLifeCount--
        livesCount()
        if (gLifeCount === 0) {
            gameOver()
        }

    } else if (gBoard[i][j].minesAroundCount) {
        elCell.innerText = gBoard[i][j].minesAroundCount
        gGame.shownCount++

    } else if (!gBoard[i][j].isMine && !gBoard[i][j].minesAroundCount) {
        gGame.shownCount++
            expandShown({ i: i, j: j })
    }

    elCell.style.backgroundColor = 'lightGrey'
    gBoard[i][j].isShown = true

    if (gGame.shownCount === (gLevel.size * gLevel.size - gLevel.mines)) gameWin()
}
console.table(gBoard)


function expandShown(pos) {

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (gBoard[i][j].isMarked) continue
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.style.backgroundColor = 'lightGrey'
                if (gBoard[i][j].minesAroundCount) elCell.innerText = gBoard[i][j].minesAroundCount
                gBoard[i][j].isShown = true
                gGame.shownCount++
            }
        }

    }
}

function cellMarked(elCell, i, j, e) {
    if (!gGame.isOn || gBoard[i][j].isShown) return
    if (gClickCount === 0) startTimeInterval()
    gClickCount++
    if (e.which === 3) {
        if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false
            elCell.innerText = ' '
            gGame.markedCount -= 1
                ++gFlags
            flagsCount()
        } else if (gLevel.mines > gGame.markedCount) {
            elCell.innerText = FLAG
            gBoard[i][j].isMarked = true
            gGame.markedCount += 1
            gFlags--
            flagsCount()
        }
    }
}
console.table(gBoard)

function gameOver() {
    gGame.isOn = false
    renderMIne()
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '☠'
    clearInterval(gTimeInterval)
}
gameWin()

function gameWin() {
    gGame.isOn = false
    if (gGame.shownCount === (gLevel.size * gLevel.size - gLevel.mines)) {
        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = '😎'
        clearInterval(gTimeInterval)
    }
}

function setLevel(size, mines) {
    console.log(size);
    if (size === 4) {
        gHeight = 64
        gWidth = 64
        gFontSize = 2
    }
    if (size === 8) {
        gHeight = 30
        gWidth = 30
        gFontSize = 1.2
    }
    if (size === 12) {
        gHeight = 18.7
        gWidth = 18.7
        gFontSize = 0.8
    }

    gLevel.size = size
    gLevel.mines = mines
    init()



}


function startTimeInterval() {
    gStartTime = Date.now()

    gTimeInterval = setInterval(function() {
        var elTime = document.querySelector('.time')
        var secs = Date.now() - gStartTime


        elTime.innerText = (secs / 1000).toFixed(0)
    }, 100)
}


function flagsCount() {
    var elFlagCount = document.querySelector('.flags-count')
    elFlagCount.innerText = gFlags
}



function livesCount() {
    var elLivesLeft = document.querySelector('.lives-left')
    elLivesLeft.innerText = gLifeCount
}


function undo() {


}
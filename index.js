const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const turnHtml = document.getElementById('turn')
console.log(turnHtml)

if (window.innerWidth >= 650){
	canvas.width = 600
} else {
	canvas.width = 400
}
canvas.height = canvas.width

c.imageSmoothingEnabled = false

const squareSize = canvas.width / 8
const placeholderImage = new Image()
let pieces = []

let turn = 0

const mouse = {
	position: {
		x: undefined,
		y: undefined
	},
	startPos: {
		x: undefined,
		y: undefined
	},
	endPos: {
		x: undefined,
		y: undefined
	},
	isDown: false,
	selectedPiece: undefined
}

let board = [
    [2, 3, 4, 5, 6, 4, 3, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [11, 11, 11, 11, 11, 11, 11, 11],
    [12, 13, 14, 15, 16, 14, 13, 12],
]


function createImage(imageSrc) {
	const image = new Image()
	image.src = imageSrc
	return image
}
const images = {
	whitePawn: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png'),
	blackPawn: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png'),
	whiteRook: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png'),
	blackRook: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png'),
	whiteKnight: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png'),
	blackKnight: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png'),
	whiteBishop: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png'),
	blackBishop: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png'),
	whiteQueen: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png'),
	blackQueen: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png'),
	whiteKing: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png'),
	blackKing: createImage('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png'),
}


class Piece {
    constructor({x, y, tag}) {
        this.position = {
            x,
            y
        }

        this.width = squareSize
        this.height = squareSize

        this.tag = tag
        this.image = placeholderImage
        this.loaded = false
    }

    draw() {
        if (this.loaded) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
    }
}


function pieceCode(x) {
	y = undefined
	if (typeof(x) === 'string') {
		switch (x) {
			case 'blackPawn': y = 1; break
			case 'whitePawn': y = 11; break
			case 'blackRook': y = 2; break
			case 'whiteRook': y = 12; break
			case 'blackKnight': y = 3; break
			case 'whiteKnight': y = 13; break
			case 'blackBishop': y = 4; break
			case 'whiteBishop': y = 14; break
			case 'blackQueen': y = 5; break
			case 'whiteQueen': y = 15; break
			case 'blackKing': y = 6; break
			case 'whiteKing': y = 16; break
		}
	} else if (typeof(x) === 'number') {
		switch (x) {
			case 1: y = 'blackPawn'; break
			case 11: y = 'whitePawn'; break
			case 2: y = 'blackRook'; break
			case 12: y = 'whiteRook'; break
			case 3: y = 'blackKnight'; break
			case 13: y = 'whiteKnight'; break
			case 4: y = 'blackBishop'; break
			case 14: y = 'whiteBishop'; break
			case 5: y = 'blackQueen'; break
			case 15: y = 'whiteQueen'; break
			case 6: y = 'blackKing'; break
			case 16: y = 'whiteKing'; break
			case 0: y = 'xxxxxxxxx'; break
		}
	}
	return y
}


function createStaticPieces() {
	pieces = []

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (board[j][i]) {
				tempTag = pieceCode(board[j][i])
				pieces.push(
					new Piece({
						x: i * squareSize,
						y: j * squareSize,
						tag: tempTag
					})
				)
			}
		}
	}
}
createStaticPieces()


// cycle through images and set onload functions
Object.keys(images).forEach(tag => {
	images[tag].onload = function() {
		// cycle through pieces and set the pieces of the image that loaded
		pieces.forEach(piece => {
			if (piece.tag === tag) {
				piece.image = images[tag]
				piece.loaded = true
			}
		})
	}
})


function isValidMove() {
	const startCoord = {
		x: Math.floor(mouse.startPos.x / squareSize),
		y: Math.floor(mouse.startPos.y / squareSize)
	}
	const endCoord = {
		x: Math.floor(mouse.endPos.x / squareSize),
		y: Math.floor(mouse.endPos.y / squareSize)
	}
	const startPiece = {
		col: pieceCode(board[startCoord.y][startCoord.x]).slice(0, 5),
		piece: pieceCode(board[startCoord.y][startCoord.x]).slice(5)
	}
	const endPiece = {
		col: pieceCode(board[endCoord.y][endCoord.x]).slice(0, 5),
		piece: pieceCode(board[endCoord.y][endCoord.x]).slice(5)
	}

	// if moving to a square with same colour piece
	if (endPiece.col !== 'xxxxx' && endPiece.col === startPiece.col) {
		return false
	}

	// check whos turn it is
	if (
		(startPiece.col === 'black' && turn % 2 === 0) ||
		(startPiece.col === 'white' && turn % 2 === 1)
	) {
			return false
	}

	// go through pieces
	if (startPiece.piece === 'Pawn') {
		if (startPiece.col === 'black') {
			if (
				// one square diagonal and onto white
				(Math.abs(endCoord.x - startCoord.x) === 1 && endCoord.y - startCoord.y === 1 && endPiece.col === 'white') ||
				// on home row, two squares down, file is same, moving to empty square
				(startCoord.y === 1 && endCoord.y - startCoord.y === 2 && endPiece.col === 'xxxxx' && board[startCoord.y + 1][startCoord.x] === 0) ||
				// one square down, file is same, moving to empty square
				(endCoord.y - startCoord.y === 1 && endCoord.x === startCoord.x && endPiece.col === 'xxxxx')
			) {
				return true
			} else return false
		}

		if (startPiece.col === 'white') {
			if (
				// one square diagonal and onto white
				(Math.abs(endCoord.x - startCoord.x) === 1 && endCoord.y - startCoord.y === -1 && endPiece.col === 'black') ||
				// on home row, two squares down, file is same, moving to empty square
				(startCoord.y === 6 && endCoord.y - startCoord.y === -2 && endPiece.col === 'xxxxx' && board[startCoord.y - 1][startCoord.x] === 0) ||
				// one square down, file is same, moving to empty square
				(endCoord.y - startCoord.y === -1 && endCoord.x === startCoord.x && endPiece.col === 'xxxxx')
			) {
				return true
			} else return false
		}

		return false
	} else if (startPiece.piece === 'Rook') {
		// end if any diagonal
		if (endCoord.x !== startCoord.x && endCoord.y !== startCoord.y) {
			return false
		}
		// up
		if (endCoord.y < startCoord.y) {
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y - i][startCoord.x] !== 0) {
					return false
				}
			}
		}
		// down
		if (endCoord.y > startCoord.y) {
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y + i][startCoord.x] !== 0) {
					return false
				}
			}
		}
		// left
		if (endCoord.x < startCoord.x) {
			for (let i = 1; i < Math.abs(endCoord.x - startCoord.x); i++) {
				if (board[startCoord.y][startCoord.x - i] !== 0) {
					return false
				}
			}
		}
		// right
		if (endCoord.x > startCoord.x) {
			for (let i = 1; i < Math.abs(endCoord.x - startCoord.x); i++) {
				if (board[startCoord.y][startCoord.x + i] !== 0) {
					return false
				}
			}
		}
		return true
	} else if (startPiece.piece === 'Knight') {
		if (
			(Math.abs(endCoord.x - startCoord.x) === 2 && Math.abs(endCoord.y - startCoord.y) === 1) ||
			(Math.abs(endCoord.x - startCoord.x) === 1 && Math.abs(endCoord.y - startCoord.y) === 2)
		) {
			return true
		} else return false
	} else if (startPiece.piece === 'Bishop') {
		// diff in x has to equal diff in y
		if (Math.abs(endCoord.x - startCoord.x) !== Math.abs(endCoord.y - startCoord.y)) {
			return false
		}
		// up-right
		if (endCoord.x > startCoord.x && endCoord.y < startCoord.y) {
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y - i][startCoord.x + i] !== 0) {
					return false
				}
			}
		}
		// down-right
		if (endCoord.x > startCoord.x && endCoord.y > startCoord.y) {
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y + i][startCoord.x + i] !== 0) {
					return false
				}
			}
		}
		// down-left
		if (endCoord.x < startCoord.x && endCoord.y > startCoord.y) {
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y + i][startCoord.x - i] !== 0) {
					return false
				}
			}
		}
		// up-left
		if (endCoord.x < startCoord.x && endCoord.y < startCoord.y) {
			console.log('upleft')
			for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
				if (board[startCoord.y - i][startCoord.x - i] !== 0) {
					console.log(i, Math.abs(endCoord.y - startCoord.y))
					console.log(board[startCoord.y - i][startCoord.x - i] !== 0)
					return false
				}
			}
		}
		return true
	} else if (startPiece.piece === 'Queen') {
		if (endCoord.y === startCoord.y || endCoord.x === startCoord.x) {
			// up
			if (endCoord.y < startCoord.y) {
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y - i][startCoord.x] !== 0) {
						return false
					}
				}
			}
			// down
			if (endCoord.y > startCoord.y) {
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y + i][startCoord.x] !== 0) {
						return false
					}
				}
			}
			// left
			if (endCoord.x < startCoord.x) {
				for (let i = 1; i < Math.abs(endCoord.x - startCoord.x); i++) {
					if (board[startCoord.y][startCoord.x - i] !== 0) {
						return false
					}
				}
			}
			// right
			if (endCoord.x > startCoord.x) {
				for (let i = 1; i < Math.abs(endCoord.x - startCoord.x); i++) {
					if (board[startCoord.y][startCoord.x + i] !== 0) {
						return false
					}
				}
			}
			return true
		} else if (Math.abs(endCoord.y - startCoord.y) === Math.abs(endCoord.x - startCoord.x)) {
			// up-right
			if (endCoord.x > startCoord.x && endCoord.y < startCoord.y) {
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y - i][startCoord.x + i] !== 0) {
						return false
					}
				}
			}
			// down-right
			if (endCoord.x > startCoord.x && endCoord.y > startCoord.y) {
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y + i][startCoord.x + i] !== 0) {
						return false
					}
				}
			}
			// down-left
			if (endCoord.x < startCoord.x && endCoord.y > startCoord.y) {
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y + i][startCoord.x - i] !== 0) {
						return false
					}
				}
			}
			// up-left
			if (endCoord.x < startCoord.x && endCoord.y < startCoord.y) {
				console.log('upleft')
				for (let i = 1; i < Math.abs(endCoord.y - startCoord.y); i++) {
					if (board[startCoord.y - i][startCoord.x - i] !== 0) {
						console.log(i, Math.abs(endCoord.y - startCoord.y))
						console.log(board[startCoord.y - i][startCoord.x - i] !== 0)
						return false
					}
				}
			}
			return true
		} else return false
	} else if (startPiece.piece === 'King') {
		if (Math.abs(endCoord.x - startCoord.x) <= 1 && Math.abs(endCoord.y - startCoord.y) <= 1) {
			return true
		} else return false
	}
}


const lightCol = '#f5cfa2'
const darkCol = '#d99e6a'
const boardLetters = ["a","b","c","d","e","f","g","h",]
function drawBoard() {
	// squares
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (i % 2 == j % 2) {
				c.fillStyle = lightCol
			} else c.fillStyle = darkCol
			c.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
		}		
	}

	c.font = `${canvas.width / 30}px Arial`
	for (var i = 0; i < 8; i++) {
		// numbers
		if (i % 2) {
			c.fillStyle = lightCol
		} else c.fillStyle = darkCol
		c.fillText(i + 1, squareSize / 10 - 4, squareSize * i + 20)

		// letters
		if (i % 2) {
			c.fillStyle = darkCol
		} else c.fillStyle = lightCol
		c.fillText(boardLetters[i], i * squareSize + squareSize - 15, squareSize * 8 - 7)
	}
}


function roundSquare(x) {
	return Math.ceil(x / squareSize) * squareSize - squareSize
}


function animate() {
  requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0, 0, canvas.width, canvas.height)

  drawBoard()
	
	pieces.forEach(piece => {
		piece.draw()
	})
}
animate()


window.addEventListener('mousedown', (event) => {
	mouse.startPos = ({x: mouse.position.x, y: mouse.position.y})
	mouse.isDown = true

	pieces.forEach(piece => {
		if (
			piece.position.x / squareSize === Math.floor(mouse.startPos.x / squareSize) &&
			piece.position.y / squareSize === Math.floor(mouse.startPos.y / squareSize)
		) {
			mouse.selectedPiece = piece
		}
	})
})

window.addEventListener('mouseup', (event) => {
	mouse.endPos = ({x: mouse.position.x, y: mouse.position.y})
	mouse.isDown = false

	if (mouse.selectedPiece !== undefined) {
		if (isValidMove()) {
			pieces.forEach(piece => {
				if (
					piece.position.x / squareSize === Math.floor(mouse.endPos.x / squareSize) &&
					piece.position.y / squareSize === Math.floor(mouse.endPos.y / squareSize)
				) {
					pieces.splice(pieces.indexOf(piece), 1)
				}
			})
	
			mouse.selectedPiece.position = ({
				x: roundSquare(mouse.endPos.x),
				y: roundSquare(mouse.endPos.y)
			})
	
			board[Math.floor(mouse.endPos.y / squareSize)][Math.floor(mouse.endPos.x / squareSize)] = board[Math.floor(mouse.startPos.y / squareSize)][Math.floor(mouse.startPos.x / squareSize)]
			board[Math.floor(mouse.startPos.y / squareSize)][Math.floor(mouse.startPos.x / squareSize)] = 0

			turn++
			if (turn % 2 === 0) {
				turnHtml.innerHTML = 'White\'s Turn To Move'
			} else {
				turnHtml.innerHTML = 'Black\'s Turn To Move'
			}
	
		} else {
			mouse.selectedPiece.position = ({
				x: roundSquare(mouse.startPos.x),
				y: roundSquare(mouse.startPos.y)
			})
		}
	
		mouse.selectedPiece = undefined
	}
})

window.addEventListener('mousemove', (event) => {
	let x = event.clientX - canvas.getBoundingClientRect().left
	let y = event.clientY - canvas.getBoundingClientRect().top

	if (
		x > 0 &&
		y > 0 &&
		x < canvas.width &&
		y < canvas.height
	) {
		mouse.position = ({x: x, y: y})

		if (mouse.isDown && mouse.selectedPiece !== undefined) {
			mouse.selectedPiece.position = ({
				x: mouse.position.x - squareSize / 2,
				y: mouse.position.y - squareSize / 2
			})
		}
	}
})

window.addEventListener('keypress', (event) => {
	console.log(board)
})

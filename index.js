const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600

c.imageSmoothingEnabled = false

const squareSize = canvas.width / 8
const placeholderImage = new Image()
let pieces = []

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


function createStaticPieces() {
	pieces = []

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (board[j][i]) {
				switch (board[j][i]) {
					case 1: tempTag = 'blackPawn'; break
					case 11: tempTag = 'whitePawn'; break
					case 2: tempTag = 'blackRook'; break
					case 12: tempTag = 'whiteRook'; break
					case 3: tempTag = 'blackKnight'; break
					case 13: tempTag = 'whiteKnight'; break
					case 4: tempTag = 'blackBishop'; break
					case 14: tempTag = 'whiteBishop'; break
					case 5: tempTag = 'blackQueen'; break
					case 15: tempTag = 'whiteQueen'; break
					case 6: tempTag = 'blackKing'; break
					case 16: tempTag = 'whiteKing'; break
				}
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
	return true
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

	c.font = '20px Arial'
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


function displayStaticPieces() {
	pieces.forEach(piece => {
		piece.draw()
	})
}


function roundSquare(x) {
	return Math.ceil(x / squareSize) * squareSize - squareSize
}


function animate() {
  requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0, 0, canvas.width, canvas.height)

  drawBoard()
	displayStaticPieces()

	console.log(mouse)
}
animate()


window.addEventListener('mousedown', (event) => {
	mouse.startPos = ({x: mouse.position.x, y: mouse.position.y})
	mouse.isDown = true

	pieces.forEach(piece => {
		if (
			piece.position.x / 75 === Math.floor(mouse.startPos.x / 75) &&
			piece.position.y / 75 === Math.floor(mouse.startPos.y / 75)
		) {
			mouse.selectedPiece = piece
		}
	})
})

window.addEventListener('mouseup', (event) => {
	mouse.endPos = ({x: mouse.position.x, y: mouse.position.y})
	mouse.isDown = false

	if (isValidMove()) {
		pieces.forEach(piece => {
			if (
				piece.position.x / 75 === Math.floor(mouse.endPos.x / 75) &&
				piece.position.y / 75 === Math.floor(mouse.endPos.y / 75)
			) {
				pieces.splice(pieces.indexOf(piece), 1)
			}
		})

		mouse.selectedPiece.position = ({
			x: roundSquare(mouse.endPos.x),
			y: roundSquare(mouse.endPos.y)
		})

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

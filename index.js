const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600

c.imageSmoothingEnabled = false

const squareSize = canvas.width / 8
const placeholderImage = new Image()


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
			x: x,
			y: y
		}

		this.width = squareSize
		this.height = squareSize

		this.tag = tag
		this.image = placeholderImage
		this.loaded = false
	}

	draw() {
		if (this.loaded === true) {
			c.drawImage(
				this.image,
				this.position.x * squareSize,
				this.position.y * squareSize,
				squareSize,
				squareSize
			)
		}
	}
}


let pieces = []

for (let i = 0; i < 8; i++) {
	pieces.push(
		new Piece({
			x: i,
			y: 1,
			tag: 'blackPawn'
		}),
		new Piece({
			x: i,
			y: 6,
			tag: 'whitePawn'
		})
	)
}
for (let i = 0; i < 2; i++) {
	pieces.push(
		new Piece({
			x: i * 7,
			y: 0,
			tag: 'blackRook'
		}),
		new Piece({
			x: i * 7,
			y: 7,
			tag: 'whiteRook'
		}),
		new Piece({
			x: i * 5 + 1,
			y: 0,
			tag: 'blackKnight'
		}),
		new Piece({
			x: i * 5 + 1,
			y: 7,
			tag: 'whiteKnight'
		}),
		new Piece({
			x: i * 3 + 2,
			y: 0,
			tag: 'blackBishop'
		}),
		new Piece({
			x: i * 3 + 2,
			y: 7,
			tag: 'whiteBishop'
		})
	)
}
pieces.push(
	new Piece({
		x: 3,
		y: 0,
		tag: 'blackQueen'
	}),
	new Piece({
		x: 3,
		y: 7,
		tag: 'whiteQueen'
	}),
	new Piece({
		x: 4,
		y: 0,
		tag: 'blackKing'
	}),
	new Piece({
		x: 4,
		y: 7,
		tag: 'whiteKing'
	})
)


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


function animate() {
	requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0, 0, canvas.width, canvas.height)

	drawBoard()

	pieces.forEach(piece => {
		if (piece.loaded === true) {
			piece.draw()
		}
	})
}


animate()
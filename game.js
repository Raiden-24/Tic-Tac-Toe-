const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const modeSelection = document.getElementById('modeSelection');
const markerSelection = document.getElementById('markerSelection');
const gameEndElement = document.getElementById('gameEnd');
const thankYouPage = document.getElementById('thankYouPage');

let board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentMarker = 'X';
let currentPlayer = 1;
let gameMode = '';
let isGameActive = false;
let playerMarker = 'X';
let computerMarker = 'O';

// Function to initialize the game board
function initializeBoard() {
    boardElement.innerHTML = ''; // Clear the board
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = `${i}-${j}`;
            cell.addEventListener('click', () => handleCellClick(i, j));
            boardElement.appendChild(cell);
        }
    }
    boardElement.style.display = 'grid'; // Show the board
    messageElement.innerText = `Player ${currentPlayer}'s turn using symbol (${currentMarker})`;
}

// Start the game based on the selected mode
function startGame(mode) {
    gameMode = mode;
    currentPlayer = 1; // Reset to player 1
    currentMarker = 'X'; // Default to X
    isGameActive = true;

    modeSelection.style.display = 'none'; // Hide mode selection
    markerSelection.style.display = 'block'; // Show marker selection
}

// Select marker for the game
function selectMarker(marker) {
    playerMarker = marker;
    computerMarker = (marker === 'X') ? 'O' : 'X'; // Ensure the computer chooses the opposite marker
    currentMarker = playerMarker;

    messageElement.innerText = `You are playing as ${playerMarker}. Computer is ${computerMarker}.`;
    
    markerSelection.style.display = 'none'; // Hide marker selection
    initializeBoard(); // Initialize the game board
    
    if (gameMode === 'PvC' && currentPlayer === 2) {
        computerMove();
    }
}

// Handle cell click events
function handleCellClick(i, j) {
    if (!isGameActive || board[i][j] !== '' || (gameMode === 'PvC' && currentPlayer === 2)) return;

    board[i][j] = currentMarker; // Place marker
    updateBoard();

    const winner = checkWinner();
    if (winner) {
        messageElement.innerText = `Player ${winner} wins!`;
        isGameActive = false;
        endGame();
        return;
    }

    if (isBoardFull()) {
        messageElement.innerText = 'It\'s a tie!';
        isGameActive = false;
        endGame();
        return;
    }

    switchPlayer();

    if (gameMode === 'PvC' && isGameActive) {
        computerMove();
    }
}

// Update the board UI
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const [i, j] = cell.dataset.index.split('-').map(Number);
        cell.innerText = board[i][j];
        if (board[i][j] !== '') {
            cell.classList.add('disabled');
        }
    });
    messageElement.innerText = `Player ${currentPlayer}'s turn using symbol(${currentMarker})`;
}

// Check for a winner
function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return currentPlayer;
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return currentPlayer;
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return currentPlayer;
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return currentPlayer;
    return null;
}

// Check if the board is full
function isBoardFull() {
    return board.flat().every(cell => cell !== '');
}

// Switch player function
function switchPlayer() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    currentMarker = (currentMarker === playerMarker) ? computerMarker : playerMarker;
    messageElement.innerText = `Player ${currentPlayer}'s turn (${currentMarker})`;
}

// Computer's turn
function computerMove() {
    let move;
    do {
        const i = Math.floor(Math.random() * 3);
        const j = Math.floor(Math.random() * 3);
        if (board[i][j] === '') {
            move = { i, j };
        }
    } while (!move);
    board[move.i][move.j] = computerMarker; // Place the computer's marker
    updateBoard();

    const winner = checkWinner();
    if (winner) {
        messageElement.innerText = `Player ${winner} wins!`;
        isGameActive = false;
        endGame();
        return;
    }

    if (isBoardFull()) {
        messageElement.innerText = 'It\'s a tie!';
        isGameActive = false;
        endGame();
        return;
    }

    switchPlayer(); // Switch back to player
}

// End the game
function endGame() {
    gameEndElement.style.display = 'block'; // Show game end message
}

// Restart the game
function restartGame() {
    gameEndElement.style.display = 'none'; // Hide the game end message
    initializeBoard();
    isGameActive = true;
}

// Exit the game
// Exit the game function
function exitGame() {
    // Hide the game elements
    document.getElementById('gameEnd').style.display = 'none';
    document.getElementById('board').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'none';  // Hide mode selection
    document.getElementById('markerSelection').style.display = 'none';  // Hide marker selection

    // Clear the board element
    document.getElementById('board').innerHTML = '';

    // Display the "Thank You" message
    const thankYouPage = document.getElementById('thankYouPage');
    thankYouPage.innerHTML = `<h1>Thank you for playing!</h1><p>Game by Amruth</p>`;
    thankYouPage.style.display = 'block'; // Show thank you page
}
 
// Initialize the game
function initGame() {
    modeSelection.style.display = 'block'; // Show mode selection
    gameEndElement.style.display = 'none'; // Hide end game message
    thankYouPage.style.display = 'none'; // Hide the thank you page
}

// Call the initGame function to start the game
initGame();

// Attach event listeners for buttons
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('exitButton').addEventListener('click', exitGame);



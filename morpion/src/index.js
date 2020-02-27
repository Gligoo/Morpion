import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Composant qui affiche un Bouton
// class Square extends React.Component {

//      square ne maintient plus son état local donc on peu le supprimer 
    
//      constructor(props) {
//         super(props);
//         this.state = {
//             value: null,
//         }
//     }

//     render() {
//       return (
//         // j'ajoute un évènement clic sur mes 'square'.
//         // ici on utilise une fonction fléchée ce qui revient à " function() ".
//         // Ne pas oublier () après onClick sinon l'alerte se déclenchera immédiatement à chaque                      affichage.
//         <button 
//             className="square" 
//             // Je modifie la valeur de value dans le state, à chaque click désormais une X s'affiche.
//             onClick={() => this.props.onClick()}
//         >
//         {/* je passe la props 'value' du composant parent Board au composant enfant square*/}
//         {/*{this.props.value} */}
//         {this.props.value}
//         </button>
//       );
//     }
//   }


function Square (props) {
  return (
    <button className="squares" onClick={props.onClick}>
        {props.value}
    </button>
  );
}

// Composant qui affiche les cases
  class Board extends React.Component {

    // Nous effaçons désormais le contructor de Board car c'est GAME qui vas gérer l'état pour
    // obtenir l'historique

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         // La méthode fill() remplit tous les éléments d'un tableau entre deux index avec une valeur statique.
    //         squares: Array(9).fill(null),
    //         xIsNext : true,
    //     };
    // }


    // handleClick(i) {
    //   // La méthode slice() renvoie un objet tableau, contenant une copie superficielle.
    //   // créer une copie du tableau squares à modifier, plutôt que de modifier le tableau existant.
    //   const squares = this.state.squares.slice();

    //   //Nous pouvons maintenant modifier la méthode handleClick de Board pour la court-circuiter en       ignorant le clic si quelqu’un a déjà gagné la partie, ou si la case est déjà remplie

    //   if (calculateWinner(squares) || squares[i]) {
    //     return;
    //   }

    //   // Ici on permet d'inverser les X et O à chaque tour
    //   squares[i] = this.state.xIsNext ? 'X' : 'O';
    //   this.setState({
    //     squares: squares,
    //     xIsNext: !this.state.xIsNext,
    //   });
    // }


    renderSquare(i) {
    // je passe une valeur au square
      return (

        <Square
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
       />

      )
    }
  
    render() {
      
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }


  // Composant qui affiche le tableau
  class Game extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        // concat ne modifie pas le tableau contrairement à push
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState ({
        stepNumber: step,
        xIsNext: (step % 2 ) === 0,
      })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
          const desc = move ?
            'Revenir au tour numéro' + move :
            'Revenir au début de la partie';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
            );
                  
          });
        
      let status;
      if (winner) {
        status = 'winner: ' + winner;
      } else {
        status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
      }
      

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }


  // À partir d’un tableau de 9 cases, cette fonction vérifiera si on a un gagnant et renverra 'X', 'O' ou null suivant le cas.
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );


  
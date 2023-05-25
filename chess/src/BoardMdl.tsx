import { Chess } from "chess.js";
import { any } from "prop-types";
import React from "react";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

const namedPieces:any={
  "wP":"White Pawn",
  "wN":"White Knight",
  "wB":"White Bishop",
  "wR":"White Rook",
  "wQ":"White Queen",
  "wK":"White King",
  "bP":"Mint Pawn",
  "bN":"Mint Knight",
  "bB":"Mint Bishop",
  "bR":"Mint Rook",
  "bQ":"Mint Queen",
  "bK":"Mint King",
}

function PandaBoard() {
  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];
 
  const [game, setGame] = useState(new Chess());
  const [invalidSquare, setInvalidSquare] = useState({});
  const [validSquare, setValidSquare] = useState({});
  const [movesList, setMovesList]=useState<any>({moves:[]})
  
  function mutateGame(changes:any) {
    const updatedState = new Chess();
    updatedState.loadPgn(game.pgn());
    try{
      updatedState.move(changes);

    }
    catch(err){
      console.log("Don't you know how to play chess")
     
    }
    
    setGame(updatedState);
    return updatedState;
  }
 function onPieceDragBegin(piece:any,sourceSquare:any){
    const moves = game.moves({square:sourceSquare,verbose:true}); 
    
    const validMoves:any={};
    const panda = require(`./img/panda.png`)
    moves.map((move)=>{
      validMoves[move.to]={
                        backgroundImage:`url("${panda}")`,
                        backgroundRepeat:"no-repeat",
                        backgroundSize:"65%",
                        backgroundPosition:"center",
                        opacity:"0.45",
                        }
    })
    validMoves[sourceSquare]={background:game.get(sourceSquare).color}
    setValidSquare(validMoves)
 }
  //AI
  function onDragOverSquare(square:any){
    
    const invalidMove:any={}
    if(!(square in validSquare)){
      invalidMove[square]={background:"none repeat scroll 0 0 rgba(255, 0, 0, 0.30)"}
    }
    setInvalidSquare(invalidMove)
    


  
    return true;
  }

  function onDrop(fromSquare:any, toSquare:any,piece:any) {
    setInvalidSquare({})
    setValidSquare({})
    const change = mutateGame({
      from: fromSquare,
      to: toSquare,
      promotion: "q",
      strict:true,
    });
    if(change == null){return false}
    if(toSquare in validSquare){
      let prevMoves = movesList["moves"];
      prevMoves.push({piece:piece,id:prevMoves.length+1,origin:fromSquare,destination:toSquare})
      setMovesList({moves:prevMoves})
    }
    //call Ai
    return true;
  }
  //from react-chessboard.com

  function pandaBrand() {
    
    const returnPieces:any = {};
    pieces.forEach(function (val) {
      const photo = require(`./img/${val}.png`)
      const alt=`${val}`
      returnPieces[val] = (squareWidth:any) => (
        <img
          style={{
            width: val==="wP"||val==="bP"? squareWidth:squareWidth,
            height: val==="wP"||val==="bP"? "auto":squareWidth,
            marginTop: val==="wP"||val==="bP"? "30%":"10%",

          }}
          src={photo}
          alt={alt}
        />
      );
    });

    
    return returnPieces;
  }

  return (
   <div>
    <div>
    <Chessboard
      id="panda-Board"
      boardWidth={500}
      position={game.fen()}
      onPieceDrop={onDrop}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      }}
      customDarkSquareStyle={{ backgroundColor: "#7EC6B8",position:"relative" }}
      customLightSquareStyle={{ backgroundColor: "#FFFFFF" }}
      customPieces={pandaBrand()}
      onDragOverSquare={onDragOverSquare}
      customSquareStyles={{
        ...invalidSquare,
        ...validSquare,
      }}
      onPieceDragBegin={onPieceDragBegin}
     
      
    />
    </div>
     <div>
      <Tracker list={movesList["moves"]}/>
     </div>
   </div>


  );
}
function Tracker(props:any){
  const showList =(item:{piece:string,id:number,origin:string,destination:string})=>{
  
    return (
      <p><span>{item.id}. {namedPieces[item.piece]} from</span> <span><b>{item.origin}</b> to <b>{item.destination}</b></span></p>
    );

  };
  return(
    <p>{props.list.map(showList)}</p>
  );
}
export default PandaBoard;

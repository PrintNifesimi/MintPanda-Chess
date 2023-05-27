import { Chess } from "chess.js";
import React from "react";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import "./index.css"

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
  const [movesList, setMovesList]=useState<any>({moves:[]});
  const [deadPieces, updateDeadPieces]=useState<any>({w:[],b:[]})
  const [keyDuplicate, setKeyDuplicate]=useState<any>({})
  
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
       return 0;                 
    }
    )
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
  function checkKill(game:Chess){
    let history = game.history({verbose:true})
    let lastMoveDetails:any = history[history.length-1];
    let key = lastMoveDetails["piece"]+lastMoveDetails["captured"]+lastMoveDetails["after"]
    if (lastMoveDetails["captured"] && !keyDuplicate[key]){
      
        setKeyDuplicate({...keyDuplicate,key:true});
        return [true,game.turn()+lastMoveDetails["captured"].toUpperCase()]
    }
    else{
     
      return [false,"none"]
    }

  }
  function getPieceCurrSquare(type:string,color:string){
      let piece = {type:type,color:color}
      const get_piece_positions = (game:any, piece:any) => {
        return [].concat(...game.board()).map((p:any, index) => {
          if (p !== null && p.type === piece.type && p.color === piece.color) {
            return index
          }
          return 0;
        }).filter(Number.isInteger).map((piece_index:any) => {
          const row = 'abcdefgh'[piece_index % 8]
          const column = Math.ceil((64 - piece_index) / 8)
          return row + column
        })
      }
      
      return get_piece_positions(game,piece);
  }
  function checkHandler(incheck:string){
    
    let kingPos:string[] = getPieceCurrSquare('k',incheck)
    let invalidMove:any ={}
    invalidMove[kingPos[0]]={background:"none repeat scroll 0 0 rgba(154, 42, 42, 0.30)"}
    setInvalidSquare(invalidMove)
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
 
    if (change.inCheck()) checkHandler(change.turn())
    if(change == null){return false}
    let kill =checkKill(change)
    console.log(kill)
    if(kill[0]){
      let takenPieces = deadPieces;
      takenPieces[change.turn()].push([takenPieces[change.turn()].length+1,kill[1]]);
      updateDeadPieces(takenPieces);
    }
    if(toSquare in validSquare){
      let prevMoves = movesList["moves"];
     
      prevMoves.push({piece:piece,id:prevMoves.length+1,origin:fromSquare,destination:toSquare,kill:kill})
      setMovesList({moves:prevMoves})
    }
    if(game.isGameOver()){
     
      gameOver();
    }
    
    //call Ai
    return true;
  }
  //from react-chessboard.com
  function gameOver(){
    if(game.isDraw()){
      console.log("game is draw")
    }else if(game.isCheckmate()){
      console.log(game.turn()+" Lost")
    }else if(game.isStalemate()){
      console.log("Stalemate")
    }
  }
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
            marginLeft: val==="wK"||val==="bK"?"12%":"auto"

          }}
          src={photo}
          alt={alt}
        />
      );
    });

    
    return returnPieces;
  }

  return (
   <div className="">
    <div><Takenpieces deadPieces={deadPieces} color={"w"}/></div>
    <div className="">
    <Chessboard
      id="panda-Board"
      boardWidth={500}
      position={game.fen()}
      onPieceDrop={onDrop}
      customBoardStyle={{
       
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
      <Takenpieces deadPieces={deadPieces} color={"b"}/>
      
     </div>
     <div>
     <Tracker list={movesList["moves"]}/>
     </div>
   </div>


  );
}

function Takenpieces(props:any){
  const showPieces = (piece:string)=>{
    const photo = require(`./img/${piece[1]}.png`)
      const alt=`${piece[1]}`
      return (
        <img 
          key={piece[0]}
          style={{
            marginLeft:"-20px"

          }}
          src={photo}
          alt={alt}
        />
      )
  }
  return (
    <div>{props.deadPieces[props.color].map(showPieces)}</div>

  )
}

function Tracker(props:any){
  const showList =(item:{piece:string,id:number,origin:string,destination:string,kill:[boolean,string]})=>{
   
  
      return (
       
        
       ( item.kill[0])
        ?<p key={item.id}><b>{namedPieces[item.piece]}</b> moved from <b>{item.origin}</b> to <b>{item.destination}</b> and killed <b>{namedPieces[item.kill[1]]}</b> </p>
        :<p  key={item.id}><b>{namedPieces[item.piece]}</b> moved from <b>{item.origin}</b> to <b>{item.destination}</b></p>
       
      );
    

  };
  return(
    <div>{props.list.map(showList)}</div>
  );
}
export default PandaBoard;

import { Chess } from "chess.js";
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
  const [movesList, setMovesList]=useState<any>({moves:[]});
  const [deadPieces, updateDeadPieces]=useState<any>({w:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0},b:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0}})
  const [currentTimeout,setCurrentTimeout]=useState<NodeJS.Timeout>();
  
  function mutateGame(changes:any) {
    const updatedState = new Chess();
    updatedState.loadPgn(game.pgn());
    
    try{
      
      
      updatedState.move(changes);
      


    }
    catch(err){
      console.log("Don't you know how to play chess")
     
    }
    
   
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

 function makeRandomMove(change:Chess){
  const possibleMoves = change.moves();

  // exit if the game is over
  if (change.isGameOver() || change.isDraw() || possibleMoves.length === 0) return;

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  change.move(possibleMoves[randomIndex]);
  
  let history:any = change.history({verbose:true})
  history=history[history.length-1]
  updateMovesTracker(change,history["from"],history["to"],'b'+history["piece"].toUpperCase(),true)
 }

 function onDragOverSquare(square:any){
    
    const invalidMove:any={}
    if(!(square in validSquare)){
      invalidMove[square]={background:"none repeat scroll 0 0 rgba(255, 0, 0, 0.30)"}
    }
    setInvalidSquare(invalidMove)
    


  
    return true;
  }
  function checkKill(game:Chess,color:string){
    const captured:any = {'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0}

    for (const move of game.history({ verbose: true })) {
        if (move.hasOwnProperty("captured") && move.color !== color[0]) {
            captured[move.captured!]++
        }
    }
    let currentDeadPieces = deadPieces
    currentDeadPieces[color[0]]=captured
    updateDeadPieces(currentDeadPieces)
    return true
    }

  
  function getPieceCurrSquare(type:string,color:string){
    
      let board = game.board();
      
      for (let row in board){
        for (let squarePiece in board[row]){

             let details:any=board[row][squarePiece]
             if (details==null) continue
             if (details["type"]===type && details["color"]===color){
               return details["square"]
             
          }
          
           

        }
      }

      
     
      //const row = 'abcdefgh'[index % 8]
      //const column = Math.ceil((64 - index) / 8)
         
      
      
      
     
  }
  function checkHandler(incheck:string){
    
    let kingPos:string = getPieceCurrSquare('k',incheck)
   
    let invalidMove:any ={}
    invalidMove[kingPos]={background:"none repeat scroll 0 0 rgba(154, 42, 42, 0.30)"}
    setInvalidSquare(invalidMove)
  }
  function updateMovesTracker(change:Chess,fromSquare:string,toSquare:any,piece:any,random:boolean=false){
   
    if(toSquare in validSquare || random){
      let prevMoves = movesList["moves"];
      prevMoves.push({piece:piece,id:prevMoves.length+1,origin:fromSquare,destination:toSquare})
      setMovesList({moves:prevMoves})
     
     
      checkKill(change,"white")
      checkKill(change,"black")
    }
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

    if (toSquare in validSquare){
       updateMovesTracker(change,fromSquare,toSquare,piece) 
       makeRandomMove(change)
    }
   
   
   
   
    setGame(change); 
      
    if (change.inCheck()) checkHandler(change.turn()) 
   
    if(change == null){return false} 
    //change.move('c6') 
   
   
   
   
    if(game.isGameOver() || change.isGameOver()){
     
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
    <div><Takenpieces deadPieces={deadPieces["w"]} color={"w"}/></div>
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
      <Takenpieces deadPieces={deadPieces["b"]} color={"b"}/>
      
     </div>
     <div>
     <Tracker list={movesList["moves"]}/>
     <button
        onClick={
              ()=>{
               setGame(new Chess())
               setMovesList({moves:[]})
               updateDeadPieces({w:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0},b:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0}})
              }

        }/>
     </div>
   </div>


  );
}

function Takenpieces(props:any){
  let pieces:any=[]
  for(let x in props.deadPieces){
    let count=0;
    
    while (count<props.deadPieces[x]){
      pieces.push([props.color+x.toUpperCase(),pieces.length]);
      count+=1;
    }
    

  }
  const showPieces = (piece:string)=>{
    //{p:2,r:3,...}
    const photo = require(`./img/${piece[0]}.png`)
      const alt=`${piece[0]}`
      return (
        <img 
          key={piece+pieces[1]}
          style={{
            marginLeft:"-20px"

          }}
          src={photo}
          alt={alt}
        />
      )
  }
  return (
    <div>{pieces.map(showPieces)}</div>

  )
}

function Tracker(props:any){
  const showList =(item:{piece:string,id:number,origin:string,destination:string,kill:[boolean,string]})=>{
   
  
      return (
       
        
       
        <p  key={item.id}><b>{namedPieces[item.piece]}</b> moved from <b>{item.origin}</b> to <b>{item.destination}</b></p>
       
      );
    

  };
  return(
    <div>{props.list.map(showList)}</div>
  );
}
export default PandaBoard;

import { Chess } from "chess.js";
import React from "react";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import styled from 'styled-components';
import {device} from './DeviceWidths'


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
const StickyTh= styled.th`
    
  `

const CustomButton = styled.button`

  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  background-color:#76D7C4;
  color: #000 ;
  cursor: pointer;

 

  border: 3px solid white;

  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px #51998B, 2px 2px 0px 0px #51998B, 3px 3px 0px 0px #51998B, 4px 4px 0px 0px #51998B, 5px 5px 0px 0px #51998B;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;


&:active {
  box-shadow: 0px 0px 0px 0px;
  top: 5px;
  left: 5px;
}



@media ${device.mobileM}{
  margin-bottom:130px;

}


`

const DivTracker= styled.div`


overflowY: auto;
display:flex; 
height: 400px;
  display: flex;
flex-direction: column-reverse;








`
const MintPanda=styled.div`
font-family: 'Acme', sans-serif;
font-size:50px;
`







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
  const [gameEnd,setGameEnd]=useState({status:["",""]})


 
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
  if (change.isGameOver() || change.isDraw() || possibleMoves.length === 0) gameOver();

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  try{
      change.move(possibleMoves[randomIndex]);
  }
  catch(err){
    
    return Win({status:["checkmate",'White']})
  }

  
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
    let oldDeadPieces =  deadPieces[color[0]]
    let currentDeadPieces = deadPieces
    currentDeadPieces[color[0]]=captured
    updateDeadPieces(currentDeadPieces)

    for (let key of Object.keys(captured)){
      if(oldDeadPieces[key]!==captured[key]){
        return true
      }
    }
    return false
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
      
    
      if(change.turn()==='w'){
        
        prevMoves.push({piece:piece,id:prevMoves.length+1,origin:fromSquare,destination:toSquare,kill:checkKill(change,"white")})
        
      }else{
       
         prevMoves.push({piece:piece,id:prevMoves.length+1,origin:fromSquare,destination:toSquare,kill:checkKill(change,"black")})
      }
      
     setMovesList({moves:prevMoves})
     
    }
  }
  function onDrop(fromSquare:any, toSquare:any,piece:any) {
   
    if(game.turn()!=='w') return false
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
       if (!game.isGameOver()||!change.isGameOver()){
         const newTimeout = setTimeout(makeRandomMove,1100,change) 
         setCurrentTimeout(newTimeout)
       }
      
      
    }
   
   
   
   
    setGame(change); 
      
    if (change.inCheck()) checkHandler(change.turn()) 
    if(game.isGameOver() || change.isGameOver()){
     
      gameOver();
    }
    if(change == null){return false} 
    //change.move('c6') 
   
   
   
   
   
    
   
    
    //call Ai
    return true;
  }
  //from react-chessboard.com
  function gameOver(){
    
    if(game.isDraw()){
      setGameEnd({status:["draw"]})
    }else if(game.isCheckmate()){
      
      setGameEnd({status:["checkmate",game.turn()]})
    }else if(game.isStalemate()){
     setGameEnd({status:["stalemate"]})
    }
    document.getElementById("resetBtn")?.click()
  }
  function pandaBrand() {
    
    const returnPieces:any = {};
    pieces.forEach(function (val) {
      const photo = require(`./img/${val}.png`)
      const alt=`${val}`
      returnPieces[val] = (squareWidth:any) => (
       
        <img
        style={{
         
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
   
   <div className="container mt-5">
    <MintPanda>Mint-Panda</MintPanda>
    <Win status={gameEnd}/>
    <div className="container">
      
      <div className="row justify-content-center">
        <div className="col mt-5">
              

  <div id="chessdiv" className="mx-auto">
  
    <Chessboard
      id="panda-Board"
      
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
    /></div>
      <div className="container">
      <div className="row justify-content-between">
          <div id="takenPieces" className="col mt-3">
          <Takenpieces  deadPieces={deadPieces["w"]} color={"w"}/>
            </div>
         <div id="takenPieces" className="col mt-3">
         <Takenpieces  deadPieces={deadPieces["b"]} color={"b"}/>
          </div>
          </div>
        </div>
   
        </div>
       
         <div className="col mt-5" >
        <DivTracker id="trackerDiv" className="table-responsive rounded rounded-4">
     <Tracker list={movesList["moves"]}/>
     </DivTracker>
     <CustomButton
       
       id="resetBtn"
       className="mt-3"
        onClick={
              ()=>{
               setGame(new Chess())
               setMovesList({moves:[]})
               updateDeadPieces({w:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0},b:{'p': 0, 'n': 0, 'b': 0, 'r': 0, 'q': 0}})
                clearTimeout(currentTimeout)
                setInvalidSquare({})
                setValidSquare({})
              }

        }>Restart</CustomButton>
          </div>
      </div>
      <div id="makerCredit" className="container justify-content-center align-text-bottom" style={{bottom:"2px",}}>
      <p >
    <span className="text-secondary" >Made at  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"></path>
        <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"></path>
      </svg>by Nifesimi, designed by Henry.</span> </p>
          </div>
      
      
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
       
        
       
        /*<p  key={item.id}><b>{namedPieces[item.piece]}</b> moved from <b>{item.origin}</b> to <b>{item.destination}</b></p>*/
        <tr key={item.id} className={item.kill?"table-danger":""}>
        <th scope="row">{item.id}</th>
        <td>{namedPieces[item.piece]}</td>
        <td>{item.origin}</td>
        <td>{item.destination}</td>
      </tr>
      );
     

  };
  
 
 
 
  
  return(
   
      <table className="table table-striped table-dark">
    <thead>
      <tr>
        
        <StickyTh id="stickyTh" scope="col">#</StickyTh>
        <StickyTh id="stickyTh" scope="col">Piece</StickyTh>
        <StickyTh id="stickyTh" scope="col">From</StickyTh>
        <StickyTh id="stickyTh" scope="col">To</StickyTh>
      </tr>
    </thead>
    <tbody>
      {props.list.map(showList)}
     
    </tbody>
  </table>
  
  );
}

function Win(props:any){
 
  if(props.status[0]==="checkmate"){
    return (
    <div className="alert alert-success mb-3" role="alert">
    Wow how did you win {props.status[1]}
  </div>)
  }else if(props.status[0]==="draw" || props.status[0]==="stalemate"){
    return(<div className="alert alert-danger mb-3" role="alert">
      No way you just drew with a robot damn {props.status[0]}
</div>)
  }
  else{
    return (<div className="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>WAGWAN!</strong> My Guy's/Gal's. Enjoy.
  </div>)
  
  }
}
export default PandaBoard;

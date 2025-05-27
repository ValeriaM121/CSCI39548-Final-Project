import { useState, useEffect } from "react";
import "./App.css";

import { db } from "../firebase.ts";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function App() {
 
  const [docRef, setDocRef] = useState(null);

  const[todo, setTodo] = useState([]);
  const [input, setInput]= useState('');

  const[deleted, setDeleted] = useState([]);
  const[switched, setSwitched] = useState([]);
  
  const testDocRef = doc(db, "test" , "single-document");

  useEffect(() =>{
    const loadDocument = async () =>{
      try{
        const docSnap = await getDoc(testDocRef);
        if(docSnap.exists()){
          setTodo(docSnap.data().todo || []);
          setDocRef(testDocRef);
        }else{
          await setDoc(testDocRef, {uid: "test", createdAt: new Date(), todo: [] , deletedTodo: [], BeforeSwitch: []});
          setTodo([]);
          setDocRef(testDocRef);
        }
      } catch(error){
          console.error ("Error loading document: ", error);
      }
    };
      loadDocument();
  },[]);



  const handleAddClick = () =>{
    setTodo([...todo, input]);
    setInput('');
  };

  const handleDeleteClick = (index) => {
    const newTodo = [...todo];
    setDeleted([...deleted, newTodo.splice(index,1)[0]]);
    setTodo(newTodo);
  };

  const handleUpdateClick=(index, newval) => {
    const newTodo = [...todo];
    setSwitched([...switched, newTodo[index]]);
    newTodo[index] = newval;
    setTodo(newTodo);
  }

  useEffect(()=>{
    if(!docRef) return;
    const addTodo = async() =>{
      try{
        await updateDoc(docRef, {todo});
      }catch(error){
        console.error("Error adding note to todo list: ", error);
      }
    };
    addTodo();
  }, [docRef, todo]);

  useEffect(()=>{
    if(!docRef) return;
    const deletedTodo = async()=>{
      try{
        await updateDoc(docRef, {deletedTodo: deleted});
      }catch(error){
        console.error("Error deleting note from todo list: ", error);
      }
    };
    deletedTodo();
  },[docRef, deleted]);

  useEffect(() =>{
    if(!docRef) return;
    const beforeSwitch = async()=>{
      try{
        await updateDoc(docRef, {BeforeSwitch: switched});
      }catch(error){
        console.error("Error updating todo note: ", error);
      }
    };
    beforeSwitch();
  },[docRef, switched]);


  
  return (
    <>
      <div className ="title">
        <h1>ToDo list</h1>
      </div>

      <div className="card">
        <ol>
          {todo.map((todo,index)=> (
            <li key ={index} className="todo-item">
              <span className="todo-text"> {todo} </span>
              <div className="todo-actions">
                <button onClick={()=>handleDeleteClick(index)}> Delete</button> 
                <button onClick ={()=> handleUpdateClick(index, input)}> Update</button>
              </div>
            </li>
            ))}
        </ol>


        <div className="search">
          <input 
          type="text"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Add Note"
        />

        <br></br>
        <br></br>
         </div>
        <div className="add">
          <button onClick={handleAddClick}> Add Note</button>
        </div>

        <p> (To update list just add the note in the textbox and click update)</p>
        <p>(Sorry, will have to delete updated note in textbox after updating.)</p>
       
      </div>
    </>
  );
}

export default App;



export default function HomeTodoList(){


  return(<>


    <div className="flex flex-col  border border-[#50B498] green mt-[9em]">


      <form className="flex flex-col border border-[#50B498] green">

        <p className="font-roboto text-[3em]">Todo</p>


        <input type="text" className="border border-[gray] green py-[1em] outline-none rounded-[0.25em] mt-[1em]" placeholder="Todo text here" />

        <button className="border border-[orange] mt-[1em] rounded-[0.25em] bg-orange-200 py-[1em]">ADD TODO</button>


      </form>


       





    </div>
    
    
  </>)
}
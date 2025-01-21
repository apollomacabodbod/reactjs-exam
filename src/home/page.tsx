import HomeTodoItems from "./_components/home-todo-items";
import HomeTodoList from "./_components/home-todo-list";

export default function Home() {
  
  
  return (<>

    <div className="flex flex-col max-w-[1200px] lg:mx-auto px-[1.25em]">


      <HomeTodoList/>
      <HomeTodoItems/>



    </div>


    
    
  </>)
}
  
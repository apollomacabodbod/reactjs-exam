


import { useState } from "react"

export default function HomeTodoItems(){



    type todoTypes = {
        
        id: number;
        Title: string;
        date_added: string
        date_completed: string
    }


    const [todo] = useState<todoTypes[]>([

      {id: 1, Title: "todo1", date_added:"jan22", date_completed: "jan22" },
      {id: 2, Title: "todo2", date_added:"jan22", date_completed: "jan22" },
      {id: 3, Title: "todo2", date_added:"jan22", date_completed: "jan22" },
      {id: 4, Title: "todo3", date_added:"jan22", date_completed: "jan22" },

    ]
    )



    return(<>


      <div className="grid grid-cols-1">

        {todo.map(() => (


          <div className="flex flex-col">




          </div>



        ))}





      </div>
    
    
    </>)
}
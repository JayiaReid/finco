import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex bg-[url(/finances.jpg)] h-[100vh] bg-cover bg-no-repeat items-center justify-end px-[200px]">
       <SignUp/> 
    </div>
      
    )
   
}
import React from 'react'

interface FormProps{
    setOpen:  React.Dispatch<React.SetStateAction<Boolean>>;
}

function Form({setOpen}: any) {
  return (
   <>
    <div className='fixed top-0 left-0 flex w-full h-screen bg-slate-400/50 z-50  justify-center'>
        <button type="button" onClick={()=>setOpen(false)}>Cancel</button>   
        <form className='w-3/5 bg-white h-1/2'>
            <input type="text"  />
        </form>
        aaaaaaaaaaaaaaaaa
    </div>
   </>
  )
}

export default Form
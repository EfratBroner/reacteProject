import type { FC } from 'react';
import './Register.scss';
import { useState, useEffect } from "react";
import api from '../../api'
import type { Volunteer } from '../../models/volunteer.model'


interface RegisterProps {}

export default function Register(){
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [specialties, setSpecialties] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/volunteer')
      setVolunteers(response.data as Volunteer[])
    }
    fetchData()
  }, [])

  const handleSubmit=async (e:any)=>{
      e.preventDefault()
      for(let i=0;i<volunteers.length;i++){
        if(volunteers[i].email===email&&volunteers[i].firstName===firstName&&volunteers[i].lastName===lastName){
          alert("המתנדב קיים במערכת")
          //להעביר לקומפוננטה של ההתחברות
          return
        }
      }
      try {
          const response=await api.post('/volunteer',{
              firstName,
              lastName,
              email,
              phone,
              specialties: specialties.split(',')
          })
          console.log(response)
          alert("המתנדב נרשם בהצלחה")
          setEmail('')
          setFirstName('')
          setLastName('')
          setPhone('')
          setSpecialties('')
          //להעביר לקומפוננטה של דף הבית
      } catch (error) {
          console.error(error)
      }
  }
  return(
      <div className='register'>
          <form onSubmit={handleSubmit} >
              <h2>Register</h2>
              <input type="text" placeholder='First Name' onChange={(e)=>setFirstName(e.target.value)}/><br/>
              <input type="text" placeholder='Last Name' onChange={(e)=>setLastName(e.target.value)}/><br/>
              <input type="text" placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/><br/>
              <input type="text" placeholder='Phone' onChange={(e)=>setPhone(e.target.value)}/><br/>
              <input type="text" placeholder='Specialties (comma separated)' onChange={(e)=>setSpecialties(e.target.value)}/><br/>
              <button type='submit'>Register</button>
          </form>
      </div>
  )

}





import type { FC } from 'react';
import './Register.scss';
import { useState, useEffect } from "react";
import api from '../../api'
import type { Volunteer } from '../../models/volunteer.model'

interface RegisterProps {
  onRegisterSuccess: (password: string) => void;
  onNavigateToLogin: () => void;
  onClose: () => void;
}

export default function Register({ onRegisterSuccess, onClose,onNavigateToLogin }: RegisterProps) {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    for (let i = 0; i < volunteers.length; i++) {
      if (volunteers[i].email === email && volunteers[i].firstName === firstName && volunteers[i].lastName === lastName) {
        alert("המתנדב קיים במערכת, מועבר לדף התחברות...");
        onNavigateToLogin(); 
        return
      }
    }
    
    try {
      const response = await api.post('/volunteer', {
        firstName,
        lastName,
        email,
        phone,
        specialties: specialties.split(',')
      })
      
      console.log(response)
      alert("המתנדב נרשם בהצלחה")
      const newVolunteer = response.data as Volunteer;

      setEmail('')
      setFirstName('')
      setLastName('')
      setPhone('')
      setSpecialties('')
      
      if (newVolunteer && newVolunteer.password) {
        onRegisterSuccess(newVolunteer.password);
      }

    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <div className='register-overlay' onClick={onClose}>
      <div className='register-modal' onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>הרשמה</h2>
          <input type="text" placeholder='שם פרטי' onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder='שם משפחה' onChange={(e) => setLastName(e.target.value)} />
          <input type="text" placeholder='אימייל' onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder='טלפון' onChange={(e) => setPhone(e.target.value)} />
          <input type="text" placeholder='התמחויות (מופרדות בפסיקים)' onChange={(e) => setSpecialties(e.target.value)} />
          <button type='submit' className='modal-submit'>הרשם</button>
        </form>
      </div>
    </div>
  )
}
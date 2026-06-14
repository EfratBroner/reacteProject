import type { FC } from 'react';
import './Register.scss';
import { useState, useEffect } from "react";
import api from '../../api';
import type { Volunteer } from '../../models/volunteer.model';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface RegisterProps {
  onRegisterSuccess: (volunteer: Volunteer) => void;
  onNavigateToLogin: () => void;
  onClose: () => void;
}

interface RegisterFormValues {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialties: string;
}

export default function Register({ onRegisterSuccess, onClose, onNavigateToLogin }: RegisterProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/volunteer');
        setVolunteers(response.data as Volunteer[]);
      } catch (error) {
        console.error("שגיאה בטעינת מתנדבים:", error);
      }
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('חובה למלא שם פרטי')
      .min(2, 'שם פרטי חייב להכיל לפחות 2 אותיות'),
    lastName: Yup.string()
      .required('חובה למלא שם משפחה')
      .min(2, 'שם משפחה חייב להכיל לפחות 2 אותיות'),
    email: Yup.string()
      .required('חובה למלא כתובת אימייל')
      .email('כתובת האימייל אינה תקינה'),
    phone: Yup.string()
      .required('חובה למלא מספר טלפון')
      .matches(/^05\d[-]?\d{7}$/, 'מספר הטלפון חייב להיות פורמט סלולרי תקין'),
    specialties: Yup.string()
      .required('חובה למלא לפחות התמחות אחת'),
  });

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialties: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const exists = volunteers.some(v => v.email === values.email);

      if (exists) {
        alert("המתנדב קיים במערכת, מועבר לדף התחברות...");
        onNavigateToLogin();
        return;
      }

      try {
        const response = await api.post('/volunteer', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          specialties: values.specialties.split(',').map(s => s.trim())
        });

        const newVolunteer = await api.get(`/volunteer/byEmail/${values.email}`).then(r => r.data);
        formik.resetForm();
        alert("המתנדב נרשם בהצלחה! בדוק את המייל שלך לקבלת הסיסמה");
        onRegisterSuccess(newVolunteer);
      } catch (error) {
        console.error("שגיאה בתהליך ההרשמה:", error);
        alert("חלה שגיאה ברישום המתנדב.");
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <div className='register-overlay' onClick={handleClose}>
      <div className='register-modal' onClick={e => e.stopPropagation()}>
        <form onSubmit={formik.handleSubmit}>
          <h2>הרשמה</h2>

          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder='שם פרטי'
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error-message">{formik.errors.firstName}</div>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder='שם משפחה'
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error-message">{formik.errors.lastName}</div>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder='אימייל'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="phone"
              placeholder='טלפון'
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="error-message">{formik.errors.phone}</div>
            ) : null}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="specialties"
              placeholder='התמחויות (מופרדות בפסיקים)'
              value={formik.values.specialties}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.specialties && formik.errors.specialties ? (
              <div className="error-message">{formik.errors.specialties}</div>
            ) : null}
          </div>

          <button type='submit' className='modal-submit'>הרשם</button>
        </form>
      </div>
    </div>
  );
}
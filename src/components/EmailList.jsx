import React from 'react'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function EmailList() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: ''
  })
  const [status, setStatus] = useState({ error: '', success: false })

  const handleChange = (e) => {
    e.preventDefault()
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let { data: EmailList, error } = await supabase
        .from('EmailList')
        .select('*')
        .eq('email', formValues.email)
      if (EmailList.length > 0) {
        setStatus(() => ({
          error: 'Email already registered. Enter a different email.',
          success: false
        }))
        setFormValues({
          name: '',
          email: ''
        })
      } else {
        try {
          const { data, error } = await supabase
            .from('EmailList')
            .insert([formValues])
          setStatus(() => ({
            error: '',
            success: true
          }))
        } catch (error) {
          throw error
        }
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="email-list">
      <div className="email-list-wrapper">
        <div className="mailing-copy">
          <h3>Join the mailing list</h3>
          <p>
            Never miss when a new playlist is released, and always have
            something new to listen to. Maybe you will find a rabbit hole of
            your own to dive down.
          </p>
        </div>
        {status.success ? (
          <div className="success">
            You have joined the email list. You should recieve and email
            shortly. Thank you!
          </div>
        ) : (
          <div className="form-wrapper">
            <form className="email-signup" onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>

              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>

              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </form>
            <button
              type="submit"
              className="btn primary"
              disabled={!formValues.name || !formValues.email}
            >
              Join List
            </button>
          </div>
        )}
      </div>

      {status.error ? <div className="error">{status.error}</div> : null}
    </div>
  )
}

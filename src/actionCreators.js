const API = "http://localhost:3000/";
const CUSTOMERS = `${API}customers`
const APPOINTMENTS = `${API}appointments`
const USERS = `${API}users`


const fetchCustomers = ( ) => dispatch => {
  fetch(CUSTOMERS).then(r=>r.json())
  .then(customers => dispatch({type:"FETCH_CUSTOMERS",payload:{customers}}))
}

const saveCustomer = (customer) => (dispatch) => {
  fetch(`${CUSTOMERS}/${customer.id}`,{
    method:customer.id? "PATCH": "POST",
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body:JSON.stringify({
      name:customer.firstName,
      lastname:customer.lastName,
      phone:customer.phone
    })
  }).then(r=>r.json())
  .then(newCustomer=> dispatch({type:"SAVE_CUSTOMER",payload:{customer:newCustomer,edit:!!customer.id}}))
}

const deleteCustomer = (id)=> dispatch => {
  fetch(`${CUSTOMERS}/${id}`,{
    method:"DELETE",
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json'
    }
  }).then(r=>r.json())
  .then(customer => dispatch({type:"DELETE_CUSTOMER",payload:{customerId:customer.id}}))
}

const addAppointment = (appointment,calendarRef) => dispatch =>{
  fetch(APPOINTMENTS,{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify(appointment)
  }).then(r=>r.json())
  .then(app => {
    const appointment = {
      id:app.id,
      customer_id: app.customer_id,
      user_id: app.user_id,
      start:new Date(app.start),
      end:new Date(app.end),
      title:`${app.customer_id}`
    }
    calendarRef.current.getApi().addEvent(appointment)
    dispatch({type:"ADD_APPOINTMENT",payload:{appointment}})
  })
}

const login = (userInfo,history) => dispatch =>{
  fetch(`${USERS}/login`,{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify(userInfo)
  }).then(r=>r.json())
  .then(userInfo =>{
    if (userInfo.error){
      alert("Error in the credentials")
    }else{
      const appointments = userInfo.appointments.map(app=>{
        return {
          id:app.id,
          customer_id: app.customer_id,
          user_id: app.user_id,
          start:new Date(app.start),
          end:new Date(app.end),
          title:`${app.customer_id}`
        }
      }) 
      dispatch({type:"LOGIN",payload:{user:userInfo.user,appointments}})
      history.push("/dashboard")
    }
    
  })
}

const logout = ( ) => ({type:"LOGOUT"})

const deleteAppointment = (id,event)=> dispatch => {
  fetch(`${APPOINTMENTS}/${id}`,{
    method:"DELETE",
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json'
    }
  }).then(r=> r.json())
  .then(deletedAppointment=>{
    event && event.remove()
    dispatch({type:"DELETE_APPOINTMENT",payload:{appointment:deletedAppointment}})
  })
}


export {
  fetchCustomers,
  saveCustomer,
  deleteCustomer,
  login,
  logout,
  addAppointment,
  deleteAppointment
}
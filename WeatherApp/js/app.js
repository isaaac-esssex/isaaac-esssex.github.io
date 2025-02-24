// Start GLobal Variables
const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const strBaseURL = 'https://swollenhippo.com/DS3870/Characters/api/'
// End Global Variables

// Check if already logged in
if(sessionStorage.getItem('SessionID')){
    document.querySelector('#frmLogin').style.display = 'none'
    document.querySelector('#divDashboard').style.display = 'block'
}
// End check if already logged in

// Start click handlers
// click event for btnSwapRegister to hide frmLogin and show frmRegister
document.querySelector('#btnSwapRegister').addEventListener('click', function(){
    document.querySelector('#frmLogin').style.display = 'none'
    document.querySelector('#frmRegister').style.display = 'block'
})

// click event for btnSwapLogin to hide frmRegister and show frmLogin
document.querySelector('#btnSwapLogin').addEventListener('click', function(){
    document.querySelector('#frmRegister').style.display = 'none'
    document.querySelector('#frmLogin').style.display = 'block'
})

// click event for btnLogin
document.querySelector('#btnLogin').addEventListener('click', function(){
    async function createSession(strUserEmail,strUserPassword){
        try {
            const objResponse = await fetch(strBaseURL + 'sessions.php',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({Email:strUserEmail,Password:strUserPassword})
            })

            if(!objResponse.ok){
                throw new Error(`HTTP Error Status:${objResponse.status}`)
            }

            const objData = await objResponse.json()
            if(objData.SessionID){
                //Sweetalert for success
                Swal.fire({
                    position: "top-end",
                    icon:"success",
                    title:"Login Successful",
                    showConfirmButton: false,
                    timer: 1500
                })
                //Save the SessionID to sessionStorage
                sessionStorage.setItem('SessionID',objData.SessionID)

                //Clear our form
                document.querySelector('#txtLoginUsername').value = ''
                document.querySelector('#txtLoginPassword').value = ''
                // Swap Login
                document.querySelector('#frmLogin').style.display = 'none'
                document.querySelector('#divDashboard').style.display = 'block'
            } else {
                //Sweetalert for failure
            }
        } catch(objError){
            console.log('Error fetching objData',objError)
            //Create a Sweetalert for user indicating failure
        }
    }

    // Retrieve the values from your login form
    const strEmail = document.querySelector('#txtLoginUsername').value.trim().toLowerCase()
    const strPassword = document.querySelector('#txtLoginPassword').value
    // Validate the data
    let blnError = false;
    let strError = ''
    if(!regEmail.test(strEmail)){
        blnError = true;
        strError += '<p>You must enter a valid email</p>'
    }
    if(strPassword.length < 6){
        blnError = true;
        strError += '<p>You must enter a password</p>'
    }
    if(blnError == true){
        Swal.fire({
            title:'Look a little closer, there are errors',
            html:strError,
            icon:'error'
        })
    } else {
    // Call our function to create the account
       createSession(strEmail,strPassword) 
    }

    // Evaluate the response to ensure it worked
    // Save session information to sessionStorage 
})

// click event for btnRegister
document.querySelector('#btnRegister').addEventListener('click', function(){
    // Define a function to create a user
    async function createUser(strUserEmail,strUserPassword,strUserFirstName,strUserLastName){
        try {
            const objResponse = await fetch(strBaseURL + 'users.php',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({Email:strUserEmail,FirstName:strUserFirstName,LastName:strUserLastName,Password:strUserPassword})
            })

            if(!objResponse.ok){
                throw new Error(`HTTP Error Status:${objResponse.status}`)
            }

            const objData = await objResponse.json()
            if(objData.Outcome){
                //Sweetalert for success
                Swal.fire({
                    position: "top-end",
                    icon:"success",
                    title:"Registration Successful",
                    showConfirmButton: false,
                    timer: 1500
                })
                //Clear our form
                document.querySelector('#txtUsername').value = ''
                document.querySelector('#txtPassword').value = ''
                document.querySelector('#txtFirstName').value = ''
                document.querySelector('#txtLastName').value = ''
                // Swap Login
                document.querySelector('#frmRegister').style.display = 'none'
                document.querySelector('#frmLogin').style.display = 'block'
            } else {
                //Sweetalert for failure
            }
        } catch(objError){
            console.log('Error fetching objData',objError)
            //Create a Sweetalert for user indicating failure
        }
    }
    // Retrieve the values from your registration form
    const strEmail = document.querySelector('#txtUsername').value.trim().toLowerCase()
    const strPassword = document.querySelector('#txtPassword').value
    const strFirstName = document.querySelector('#txtFirstName').value
    const strLastName = document.querySelector('#txtLastName').value
    
    // Validate the data
    let blnError = false;
    let strError = ''
    if(!regEmail.test(strEmail)){
        blnError = true;
        strError += '<p>You must enter a valid email</p>'
    }
    if(strPassword.length < 6){
        blnError = true;
        strError += '<p>Your password must be at least 6 characters</p>'
    }
    if(strFirstName.length < 1){
        blnError = true;
        strError += '<p>You must enter a first name</p>'
    }
    if(strLastName.length < 1){
        blnError = true;
        strError += '<p>You must enter a last name</p>'
    }
    if(blnError == true){
        Swal.fire({
            title:'Look a little closer, there may be errors',
            html:strError,
            icon:'error'
        })
    } else {
    // Call our function to create the account
        createUser(strEmail,strPassword,strFirstName,strLastName)
    }
    
})

// click event for btnSearch
document.querySelector('#btnSearch').addEventListener('click', function(){
    // Retrieve the values from your txtAnimalName
    const strAnimalName = document.querySelector('#txtAnimalName').value.trim()
    // Validate data is there
    let blnError = false;
    let strError = ""
    if(strAnimalName.length <2){
        blnError = true;
        strError += '<p>You must enter an animal name</p>'
    }

    if(blnError == true){
        Swal.fire({
            title:"Oops, something went wrong",
            html: strError,
            icon: 'error'
        })
    } else {
        // Use a Fetch command to retrieve data
        async function queryAnimal(strQueryAnimalName){
            try {
                const strSessionID = sessionStorage.getItem('SessionID')
                const objResponse = await fetch(strBaseURL + `animals.php?AnimalType=${strQueryAnimalName}&SessionID=${strSessionID}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json'
                    }
                })
    
                if(!objResponse.ok){
                    throw new Error(`HTTP Error Status:${objResponse.status}`)
                }
                const objData = await objResponse.json()
                if(objData.length >0){
                    console.log(objData)
                } else {
                    //Sweetalert for failure
                    Swal.fire({
                        title: 'Animal Not Found',
                        icon: 'error'
                    })
                }
            } catch(objError){
                console.log('Error fetching objData',objError)
                //Create a Sweetalert for user indicating failure
            }
        }
        queryAnimal(strAnimalName);
    }
    

    // Evaluate the response to ensure it worked

    // Set the text of pData
})
// End click handlers
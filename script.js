let addBtn = document.querySelector(".add-btn")

let removeBtn = document.querySelector(".remove-btn")

let modal = document.querySelector(".modal-cont")

let mainCont = document.querySelector(".main-cont")

let textAreaCont = document.querySelector(".textarea-cont")

let allPriorityColor = document.querySelectorAll(".priority-color")

let colors = ["lightpink" , "lightgreen" , "lightblue" , "black"]

let priorityColor = colors[colors.length - 1]

let addFlag = false

let removeFlag = false

let lockClass = "fa-lock"

let unLockClass = "fa-lock-open"

let toolBoxColors = document.querySelectorAll(".color")

let ticketsArr = []

if(localStorage.getItem("Jira_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("Jira_tickets"))
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID)
    })
}

for(let i = 0 ; i < toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click" , (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0]
        let filteredTickets = ticketsArr.filter((ticketObj) => {
            return currentToolBoxColor === ticketObj.ticketColor
        })

        let allTicketsCont = document.querySelectorAll(".ticket-cont")
        for(let i = 0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove()
        }

        filteredTickets.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID)
        })
    })

    toolBoxColors[i].addEventListener("dblclick" , (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont")
        for(let i = 0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove()
        }

        ticketsArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID)
        })
    })
}

addBtn.addEventListener("click" , (e) =>{
    addFlag = !addFlag
    if(addFlag){
        modal.style.display = 'flex'
    }
    else{
        modal.style.display = 'none'
    }
})



modal.addEventListener("keydown" , (e) => {
    let key = e.key
    if(key == "Shift"){
        createTicket(priorityColor , textAreaCont.value)
        addFlag = !addFlag
        setModalToDefault()
    }
})

function createTicket(ticketColor , ticketTask , ticketID){
    let id = ticketID || shortid()
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class" , "ticket-cont")
    ticketCont.innerHTML = `
            <div class="ticket-color ${ticketColor} "></div>
            <div class="ticket-id"> #${id} </div>
            <div class="task-cont"> ${ticketTask} </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `
    mainCont.appendChild(ticketCont)
    
    if(!ticketID) {
        ticketsArr.push({ticketColor , ticketTask , ticketID : id})
        localStorage.setItem("Jira_tickets" , JSON.stringify(ticketsArr))
    } 

    handleRemoval(ticketCont , id)
    handleLock(ticketCont , id)
    handleColor(ticketCont , id)
}

allPriorityColor.forEach((colorElem) => {
    colorElem.addEventListener("click" , (e) => {
        allPriorityColor.forEach((priorityColorElem) => {
            priorityColorElem.classList.remove("active")
        })
        colorElem.classList.add("active")
        priorityColor = colorElem.classList[0]
    })
})

removeBtn.addEventListener("click" , (e) =>{
    removeFlag = !removeFlag
    if(removeFlag){
        removeBtn.style.color = 'red'
    }
    else{
        removeBtn.style.color = 'white'
    }
})

function handleRemoval(ticket , id){
    ticket.addEventListener("click" , (e) => {
        if(!removeFlag) return
        let idx = getTicketIdx(id)
        ticketsArr.splice(idx , 1)
        localStorage.setItem("Jira_tickets" , JSON.stringify(ticketsArr))
        ticket.remove()
    })
}

function handleLock(ticket , id){
    let ticketLockElem = ticket.querySelector(".ticket-lock")
    let ticketLock = ticketLockElem.children[0]
    let ticketTaskArea = ticket.querySelector(".task-cont")
    
    ticketLock.addEventListener("click" , (e)=> {
        let ticketIdx = getTicketIdx(id)
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unLockClass)
            ticketTaskArea.setAttribute("contenteditable" , "true")
        }
        else{
            ticketLock.classList.remove(unLockClass) 
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable" , "false")
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText
        localStorage.setItem("Jira_tickets" , JSON.stringify(ticketsArr))
    })
}

function handleColor(ticket , id){
    let ticketColor = ticket.querySelector(".ticket-color")
    ticketColor.addEventListener("click" , (e) => {
        let ticketIdx = getTicketIdx(id)
        let currentTicketColor = ticketColor.classList[1]
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color
        })
        currentTicketColorIdx++
        let newTicketColorIdx = currentTicketColorIdx % colors.length
        let newTicketColor = colors[newTicketColorIdx]
        ticketColor.classList.remove(currentTicketColor)
        ticketColor.classList.add(newTicketColor)
        ticketsArr[ticketIdx].ticketColor = newTicketColor
        localStorage.setItem("Jira_tickets" , JSON.stringify(ticketsArr))
    })
}

function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id
    })
    return ticketIdx
}

function setModalToDefault(){
    modal.style.display = 'none'
    textAreaCont.value = ""
    allPriorityColor.forEach((priorityColorElem) => {
        priorityColorElem.classList.remove("active")
    })
    allPriorityColor[allPriorityColor.length - 1].classList.add("active")
}
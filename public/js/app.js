import {Chatroom} from "./chat.js"
import {ChatUI} from "./ui.js"

let soundCounter = 0;

let audioNotification = new Audio ('./sounds/juntos.mp3')
let btnSound = document.querySelector('#btnSound');
btnSound.addEventListener('click', event => {
    event.preventDefault()
    soundCounter ++
    let spanNotif = document.querySelector('#notif')
    spanNotif.innerHTML = "on"
    if(soundCounter == 2) {
        soundCounter = 0
        spanNotif.innerHTML = "off"
    }
})

export function notificationSound() {

    if (soundCounter == 1) {
        audioNotification.play()
    }
}

let user;
if(localStorage.getItem('chatUser') == null) {
    //console.log(`empty`)
    user = "Guest"
} else {
    //console.log(localStorage.getItem('chatUser'))
    user = `${localStorage.getItem('chatUser')}`
}

let loadRoom = localStorage.getItem('room')
let btnAll = document.querySelectorAll("button")
btnAll.forEach(x => {
    if(x.id == localStorage.getItem('room')) {
        x.classList.toggle("colorChange")
    }
})

if(localStorage.getItem('room') == null) {
    //console.log(`prazna soba`)
    loadRoom = 'general'
    localStorage.setItem('room', 'general')
    btnAll.forEach(x => {
        if(x.id == 'general') {
            x.classList.toggle("colorChange")
        }
    })
}

let btn = document.querySelector('#buttons')
btn.addEventListener('click', event => {
    loadRoom = event.target.id
    loadRoom = localStorage.setItem('room', loadRoom)
    location.reload()
})
let edited = " "
console.log(edited)

let chatroom = new Chatroom(`${loadRoom}`, `${user}`, `${edited}`)

// Kreiranje objekta ChatUI
let ulChatList = document.querySelector('ul')
let chatUI1 = new ChatUI (ulChatList)

console.log(localStorage.getItem('chatUser'))
if(localStorage.getItem('chatUser') == null) {
    setTimeout(() => {
        chatUI1.helloMessage(`Dobrodošli na chat! U opcijama mozete promeniti vaše korisničko ime. `)
        setInterval(() => {
            chatUI1.helloMessage(`Promenite vaše korisničko ime`)
        }, 4000 * 10)
    }, 2000)
}


chatroom.getChats( data => {chatUI1.templateLI(data)})
//chatroom.getChatsDate( data => {chatUI1.templateLI(data)})


let formMessage = document.querySelector('#formMessage')
let inputMessage = document.querySelector('#inputMessage')
let formUsername = document.querySelector('#formUsername')
let inputUsername = document.querySelector('#inputUsername')
let formColorSelect = document.querySelector('#formColorSelect')
let inputColorSelect = document.querySelector('#inputColorSelect')
let formDateTime = document.querySelector('#formDateTime')
let inputDateOne = document.querySelector('#inputDateOne')
let inputDateTwo = document.querySelector('#inputDateTwo')
let p = document.querySelector('#unos')



formDateTime.addEventListener('submit', event => {
    //console.log(inputDateOne.value, inputDateTwo.value)
    event.preventDefault()
    let newDate1 = new Date(inputDateOne.value)
    let newDate2 = new Date(inputDateTwo.value)
    let time1 = firebase.firestore.Timestamp.fromDate(newDate1)
    let time2 = firebase.firestore.Timestamp.fromDate(newDate2)
    ulChatList.innerHTML = ""
    
    chatroom.getChatsDate( (data => {chatUI1.templateLI(data)}), time1, time2)

})

formColorSelect.addEventListener('submit', event => {
    console.log(`${inputColorSelect.value}`)
    event.preventDefault()

    setTimeout(() => {
        document.body.style.backgroundColor = `${inputColorSelect.value}`;
        inputUsername.style.backgroundColor = `${inputColorSelect.value}`;
        inputMessage.style.backgroundColor = `${inputColorSelect.value}`;
        inputDateOne.style.backgroundColor = `${inputColorSelect.value}`;
        inputDateTwo.style.backgroundColor = `${inputColorSelect.value}`;
    }, 3000)
})
let messageText = false
let messageId
//console.log(messageText == null)
console.log(messageText)

formMessage.addEventListener('submit', event => {
    event.preventDefault()
    console.log(messageText)

    if(messageText == false) {
        console.log('Proslo je u IF')
        if(localStorage.getItem('chatUser') != null) {
            console.log(`User je ${localStorage.getItem('chatUser')}`)
            let d1 = new Date ()
            let d2 = new Date ( d1 );
                d2.setMinutes ( d1.getMinutes() + 2 );
            let un = {
                username: localStorage.getItem('chatUser'),
                date: d2,
            }
            db.collection('chat_usernames').doc(localStorage.getItem('chatUser')).set(un)
        } else {
            console.log(`User je gost!`)
        }

        let message = inputMessage.value

        if(!message.match(/^ *$/)) {
            chatroom.addChat(message)
                .then(() => formMessage.reset(), inputMessage.focus())
                .catch(error => console.log(error))
            setTimeout(() => {
                updateScroll()
            }, 50)
        } else {
            alert(`Ne možete slati prazne poruke!`)
        }

    } else {
        console.log('Proslo je u ELSE')
        
        let message = inputMessage.value
        let span = document.querySelector('.messageRemove')
        let spanMsgEdited = document.querySelector('.textForUpdate')

        spanMsgEdited.innerHTML = "edited"
        edited = "edited"

        //console.log(span.innerHTML)
        span.innerHTML = inputMessage.value
        //console.log(span.innerHTML)
        
        chatroom.updateChat(message, messageId, edited)

        setTimeout(() => {
            span.classList.remove('messageRemove')
            spanMsgEdited.classList.remove('textForUpdate')
            messageText = false
            console.log(messageText)
            inputMessage.value = ""
        }, 500)
        
    }


});

let userDB = []
let time;
function usernameDatabase() {
    db.collection('chat_usernames')
    .get()
    .then(snapshot => {
        if(!snapshot.empty) {
            let allDocuments = snapshot.docs
            
            allDocuments.forEach(doc => {
                let data = doc.data()
                let niz = {}
                let fsTime = data.date
                time = fsTime.toDate()
                // niz.push(data.username)
                // niz.push(time)
                niz = {
                    username: data.username,
                    date: time

                }
                userDB.push(niz)
            })
        }
    })
    .catch(error => console.log(error));
}
usernameDatabase()

formUsername.addEventListener('submit', event => {
    event.preventDefault()
    let date = new Date()
    let d2

    for (let i=0; i<userDB.length; i++) {

        let d1 = new Date ()
            d2 = new Date ( d1 );
        d2.setMinutes ( d1.getMinutes() + 2 );
        
        let string1 = userDB[i].username
        let string2 = inputUsername.value
        let provera = string1.localeCompare(string2)
        
        if( provera == 0 ) {

            if (userDB[i].date > date) {
                //return alert(`Korisničko ime je zauzeto, izaberite drugo!`)
                return chatUI1.helloMessage(`Korisničko ime je zauzeto, izaberite drugo!`)
            }
        }
    }

        //console.log(trenutniDatum)
        console.log(`Proslo`)
        let un = {
            username: inputUsername.value,
            date: d2,
        }
        db.collection('chat_usernames').doc(`${inputUsername.value}`).set(un)
        chatroom.updateUsername(inputUsername.value)
        localStorage.setItem('chatUser', `${inputUsername.value}`)
        formUsername.reset()
        // p.innerHTML = `Korisničko ime je uspešno promenjeno`
        chatUI1.helloMessage(`Korisničko ime je uspešno promenjeno`)
        
        setTimeout(() => {
            p.innerHTML = "Choose a chatroom"
            usernameDatabase()
        }, 3000)
})

let section = document.querySelector('section')
export function updateScroll(){
    section.scrollTop = section.scrollHeight;
}



section.addEventListener('click', function(event) {
    //console.log(event.composedPath())
    let idP;
    let classP;

    // vazno !!!

    if(event.target.classList.contains('pen')) {
        let t = event.composedPath();

        for (let i=0; i<t.length; i++) {
            //console.log(t[i])
            messageId = t[1].id
            //console.log(`messageID ${messageId}`)
            //messageText = t[1].childNodes[3].innerHTML ???
            messageText = true
            t[1].childNodes[3].classList.add("messageRemove")
            t[1].childNodes[10].classList.add("textForUpdate")
            
        }
        console.log(messageText)

        inputMessage.value = document.querySelector('.messageRemove').innerHTML

        console.log(inputMessage.value)
    }
    
    if (event.target.classList.contains('bin')) {
        let t = event.composedPath();

        for (let i=0; i<t.length; i++) {

            idP = t[1].id
            classP = t[1].className
        }
    }
    //console.log(idP)
    //console.log(classP)
    let p = document.getElementById(`${idP}`)
    if(classP == 'oblakDesno' && !idP == "") { 
        let conf = confirm(`Da li želite da obrišete poruku?`)

        if(conf == true) {
            //console.log(`dalje`)
            p.remove()
            chatroom.removeChat(idP) 
        }
           
    } else if(classP == 'oblak' && !idP == "") {
        p.remove()
    }
    
})

let btnOpcije = document.querySelector('#btnOpcije')

btnOpcije.addEventListener('click', event => {
    event.preventDefault()

    window.scrollTo(0, document.body.scrollHeight)

    if (formColorSelect.style.display === "block") {
            formColorSelect.style.display = "none";            
        } else {
            formColorSelect.style.display = "block";
        }
    
    if (formDateTime.style.display === "block") {
        formDateTime.style.display = "none";        
        } else {
        formDateTime.style.display = "block";
        }

    if (formUsername.style.display === "block") {
        formUsername.style.display = "none";
        } else {
        formUsername.style.display = "block";
        }
})
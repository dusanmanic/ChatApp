import {updateScroll} from "./app.js"

export class ChatUI {
    constructor(l) {
        this._list = l
    }
    set list(l) {
        this._list = l
    }
    get list() {
       return this._list
    }

    date(dokument) {
        let month, day, hours, minutes
        let date = dokument[0].created_at.toDate()
        let year = date.getFullYear()
        if((date.getMonth() + 1) >= 10 ) {
           month = (date.getMonth() + 1)
        } else {
            month = "0" + (date.getMonth() + 1)
        }
        if(date.getDate() >= 10 ) {
            day = date.getDate()
        } else {
            day = "0" + date.getDate()
        }
        if(date.getHours() >= 10) {
            hours = date.getHours()
        } else {
            hours = "0" + date.getHours()
        }
        if(date.getMinutes() >= 10) {
            minutes = date.getMinutes()
        } else {
            minutes = "0" + date.getMinutes()
        }
        
        let fullDate = day+"."+month+"."+year+" - "+hours+":"+minutes
        return fullDate
    }

    helloMessage(poruka) {

        let htmlLi = 
            `<li class="salje">
                <p class="oblakDesno" id="pozdravnaPoruka">
                    <span class="username"> @chatroom: </span>
                    <span class="message"> ${poruka} </span>
                </p>
            </li>`;        
        this.list.innerHTML += htmlLi
        updateScroll()        

    }

    templateLI(dokument) {
        //console.log(dokument)
        if(dokument[0].username == localStorage.getItem('chatUser')) {
            
        let htmlLi = 
            `<li class="salje">
                <p class="oblakDesno"  id="${dokument[1]}">
                    <span class="username"> ${dokument[0].username} : </span>
                    <span class="message"> ${dokument[0].message} </span>
                    <img src="./img/pencil.png" class="pen" ><br>
                    <span class="date"> ${this.date(dokument)}</span>
                    <span class="updateText"> ${dokument[0].msgEdited} </span>
                    <img src="./img/bin.png" class="bin">
                </p>
            </li>`;        
        this.list.innerHTML += htmlLi
        updateScroll()
        } else {
        
        let htmlLi = 
            `<li>
                <p class="oblak" id="${dokument[1]}">
                    <span class="username"> ${dokument[0].username} : </span>
                    <span class="message"> ${dokument[0].message} </span><br>
                    <span class="date"> ${this.date(dokument)}</span>
                    <span class="updateText"> ${dokument[0].msgEdited} </span>
                    <img src="./img/bin.png" class="bin">
                </p>
            </li>`;        
        this.list.innerHTML += htmlLi
        updateScroll()
        }
    }
}



import {notificationSound} from "./app.js"

export class Chatroom {
    constructor(r, un, e) {
        this.room = r;
        this.username = un;
        this.edited = e
        this.chats = db.collection('chat'),
        this.unsub
    };
    set room(ru) {
        this._room = ru
    }
    set username(usern) {
        if(usern.length < 2 || usern.length > 10) {
            alert(`Dužina korisničkog imena je između 2 i 10 karaktera`)
        } else if (usern.match(/^ *$/)) {
            alert(`Korisničko ime ne sme biti sastavljeno samo od praznina ili tabova`)
        } else {
            this._username = usern
        }
    }
    set edited(ed) {
        this._edited = ed
    }    
    get room() {
        return this._room
    }
    get username() {
        return this._username
    }
    get edited() {
        return this._edited
    }
    updateUsername(un) {
        this.username = un
    }
    updateRoom(rm) {
        this.room = rm
        if(this.unsub) {
            this.unsub()
        }
    }
    async updateChat(poruka,chat,edited) {

        let dodaj = {
            message: poruka,
            msgEdited: edited
        }

        let response = await this.chats.doc(chat).update(dodaj);
        return response

    }
    
    async addChat(poruka) {

        let datum = new Date()
        let datumTimestamp = firebase.firestore.Timestamp.fromDate(datum)

        let dodaj = {
            message: poruka,
            room: this.room,
            username: this.username,
            msgEdited: this.edited,
            created_at: datumTimestamp
        }

        let response = await this.chats.add(dodaj);
        return response
    }

    async removeChat(id) {
        let response = await this.chats.doc(`${id}`).delete()
        return response
        
    }

    getChatsDate(callback, start, end) {
        
        this.unsub = this.chats
        .where('room', '==', this.room)
        .where('created_at', '>', start)
        .where('created_at', '<', end)
        .orderBy('created_at', 'asc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {

                if(change.type === "added") {
                    //update ceta (dodaj novu poruku na ekran)
                    callback([change.doc.data(), change.doc.id])
                }
            })
        })
    }

    getChats(callback) {

        let user;
        let userLocal = localStorage.getItem(`chatUser`)
        
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at', 'asc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {

                if(change.type === "added") {
                    let data = change.doc.data()
                    user = data.username
                    console.log(data)
                    // update ceta (dodaj novu poruku na ekran)
                    callback([change.doc.data(), change.doc.id])
                    
                }
            })

            if(user != userLocal) {
                notificationSound()
            }
        
        })
    }
}
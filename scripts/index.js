import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js"
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js'
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js"
import { createNewWhisper } from './data.js'

const firebaseConfig = {
    apiKey: "AIzaSyB8qm44xhGJozRCf-aBBk7dswlDBoSRWBk",
    authDomain: "ghibligram-af0cd.firebaseapp.com",
    databaseURL: "https://ghibligram-af0cd-default-rtdb.firebaseio.com",
    projectId: "ghibligram-af0cd",
    storageBucket: "ghibligram-af0cd.firebasestorage.app",
    messagingSenderId: "473122165873",
    appId: "1:473122165873:web:92a41076a4ed6e39daf7d0"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)
const whispersRef = ref(database, "whispers")
let openReplies = new Set()
let whispersDataLocal = [] // Local copy for rendering

signInAnonymously(auth)
    .catch(error => {
        console.log('Authentication error:', error)
    })

onAuthStateChanged(auth, user => {
    if(user){
        console.log("Authenticated! User ID:", user.uid)
        
        // Listen for real-time updates
        onValue(whispersRef, (snapshot) => {
            if(snapshot.exists()){
                const data = snapshot.val()
                whispersDataLocal = Object.values(data)
                whispersDataLocal.sort((a,b) => b.timestamp - a.timestamp)
                render()
            }
        })
    }
})

document.addEventListener('click', function(e){

    if(e.target.id === 'whisper-btn'){
        whisper()
    }

    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.rewhisper){
        handleRewhisperClick(e.target.dataset.rewhisper)
    }

    else if(e.target.dataset.trash){
        removeWhisper(e.target.dataset.trash)
    }

    else if(e.target.dataset.trashreply){
        removeWhisperReply(e.target.dataset.trashwhisper, e.target.dataset.trashreply)
    }

    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    else if(e.target.dataset.comment){
        reply(e.target.dataset.comment)
    }

})

function getWhisperObj(uuid){
    
    return whispersDataLocal.find(whisper => whisper.uuid === uuid)
}

function whisper(){

    let textareaInput = document.getElementById('whisper-input')

    if(textareaInput.value){
        const newWhisper = createNewWhisper(textareaInput.value)
        newWhisper.timestamp = Date.now()
        const newWhisperRef = ref(database, `whispers/${newWhisper.uuid}`)

        set(newWhisperRef, newWhisper)

        textareaInput.value = ''
    }
}

function reply(uuid){
    let textareaInput = document.getElementById(`reply-input-${uuid}`)

    if(textareaInput.value){
        const newWhisper = createNewWhisper(textareaInput.value)
        newWhisper.hasReply = true
        const whisperObj = getWhisperObj(uuid)
        const updatedReplies = whisperObj.replies ? [...whisperObj.replies, newWhisper] : [newWhisper]

        update(ref(database, `whispers/${uuid}`), {
            replies: updatedReplies
        })
    }
}


function removeWhisper(uuid){

    remove(ref(database, `whispers/${uuid}`))
}

function removeWhisperReply(uuid, replyUUID){
    const whisperObj= getWhisperObj(uuid)

    if(whisperObj.replies){
        const updatedReplies = whisperObj.replies.filter(reply => reply.uuid !== replyUUID)

        update(ref(database, `whispers/${uuid}`), {
            replies: updatedReplies
        })
    }
}

function handleLikeClick(likeId){

    const targetLikeObj = getWhisperObj(likeId)

    const newLikes = targetLikeObj.isliked ? targetLikeObj.likes - 1 : targetLikeObj.likes + 1

    const updatedIsLiked = !targetLikeObj.isliked

    update(ref(database, `whispers/${likeId}`),{
        likes: newLikes,
        isliked: updatedIsLiked
    })
}

function handleRewhisperClick(rewhisperId) {
    const targetRewhisperObj = getWhisperObj(rewhisperId)

    const newRewhisper  = targetRewhisperObj.isRewhispered ? targetRewhisperObj.rewhispers - 1 : targetRewhisperObj.rewhispers + 1

    const updatedIsRewhispered = !targetRewhisperObj.isRewhispered

    update(ref(database, `whispers/${rewhisperId}`), {
        rewhispers: newRewhisper,
        isRewhispered: updatedIsRewhispered
    })
}

function handleReplyClick(replyId){
    document.getElementById(`reply-${replyId}`).classList.toggle('hidden')

    if(openReplies.has(replyId)){
        openReplies.delete(replyId)
    }
    else{
        openReplies.add(replyId)
    }
}

function getFeed(){

    let feedHtml = ''

    whispersDataLocal.forEach(function(whisper){

        let likeIconClass = ''
        let rewhisperedIconClass = ''
        let repliesHtml = ''
        let replyClass = 'hidden'
        let trashIcon = 'hidden'

        if(whisper.isliked){
            likeIconClass = 'liked' 
        }

        if(whisper.isRewhispered){
            rewhisperedIconClass = 'rewhispered'
        }

        if(openReplies.has(whisper.uuid)){
            replyClass = ''
        }

        if(whisper.isNewWhisper){
            trashIcon = ''
        }

        if(whisper.replies && whisper.replies.length > 0){
            whisper.replies.forEach(function(reply){
            repliesHtml += `<div class="whisper-reply">
                            <div class="whisper-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div class="inner-container">
                                    <p class="handle">${reply.handle}</p>
                                    <p class="whisper-text">${reply.whisperText}</p>
                                    <span class="whisper-detail ${reply.hasReply ? '' : 'hidden'}">
                                        <i class="fa-solid fa-trash" data-trashWhisper="${whisper.uuid}" data-trashReply="${reply.uuid}"></i>
                                    </span>
                                </div>
                            </div>
                            </div>`
            })
        }
        
        feedHtml += `<div class="whisper">
                        <div class="whisper-inner">
                            <img src="${whisper.profilePic}" class="profile-pic">
                            <div class="inner-container">
                                <p class="handle">${whisper.handle}</p>
                                <p class="whisper-text">${whisper.whisperText}</p>
                                <div class="whisper-details">

                                    <span class="whisper-detail">
                                        <i class="fa-regular fa-comment-dots" data-reply="${whisper.uuid}"></i>
                                        ${whisper.replies ? whisper.replies.length : '0'}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}" data-like="${whisper.uuid}"></i>
                                        ${whisper.likes}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-retweet ${rewhisperedIconClass}" data-rewhisper="${whisper.uuid}"></i>
                                        ${whisper.rewhispers}
                                    </span>

                                    <span class="whisper-detail ${trashIcon}">
                                        <i class="fa-solid fa-trash" data-trash="${whisper.uuid}"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="${replyClass}" id="reply-${whisper.uuid}">
                            <!-- Reply goes here! -->         
                            ${repliesHtml}
                            <div class="whisper-reply">
                                <div class="whisper-inner whisper-input-area">
                                    <textarea placeholder="Whisper back..." id="reply-input-${whisper.uuid}" class"reply-input"></textarea>
                                </div>
                                <button id="reply-btn" data-comment="${whisper.uuid}">Reply</button>
                            </div>
                    </div>`
    })

    return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeed()
}


render()
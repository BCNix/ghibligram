import { whispersData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


let openReplies = new Set()


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.rewhisper){
        handleRewhisperClick(e.target.dataset.rewhisper)
    }

    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    if(e.target.id === 'whisper-btn'){
        // let text = document.getElementById('whisper-input').value
        // console.log(text)
        whisper()
    }
})

function whisper(){

    let text = document.getElementById('whisper-input')

    let newWhisper = {
        handle: `@Seiji 🎻`,
        profilePic: `images/seiji.jpeg`,
        likes: 0,
        rewhispers: 0,
        whisperText: `${text.value}`,
        replies: [],
        isliked: false,
        isRewhispered: false,
        uuid: uuidv4()
    }

    if(text.value){
        whispersData.unshift(newWhisper)
        text.value = ''
    }
    render()
    
}

function getWhisperObj(uuid){
    return whispersData.filter(function(whisper){
        return whisper.uuid === uuid})[0]
}

function handleLikeClick(likeId){

    const targetLikeObj = getWhisperObj(likeId)

    if(targetLikeObj.isliked){
        targetLikeObj.likes--
    }
    else {
        targetLikeObj.likes++
    }

    targetLikeObj.isliked = !targetLikeObj.isliked

    render()
}

function handleRewhisperClick(rewhisperId) {
    const targetRewhisperObj = getWhisperObj(rewhisperId)

    if(targetRewhisperObj.isRewhispered){
        targetRewhisperObj.rewhispers--
    } 
    else {
        targetRewhisperObj.rewhispers++
    }

    targetRewhisperObj.isRewhispered = !targetRewhisperObj.isRewhispered

    render()
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

    whispersData.forEach(function(whisper){

        let likeIconClass = ''
        let rewhisperedIconClass = ''
        let repliesHtml = ''
        let replyClass = 'hidden'

        if(whisper.isliked){
            likeIconClass = 'liked' 
        }

        if(whisper.isRewhispered){
            rewhisperedIconClass = 'rewhispered'
        }

        if(openReplies.has(whisper.uuid)){
            replyClass = ''
        }

        if(whisper.replies.length > 0){
            whisper.replies.forEach(function(reply){
            repliesHtml += `<div class="whisper-reply">
                            <div class="whisper-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="whisper-text">${reply.whisperText}</p>
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
                                        ${whisper.replies.length}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}" data-like="${whisper.uuid}"></i>
                                        ${whisper.likes}
                                    </span>

                                    <span class="whisper-detail">
                                        <i class="fa-solid fa-retweet ${rewhisperedIconClass}" data-rewhisper="${whisper.uuid}"></i>
                                        ${whisper.rewhispers}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="${replyClass}" id="reply-${whisper.uuid}">
                            <!-- Reply goes here! -->         
                            ${repliesHtml}
                        </div>
                    </div>`
    })

    return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeed()
}


render()
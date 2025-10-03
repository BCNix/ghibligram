import { whispersData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click', function(e){
    // console.log(e.target.dataset.reply)
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
        // console.log(document.getElementById(`like-${e.target.dataset.like}`).classList)
    }
    else if(e.target.dataset.rewhisper){
        handleRewhisperClick(e.target.dataset.rewhisper)
    }

    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
})

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
}


function getFeed(){

    let feedHtml = ''

    whispersData.forEach(function(whisper){

        let likeIconClass = ''
        let rewhisperedIconClass = ''
        let repliesHtml = ''

        if(whisper.isliked){
            likeIconClass = 'liked' 
        }

        if(whisper.isRewhispered){
            rewhisperedIconClass = 'rewhispered'
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
                        <div class="hidden" id="reply-${whisper.uuid}">
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
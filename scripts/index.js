import { whispersData, createNewWhisper } from './data.js'

let openReplies = new Set()

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
        removeWhisperReply(e.target.dataset.trashreply)
    }

    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    else if(e.target.dataset.comment){
        whisperBack(e.target.dataset.comment)
    }


    console.log(e)

})

function whisper(){

    let textareaInput = document.getElementById('whisper-input')

    const newWhisper = createNewWhisper(textareaInput.value)

    if(textareaInput.value){
        whispersData.unshift(newWhisper)
        textareaInput.value = ''
    }
    render()
    
}

function whisperBack(uuid){
    let textareaInput = document.getElementById(`reply-input-${uuid}`)

    const newWhisper = createNewWhisper(textareaInput.value)

    newWhisper['hasReply'] = true

    if(textareaInput.value){
        const replies = getWhisperObj(uuid).replies
        replies.push(newWhisper)
    }
    render()
}

function getWhisperObj(uuid){
    
    return whispersData.filter(function(whisper){
        return whisper.uuid === uuid})[0]
}

function removeWhisper(uuid){

    const whisperIndex = whispersData.indexOf(getWhisperObj(uuid))

    whispersData.splice(whisperIndex, 1)

    render()
}

function removeWhisperReply(uuid){
    const whisperReplyArr= getWhisperObj(uuid).replies
    const replyArr = whisperReplyArr.filter((reply) => reply.uuid === uuid)

    const replyIndex = whisperReplyArr.indexOf(replyArr)

    whisperReplyArr.splice(replyIndex, 1)

    render()

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

        if(whisper.replies.length > 0){
            whisper.replies.forEach(function(reply){
            repliesHtml += `<div class="whisper-reply">
                            <div class="whisper-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div class="inner-container">
                                    <p class="handle">${reply.handle}</p>
                                    <p class="whisper-text">${reply.whisperText}</p>
                                    <span class="whisper-detail ${reply.hasReply ? '' : 'hidden'}">
                                        <i class="fa-solid fa-trash" data-trashReply="${whisper.uuid}"></i>
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